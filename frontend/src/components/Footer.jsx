import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, ExternalLink, Download } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { API_BASE_URL } from '../utils/api';

const Footer = () => {
  const { settings } = useSettings();
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

  const formatSize = (bytes) => {
    if (!bytes) return '';
    if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(0)} KB`;
  };

  const getPhotoUrl = (photo) => {
    if (!photo) return null;
    if (photo.startsWith('/uploads')) return `${API_BASE_URL.replace('/api', '')}${photo}`;
    return photo;
  };

  // Placeholder cards shown when fewer than 4 real releases exist
  const placeholders = [
    { id: 'ph1', name: 'MedTrack Android', version: 'Coming Soon', platform: 'android', ph: true },
    { id: 'ph2', name: 'MedTrack iOS', version: 'Coming Soon', platform: 'ios', ph: true },
    { id: 'ph3', name: 'MedTrack Lite', version: 'Coming Soon', platform: 'android', ph: true },
    { id: 'ph4', name: 'MedTrack Universal', version: 'Coming Soon', platform: 'both', ph: true },
  ];

  // Show real releases first; pad with placeholders to reach at least 4
  const displayItems = releases.length >= 4
    ? releases
    : [...releases, ...placeholders.slice(releases.length)];

  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--glass-border)',
      paddingTop: '56px',
      color: 'var(--text-secondary)',
      marginTop: 'auto',
      transition: 'all 0.3s ease'
    }}>
      <div className="container">

        {/* ── App Downloads Banner ── */}
        <div style={{
          background: 'linear-gradient(135deg, #060d2e 0%, #0a1a5c 45%, #0d2a7c 100%)',
          borderRadius: '20px',
          padding: '36px 32px',
          marginBottom: '48px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Glow blobs */}
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-40px', left: '20%', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px', position: 'relative' }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)',
                borderRadius: '20px', padding: '4px 14px',
                fontSize: '0.72rem', fontWeight: 700, color: '#a5b4fc',
                letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '10px'
              }}>
                📲 Official Releases
              </div>
              <h3 style={{ color: 'white', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
                Download ACET MedTrack
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', marginTop: '6px' }}>
                Get the latest builds for Android & iOS — always free, always secure.
              </p>
            </div>
            <Link
              to="/download"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 22px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                color: 'white', fontWeight: 700, fontSize: '0.85rem',
                textDecoration: 'none', backdropFilter: 'blur(8px)',
                transition: 'all 0.2s', whiteSpace: 'nowrap'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            >
              <Download size={15} /> View All
            </Link>
          </div>

          {/* App Cards Grid — min 4 shown */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '14px',
            position: 'relative'
          }}>
            {displayItems.slice(0, 8).map((rel, idx) => {
              const isPlaceholder = rel.ph === true;
              const hasApk = !isPlaceholder && rel.filePath && rel.fileName;
              const hasIpa = !isPlaceholder && rel.ipaFilePath && rel.ipaFileName;
              const platformColor =
                rel.platform === 'both' ? '#f59e0b' :
                rel.platform === 'ios'  ? '#a78bfa' : '#34d399';
              const platformIcon =
                rel.platform === 'both' ? '🤖+🍏' :
                rel.platform === 'ios'  ? '🍏' : '🤖';
              const photoUrl = getPhotoUrl(rel.photo);

              return (
                <div
                  key={rel._id || rel.id || idx}
                  style={{
                    background: isPlaceholder
                      ? 'rgba(255,255,255,0.03)'
                      : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${isPlaceholder ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: '14px',
                    overflow: 'hidden',
                    opacity: isPlaceholder ? 0.55 : 1,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    backdropFilter: 'blur(10px)'
                  }}
                  onMouseEnter={e => { if (!isPlaceholder) { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.4)'; }}}
                  onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                >
                  {/* Cover photo / placeholder banner */}
                  <div style={{
                    height: '100px',
                    background: isPlaceholder
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)'
                      : 'linear-gradient(135deg, #0f2057 0%, #1a3a8a 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {photoUrl && !isPlaceholder ? (
                      <img src={photoUrl} alt={rel.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '2.2rem', opacity: isPlaceholder ? 0.35 : 1 }}>📱</span>
                    )}
                    {/* Platform badge */}
                    <div style={{
                      position: 'absolute', top: '8px', right: '8px',
                      background: platformColor + '28',
                      border: `1px solid ${platformColor}60`,
                      color: platformColor,
                      fontSize: '0.62rem', fontWeight: 800,
                      padding: '2px 8px', borderRadius: '20px'
                    }}>{platformIcon}</div>
                    {/* Version badge */}
                    <div style={{
                      position: 'absolute', bottom: '8px', left: '8px',
                      background: 'rgba(0,0,0,0.6)',
                      color: isPlaceholder ? 'rgba(255,255,255,0.4)' : 'white',
                      fontSize: '0.62rem', fontWeight: 700,
                      padding: '2px 8px', borderRadius: '20px'
                    }}>
                      {isPlaceholder ? 'Soon' : `v${rel.version}`}
                    </div>
                  </div>

                  {/* Body */}
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{
                      fontSize: '0.82rem', fontWeight: 700,
                      color: isPlaceholder ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.9)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      marginBottom: '8px'
                    }}>{rel.name}</div>

                    {isPlaceholder ? (
                      <div style={{
                        fontSize: '0.7rem', color: 'rgba(255,255,255,0.25)',
                        textAlign: 'center', padding: '6px 0'
                      }}>Coming Soon</div>
                    ) : (
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {hasApk && (
                          <a
                            href={`${API_BASE_URL}/releases/${rel._id || rel.id}/download`}
                            style={{
                              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                              padding: '6px 8px', borderRadius: '7px', textDecoration: 'none',
                              fontSize: '0.7rem', fontWeight: 700,
                              background: 'rgba(52,211,153,0.15)',
                              color: '#34d399',
                              border: '1px solid rgba(52,211,153,0.3)',
                              transition: 'all 0.2s',
                              whiteSpace: 'nowrap'
                            }}
                            title={`Download APK · ${formatSize(rel.fileSize)}`}
                          >
                            🤖 APK
                          </a>
                        )}
                        {hasIpa && (
                          <a
                            href={`${API_BASE_URL}/releases/${rel._id || rel.id}/download-ipa`}
                            style={{
                              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                              padding: '6px 8px', borderRadius: '7px', textDecoration: 'none',
                              fontSize: '0.7rem', fontWeight: 700,
                              background: 'rgba(167,139,250,0.15)',
                              color: '#a78bfa',
                              border: '1px solid rgba(167,139,250,0.3)',
                              transition: 'all 0.2s',
                              whiteSpace: 'nowrap'
                            }}
                            title={`Download IPA · ${formatSize(rel.ipaFileSize)}`}
                          >
                            🍏 IPA
                          </a>
                        )}
                        {!hasApk && !hasIpa && (
                          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', textAlign: 'center', width: '100%', padding: '4px 0' }}>
                            Processing…
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Main 4-column footer grid ── */}
        <div className="grid-4" style={{ marginBottom: '40px', gap: '32px' }}>

          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                src={settings?.logo || "/logo.jpg"}
                alt={`${settings?.websiteName || 'ACET MEDTRACK'} Logo`}
                style={{ height: '36px', width: '36px', borderRadius: '50%' }}
              />
              <span style={{
                fontFamily: 'var(--font-title)',
                fontWeight: 800,
                color: 'var(--primary-blue)',
                fontSize: '1.2rem',
                textTransform: 'uppercase'
              }}>
                {settings?.websiteName || 'ACET MEDTRACK'}
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
              A unified full-stack digital health tracking portal designed to automate medicine schedules, share reports, and secure records.
            </p>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Developed with <Heart size={12} style={{ color: 'var(--danger-red)' }} /> by ACET Students.
            </span>
          </div>

          {/* Quick Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/about" className="footer-link">About Us</Link>
              <Link to="/services" className="footer-link">Services</Link>
              <Link to="/gallery" className="footer-link">Gallery</Link>
              <Link to="/shop" className="footer-link">Shop</Link>
              <Link to="/download" className="footer-link" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>📲 Download App</Link>
              <Link to="/contact" className="footer-link">Contact Us</Link>
            </div>
          </div>

          {/* Contact Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>Contact Info</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={16} style={{ color: 'var(--primary-blue)', flexShrink: 0, marginTop: '2px' }} />
                <span>{settings?.footerLocation || "ADITYA COLLEGE OF ENGINEERING, YEHLENKA KAMKSHIPURA-560089"}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} style={{ color: 'var(--primary-blue)', flexShrink: 0 }} />
                <span>{settings?.footerPhone || "+91 8792714127"}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} style={{ color: 'var(--primary-blue)', flexShrink: 0 }} />
                <span>dipendra@steptrendy.com</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" style={{ color: '#25D366', flexShrink: 0 }}>
                  <path d="M12.012 1.985c-5.529 0-10.026 4.497-10.026 10.026 0 1.767.46 3.427 1.264 4.887l-1.343 4.903 5.022-1.317c1.402.763 3.003 1.197 4.71 1.197 5.529 0 10.026-4.497 10.026-10.026 0-5.529-4.497-10.026-10.026-10.026zm5.54 14.288c-.219.614-1.286 1.117-1.778 1.18-.342.044-.789.078-1.286-.08-3.155-1.002-5.187-4.148-5.345-4.36-.157-.212-1.264-1.685-1.264-3.21 0-1.526.789-2.278 1.073-2.583.284-.305.614-.383.82-.383.206 0 .411.001.59.01.183.009.43.006.671.58.252.597.859 2.086.934 2.238.075.152.124.329.025.529-.1.2-.249.329-.395.503-.146.173-.306.386-.131.691.176.305.779 1.28 1.67 2.072 1.15 1.025 2.115 1.343 2.417 1.493.303.15.48.125.66-.082.179-.208.779-.905.986-1.212.207-.306.413-.257.697-.151.284.106 1.798.847 2.109.996.311.149.518.223.593.351.075.128.075.742-.144 1.356z" />
                </svg>
                <a href="https://wa.me/918792714127" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color = '#25D366'} onMouseLeave={(e) => e.target.style.color = 'inherit'}>WhatsApp Chat</a>
              </div>
            </div>
          </div>

          {/* Latest Release Quick-access */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>Latest Release</h4>
            {releases.length === 0 ? (
              <>
                <span style={{
                  alignSelf: 'flex-start',
                  background: 'var(--primary-blue-glow)',
                  color: 'var(--primary-blue)',
                  fontSize: '0.75rem', fontWeight: 700,
                  padding: '4px 10px', borderRadius: '12px',
                  textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>
                  Coming Soon
                </span>
                <p style={{ fontSize: '0.85rem' }}>
                  Our native Android & iOS applications will soon be available for download.
                </p>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {releases.slice(0, 3).map(rel => {
                  const hasApk = rel.filePath && rel.fileName;
                  const hasIpa = rel.ipaFilePath && rel.ipaFileName;
                  const platformIcon =
                    rel.platform === 'both' ? '🤖+🍏' :
                    rel.platform === 'ios'  ? '🍏' : '🤖';
                  return (
                    <div
                      key={rel._id || rel.id}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>{platformIcon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
                            {rel.name}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>v{rel.version}</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {hasApk && (
                          <a
                            href={`${API_BASE_URL}/releases/${rel._id || rel.id}/download`}
                            style={{
                              flex: 1, textAlign: 'center', padding: '5px',
                              borderRadius: '6px', textDecoration: 'none',
                              fontSize: '0.7rem', fontWeight: 700,
                              background: 'rgba(16,185,129,0.1)', color: 'var(--success-green)',
                              border: '1px solid rgba(16,185,129,0.25)'
                            }}
                          >
                            APK ↓
                          </a>
                        )}
                        {hasIpa && (
                          <a
                            href={`${API_BASE_URL}/releases/${rel._id || rel.id}/download-ipa`}
                            style={{
                              flex: 1, textAlign: 'center', padding: '5px',
                              borderRadius: '6px', textDecoration: 'none',
                              fontSize: '0.7rem', fontWeight: 700,
                              background: 'rgba(139,92,246,0.1)', color: '#8b5cf6',
                              border: '1px solid rgba(139,92,246,0.25)'
                            }}
                          >
                            IPA ↓
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
                <Link to="/download" style={{
                  textAlign: 'center', padding: '8px',
                  borderRadius: '8px', textDecoration: 'none',
                  fontSize: '0.78rem', fontWeight: 700,
                  background: 'var(--primary-blue-glow)',
                  color: 'var(--primary-blue)',
                  border: '1px solid var(--primary-blue)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                }}>
                  <Download size={13} /> See All Releases
                </Link>
              </div>
            )}
          </div>

        </div>

        {/* Divider & Copyright */}
        <div style={{
          borderTop: '1px solid var(--glass-border)',
          paddingTop: '24px',
          paddingBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.85rem'
        }}>
          <span>{settings?.footerCopyright || "ACET MEDTRACK © 2026 – Crafted by Dipendra Upadhayay and TEAM"}</span>
          <div style={{ display: 'flex', gap: '16px' }}>
            <Link to="/download" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-blue)', fontWeight: 600 }}>
              📲 Download App
            </Link>
            <a href="https://www.acetedu.net/" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              College Website <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link {
          color: var(--text-secondary);
          text-decoration: none;
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
