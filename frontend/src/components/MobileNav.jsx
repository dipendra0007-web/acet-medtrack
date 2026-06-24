import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Activity, ShoppingBag, Download, User } from 'lucide-react';

const MobileNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || 
             location.pathname === '/patient' || 
             location.pathname === '/doctor' || 
             location.pathname === '/admin' || 
             location.pathname === '/parent' ||
             location.pathname.startsWith('/PATIENT') ||
             location.pathname.startsWith('/DOCTOR') ||
             location.pathname.startsWith('/ADMIN');
    }
    return location.pathname === path;
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Services', path: '/services', icon: Activity },
    { label: 'Shop', path: '/shop', icon: ShoppingBag },
    { label: 'Download', path: '/download', icon: Download },
    { label: 'Dashboard', path: user ? '/dashboard' : '/login', icon: User, matchPath: '/dashboard' }
  ];

  return (
    <div className="mobile-nav-container">
      <div className="mobile-nav-bar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.matchPath ? isActive(item.matchPath) : isActive(item.path);
          return (
            <Link 
              key={item.label} 
              to={item.path} 
              className={`mobile-nav-item ${active ? 'active' : ''}`}
            >
              <div className="mobile-nav-icon-wrapper">
                <Icon size={20} className="mobile-nav-icon" />
              </div>
              <span className="mobile-nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <style>{`
        .mobile-nav-container {
          display: none;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 999;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid var(--glass-border);
          box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.08);
          padding-bottom: env(safe-area-inset-bottom, 12px);
          padding-top: 10px;
          transition: background-color 0.3s ease;
        }

        .mobile-nav-bar {
          display: flex;
          justify-content: space-around;
          align-items: center;
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          padding: 0 10px;
        }

        .mobile-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          text-decoration: none;
          flex: 1;
          gap: 4px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .mobile-nav-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 28px;
          border-radius: 16px;
          transition: all 0.25s ease;
        }

        .mobile-nav-icon {
          stroke-width: 2.2;
          transition: transform 0.2s ease, stroke var(--transition-fast);
        }

        .mobile-nav-label {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.2px;
          transition: all 0.2s ease;
        }

        /* Active Styles (Native Android/iOS pill concept) */
        .mobile-nav-item.active {
          color: var(--primary-blue);
        }

        .mobile-nav-item.active .mobile-nav-icon-wrapper {
          background-color: var(--primary-blue-glow);
          color: var(--primary-blue);
        }

        .mobile-nav-item.active .mobile-nav-icon {
          transform: scale(1.1);
        }

        .mobile-nav-item.active .mobile-nav-label {
          font-weight: 700;
          color: var(--primary-blue);
        }

        /* Medium screen views (tablet and mobile) */
        @media (max-width: 1024px) {
          .mobile-nav-container {
            display: block;
          }
        }
      `}</style>
    </div>
  );
};

export default MobileNav;
