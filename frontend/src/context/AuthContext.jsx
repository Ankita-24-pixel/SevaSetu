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
          const response = await axios.get('http://localhost:3001/api/auth/profile', {
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

  const loginAuth = (userData, token) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logoutAuth = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loginAuth, logoutAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth anywhere easily
export const useAuth = () => useContext(AuthContext);