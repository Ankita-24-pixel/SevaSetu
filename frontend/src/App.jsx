import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // <-- 1. Make sure this is imported
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ServiceDetails from './pages/ServiceDetails';
import Favorites from './pages/Favorites';
import AddService from './pages/AddService';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    // 2. AuthProvider MUST be the very first thing here!
    <AuthProvider>
      <Router>
        <div className="w-full min-h-screen font-sans bg-slate-50">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-service" element={<AddService />} />
            
            <Route 
              path="/service/:id" 
              element={
                <ProtectedRoute>
                  <ServiceDetails />
                </ProtectedRoute>
              } 
            />
            <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>}/>
            <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;