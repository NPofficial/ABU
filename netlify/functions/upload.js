const cloudinary = require('cloudinary').v2;
const multipart = require('parse-multipart-data');

exports.handler = async (event, context) => {
    // Add CORS headers to all responses with anti-cache settings
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    };

    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Configure Cloudinary using CLOUDINARY_URL or individual variables
        if (process.env.CLOUDINARY_URL) {
            // Use CLOUDINARY_URL for simplified configuration
            cloudinary.config(process.env.CLOUDINARY_URL);
            console.log('Cloudinary configured with CLOUDINARY_URL');
        } else if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
            // Fallback to individual environment variables
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            });
            console.log('Cloudinary configured with individual variables');
        } else {
            console.error('Missing Cloudinary configuration');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Server configuration error' })
            };
        }

        // Parse multipart data with enhanced error handling
        const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
        console.log('Content-Type:', contentType);
        console.log('Headers:', JSON.stringify(event.headers, null, 2));
        
        if (!contentType.includes('multipart/form-data')) {
            console.error('Invalid content type received:', contentType);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Invalid content type. Expected multipart/form-data',
                    received: contentType,
                    headers: event.headers
                })
            };
        }

        // More flexible boundary extraction
        let boundaryMatch = contentType.match(/boundary=([^;]+)/);
        if (!boundaryMatch) {
            boundaryMatch = contentType.match(/boundary=(.+)$/);
        }
        
        if (!boundaryMatch) {
            console.error('No boundary found in content-type:', contentType);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Missing boundary in content-type',
                    contentType: contentType
                })
            };
        }

        const boundary = boundaryMatch[1].trim().replace(/['"]/g, ''); // Remove quotes if present
        console.log('Extracted boundary:', boundary);
        
        const buffer = event.isBase64Encoded ? Buffer.from(event.body, 'base64') : Buffer.from(event.body, 'utf8');
        
        let parts;
        try {
            console.log('Buffer length:', buffer.length);
            console.log('Buffer preview:', buffer.toString('utf8', 0, Math.min(200, buffer.length)));
            
            parts = multipart.parse(buffer, boundary);
            console.log('Parsed parts count:', parts.length);
            console.log('Parts info:', parts.map(p => ({ 
                name: p.name, 
                filename: p.filename,
                type: p.type,
                dataLength: p.data?.length 
            })));
        } catch (parseError) {
            console.error('Multipart parse error:', parseError);
            console.error('Parse error details:', parseError.message);
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Failed to parse uploaded file',
                    details: parseError.message,
                    boundary: boundary,
                    bufferLength: buffer.length
                })
            };
        }

        const file = parts.find(part => part.name === 'image');
        if (!file || !file.data || file.data.length === 0) {
            console.log('Available parts:', parts.map(p => ({ 
                name: p.name, 
                filename: p.filename,
                type: p.type,
                dataLength: p.data?.length 
            })));
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'No image file found in upload',
                    availableParts: parts.map(p => ({ name: p.name, dataLength: p.data?.length }))
                })
            };
        }

        // File validation
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        const fileType = file.type || 'unknown';
        
        if (!allowedTypes.includes(fileType)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: `Invalid file type: ${fileType}. Only JPG, PNG, WebP allowed` })
            };
        }

        if (file.data.length > 10 * 1024 * 1024) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: `File too large: ${Math.round(file.data.length / 1024 / 1024)}MB. Max 10MB allowed` })
            };
        }

        console.log(`Uploading file: ${fileType}, size: ${file.data.length} bytes`);

        // Генерируем уникальное имя для каждого файла
        const uniqueId = `tongue_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        console.log('Generated unique ID:', uniqueId);

        // Upload to Cloudinary with anti-caching settings
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: 'image',
                    folder: 'health-analyzer',
                    public_id: uniqueId,
                    unique_filename: true,
                    overwrite: false,
                    invalidate: true,
                    transformation: [
                        { width: 1000, height: 1000, crop: 'limit' },
                        { quality: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                    } else {
                        console.log('Cloudinary upload success:', result.secure_url);
                        resolve(result);
                    }
                }
            ).end(file.data);
        });

        // Добавляем timestamp к URL для предотвращения кэширования
        const versionedUrl = `${result.secure_url}?v=${Date.now()}`;
        console.log('Original URL:', result.secure_url);
        console.log('Versioned URL:', versionedUrl);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true,
                url: versionedUrl,
                originalUrl: result.secure_url,
                publicId: result.public_id,
                uniqueId: uniqueId
            })
        };

    } catch (error) {
        console.error('Upload function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Upload failed', 
                details: error.message 
            })
        };
    }
};
