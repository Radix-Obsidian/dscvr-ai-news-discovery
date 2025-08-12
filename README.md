# Dscvr AI News Discovery Platform

A modern, AI-powered news discovery platform built with React, TypeScript, and FastAPI. Discover trending content from across the web with intelligent feed curation and AI-powered summaries.

## 🚀 Features

- **AI-Powered Summaries**: Get intelligent summaries of articles using Ollama
- **Smart Feed Curation**: RSS feed aggregation with intelligent filtering
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Updates**: Live feed updates with automatic refresh
- **Custom Feeds**: Create and follow personalized news feeds
- **Trending Topics**: Discover what's trending across different categories
- **Reading Progress**: Track your reading progress and history
- **Share Functionality**: Easy sharing of articles across platforms

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **Lucide React** for icons
- **Sonner** for toast notifications

### Backend
- **FastAPI** for the API server
- **Python 3.11+** for backend logic
- **Ollama** for AI-powered features
- **SQLAlchemy** for database operations
- **Pydantic** for data validation

### Infrastructure
- **Local Development** - Simplified setup for development
- **PostgreSQL** for database (local or cloud)
- **Ollama** for local AI processing

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.11+
- Ollama (for AI features)

### 1. Setup Environment
```bash
# Create environment files
./setup-env.sh
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt
cd ..
```

### 3. Download AI Models
```bash
# Download the default model
ollama pull llama2:7b
```

### 4. Start the Application
```bash
# Use the convenience script
./start-local.sh

# Or start manually:
npm run dev
```

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment (optional)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```

### Quick Start (All Services)
```bash
# Use the convenience script to start everything
./start-local.sh

# Or run manually:
# Terminal 1: ollama serve
# Terminal 2: cd backend && python main.py
# Terminal 3: npm run dev
```

## 📁 Project Structure

```
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── ...             # Feature components
├── src/
│   ├── hooks/          # Custom React hooks
│   └── services/       # API services
├── backend/
│   ├── app/
│   │   ├── api/        # API endpoints
│   │   ├── core/       # Core configuration
│   │   ├── models/     # Database models
│   │   └── services/   # Business logic
│   └── main.py         # FastAPI application
├── styles/             # Global styles
└── public/             # Static assets
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Frontend
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://itmtexyyxpzddlutxoyxxs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0bXRleHl4cHpkZGx1dHhveHhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NzQ0NzYsImV4cCI6MjA3MDU1MDQ3Nn0.NjMkMu-fWYX8dF_eHUwDM2Mq4k1MexFTfXa4iGI-vYs
VITE_OLLAMA_URL=http://localhost:11434
VITE_OLLAMA_MODEL=llama2
```

Create a `.env` file in the `backend/` directory:

```env
# Backend
DATABASE_URL=sqlite:///./database/dscvr_news.db
SECRET_KEY=your-super-secret-key-change-this-in-production
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama2:7b
```

### Ollama Setup

1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Pull the model: `ollama pull llama2`
3. Start Ollama: `ollama serve`

## 🚀 Deployment

### Local Development
This project is configured for local development. For production deployment, you can:

1. **Build the frontend**: `npm run build`
2. **Deploy to any static hosting service** (Vercel, Netlify, etc.)
3. **Deploy the backend** to any Python hosting service (Railway, Heroku, etc.)
4. **Set up a database** (PostgreSQL, MySQL, etc.)

### Environment Setup
Make sure to update environment variables for production:
- `VITE_API_URL` - Your backend API URL
- `DATABASE_URL` - Your production database URL
- `SECRET_KEY` - A secure secret key

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Ollama](https://ollama.ai/) for local AI inference
- [Vite](https://vitejs.dev/) for fast development and building

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.
