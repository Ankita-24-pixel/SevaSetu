import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in when the app opens
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Calls your backend 'getProfile' route
          const response = await axios.get('import.meta.env.VITE_API_URL/auth/profile', {
            headers: {
              Authorization: `Bearer ${token}` // Sends the JWT token securely
            }
          });
          setUser(response.data);
        } catch (error) {
          console.error("Token invalid or expired");
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth anywhere easily
export const useAuth = () => useContext(AuthContext);