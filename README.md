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
- **Docker** for containerization
- **Vercel** for frontend deployment
- **Railway/Render** for backend deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.11+
- Docker (optional)
- Ollama (for AI features)

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

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python main.py
```

### Docker Setup
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
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

# Backend
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=llama2
DATABASE_URL=sqlite:///./dscvr_ai.db
```

### Ollama Setup

1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Pull the model: `ollama pull llama2`
3. Start Ollama: `ollama serve`

## 🚀 Deployment

### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables in Vercel dashboard

### Railway/Render (Backend)
1. Connect your GitHub repository
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `python main.py`
4. Add environment variables

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
- [Vercel](https://vercel.com/) for deployment platform

## 📞 Support

If you have any questions or need help, please open an issue on GitHub or contact the development team.
