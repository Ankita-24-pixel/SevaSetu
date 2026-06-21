import { Search, MapPin, User, Heart, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logoutAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAuth();
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 transition-all duration-300">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo & Main Links */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <MapPin size={24} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">SevaSetu</span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/about" className="hover:text-blue-600 transition-colors">About Us</Link>
            <Link to="/map" className="hover:text-blue-600 transition-colors">Map View</Link>
          </div>
        </div>

        {/* Right Side Auth / Actions */}
        <div className="flex items-center gap-4">
          
          {user ? (
            // WHAT LOGGED-IN USERS SEE
            <>
              <Link to="/favorites" className="hidden sm:flex items-center gap-2 text-slate-600 hover:text-red-500 font-medium transition-colors mr-2">
                <Heart size={20} />
                Favorites
              </Link>
              
              <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
              
              <div className="flex items-center gap-3 pl-2">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md uppercase">
                  {/* Safely get the first letter of the user's name */}
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-600 p-2 transition-colors rounded-lg hover:bg-red-50 flex items-center gap-2"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            // WHAT LOGGED-OUT USERS SEE
            <>
              <Link to="/login" className="flex items-center gap-2 text-slate-700 hover:text-blue-600 font-semibold px-4 py-2 rounded-lg transition-colors">
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