const { Resend } = require('resend');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { email, analysisData, imageUrl, analysisType } = JSON.parse(event.body);
    
    // Validate email
    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email' })
      };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    // Generate HTML email based on analysis type
    const emailHtml = generateEmailHtml(analysisData, imageUrl, analysisType);
    
    await resend.emails.send({
      from: 'Health Analyzer <noreply@mycheck.com.ua>',
      to: email,
      subject: '🔬 Ваш звіт готовий - Health Analyzer',
      html: emailHtml
    });
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Email sent successfully' })
    };
    
  } catch (error) {
    console.error('Email send error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to send email', details: error.message })
    };
  }
};

function generateEmailHtml(data, imageUrl, type) {
  const overallScore = data.overall_score || data.overall_health_score || 'N/A';
  const category = data.category || data.health_status || '';
  
  let parametersHtml = '';
  
  if (type === 'detailed' && data.objective_findings) {
    // Detailed analysis parameters
    const params = [
      { key: 'color', name: 'Колір', data: data.objective_findings.color },
      { key: 'coating', name: 'Наліт', data: data.objective_findings.coating },
      { key: 'cracks', name: 'Тріщини', data: data.objective_findings.cracks },
      { key: 'edges', name: 'Краї', data: data.objective_findings.edges },
      { key: 'papillae', name: 'Сосочки', data: data.objective_findings.papillae }
    ];
    
    parametersHtml = params.map(param => {
      if (!param.data) return '';
      return `
        <div style="margin: 16px 0; padding: 16px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #3B82F6;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong style="color: #111827; font-size: 16px;">${param.name}</strong>
            <span style="font-size: 20px; font-weight: bold; color: #3B82F6;">${param.data.score}/10</span>
          </div>
          <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 14px; line-height: 1.5;">
            ${param.data.description || ''}
          </p>
        </div>
      `;
    }).join('');
    
  } else if (type === 'comprehensive' && data.zone_analysis) {
    // Comprehensive analysis zones
    const zoneNames = {
      anterior: 'Передня зона (Серце/Легені)',
      middle: 'Середня зона (Шлунок/Селезінка)',
      posterior: 'Задня зона (Нирки/Сеча)',
      lateral: 'Бокові зони (Печінка/Жовчний)'
    };
    
    parametersHtml = Object.entries(data.zone_analysis).map(([key, zone]) => {
      if (!zone || typeof zone !== 'object') return '';
      return `
        <div style="margin: 16px 0; padding: 16px; background: #f9fafb; border-radius: 8px; border-left: 4px solid #3B82F6;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <strong style="color: #111827; font-size: 16px;">${zoneNames[key] || key}</strong>
            <span style="font-size: 20px; font-weight: bold; color: #3B82F6;">${zone.score}/100</span>
          </div>
          <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 14px; line-height: 1.5;">
            ${zone.interpretation || ''}
          </p>
        </div>
      `;
    }).join('');
  }
  
  const interpretation = data.interpretation || data.health_interpretation || '';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); padding: 40px 32px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
            🔬 Ваш звіт готовий!
          </h1>
          <p style="color: rgba(255,255,255,0.9); margin: 12px 0 0 0; font-size: 16px;">
            Health Analyzer ABU
          </p>
        </div>
        
        <!-- Content -->
        <div style="padding: 32px;">
          
          <!-- Image -->
          ${imageUrl ? `
          <div style="text-align: center; margin-bottom: 32px;">
            <img src="${imageUrl}" alt="Фото язика" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          </div>
          ` : ''}
          
          <!-- Overall Score -->
          <div style="text-align: center; margin-bottom: 32px; padding: 24px; background: linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%); border-radius: 16px;">
            <div style="font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
              Загальна оцінка
            </div>
            <div style="font-size: 56px; font-weight: 700; color: #3B82F6; line-height: 1; margin-bottom: 8px;">
              ${overallScore}${type === 'detailed' ? '/10' : '/100'}
            </div>
            ${category ? `
            <div style="font-size: 16px; color: #4b5563; font-weight: 500;">
              ${category}
            </div>
            ` : ''}
          </div>
          
          <!-- Parameters -->
          <div style="margin-bottom: 32px;">
            <h2 style="color: #111827; font-size: 22px; margin-bottom: 20px; font-weight: 600;">
              Детальні параметри
            </h2>
            ${parametersHtml}
          </div>
          
          <!-- Interpretation -->
          ${interpretation ? `
          <div style="padding: 20px; background: #FEF3C7; border-left: 4px solid #F59E0B; border-radius: 8px; margin-bottom: 32px;">
            <h3 style="color: #92400E; margin: 0 0 12px 0; font-size: 16px; font-weight: 600;">
              💡 Інтерпретація
            </h3>
            <p style="color: #78350F; margin: 0; line-height: 1.6; font-size: 14px;">
              ${interpretation}
            </p>
          </div>
          ` : ''}
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://mycheck.com.ua" 
               style="display: inline-block; padding: 16px 32px; background: #3B82F6; color: #ffffff; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px;">
              Зробити новий аналіз
            </a>
          </div>
          
          <!-- Disclaimer -->
          <div style="padding: 20px; background: #FEE2E2; border-radius: 8px; margin-top: 32px;">
            <p style="color: #991B1B; margin: 0; font-size: 13px; line-height: 1.5;">
              ⚠️ <strong>Важливо:</strong> Це wellness-аналіз для інформаційних цілей. 
              Не є медичною діагностикою та не замінює консультацію лікаря. 
              При серйозних симптомах зверніться до медичного фахівця.
            </p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f9fafb; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; margin: 0; font-size: 14px;">
            Health Analyzer ABU • mycheck.com.ua
          </p>
          <p style="color: #9ca3af; margin: 8px 0 0 0; font-size: 12px;">
            Аналіз здоров'я на основі AI
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;
}

