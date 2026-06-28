import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { Activity, Sun, Moon, Menu, X, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = settings?.customNavLinks?.length > 0 ? settings.customNavLinks : [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Our Team', path: '/team' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Shop', path: '/shop' },
    { label: 'Contact Us', path: '/contact' }
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--glass-border)',
      boxShadow: 'var(--shadow-sm)',
      transition: 'all 0.3s ease'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '72px'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src={settings?.logo || "/logo.jpg"} 
            alt={`${settings?.websiteName || 'ACET MEDTRACK'} Logo`} 
            style={{ 
              height: '46px', 
              width: '46px', 
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--primary-blue)'
            }} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ 
              fontFamily: 'var(--font-title)',
              fontWeight: 800,
              fontSize: '1.25rem',
              color: 'var(--primary-blue)',
              lineHeight: 1.1,
              textTransform: 'uppercase'
            }}>
              {settings?.websiteName || 'ACET MEDTRACK'}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'none', md: 'flex', alignItems: 'center', gap: '28px' }} className="desktop-nav">
          {navLinks.map((link) => (
            <Link 
              key={link.label || link.name} 
              to={link.path} 
              style={{
                fontWeight: 500,
                fontSize: '0.95rem',
                color: isActive(link.path) ? 'var(--primary-blue)' : 'var(--text-secondary)',
                transition: 'color 0.2s',
                padding: '4px 0',
                borderBottom: isActive(link.path) ? '2px solid var(--primary-blue)' : '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                if(!isActive(link.path)) e.target.style.color = 'var(--primary-blue)';
              }}
              onMouseLeave={(e) => {
                if(!isActive(link.path)) e.target.style.color = 'var(--text-secondary)';
              }}
            >
              {link.label || link.name}
            </Link>
          ))}
          
          {user ? (
            <Link 
              to="/dashboard"
              style={{
                fontWeight: 500,
                fontSize: '0.95rem',
                color: isActive('/dashboard') ? 'var(--primary-blue)' : 'var(--text-secondary)',
                transition: 'color 0.2s',
                padding: '4px 0',
                borderBottom: isActive('/dashboard') ? '2px solid var(--primary-blue)' : '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                if(!isActive('/dashboard')) e.target.style.color = 'var(--primary-blue)';
              }}
              onMouseLeave={(e) => {
                if(!isActive('/dashboard')) e.target.style.color = 'var(--text-secondary)';
              }}
            >
              Dashboard
            </Link>
          ) : null}
        </div>

        {/* Desktop Controls (Login, Theme, Logout) */}
        <div style={{ display: 'none', md: 'flex', alignItems: 'center', gap: '16px' }} className="desktop-nav">
          <button 
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-blue-glow)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            title="Toggle Theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '20px',
                background: 'var(--primary-blue-glow)',
                color: 'var(--primary-blue)',
                fontWeight: 600,
                fontSize: '0.85rem'
              }}>
                <UserIcon size={14} />
                <span>{user.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Login
              </Link>
              {location.pathname !== '/login' && (
                <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  Register
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Mobile Toggle Icons */}
        <div style={{ display: 'flex', md: 'none', alignItems: 'center', gap: '12px' }} className="mobile-toggle">
          <button 
            onClick={toggleTheme}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              padding: '6px'
            }}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <button 
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-primary)',
              padding: '6px'
            }}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--glass-border)',
          padding: '16px 24px 24px 24px',
          gap: '16px',
          md: 'none'
        }} className="mobile-menu">
          {navLinks.map((link) => (
            <Link 
              key={link.label || link.name} 
              to={link.path} 
              onClick={() => setIsOpen(false)}
              style={{
                fontWeight: 600,
                color: isActive(link.path) ? 'var(--primary-blue)' : 'var(--text-primary)',
                padding: '8px 0',
                borderBottom: '1px solid var(--glass-border)'
              }}
            >
              {link.label || link.name}
            </Link>
          ))}
          
          {user && (
            <Link 
              to="/dashboard" 
              onClick={() => setIsOpen(false)}
              style={{
                fontWeight: 600,
                color: isActive('/dashboard') ? 'var(--primary-blue)' : 'var(--text-primary)',
                padding: '8px 0',
                borderBottom: '1px solid var(--glass-border)'
              }}
            >
              Dashboard
            </Link>
          )}

          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
              <div style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                fontWeight: 500
              }}>
                Logged in as: <strong style={{ color: 'var(--primary-blue)' }}>{user.name}</strong>
              </div>
              <button 
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
              <Link to="/login" onClick={() => setIsOpen(false)} className="btn btn-secondary" style={{ width: '100%' }}>
                Login
              </Link>
              {location.pathname !== '/login' && (
                <Link to="/register" onClick={() => setIsOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
                  Register
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* Inject responsive CSS stylesheet override directly on the header tag */}
      <style>{`
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
