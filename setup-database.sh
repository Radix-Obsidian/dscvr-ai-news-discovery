#!/bin/bash

# PostgreSQL Database Setup Script for Dscvr AI News Discovery Platform
# This script will help you set up PostgreSQL for the project

set -e  # Exit on any error

echo "🚀 Setting up PostgreSQL for Dscvr AI News Discovery Platform"
echo "=============================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if PostgreSQL is installed
echo
print_info "Checking PostgreSQL installation..."

if command -v psql >/dev/null 2>&1; then
    print_status "PostgreSQL is installed"
    psql_version=$(psql --version | head -n1)
    echo "   Version: $psql_version"
else
    print_error "PostgreSQL is not installed!"
    echo
    echo "Please install PostgreSQL first:"
    echo "  macOS (Homebrew): brew install postgresql"
    echo "  Ubuntu/Debian: sudo apt-get install postgresql postgresql-contrib"
    echo "  CentOS/RHEL: sudo yum install postgresql-server postgresql-contrib"
    exit 1
fi

# Check if PostgreSQL is running
echo
print_info "Checking if PostgreSQL is running..."

if pg_isready >/dev/null 2>&1; then
    print_status "PostgreSQL is running"
else
    print_warning "PostgreSQL is not running. Attempting to start..."
    
    # Try to start PostgreSQL
    if command -v brew >/dev/null 2>&1; then
        # macOS with Homebrew
        brew services start postgresql
    elif command -v systemctl >/dev/null 2>&1; then
        # Linux with systemd
        sudo systemctl start postgresql
    else
        print_error "Could not start PostgreSQL automatically"
        echo "Please start PostgreSQL manually and run this script again"
        exit 1
    fi
    
    # Wait a moment and check again
    sleep 2
    if pg_isready >/dev/null 2>&1; then
        print_status "PostgreSQL started successfully"
    else
        print_error "Failed to start PostgreSQL"
        exit 1
    fi
fi

# Get database configuration
echo
echo "📋 Database Configuration"
echo "========================="

# Default values
DEFAULT_DB_NAME="dscvr_news"
DEFAULT_DB_USER="dscvr_user"
DEFAULT_DB_HOST="localhost"
DEFAULT_DB_PORT="5432"

# Prompt for database details
read -p "Database name [$DEFAULT_DB_NAME]: " DB_NAME
DB_NAME=${DB_NAME:-$DEFAULT_DB_NAME}

read -p "Database user [$DEFAULT_DB_USER]: " DB_USER
DB_USER=${DB_USER:-$DEFAULT_DB_USER}

read -s -p "Database password (will be hidden): " DB_PASSWORD
echo

read -p "Database host [$DEFAULT_DB_HOST]: " DB_HOST
DB_HOST=${DB_HOST:-$DEFAULT_DB_HOST}

read -p "Database port [$DEFAULT_DB_PORT]: " DB_PORT
DB_PORT=${DB_PORT:-$DEFAULT_DB_PORT}

# Create database and user
echo
print_info "Creating database and user..."

# Create SQL commands
SQL_COMMANDS=$(cat << EOF
-- Create database
CREATE DATABASE $DB_NAME;

-- Create user with password
CREATE USER $DB_USER WITH ENCRYPTED PASSWORD '$DB_PASSWORD';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

-- Additional privileges for PostgreSQL 15+
\c $DB_NAME
GRANT ALL ON SCHEMA public TO $DB_USER;
GRANT CREATE ON SCHEMA public TO $DB_USER;
EOF
)

# Execute SQL commands
if echo "$SQL_COMMANDS" | psql -U postgres -h $DB_HOST -p $DB_PORT >/dev/null 2>&1; then
    print_status "Database and user created successfully"
else
    print_warning "Database or user might already exist, or permission denied"
    print_info "Attempting to connect to verify..."
fi

# Create DATABASE_URL
DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"

# Test connection
echo
print_info "Testing database connection..."

if psql "$DATABASE_URL" -c "SELECT 1;" >/dev/null 2>&1; then
    print_status "Database connection successful!"
else
    print_error "Database connection failed!"
    echo "Please check your credentials and try again"
    exit 1
fi

# Install Python dependencies
echo
print_info "Installing Python dependencies..."

cd backend

if [ -f "requirements.txt" ]; then
    if pip install -r requirements.txt >/dev/null 2>&1; then
        print_status "Python dependencies installed"
    else
        print_warning "Some dependencies might have failed to install"
        print_info "You may need to install them manually:"
        echo "   cd backend && pip install -r requirements.txt"
    fi
else
    print_warning "requirements.txt not found"
    print_info "Installing essential packages..."
    pip install psycopg2-binary sqlalchemy fastapi uvicorn
fi

# Set up environment file
echo
print_info "Setting up environment configuration..."

ENV_FILE="backend/.env"
if [ -f "$ENV_FILE" ]; then
    print_warning ".env file already exists"
    read -p "Overwrite existing .env file? (y/N): " OVERWRITE
    if [[ $OVERWRITE =~ ^[Yy]$ ]]; then
        cat > "$ENV_FILE" << EOF
# Database Configuration
DATABASE_URL=$DATABASE_URL

# Application Configuration
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Configuration
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:8000"]

# Ollama Configuration (for AI features)
OLLAMA_BASE_URL=http://localhost:11434
EOF
        print_status "Environment file updated"
    fi
else
    cat > "$ENV_FILE" << EOF
# Database Configuration
DATABASE_URL=$DATABASE_URL

# Application Configuration
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Configuration
BACKEND_CORS_ORIGINS=["http://localhost:3000","http://localhost:8000"]

# Ollama Configuration (for AI features)
OLLAMA_BASE_URL=http://localhost:11434
EOF
    print_status "Environment file created"
fi

# Initialize database tables
echo
print_info "Initializing database tables..."

if python create_tables.py; then
    print_status "Database tables created successfully!"
else
    print_error "Failed to create database tables"
    echo "You can try running this manually:"
    echo "   cd backend && python create_tables.py"
fi

# Final instructions
echo
echo "🎉 Setup Complete!"
echo "=================="
echo
echo "Your database is ready to use with these settings:"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  Host: $DB_HOST:$DB_PORT"
echo
echo "Next steps:"
echo "1. Start the backend server:"
echo "   cd backend && python -m uvicorn main:app --reload"
echo
echo "2. Start the frontend:"
echo "   npm run dev"
echo
echo "3. Visit your application:"
echo "   Frontend: http://localhost:3000"
echo "   API Docs: http://localhost:8000/docs"
echo
print_info "Your DATABASE_URL has been saved to backend/.env"
print_warning "Remember to change the SECRET_KEY in production!"