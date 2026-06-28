import React, { useState, useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

const OpeningAnimation = () => {
  const { settings, loading } = useSettings();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!loading && (!settings || !settings.openingAnimationActive)) {
      setShow(false);
      return;
    }
    
    // Auto dismiss after 2.5 seconds
    const timer = setTimeout(() => {
      setShow(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [loading, settings]);

  if (!show) return null;

  const text = settings?.openingAnimationText || 'ACET MEDTRACK';
  const logo = settings?.openingAnimationLogo || settings?.logo || '/logo.jpg';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#070b19', // Premium dark aesthetic
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      animation: 'fadeOut 0.5s ease-out 2.2s forwards'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        animation: 'zoomIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        {logo ? (
          <img
            src={logo}
            alt="Logo"
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid var(--primary-blue)',
              boxShadow: '0 0 35px rgba(59, 130, 246, 0.6)',
              animation: 'pulseGlow 2s infinite'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-blue), var(--accent-teal))',
            boxShadow: '0 0 35px rgba(59, 130, 246, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: 'white',
            fontWeight: 800
          }}>
            {text.charAt(0)}
          </div>
        )}

        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
          fontFamily: 'var(--font-title)',
          letterSpacing: '1px',
          textAlign: 'center'
        }}>
          {text}
        </h1>
        
        <div style={{
          width: '50px',
          height: '4px',
          background: 'var(--primary-blue)',
          borderRadius: '2px',
          animation: 'loadProgress 1.6s ease-in-out forwards'
        }} />
      </div>

      <style>{`
        @keyframes fadeOut {
          to { opacity: 0; visibility: hidden; }
        }
        @keyframes zoomIn {
          from { transform: scale(0.6); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.45); }
          50% { box-shadow: 0 0 45px rgba(59, 130, 246, 0.85); }
        }
        @keyframes loadProgress {
          from { width: 0; }
          to { width: 180px; }
        }
      `}</style>
    </div>
  );
};

export default OpeningAnimation;
