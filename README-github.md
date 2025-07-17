# Health Analyzer Pro

Современное веб-приложение для анализа состояния здоровья по изображениям языка с использованием ИИ Claude Vision.

## ✨ Ключевые особенности

- **Двойная система анализа**: Детальный морфологический + полный зональный анализ
- **Claude 4.0 Sonnet**: Новейшая модель ИИ для точного анализа
- **Быстрая обработка**: ~15 секунд на каждый тип анализа
- **Мобильная оптимизация**: Адаптивный дизайн для всех устройств
- **Безопасность**: Cloudinary для обработки изображений + защищенные API ключи

## 🚀 Демо

Попробуйте приложение: [Health Analyzer Pro](https://your-app-url.netlify.app)

## 🔧 Технологии

- **Frontend**: Vanilla HTML/CSS/JavaScript
- **Backend**: Netlify Functions (Node.js)
- **ИИ**: Anthropic Claude Vision API
- **Изображения**: Cloudinary для загрузки и обработки
- **Хостинг**: Netlify с глобальным CDN

## 📊 Типы анализа

### 1. Детальный анализ (~15 сек)
- Морфологическое описание поверхности
- Анализ цвета, текстуры, контуров
- Выявление патологических изменений
- Описание структурных элементов

### 2. Полный анализ (~15 сек)
- Зональное картирование (ТКМ)
- Wellness интерпретация
- Персонализированные рекомендации
- Общая оценка здоровья

## 🛠️ Установка и развертывание

### Локальная разработка

1. **Клонирование репозитория**
```bash
git clone https://github.com/your-username/health-analyzer-pro.git
cd health-analyzer-pro
```

2. **Установка зависимостей**
```bash
npm install
```

3. **Настройка переменных окружения**
Создайте файл `.env` со следующими ключами:
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

Приложение будет доступно по адресу `http://localhost:5000`

### Развертывание на Netlify

1. **Fork или импорт репозитория** в свой аккаунт GitHub

2. **Подключение к Netlify**
   - Войдите в [Netlify](https://netlify.com)
   - Нажмите "New site from Git"
   - Выберите свой репозиторий

3. **Настройка сборки**
   - Build command: `npm install`
   - Publish directory: `.` (корень)
   - Functions directory: `netlify/functions`

4. **Добавление переменных окружения**
   В настройках сайта Netlify добавьте:
   - `ANTHROPIC_API_KEY`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

5. **Развертывание**
   Netlify автоматически соберет и развернет приложение

## 🗂️ Структура проекта

```
health-analyzer-pro/
├── netlify/
│   └── functions/
│       ├── upload.js              # Загрузка изображений в Cloudinary
│       ├── analyze-detailed.js    # Детальный морфологический анализ
│       └── analyze-comprehensive.js # Полный зональный анализ
├── index.html                     # Основное приложение
├── package.json                   # Зависимости Node.js
├── netlify.toml                   # Конфигурация Netlify
├── README.md                      # Документация
└── .env.example                   # Пример переменных окружения
```

## 🔑 Получение API ключей

### Anthropic Claude API
1. Зарегистрируйтесь на [console.anthropic.com](https://console.anthropic.com)
2. Создайте новый API ключ
3. Добавьте средства на аккаунт для использования

### Cloudinary
1. Создайте аккаунт на [cloudinary.com](https://cloudinary.com)
2. В Dashboard скопируйте:
   - Cloud Name
   - API Key 
   - API Secret

## ⚙️ Конфигурация

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

### Таймауты и лимиты
- Максимальный размер изображения: 10 МБ
- Таймаут Claude API: 60 секунд
- Таймаут Netlify Functions: 120 секунд

## 🔒 Безопасность

- Все API ключи хранятся как переменные окружения
- CORS настроен для безопасных запросов
- Валидация файлов на стороне клиента и сервера
- Антикэширование для уникальности анализов

## 🐛 Устранение неполадок

### Распространенные проблемы

**Ошибка загрузки изображения**
- Проверьте размер файла (до 10 МБ)
- Убедитесь в поддерживаемом формате (JPG, PNG, WebP)
- Проверьте настройки Cloudinary

**Ошибка анализа**
- Проверьте валидность API ключа Anthropic
- Убедитесь в наличии средств на аккаунте Anthropic
- Проверьте интернет-соединение

**Таймаут функций**
- Увеличьте таймаут в netlify.toml
- Оптимизируйте размер изображения

### Отладка
Включите консоль разработчика для просмотра подробных логов:
```javascript
console.log('Debug mode enabled');
```

## 📈 Производительность

- **Время загрузки**: <2 секунды
- **Время анализа**: 15 секунд каждый тип
- **Оптимизация изображений**: Автоматическая в Cloudinary
- **CDN**: Глобальное распределение через Netlify

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE` для подробностей.

## 👨‍💻 Автор

**Health Analyzer Pro Team**
- Веб-сайт: [your-website.com](https://your-website.com)
- Email: contact@your-domain.com

## 🙏 Благодарности

- [Anthropic](https://anthropic.com) за Claude Vision API
- [Cloudinary](https://cloudinary.com) за обработку изображений
- [Netlify](https://netlify.com) за хостинг и функции

---

⚠️ **Дисклеймер**: Это wellness приложение не заменяет профессиональную медицинскую консультацию. При серьезных симптомах обратитесь к врачу.
