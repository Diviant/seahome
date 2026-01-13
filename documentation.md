
# SeaHome — Архитектура и стратегия

### 1. Архитектура приложения
Приложение спроектировано как **Telegram Mini App (TMA)** с разделением на:
- **Frontend**: React (SPA), Tailwind CSS. Интеграция с Telegram WebApp API для получения `initData` и данных пользователя.
- **Backend (Node.js/Express)**: 
  - Валидация `hash` от Telegram.
  - RESTful API для CRUD операций.
  - Интеграция с Telegram Bot API для уведомлений владельцев и админов.
- **DB (PostgreSQL)**:
  - Реляционная структура для поиска и фильтрации.
  - Полнотекстовый поиск по описаниям.
- **Хранилище**: AWS S3 или Cloudinary для фотографий жилья.

### 2. Структура Базы Данных
- **Users**: `id (TG ID)`, `username`, `role`, `status`, `created_at`.
- **Properties**: `id`, `owner_id`, `title`, `description`, `type (enum)`, `location (Point/JSON)`, `price`, `distance_to_sea`, `status`, `is_verified`, `is_featured`, `valid_until`.
- **Images**: `id`, `property_id`, `url`, `order_index`.
- **Transactions**: `id`, `user_id`, `property_id`, `amount`, `status`, `type (listing/boost)`.

### 3. API Endpoints
- `GET /api/properties`: Получение каталога с фильтрами.
- `GET /api/properties/:id`: Детальная информация.
- `POST /api/properties`: Создание объекта (владелец).
- `PATCH /api/properties/:id`: Редактирование (владелец).
- `POST /api/admin/moderate`: Одобрение/отклонение (админ).
- `GET /api/user/listings`: Мои объекты.
- `POST /api/payments/create-order`: Инициация оплаты тарифа через Telegram Payments.

### 4. Стратегия масштабирования
1.  **Региональные представители**: Партнерство с локальными группами в Telegram в курортных городах.
2.  **SEO & Content**: Автоматическая генерация постов в Telegram-каналы с новыми проверенными объектами.
3.  **Локализация**: Добавление популярных направлений (Турция, Грузия, Таиланд) с переводом интерфейса.
4.  **Community-driven moderation**: Система "жалоб" от пользователей для удаления неактуальных или мошеннических объявлений.

### 5. Дисклеймер
Приложение является **информационным каталогом**. Все транзакции и бронирования происходят вне платформы. Платформа не несет ответственности за качество услуг проживания.
