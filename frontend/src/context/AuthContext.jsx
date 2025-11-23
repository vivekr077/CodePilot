import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    // Check if user is logged in based on cookie
    const isLoggedIn = document.cookie.includes('authToken');
    if (isLoggedIn) {
      setUser({ isAuthenticated: true });
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/logIn', { email, password });
      if (response.data.status !== false) {
        setUser({ isAuthenticated: true });
        return { success: true };
      }
      return { success: false, message: response.data.msg };
    } catch (error) {
      return { success: false, message: error.response?.data?.msg || 'Login failed' };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await api.post('/signUp', { name, email, password });
      if (response.data.user) {
        return { success: true };
      }
      return { success: false, message: response.data.msg };
    } catch (error) {
      return { success: false, message: error.response?.data?.msg || 'Signup failed' };
    }
  };

  const logout = () => {
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
