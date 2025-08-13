#!/bin/bash

# Neon Database Connection Setup Script
# This script helps configure your Neon PostgreSQL database connection

echo "🚀 Neon Database Connection Setup"
echo "================================="
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
fi

echo "📋 Please provide your Neon database connection details:"
echo ""

# Get Neon connection string
echo "🔗 Enter your Neon PostgreSQL connection string:"
echo "   (Format: postgresql://username:password@host:port/database?sslmode=require)"
echo "   You can find this in your Neon console under 'Connection Details'"
echo ""
read -p "Connection String: " NEON_CONNECTION_STRING

# Validate connection string format
if [[ ! $NEON_CONNECTION_STRING =~ ^postgresql:// ]]; then
    echo "❌ Invalid connection string format. Must start with 'postgresql://'"
    exit 1
fi

# Create backup of current .env
cp .env .env.backup
echo "💾 Backed up current .env to .env.backup"

# Update DATABASE_URL in .env file
if grep -q "^DATABASE_URL=" .env; then
    # Replace existing DATABASE_URL
    sed -i.bak "s|^DATABASE_URL=.*|DATABASE_URL=$NEON_CONNECTION_STRING|" .env
    echo "✅ Updated DATABASE_URL in .env"
else
    # Add DATABASE_URL if it doesn't exist
    echo "DATABASE_URL=$NEON_CONNECTION_STRING" >> .env
    echo "✅ Added DATABASE_URL to .env"
fi

# Clean up sed backup file
rm -f .env.bak

echo ""
echo "🎯 Configuration Complete!"
echo ""
echo "Next steps:"
echo "1. Test connection: cd backend && python -c \"from app.core.database import engine; print('✅ Connected!')\" "
echo "2. Create tables: cd backend && python create_tables.py"
echo "3. Import data: cd backend && python import_real_data.py"
echo ""
echo "Your DATABASE_URL has been updated to use Neon PostgreSQL!"
echo "🔐 Keep your connection string secure - don't commit it to git!"