import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, ExternalLink, Globe } from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

const Footer = () => {
  const [releases, setReleases] = useState([]);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/releases`);
        if (res.ok) {
          const data = await res.json();
          setReleases(data);
        }
      } catch (err) {
        console.error('Failed to fetch releases in footer:', err);
      }
    };
    fetchReleases();
  }, []);

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--glass-border)',
      padding: '56px 0 24px 0',
      color: 'var(--text-secondary)',
      marginTop: 'auto',
      transition: 'all 0.3s ease'
    }}>
      <div className="container">
        <div className="grid-4" style={{ marginBottom: '40px', gap: '32px' }}>
          
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img 
                src="/logo.jpg" 
                alt="ACET MEDTRACK Logo" 
                style={{ height: '36px', width: '36px', borderRadius: '50%' }} 
              />
              <span style={{ 
                fontFamily: 'var(--font-title)', 
                fontWeight: 800, 
                color: 'var(--primary-blue)',
                fontSize: '1.2rem'
              }}>
                ACET MEDTRACK
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              A unified full-stack digital health tracking portal designed to automate medicine schedules, share reports, and secure records.
            </p>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Developed with <Heart size={12} style={{ color: 'var(--danger-red)' }} /> by ACET Students.
            </span>
          </div>

          {/* Quick Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <Link to="/" style={{ hover: 'var(--primary-blue)' }} className="footer-link">Home</Link>
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/services" className="footer-link">Services</Link>
              <Link to="/contact" className="footer-link">Contact Us</Link>
            </div>
          </div>

          {/* Contact Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>Contact Info</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={16} style={{ color: 'var(--primary-blue)', flexShrink: 0, marginTop: '2px' }} />
                <span>ADITYA COLLEGE OF ENGINEERING, YEHLENKA KAMKSHIPURA-560089</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} style={{ color: 'var(--primary-blue)', flexShrink: 0 }} />
                <span>+91 8792714127</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} style={{ color: 'var(--primary-blue)', flexShrink: 0 }} />
                <span>dipendra@steptrendy.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ color: '#25D366', flexShrink: 0 }}>
                  <path d="M12.012 1.985c-5.529 0-10.026 4.497-10.026 10.026 0 1.767.46 3.427 1.264 4.887l-1.343 4.903 5.022-1.317c1.402.763 3.003 1.197 4.71 1.197 5.529 0 10.026-4.497 10.026-10.026 0-5.529-4.497-10.026-10.026-10.026zm5.54 14.288c-.219.614-1.286 1.117-1.778 1.18-.342.044-.789.078-1.286-.08-3.155-1.002-5.187-4.148-5.345-4.36-.157-.212-1.264-1.685-1.264-3.21 0-1.526.789-2.278 1.073-2.583.284-.305.614-.383.82-.383.206 0 .411.001.59.01.183.009.43.006.671.58.252.597.859 2.086.934 2.238.075.152.124.329.025.529-.1.2-.249.329-.395.503-.146.173-.306.386-.131.691.176.305.779 1.28 1.67 2.072 1.15 1.025 2.115 1.343 2.417 1.493.303.15.48.125.66-.082.179-.208.779-.905.986-1.212.207-.306.413-.257.697-.151.284.106 1.798.847 2.109.996.311.149.518.223.593.351.075.128.075.742-.144 1.356z" />
                </svg>
                <a href="https://wa.me/918792714127" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e)=>e.target.style.color='#25D366'} onMouseLeave={(e)=>e.target.style.color='inherit'}>WhatsApp Chat</a>
              </div>
            </div>
          </div>

          {/* Apps & Downloads Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>Downloads & Apps</h4>
            {releases.length === 0 ? (
              <>
                <span style={{ 
                  alignSelf: 'flex-start',
                  background: 'var(--primary-blue-glow)',
                  color: 'var(--primary-blue)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '4px 10px',
                  borderRadius: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Coming Soon
                </span>
                <p style={{ fontSize: '0.85rem' }}>
                  Our native Android & iOS applications will soon be available for download.
                </p>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {releases.map(rel => {
                  const isApk = rel.fileName.endsWith('.apk');
                  return (
                    <a
                      key={rel._id || rel.id}
                      href={`${API_BASE_URL}/releases/${rel._id || rel.id}/download`}
                      style={{
                        background: '#121824',
                        color: 'white',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                      className="footer-release-btn"
                    >
                      <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{isApk ? '🤖' : '📄'}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#f7fafc' }}>
                          {rel.name}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#a0aec0' }}>
                          {rel.version} • {rel.fileSize > 1024 * 1024 
                            ? `${(rel.fileSize / (1024 * 1024)).toFixed(1)} MB` 
                            : `${(rel.fileSize / 1024).toFixed(0)} KB`
                          }
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Divider & Copyright */}
        <div style={{
          borderTop: '1px solid var(--glass-border)',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.85rem'
        }}>
          <span>
            ACET MEDTRACK © 2026 – Crafted by Dipendra Upadhayay and TEAM
          </span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="https://www.acetedu.net/" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              College Website <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
      
      {/* Styles for footer links hover effect */}
      <style>{`
        .footer-link {
          transition: color 0.2s;
        }
        .footer-link:hover {
          color: var(--primary-blue);
        }
        .footer-release-btn {
          transition: all 0.2s ease-in-out;
        }
        .footer-release-btn:hover {
          border-color: var(--primary-blue) !important;
          transform: translateY(-2px);
          background: #172033 !important;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
