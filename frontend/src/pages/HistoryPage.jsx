import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  History, 
  Code2, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check,
  Calendar,
  FileCode,
  ArrowLeft,
  Loader,
  Menu,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const HistoryPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchHistory(currentPage);
  }, [currentPage]);

  const fetchHistory = async (page) => {
    setLoading(true);

    try {
      const response = await api.get(`/history?page=${page}&limit=${itemsPerPage}`);
      
      if (response.data.status) {
        setHistory(response.data.records);
        setTotalPages(response.data.totalPages);
        setTotalCount(response.data.totalCount);
      } else {
        toast.error('Failed to fetch history');
      }
    } catch (err) {
      toast.error(err.response?.data?.msg || 'An error occurred while fetching history');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (code, id) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error('Failed to copy code');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLanguageLabel = (lang) => {
    const labels = {
      javascript: '🟨 JavaScript',
      python: '🐍 Python',
      cpp: '⚡ C++',
      java: '☕ Java'
    };
    return labels[lang] || lang;
  };

  return (
    <div className="history-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <Code2 size={28} />
          <span>CodeCopilot</span>
        </div>
        
        {/* Desktop Navigation */}
        <div className="nav-actions desktop-nav">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/generator')}
          >
            <ArrowLeft size={18} />
            Generator
          </button>
          <button 
            className="btn btn-ghost"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div className="mobile-nav-menu">
          <button 
            className="btn btn-secondary mobile-nav-btn"
            onClick={() => {
              navigate('/generator');
              setMenuOpen(false);
            }}
          >
            <ArrowLeft size={18} />
            Generator
          </button>
          <button 
            className="btn btn-ghost mobile-nav-btn"
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}

      <div className="history-container">
        <div className="history-header">
          <div className="header-content">
            <History size={36} />
            <div>
              <h1>Generation History</h1>
              <p>Browse through all your AI-generated code snippets</p>
            </div>
          </div>
          {totalCount > 0 && (
            <div className="stats">
              <span className="stat-badge">{totalCount} Total Generations</span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading-state">
            <Loader className="spin" size={48} />
            <p>Loading your history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="empty-state">
            <FileCode size={64} strokeWidth={1} />
            <h3>No History Yet</h3>
            <p>Start generating code to see your history here</p>
            <button className="btn btn-primary" onClick={() => navigate('/generator')}>
              <Code2 size={18} />
              Generate Code
            </button>
          </div>
        ) : (
          <>
            <div className="history-list">
              {history.map((item) => (
                <div key={item.id} className="history-card">
                  <div className="history-card-header">
                    <div className="card-info">
                      <span className="language-badge">
                        {getLanguageLabel(item.language)}
                      </span>
                      <span className="date">
                        <Calendar size={14} />
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                    <div className="card-actions">
                      <button
                        className="btn btn-icon"
                        onClick={() => handleCopy(item.code, item.id)}
                        title="Copy code"
                      >
                        {copiedId === item.id ? (
                          <Check size={18} />
                        ) : (
                          <Copy size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="history-card-content">
                    <div className="prompt-section">
                      <h3>Prompt:</h3>
                      <p>{item.prompt}</p>
                    </div>

                    <button
                      className="expand-btn"
                      onClick={() => toggleExpand(item.id)}
                    >
                      {expandedId === item.id ? 'Hide Code' : 'Show Code'}
                      <ChevronRight 
                        size={18} 
                        className={expandedId === item.id ? 'rotated' : ''} 
                      />
                    </button>

                    {expandedId === item.id && (
                      <div className="code-section">
                        <SyntaxHighlighter
                          language={item.language === 'cpp' ? 'cpp' : item.language}
                          style={vscDarkPlus}
                          customStyle={{
                            margin: 0,
                            borderRadius: '8px',
                            fontSize: '13px',
                            padding: '16px'
                          }}
                          showLineNumbers
                        >
                          {item.code}
                        </SyntaxHighlighter>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn-secondary"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={18} />
                  Previous
                </button>
                
                <div className="page-numbers">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  className="btn btn-secondary"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
