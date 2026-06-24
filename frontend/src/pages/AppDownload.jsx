import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../utils/api';

const AppDownload = () => {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPlatform, setFilterPlatform] = useState('all');

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/releases`);
        const data = await res.json();
        setReleases(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load releases:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReleases();
  }, []);

  const filtered = releases.filter(r => {
    const matchSearch =
      r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.version?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPlatform =
      filterPlatform === 'all' ||
      r.platform === filterPlatform ||
      (filterPlatform === 'android' && (r.platform === 'android' || r.platform === 'both')) ||
      (filterPlatform === 'ios' && (r.platform === 'ios' || r.platform === 'both'));
    return matchSearch && matchPlatform;
  });

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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '80px' }}>

      {/* ── Hero Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #060d2e 0%, #0a1a5c 40%, #0d2e8c 100%)',
        padding: '80px 0 60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '400px', height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '300px', height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.35)',
            borderRadius: '20px', padding: '6px 16px',
            fontSize: '0.8rem', fontWeight: 700, color: '#a5b4fc',
            marginBottom: '24px', letterSpacing: '0.5px', textTransform: 'uppercase'
          }}>
            📲 Official App Downloads
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            color: 'white',
            marginBottom: '16px',
            lineHeight: 1.15
          }}>
            Download ACET MedTrack
          </h1>

          <p style={{
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.65)',
            maxWidth: '560px',
            margin: '0 auto 36px',
            lineHeight: 1.7
          }}>
            Get the latest app builds for Android and iOS. Always up-to-date, always secure.
          </p>

          {/* Search Bar */}
          <div style={{ position: 'relative', maxWidth: '480px', margin: '0 auto' }}>
            <span style={{
              position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.4)', fontSize: '1.1rem', pointerEvents: 'none'
            }}>🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search releases..."
              style={{
                width: '100%', padding: '14px 20px 14px 48px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'white',
                fontSize: '0.95rem',
                backdropFilter: 'blur(10px)',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Platform Filter Pills ── */}
      <div className="container" style={{ marginTop: '-1px', paddingTop: '32px' }}>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '40px' }}>
          {[
            { key: 'all', label: '🌐 All Platforms' },
            { key: 'android', label: '🤖 Android' },
            { key: 'ios', label: '🍏 iOS' },
            { key: 'both', label: '🔀 Universal' }
          ].map(p => (
            <button
              key={p.key}
              onClick={() => setFilterPlatform(p.key)}
              style={{
                padding: '8px 20px',
                borderRadius: '20px',
                border: '1.5px solid',
                borderColor: filterPlatform === p.key ? 'var(--primary-blue)' : 'var(--glass-border)',
                background: filterPlatform === p.key ? 'var(--primary-blue-glow)' : 'transparent',
                color: filterPlatform === p.key ? 'var(--primary-blue)' : 'var(--text-secondary)',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{
              width: '48px', height: '48px', margin: '0 auto 16px',
              border: '4px solid var(--glass-border)',
              borderTop: '4px solid var(--primary-blue)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }} />
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading releases...</div>
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '80px 20px',
            background: 'var(--bg-secondary)',
            borderRadius: '20px',
            border: '1px solid var(--glass-border)'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📭</div>
            <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>No releases found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {searchQuery ? 'Try a different search term.' : 'No app releases have been published yet.'}
            </p>
          </div>
        )}

        {/* ── Cards Grid ── */}
        {!loading && filtered.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {filtered.map(rel => {
              const hasApk = rel.filePath && rel.fileName;
              const hasIpa = rel.ipaFilePath && rel.ipaFileName;
              const platformColor =
                rel.platform === 'both' ? '#f59e0b' :
                rel.platform === 'ios'  ? '#8b5cf6' : '#10b981';
              const platformLabel =
                rel.platform === 'both' ? '🤖 + 🍏 Universal' :
                rel.platform === 'ios'  ? '🍏 iOS Only' : '🤖 Android Only';

              return (
                <div
                  key={rel._id || rel.id}
                  className="animate-fade-in-up"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    transition: 'transform 0.25s, box-shadow 0.25s',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.35)`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  {/* Cover Photo */}
                  <div style={{
                    height: '200px',
                    background: 'linear-gradient(135deg, #0d1f55 0%, #1a3a8a 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    {getPhotoUrl(rel.photo) ? (
                      <img
                        src={getPhotoUrl(rel.photo)}
                        alt={rel.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        height: '100%', flexDirection: 'column', gap: '8px'
                      }}>
                        <span style={{ fontSize: '4rem' }}>📱</span>
                        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>No cover image</span>
                      </div>
                    )}

                    {/* Gradient overlay */}
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(6,13,46,0.7) 0%, transparent 60%)'
                    }} />

                    {/* Platform badge */}
                    <div style={{
                      position: 'absolute', top: '12px', right: '12px',
                      background: platformColor + '25',
                      border: `1.5px solid ${platformColor}`,
                      color: platformColor,
                      fontSize: '0.7rem', fontWeight: 800,
                      padding: '4px 12px', borderRadius: '20px',
                      backdropFilter: 'blur(8px)',
                      letterSpacing: '0.3px'
                    }}>{platformLabel}</div>

                    {/* Version badge */}
                    <div style={{
                      position: 'absolute', bottom: '12px', left: '12px',
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      fontSize: '0.75rem', fontWeight: 700,
                      padding: '4px 12px', borderRadius: '20px',
                      backdropFilter: 'blur(8px)'
                    }}>v{rel.version}</div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{
                      fontSize: '1.15rem', fontWeight: 800,
                      color: 'var(--text-primary)',
                      margin: '0 0 8px 0'
                    }}>{rel.name}</h3>

                    {rel.description && (
                      <p style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        lineHeight: 1.6,
                        marginBottom: '16px',
                        flex: 1
                      }}>
                        {rel.description.length > 120 ? rel.description.slice(0, 120) + '…' : rel.description}
                      </p>
                    )}

                    {/* Meta info */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between',
                      fontSize: '0.75rem', color: 'var(--text-light)',
                      marginBottom: '14px',
                      padding: '10px 12px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      border: '1px solid var(--glass-border)'
                    }}>
                      <span>📅 {rel.uploadedAt?.split('T')[0] || 'Unknown'}</span>
                      <span>⬇️ {(rel.downloadCount || 0) + (rel.ipaDownloadCount || 0)} downloads</span>
                    </div>

                    {/* File sizes */}
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      {hasApk && (
                        <span style={{
                          fontSize: '0.72rem',
                          background: 'rgba(16,185,129,0.1)',
                          color: '#10b981',
                          padding: '3px 10px', borderRadius: '20px', fontWeight: 700
                        }}>
                          APK · {formatSize(rel.fileSize)}
                        </span>
                      )}
                      {hasIpa && (
                        <span style={{
                          fontSize: '0.72rem',
                          background: 'rgba(139,92,246,0.1)',
                          color: '#8b5cf6',
                          padding: '3px 10px', borderRadius: '20px', fontWeight: 700
                        }}>
                          IPA · {formatSize(rel.ipaFileSize)}
                        </span>
                      )}
                    </div>

                    {/* Download Buttons */}
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {hasApk && (
                        <a
                          href={`${API_BASE_URL}/releases/${rel._id || rel.id}/download`}
                          style={{
                            flex: 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            padding: '12px 16px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                            color: 'white',
                            textDecoration: 'none',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                          onMouseLeave={e => e.currentTarget.style.transform = ''}
                        >
                          🤖 Download APK
                        </a>
                      )}
                      {hasIpa && (
                        <a
                          href={`${API_BASE_URL}/releases/${rel._id || rel.id}/download-ipa`}
                          style={{
                            flex: 1,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            padding: '12px 16px',
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)',
                            color: 'white',
                            textDecoration: 'none',
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            boxShadow: '0 4px 15px rgba(139,92,246,0.3)',
                            transition: 'all 0.2s',
                            whiteSpace: 'nowrap'
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                          onMouseLeave={e => e.currentTarget.style.transform = ''}
                        >
                          🍏 Download IPA
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Safety Note ── */}
        {!loading && filtered.length > 0 && (
          <div style={{
            marginTop: '48px',
            padding: '20px 24px',
            background: 'rgba(16,185,129,0.06)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'flex-start', gap: '14px'
          }}>
            <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>🔒</span>
            <div>
              <div style={{ fontWeight: 700, color: 'var(--success-green)', marginBottom: '4px', fontSize: '0.9rem' }}>
                Official & Safe Downloads
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.6 }}>
                All builds listed here are officially published by the ACET MedTrack admin team. For Android installs, enable "Install from Unknown Sources" in your device settings before installing the APK.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Spin animation */}
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AppDownload;
