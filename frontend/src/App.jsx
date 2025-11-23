import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import GeneratorPage from './pages/GeneratorPage';
import HistoryPage from './pages/HistoryPage';
import './App.css';

function App() {

  useEffect(() => {
    const wakeUpBackend = async () => {
      try {
        const backendUrl = import.meta.env.VITE_API_BASE_URL || 'https://codecopilotbackend.onrender.com/api/v1';
        const healthUrl = backendUrl.replace('/api/v1', '/health');
        
        console.log('Waking up backend server...');
        console.log('Backend URL:', healthUrl);
        
        await fetch(healthUrl, { 
          method: 'GET',
        })
        .then(response => {
          if (response.ok) {
            console.log('Backend is awake and ready!');
          } else {
            console.log('Backend responded but might be warming up...');
          }
        })
        .catch(() => {
          console.log('Wake-up signal sent to backend (CORS limited response)');
        });
      } catch (error) {
        console.log('Backend wake-up ping attempted');
      }
    };

    wakeUpBackend();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              },
              success: {
                iconTheme: {
                  primary: 'var(--success)',
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: 'var(--error)',
                  secondary: 'white',
                },
              },
            }}
          />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/generator" 
              element={
                <ProtectedRoute>
                  <GeneratorPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/history" 
              element={
                <ProtectedRoute>
                  <HistoryPage />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
