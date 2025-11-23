# CodeCopilot Frontend

Modern, responsive React application for AI-powered code generation.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:5174`

## 📦 Dependencies

- **react** & **react-dom**: Core React framework
- **react-router-dom**: Client-side routing
- **axios**: HTTP client for API calls
- **react-syntax-highlighter**: Code syntax highlighting
- **lucide-react**: Beautiful icon library
- **vite**: Fast build tool and dev server

## 🏗️ Project Structure

```
src/
├── pages/              # Page components
│   ├── LandingPage.jsx    # Home page with features
│   ├── SignupPage.jsx     # User registration
│   ├── LoginPage.jsx      # User authentication
│   ├── GeneratorPage.jsx  # Code generation interface
│   └── HistoryPage.jsx    # Generation history with pagination
├── components/         # Reusable components
│   └── ProtectedRoute.jsx # Auth guard for protected routes
├── context/           # React Context
│   └── AuthContext.jsx    # Authentication state management
├── utils/             # Utilities
│   └── api.js            # Axios instance with interceptors
├── App.jsx            # Main app component with routing
├── index.css          # Global styles
└── main.jsx           # App entry point
```

## 🎨 Features

### Pages

1. **Landing Page** (`/`)
   - Hero section with gradient effects
   - Feature cards
   - How it works section
   - Call-to-action buttons

2. **Sign Up** (`/signup`)
   - Form validation
   - Password confirmation
   - Error handling

3. **Login** (`/login`)
   - Email/password authentication
   - JWT cookie-based auth

4. **Generator** (`/generator`) - Protected
   - Multi-language support
   - Real-time code generation
   - Syntax highlighting
   - Copy to clipboard

5. **History** (`/history`) - Protected
   - Paginated list
   - Expandable code sections
   - Copy functionality

## 🔒 Authentication

Uses Context API for state management:
- JWT stored in HTTP-only cookies
- Protected routes redirect to login
- Automatic token validation

## 🎨 Styling

- Custom CSS with CSS variables
- Dark theme optimized for developers
- Fully responsive design
- Smooth animations and transitions

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px
- Touch-friendly UI elements

## 🔧 Configuration

### API Base URL

Update in `src/utils/api.js`:

```javascript
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  withCredentials: true,
});
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📦 Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## 🌐 Deployment

### Vercel
```bash
vercel --prod
```

### Netlify
```bash
netlify deploy --prod --dir=dist
```

## 🧪 Testing

Manual testing checklist:
- [ ] Landing page loads correctly
- [ ] Signup creates new user
- [ ] Login authenticates user
- [ ] Protected routes redirect when not authenticated
- [ ] Code generation works
- [ ] History pagination works
- [ ] Copy to clipboard works
- [ ] Logout clears session

## 📄 License

MIT
