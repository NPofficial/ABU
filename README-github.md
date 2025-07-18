# Health Analyzer Pro

Сучасний веб-додаток для аналізу стану здоров'я за зображеннями язика з використанням ШІ Claude Vision.

## ✨ Ключові особливості

- **Подвійна система аналізу**: Детальний морфологічний + повний зональний аналіз
- **Claude 4.0 Sonnet**: Найновіша модель ШІ для точного аналізу
- **Швидка обробка**: ~15 секунд на кожен тип аналізу
- **Мобільна оптимізація**: Адаптивний дизайн для всіх пристроїв
- **Безпека**: Cloudinary для обробки зображень + захищені API ключі

## 🚀 Демо

Спробуйте додаток: [Health Analyzer Pro](https://your-app-url.netlify.app)

## 🔧 Технології

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Backend**: Netlify Functions (Node.js)
- **ШІ**: Anthropic Claude Vision API
- **Зображення**: Cloudinary для завантаження та обробки
- **Хостинг**: Netlify з глобальним CDN

## 📊 Типи аналізу

### 1. Детальний аналіз (~15 сек)
- Морфологічний опис поверхні
- Аналіз кольору, текстури, контурів
- Виявлення патологічних змін
- Опис структурних елементів

### 2. Повний аналіз (~15 сек)
- Зональне картування (ТКМ)
- Wellness інтерпретація
- Персоналізовані рекомендації
- Загальна оцінка здоров'я

## 🛠️ Встановлення та розгортання

### Локальна розробка

1. **Клонування репозиторію**
```bash
git clone https://github.com/your-username/health-analyzer-pro.git
cd health-analyzer-pro
```

2. **Встановлення залежностей**
```bash
npm install
```

3. **Налаштування змінних оточення**
Створіть файл `.env` з наступними ключами:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Запуск локального сервера**
```bash
npm run dev
```

Додаток буде доступний за адресою `http://localhost:5000`

### Розгортання на Netlify

1. **Fork або імпорт репозиторію** у свій акаунт GitHub

2. **Підключення до Netlify**
   - Увійдіть в [Netlify](https://netlify.com)
   - Натисніть "New site from Git"
   - Виберіть свій репозиторій

3. **Налаштування збірки**
   - Build command: `npm install`
   - Publish directory: `.` (корінь)
   - Functions directory: `netlify/functions`

4. **Додавання змінних оточення**
   У налаштуваннях сайту Netlify додайте:
   - `ANTHROPIC_API_KEY`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

5. **Розгортання**
   Netlify автоматично збере та розгорне додаток

## 🗂️ Структура проєкту

```
health-analyzer-pro/
├── netlify/
│   └── functions/
│       ├── upload.js              # Завантаження зображень в Cloudinary
│       ├── analyze-detailed.js    # Детальний морфологічний аналіз
│       └── analyze-comprehensive.js # Повний зональний аналіз
├── index.html                     # Основний додаток
├── package.json                   # Залежності Node.js
├── netlify.toml                   # Конфігурація Netlify
├── README.md                      # Документація
└── .env.example                   # Приклад змінних оточення
```

## 🔑 Отримання API ключів

### Anthropic Claude API
1. Зареєструйтеся на [console.anthropic.com](https://console.anthropic.com)
2. Створіть новий API ключ
3. Додайте кошти на акаунт для використання

### Cloudinary
1. Створіть акаунт на [cloudinary.com](https://cloudinary.com)
2. В Dashboard скопіюйте:
   - Cloud Name
   - API Key 
   - API Secret

## ⚙️ Конфігурація

### netlify.toml
```toml
[build]
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"
  timeout = 120

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Таймаути та ліміти
- Максимальний розмір зображення: 10 МБ
- Таймаут Claude API: 60 секунд
- Таймаут Netlify Functions: 120 секунд

## 🔒 Безпека

- Всі API ключі зберігаються як змінні оточення
- CORS налаштований для безпечних запитів
- Валідація файлів на стороні клієнта та сервера
- Антикешування для унікальності аналізів

## 🐛 Усунення неполадок

### Поширені проблеми

**Помилка завантаження зображення**
- Перевірте розмір файлу (до 10 МБ)
- Переконайтеся у підтримуваному форматі (JPG, PNG, WebP)
- Перевірте налаштування Cloudinary

**Помилка аналізу**
- Перевірте валідність API ключа Anthropic
- Переконайтеся у наявності коштів на акаунті Anthropic
- Перевірте інтернет-з'єднання

**Таймаут функцій**
- Збільште таймаут у netlify.toml
- Оптимізуйте розмір зображення

### Відладка
Увімкніть консоль розробника для перегляду детальних логів:
```javascript
console.log('Debug mode enabled');
```

## 📈 Продуктивність

- **Час завантаження**: <2 секунди
- **Час аналізу**: 15 секунд кожен тип
- **Оптимізація зображень**: Автоматична в Cloudinary
- **CDN**: Глобальний розподіл через Netlify

## 🤝 Внесок у проєкт

1. Fork репозиторію
2. Створіть feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit зміни (`git commit -m 'Add some AmazingFeature'`)
4. Push у branch (`git push origin feature/AmazingFeature`)
5. Відкрийте Pull Request

## 📄 Ліцензія

Цей проєкт розповсюджується під ліцензією MIT. Див. файл `LICENSE` для деталей.

## 👨‍💻 Автор

**Health Analyzer Pro Team**
- Веб-сайт: [your-website.com](https://your-website.com)
- Email: contact@your-domain.com

## 🙏 Подяки

- [Anthropic](https://anthropic.com) за Claude Vision API
- [Cloudinary](https://cloudinary.com) за обробку зображень
- [Netlify](https://netlify.com) за хостинг та функції

---

⚠️ **Застереження**: Це wellness додаток не замінює професійну медичну консультацію. При серйозних симптомах зверніться до лікаря.
