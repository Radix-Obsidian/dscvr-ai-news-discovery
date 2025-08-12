# 🏠 Local Development Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Your app will be available at: **http://localhost:3000**

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📁 Project Structure

```
├── src/                    # Source code
│   ├── main.tsx           # App entry point
│   ├── hooks/             # Custom React hooks
│   └── services/          # API services
├── components/            # React components
│   ├── ui/               # UI components
│   └── ...               # Feature components
├── styles/               # Global styles
├── backend/              # Backend API (if needed)
└── public/               # Static assets
```

## 🔧 Configuration

- **Vite Config**: `vite.config.ts`
- **TypeScript**: `tsconfig.json`
- **Tailwind**: `tailwind.config.js`
- **Package**: `package.json`

## 🚀 Next Steps

1. **Add Backend**: Set up FastAPI backend in `backend/` directory
2. **Add Database**: Configure PostgreSQL or SQLite
3. **Add AI Features**: Set up Ollama for AI-powered features
4. **Add Authentication**: Implement user authentication
5. **Add RSS Feeds**: Integrate RSS feed aggregation

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Build Issues
```bash
# Clear build cache
rm -rf dist

# Rebuild
npm run build
```
