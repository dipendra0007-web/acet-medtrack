import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { api } from '../utils/api';
import { Image, Video, HelpCircle, X } from 'lucide-react';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Lightbox Modal state
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const data = await api.get('/gallery');
      setItems(data);
    } catch (err) {
      console.error('Failed to load gallery items:', err);
      setError('Unable to retrieve media gallery files. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      try {
        if (url.includes('youtube.com/watch?v=')) {
          videoId = url.split('v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('youtube.com/embed/')) {
          videoId = url.split('/embed/')[1].split('?')[0];
        }
        return `https://www.youtube.com/embed/${videoId}`;
      } catch (e) {
        console.error('Error parsing youtube video id:', e);
        return null;
      }
    }
    return null;
  };

  return (
    <div style={{ padding: '60px 0 80px 0' }} className="animate-fade-in-up">
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--primary-blue-glow)',
            color: 'var(--primary-blue)',
            fontSize: '0.85rem',
            fontWeight: 700,
            padding: '6px 16px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            <Image size={16} />
            Media Gallery
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', fontFamily: 'var(--font-title)' }}>
            Campus Life & Healthcare Operations
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.6' }}>
            Explore visual records, clinical walk-throughs, and development milestones at **Aditya College of Engineering & Technology**.
          </p>
        </div>

        {/* Loading / Error / Empty States */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <div className="pulse-alarm" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-blue)' }}></div>
          </div>
        ) : error ? (
          <GlassCard style={{ padding: '24px', border: '1px solid var(--danger-red)', textAlign: 'center' }}>
            <p style={{ color: 'var(--danger-red)', fontWeight: 600 }}>{error}</p>
          </GlassCard>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <GlassCard style={{ maxWidth: '480px', margin: '0 auto', padding: '32px' }}>
              <HelpCircle size={36} style={{ color: 'var(--text-light)', marginBottom: '12px' }} />
              <h4 style={{ fontWeight: 600, marginBottom: '8px' }}>Gallery is Empty</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                There are no photos or videos uploaded by the administrator yet. Check back soon for updates.
              </p>
            </GlassCard>
          </div>
        ) : (
          <div className="grid-3" style={{ gap: '28px' }}>
            {items.map((item) => {
              const youtubeEmbed = getEmbedUrl(item.url);
              return (
                <GlassCard 
                  key={item._id} 
                  interactive={item.type === 'photo'}
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    padding: '16px', 
                    height: '100%',
                    background: 'var(--bg-secondary)',
                    overflow: 'hidden'
                  }}
                >
                  {/* Media Content */}
                  <div style={{
                    width: '100%',
                    aspectRatio: '16/10',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    {item.type === 'photo' ? (
                      <img 
                        src={item.url} 
                        alt={item.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer', transition: 'transform 0.3s' }}
                        onClick={() => setSelectedPhoto(item)}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      />
                    ) : (
                      /* Video Player */
                      youtubeEmbed ? (
                        <iframe
                          title={item.title}
                          src={youtubeEmbed}
                          style={{ width: '100%', height: '100%', border: 'none' }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      ) : (
                        <video 
                          src={item.url} 
                          controls 
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      )
                    )}

                    {/* Media Type Icon Ribbon */}
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      background: 'rgba(0,0,0,0.6)',
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backdropFilter: 'blur(4px)',
                      pointerEvents: 'none'
                    }}>
                      {item.type === 'photo' ? <Image size={12} /> : <Video size={12} />}
                      <span style={{ textTransform: 'capitalize' }}>{item.type}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 style={{ 
                    fontSize: '1.05rem', 
                    fontWeight: 700, 
                    marginTop: '16px', 
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-title)',
                    lineHeight: '1.4'
                  }}>
                    {item.title}
                  </h3>
                </GlassCard>
              );
            })}
          </div>
        )}

        {/* Photo Lightbox Modal */}
        {selectedPhoto && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(11, 19, 41, 0.9)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px'
          }} onClick={() => setSelectedPhoto(null)}>
            <div style={{
              position: 'relative',
              maxWidth: '90%',
              maxHeight: '90%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }} onClick={(e) => e.stopPropagation()}>
              
              {/* Close Button */}
              <button 
                onClick={() => setSelectedPhoto(null)}
                style={{
                  position: 'absolute',
                  top: '-48px',
                  right: 0,
                  border: 'none',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--danger-red)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
              >
                <X size={20} />
              </button>

              <img 
                src={selectedPhoto.url} 
                alt={selectedPhoto.title} 
                style={{
                  maxWidth: '100%',
                  maxHeight: '75vh',
                  borderRadius: '8px',
                  objectFit: 'contain',
                  boxShadow: 'var(--shadow-lg)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              />

              <h2 style={{ color: '#fff', fontSize: '1.25rem', textAlign: 'center', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                {selectedPhoto.title}
              </h2>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Gallery;
