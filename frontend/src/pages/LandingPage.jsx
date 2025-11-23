import { useNavigate } from 'react-router-dom';
import { Code2, Sparkles, History, Zap, Shield, Layers, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="landing-page">
      {/* Theme Toggle Button */}
      <button 
        className="theme-toggle-fab"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="badge">
            <Sparkles size={16} />
            <span>AI-Powered Code Generation</span>
          </div>
          <h1 className="hero-title">
            Transform Ideas into
            <span className="gradient-text"> Code Instantly</span>
          </h1>
          <p className="hero-description">
            Generate high-quality code in multiple programming languages with the power of AI.
            Simply describe what you need, and let our copilot do the rest.
          </p>
          <div className="hero-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => navigate(user ? '/generator' : '/signup')}
            >
              <Code2 size={20} />
              Start Generating
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </div>
          
          {/* Code Preview Animation */}
          <div className="code-preview">
            <div className="code-window">
              <div className="window-header">
                <div className="window-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <span className="window-title">AI Generated Code</span>
              </div>
              <div className="code-content">
                <pre>
{`// Prompt: "Create a function to reverse a string"

function reverseString(str) {
  return str.split('').reverse().join('');
}

// Example usage
console.log(reverseString("Hello World"));
// Output: "dlroW olleH"`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 CodeCopilot. Built with ❤️ for developers.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
