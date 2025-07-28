# Email Campaign Web Application

A full-stack web application for managing email campaigns with profile and list management capabilities.

## 🏗️ Architecture

- **Backend**: Flask (Python) with SQLAlchemy ORM
- **Frontend**: React with PWA support
- **Database**: SQLite (development) / PostgreSQL (production)
- **Email Service**: Postmark (planned integration)

## 📁 Project Structure
```
emailWeb/
├── backend/ # Flask backend application
│ ├── app.py # Main Flask application
│ ├── models.py # Database models
│ ├── migrations/ # Database migrations
│ └── email_campaign.db # SQLite database
├── emailweb/ # Python virtual environment
│ ├── bin/
│ ├── lib/
│ └── include/
└── frontend/ # React frontend application
├── src/
├── public/
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Create and Activate virtual environment:**

2. **Install dependencies:**
   ```bash
   pip install -r ../requirements.txt
   ```

3. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

4. **Initialize database:**
   ```bash
   export FLASK_APP=app.py
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

5. **Start backend server:**
   ```bash
   flask run --host=0.0.0.0 --port=5001
   ```

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Open application:**
   - Backend: http://localhost:5001
   - Frontend: http://localhost:3000

## 📋 Features

### ✅ Implemented (MVP)

- **Profile Management**
  - Create, list, and delete profiles
  - Store email, name, and custom fields
  - JSON-based custom field storage

- **List Management**
  - Create, list, and delete lists
  - Many-to-many relationship with profiles
  - Description and metadata support

- **Campaign Management**
  - Create campaigns with HTML content
  - Associate campaigns with target lists
  - Campaign status tracking (draft, scheduled, sending, sent, failed)
  - Scheduled sending support

- **Database Integration**
  - SQLite database with proper relationships
  - UTC timestamp handling
  - Migration system for schema changes

### �� Planned Features

- **Email Integration**
  - Postmark API integration
  - Email delivery tracking
  - Webhook handling for delivery status

- **Advanced Features**
  - Flow automation
  - Event tracking
  - Analytics and reporting
  - User authentication

## �� API Endpoints

### Health Check
- `GET /api/health` - Backend health status

### Profiles
- `GET /api/profiles` - List all profiles
- `POST /api/profiles` - Create new profile
- `DELETE /api/profiles/{id}` - Delete profile

### Lists
- `GET /api/lists` - List all lists
- `POST /api/lists` - Create new list
- `DELETE /api/lists/{id}` - Delete list

### Campaigns
- `GET /api/campaigns` - List all campaigns
- `POST /api/campaigns` - Create new campaign
- `DELETE /api/campaigns/{id}` - Delete campaign

## ��️ Database Schema

### Profiles
- `id` (Primary Key)
- `email` (Unique, indexed)
- `name`
- `custom_fields` (JSON string)
- `created_at`, `updated_at` (UTC timestamps)

### Lists
- `id` (Primary Key)
- `name`
- `description`
- `created_at`, `updated_at` (UTC timestamps)

### Campaigns
- `id` (Primary Key)
- `name`, `subject`, `content_html`
- `status` (draft, scheduled, sending, sent, failed)
- `scheduled_time` (UTC datetime)
- `target_list_id` (Foreign Key to Lists)
- `created_at`, `updated_at` (UTC timestamps)

### Email Logs (Planned)
- `id` (Primary Key)
- `campaign_id`, `profile_id` (Foreign Keys)
- `postmark_message_id`
- `status` (sent, delivered, opened, clicked, bounced, failed)
- `timestamp`, `event_details` (JSON)

## 🛠️ Development

### Backend Development

- **Database Migrations:**
  ```bash
  flask db migrate -m "Description of changes"
  flask db upgrade
  ```

- **Running Tests:**
  ```bash
  # Add test files and run with pytest
  pytest
  ```

### Frontend Development

- **Adding Dependencies:**
  ```bash
  npm install package-name
  ```

- **Building for Production:**
  ```bash
  npm run build
  ```

## 🚀 Deployment

### Production Considerations

1. **Database Migration:**
   - Switch from SQLite to PostgreSQL
   - Update database URI in configuration

2. **Environment Variables:**
   - Set `FLASK_ENV=production`
   - Configure Postmark API keys
   - Set up proper CORS origins

3. **Scaling:**
   - Use multiple Flask instances behind load balancer
   - Implement Celery for async task processing
   - Add Redis for caching



For questions or issues, please open an issue in the repository.
