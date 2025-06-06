import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { AuthModal } from '../auth/AuthModal';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAuthClick = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isHomePage = location.pathname === '/';

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="bg-black/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-red-500/25 transition-all duration-200">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-white text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                ShadowBox AI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {isHomePage ? (
                <>
                  <button 
                    onClick={() => scrollToSection('features')}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Features
                  </button>
                  <button 
                    onClick={() => scrollToSection('pricing')}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Pricing
                  </button>
                  <button 
                    onClick={() => scrollToSection('how-it-works')}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    How It Works
                  </button>
                </>
              ) : (
                <>
                  <Link to="/#features" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Features
                  </Link>
                  <Link to="/#pricing" className="text-gray-300 hover:text-white transition-colors duration-200">
                    Pricing
                  </Link>
                  <Link to="/#how-it-works" className="text-gray-300 hover:text-white transition-colors duration-200">
                    How It Works
                  </Link>
                </>
              )}
            </nav>

            {/* Desktop Auth/User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard">
                    <Button variant="ghost\" size="sm\" className="text-gray-300 hover:text-white">
                      Dashboard
                    </Button>
                  </Link>
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-all duration-200">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="hidden sm:block font-medium">{user.name}</span>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="p-2">
                        <div className="px-3 py-2 text-sm text-gray-400 border-b border-gray-800">
                          <div className="font-medium text-white">{user.name}</div>
                          <div className="text-xs">{user.email}</div>
                        </div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800 rounded-md mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAuthClick('login')}
                    className="text-gray-300 hover:text-white"
                  >
                    Login
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleAuthClick('signup')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Start Free Trial
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800">
            <div className="px-4 py-4 space-y-4">
              {/* Navigation Links */}
              <div className="space-y-2">
                {isHomePage ? (
                  <>
                    <button 
                      onClick={() => scrollToSection('features')}
                      className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
                    >
                      Features
                    </button>
                    <button 
                      onClick={() => scrollToSection('pricing')}
                      className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
                    >
                      Pricing
                    </button>
                    <button 
                      onClick={() => scrollToSection('how-it-works')}
                      className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
                    >
                      How It Works
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/#features" 
                      className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Features
                    </Link>
                    <Link 
                      to="/#pricing" 
                      className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Pricing
                    </Link>
                    <Link 
                      to="/#how-it-works" 
                      className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      How It Works
                    </Link>
                  </>
                )}
              </div>

              {/* Auth/User Section */}
              <div className="border-t border-gray-800 pt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-gray-400">
                      <div className="font-medium text-white">{user.name}</div>
                      <div className="text-xs">{user.email}</div>
                    </div>
                    <Link 
                      to="/dashboard"
                      className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-3 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800 rounded-md"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-gray-300 hover:text-white"
                      onClick={() => handleAuthClick('login')}
                    >
                      Login
                    </Button>
                    <Button
                      variant="primary"
                      className="w-full bg-red-600 hover:bg-red-700"
                      onClick={() => handleAuthClick('signup')}
                    >
                      Start Free Trial
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
};