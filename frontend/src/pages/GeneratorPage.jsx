import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Send, Copy, Check, History, LogOut, Code2, Loader, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const GeneratorPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const languages = [
    { value: 'javascript', label: 'JavaScript', icon: '🟨' },
    { value: 'python', label: 'Python', icon: '🐍' },
    { value: 'cpp', label: 'C++', icon: '⚡' },
    { value: 'java', label: 'Java', icon: '☕' }
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setLoading(true);
    setGeneratedCode('');

    try {
      const response = await api.post('/generate', {
        prompt: prompt.trim(),
        language
      });

      if (response.data.response) {
        setGeneratedCode(response.data.response);
        setPrompt('');
        toast.success('Code generated successfully!');
      } else {
        toast.error('Failed to generate code. Please try again.');
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || 'An error occurred while generating code');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleGenerate();
    }
  };

  return (
    <div className="generator-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Code2 size={28} />
          <span>CodeCopilot</span>
        </div>
        <div className="nav-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/history')}
          >
            <History size={18} />
            History
          </button>
          <button 
            className="btn btn-ghost"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </nav>

      <div className="generator-container">
        {/* Input Section */}
        <div className="generator-input-section">
          <div className="input-header">
            <h1>
              <Sparkles size={32} />
              Generate Code with AI
            </h1>
            <p>Describe what you want to build, and let AI create the code for you</p>
          </div>

          <div className="input-card">
            <div className="language-selector">
              <label>Programming Language:</label>
              <div className="language-options">
                {languages.map((lang) => (
                  <button
                    key={lang.value}
                    className={`language-option ${language === lang.value ? 'active' : ''}`}
                    onClick={() => setLanguage(lang.value)}
                  >
                    <span className="lang-icon">{lang.icon}</span>
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="prompt-input">
              <label htmlFor="prompt">Your Prompt:</label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Example: Create a function to sort an array of objects by a specific property..."
                rows={6}
              />
              <div className="input-footer">
                <span className="hint">Press Ctrl + Enter to generate</span>
                <button 
                  className="btn btn-primary"
                  onClick={handleGenerate}
                  disabled={loading || !prompt.trim()}
                >
                  {loading ? (
                    <>
                      <Loader className="spin" size={18} />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Generate Code
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Output Section */}
        {generatedCode && (
          <div className="generator-output-section">
            <div className="output-header">
              <h2>Generated Code</h2>
              <button 
                className="btn btn-secondary"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy Code
                  </>
                )}
              </button>
            </div>
            <div className="code-container">
              <SyntaxHighlighter
                language={language === 'cpp' ? 'cpp' : language}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: '8px',
                  fontSize: '14px',
                  padding: '20px'
                }}
                showLineNumbers
              >
                {generatedCode}
              </SyntaxHighlighter>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !generatedCode && (
          <div className="loading-state">
            <Loader className="spin" size={48} />
            <p>AI is generating your code...</p>
          </div>
        )}

        {/* Empty State */}
        {!generatedCode && !loading && (
          <div className="empty-state">
            <Code2 size={64} strokeWidth={1} />
            <h3>Ready to Generate</h3>
            <p>Enter a prompt and select a language to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratorPage;
