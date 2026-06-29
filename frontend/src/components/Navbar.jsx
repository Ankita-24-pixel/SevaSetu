import React from 'react';
import { Search, MapPin, User, Heart, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // We must call the hook to get 'user' and 'logout' from your context!
  const { user, logout } = useAuth();

  // We need to define the function that runs when the logout button is clicked
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Smart scrolling function
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    
    // If we are NOT on the home page, go to home page first, then scroll
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
      }, 300); // Wait for the home page to load before scrolling
    } else {
      // If we are already on the home page, just scroll smoothly!
      document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed z-50 w-full transition-all duration-300 border-b bg-white/80 backdrop-blur-lg border-slate-200/50">
      <div className="container flex items-center justify-between h-20 px-6 mx-auto">
        
        {/* Logo & Main Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 text-white shadow-lg bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-blue-500/20">
              <MapPin size={24} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">SevaSetu</span>
          </Link>
          
          <div className="hidden space-x-8 font-semibold md:flex text-slate-600">
            <Link to="/" className="transition-colors hover:text-blue-600">Home</Link>
          
            <a 
              href="#about" 
              onClick={(e) => handleNavClick(e, 'about')} 
              className="transition-colors cursor-pointer hover:text-blue-600"
            >
              About Us
            </a>
          
            <a 
              href="#map" 
              onClick={(e) => handleNavClick(e, 'map')} 
              className="transition-colors cursor-pointer hover:text-blue-600"
            >
              Map View
            </a>
          </div>
        </div>

        {/* Right Side Auth / Actions */}
        <div className="flex items-center gap-4">
          
          {user ? (
            // WHAT LOGGED-IN USERS SEE
            <>
              <Link to="/favorites" className="items-center hidden gap-2 mr-2 font-medium transition-colors sm:flex text-slate-600 hover:text-red-500">
                <Heart size={20} />
                Favorites
              </Link>
              <Link to="/add-service" className="hidden font-bold text-blue-600 transition-colors md:block hover:text-blue-800">
                + Add Service
              </Link>
              
              <div className="hidden w-px h-6 bg-slate-200 sm:block"></div>
              
              <div className="flex items-center gap-3 pl-2">
                <div className="flex items-center justify-center w-10 h-10 font-bold text-white uppercase rounded-full shadow-md bg-gradient-to-tr from-blue-600 to-indigo-600">
                  {/* Safely get the first letter of the user's name */}
                  {user?.name ? user.name.charAt(0) : <User size={18} />}
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 p-2 transition-colors rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            // WHAT LOGGED-OUT USERS SEE
            <>
              <Link to="/login" className="flex items-center gap-2 px-4 py-2 font-semibold transition-colors rounded-lg text-slate-700 hover:text-blue-600">
                Log in
              </Link>
              <Link to="/register" className="hidden sm:block bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all">
                Sign up
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}