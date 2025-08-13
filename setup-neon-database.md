# 🚀 Neon Database Setup Guide

## Step 1: Create Neon Account

1. Go to **https://console.neon.tech/signup**
2. Sign up with your preferred method:
   - Email
   - GitHub (recommended for developers)
   - Google

## Step 2: Create Your Project

1. After signup, Neon automatically creates:
   - **Production branch** (main database)
   - **Development branch** (for testing)

2. Note your project details:
   - Project ID
   - Database name (usually `neondb`)
   - Region

## Step 3: Get Your Connection String

1. In the Neon console, go to **Dashboard**
2. Click on **Connection Details**
3. Copy the **PostgreSQL connection string**
   - Format: `postgresql://username:password@host:port/database?sslmode=require`

## Step 4: Configure Environment

1. Copy the connection string from Neon
2. Run this command in your project root:

```bash
# This will update your .env file with the Neon database URL
./setup-neon-connection.sh
```

## Step 5: Initialize Database

```bash
# Navigate to backend
cd backend

# Install dependencies if needed
pip install -r requirements.txt

# Run database setup
python create_tables.py

# Import real data
python import_real_data.py
```

## Step 6: Test Connection

```bash
# Test the database connection
python -c "
from app.core.database import engine
from sqlalchemy import text

try:
    with engine.connect() as conn:
        result = conn.execute(text('SELECT version()'))
        print('✅ Connected to:', result.fetchone()[0])
except Exception as e:
    print('❌ Connection failed:', e)
"
```

## 🎯 What You Get

- **500 MB storage** (free tier)
- **PostgreSQL 17** (latest version)
- **Automatic backups**
- **SSL encryption**
- **Branching** for dev/staging/prod
- **Connection pooling**

## 🔧 Next Steps

After setup:
1. Your app will use production PostgreSQL database
2. Real user data will be stored securely
3. You can scale up when needed
4. Access database via Neon console or SQL clients

## 🛠️ Troubleshooting

**Connection Issues:**
- Ensure SSL mode is enabled
- Check firewall settings
- Verify connection string format

**Performance:**
- Free tier has compute hour limits
- Monitor usage in Neon console
- Upgrade when needed for 24/7 uptime