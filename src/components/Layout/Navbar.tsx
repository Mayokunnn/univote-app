import { FC, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar: FC = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-black/80 backdrop-blur-xl border-b border-gray-800/50' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="group flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl blur opacity-0 group-hover:opacity-50 transition-opacity -z-10"></div>
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-white group-hover:to-gray-200 transition-all duration-300">
                UniVote
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" isActive={isActive('/')} label="Home" />
            
            {currentUser ? (
              <>
                <NavLink to="/dashboard" isActive={isActive('/dashboard')} label="Dashboard" />
                {currentUser.isAdmin && (
                  <NavLink to="/admin" isActive={isActive('/admin')} label="Admin" />
                )}
              </>
            ) : (
              <NavLink to="/signup" isActive={isActive('/signup')} label="Sign Up" />
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* User Menu */}
            {currentUser && (
              <div className="hidden md:flex items-center">
                <div className="relative group">
                  <button className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-300">
                      {currentUser.matricNumber.substring(0, 8)}
                    </span>
                  </button>
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                    <div className="py-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
                      >
                        <LogOut size={16} className="mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl bg-gradient-to-br from-gray-900/80 to-gray-800/40 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
              >
                {isMenuOpen ? 
                  <X size={20} className="text-gray-300" /> : 
                  <Menu size={20} className="text-gray-300" />
                }
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-4 pt-2 pb-4 bg-black/95 backdrop-blur-xl border-t border-gray-800/50">
            <div className="space-y-2">
              <MobileNavLink 
                to="/" 
                isActive={isActive('/')} 
                label="Home" 
                onClick={() => setIsMenuOpen(false)} 
              />
              
              {currentUser ? (
                <>
                  <MobileNavLink 
                    to="/dashboard" 
                    isActive={isActive('/dashboard')} 
                    label="Dashboard" 
                    onClick={() => setIsMenuOpen(false)} 
                  />
                  {currentUser.isAdmin && (
                    <MobileNavLink 
                      to="/admin" 
                      isActive={isActive('/admin')} 
                      label="Admin" 
                      onClick={() => setIsMenuOpen(false)} 
                    />
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
                  >
                    <LogOut size={16} className="mr-3" />
                    Logout
                  </button>
                </>
              ) : (
                <MobileNavLink 
                  to="/signup" 
                  isActive={isActive('/signup')} 
                  label="Sign Up" 
                  onClick={() => setIsMenuOpen(false)} 
                />
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// Desktop Navigation Link Component
const NavLink: FC<{ to: string; isActive: boolean; label: string }> = ({ to, isActive, label }) => (
  <Link
    to={to}
    className={`relative px-4 py-2 rounded-xl font-medium transition-all duration-300 group ${
      isActive 
        ? 'text-white bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30' 
        : 'text-gray-300 hover:text-white hover:bg-gray-800/30'
    }`}
  >
    {label}
    {isActive && (
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-xl blur opacity-50"></div>
    )}
    {!isActive && (
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
    )}
  </Link>
);

// Mobile Navigation Link Component
const MobileNavLink: FC<{ to: string; isActive: boolean; label: string; onClick: () => void }> = ({ 
  to, isActive, label, onClick 
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
      isActive 
        ? 'text-white bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30' 
        : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
    }`}
  >
    {label}
  </Link>
);

export default Navbar;