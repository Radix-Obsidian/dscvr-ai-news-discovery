# PostgreSQL Setup Guide

## 1. Install PostgreSQL Dependencies

First, install the PostgreSQL adapter for Python:

```bash
cd backend
pip install psycopg2-binary
```

## 2. Create PostgreSQL Database

Connect to PostgreSQL and create your database:

```bash
# Connect to PostgreSQL as superuser
psql -U postgres

# Create database
CREATE DATABASE dscvr_news;

# Create user (optional but recommended)
CREATE USER dscvr_user WITH ENCRYPTED PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE dscvr_news TO dscvr_user;

# Exit PostgreSQL
\q
```

## 3. Set Environment Variables

Create a `.env` file in the backend directory or export environment variables:

```bash
# In backend/.env file
DATABASE_URL=postgresql://dscvr_user:your_secure_password@localhost:5432/dscvr_news

# Or export directly
export DATABASE_URL="postgresql://dscvr_user:your_secure_password@localhost:5432/dscvr_news"
```

## 4. Install Additional Dependencies

Update your requirements.txt to include PostgreSQL support:

```bash
cd backend
echo "psycopg2-binary>=2.9.0" >> requirements.txt
pip install -r requirements.txt
```

## 5. Initialize Database Tables

Run the database initialization script:

```bash
cd backend
python create_tables.py
```

This will:
- Create all necessary tables (users, articles, rss_feeds, etc.)
- Set up indexes for performance
- Add initial feed categories
- Add sample RSS feeds

## 6. Verify Setup

Test the database connection:

```bash
# Start the backend server
python -m uvicorn main:app --reload

# Visit API docs at http://localhost:8000/docs
```

## Database Schema Overview

The database includes these main tables:

### Users Table
- User authentication and profiles
- Reading preferences and interests
- Timestamps for account management

### Articles Table
- Article content and metadata
- AI-generated summaries and sentiment
- View counts and engagement metrics
- Full-text search capabilities

### RSS Feeds Table
- RSS feed sources and metadata
- Fetch scheduling and error tracking
- Statistics and performance metrics

### Reading History Table
- User reading behavior tracking
- Progress tracking (percentage read)
- Time spent reading articles

### User Feed Subscriptions Table
- User's RSS feed subscriptions
- Notification preferences
- Custom feed organization

### Feed Categories Table
- Categorization system for feeds
- UI customization (colors, icons)
- Hierarchical organization

## Performance Optimizations

The database includes several performance optimizations:

1. **Indexes**: Strategic indexes on frequently queried columns
2. **Connection Pooling**: Configured for high-concurrency workloads
3. **Query Optimization**: Efficient relationships and foreign keys
4. **Batch Operations**: Support for bulk article imports

## Troubleshooting

### Connection Issues

If you get connection errors:

1. **Check PostgreSQL is running**:
   ```bash
   # macOS with Homebrew
   brew services start postgresql
   
   # Linux systemd
   sudo systemctl start postgresql
   ```

2. **Verify connection string**:
   ```bash
   psql "postgresql://dscvr_user:your_password@localhost:5432/dscvr_news"
   ```

3. **Check firewall/permissions**:
   - Ensure PostgreSQL accepts connections on port 5432
   - Check `pg_hba.conf` for authentication settings

### Migration Issues

If tables already exist, you can:

1. **Drop and recreate** (WARNING: loses all data):
   ```sql
   DROP DATABASE dscvr_news;
   CREATE DATABASE dscvr_news;
   ```

2. **Reset specific tables**:
   ```sql
   TRUNCATE articles, rss_feeds, reading_history RESTART IDENTITY CASCADE;
   ```

## Production Considerations

For production deployment:

1. **Environment Variables**:
   - Use secure, randomly generated passwords
   - Store DATABASE_URL in secure environment variables
   - Never commit credentials to version control

2. **Database Configuration**:
   - Enable SSL connections
   - Configure connection pooling appropriately
   - Set up database backups
   - Monitor query performance

3. **Security**:
   - Use principle of least privilege for database users
   - Enable query logging for auditing
   - Regular security updates for PostgreSQL

## Sample Data

After running `create_tables.py`, you'll have:

- 8 feed categories (Technology, Business, Science, etc.)
- 4 sample RSS feeds (TechCrunch, BBC Tech, Reuters Business, Scientific American)
- Proper indexes and constraints for optimal performance

You can now start adding users and fetching articles from the RSS feeds!