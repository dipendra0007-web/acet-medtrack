import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { Mail, Phone, Users, GraduationCap } from 'lucide-react';
import { api } from '../utils/api';

const OurTeam = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await api.get('/team');
        setTeam(data);
      } catch (err) {
        console.error('Failed to fetch team members:', err);
        setError('Unable to load team member directories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div style={{ padding: '60px 0 80px 0' }} className="animate-fade-in-up">
      <div className="container">
        
        {/* Page Title */}
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
            <Users size={16} />
            Our Development Team
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', fontFamily: 'var(--font-title)' }}>
            Meet the Minds Behind ACFET MEDTRACK
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.6' }}>
            A dedicated group of engineering students from **Aditya College of Engineering & Technology (ACFET)** working to modernize healthcare records management and tracking.
          </p>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <div className="pulse-alarm" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-blue)' }}></div>
          </div>
        ) : error ? (
          <GlassCard style={{ padding: '24px', border: '1px solid var(--danger-red)', textAlign: 'center' }}>
            <p style={{ color: 'var(--danger-red)', fontWeight: 600 }}>{error}</p>
          </GlassCard>
        ) : team.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
            No development team profiles configured in the system.
          </div>
        ) : (
          <div className="grid-3" style={{ gap: '28px' }}>
            {team.map((member, idx) => (
              <GlassCard 
                key={member._id || idx} 
                interactive={true} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  height: '100%', 
                  padding: '28px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Visual Accent Corner Ribbon */}
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  width: '60px',
                  height: '60px',
                  background: 'var(--primary-blue-glow)',
                  transform: 'rotate(45deg)',
                  zIndex: 0
                }} />

                {/* Identity Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '20px',
                  zIndex: 1
                }}>
                  {member.photo ? (
                    <img 
                      src={member.photo} 
                      alt={member.name} 
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid var(--primary-blue)',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary-blue), var(--accent-teal))',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.5rem',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      {member.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                      {member.name}
                    </h3>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      color: 'var(--primary-blue)', 
                      fontWeight: 600,
                      display: 'inline-block',
                      marginTop: '4px'
                    }}>
                      {member.role}
                    </span>
                  </div>
                </div>
                
                {/* Biography Description */}
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: 'var(--text-secondary)', 
                  lineHeight: '1.6', 
                  flexGrow: 1, 
                  marginBottom: '24px',
                  zIndex: 1 
                }}>
                  {member.description || 'Contributed technical design patterns, logic layers, and system synchronization models for ACFET MedTrack.'}
                </p>

                {/* Contact and Directory Details */}
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '10px', 
                  marginBottom: '20px', 
                  fontSize: '0.85rem', 
                  color: 'var(--text-secondary)', 
                  borderTop: '1px solid var(--glass-border)', 
                  paddingTop: '16px',
                  zIndex: 1
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={14} style={{ color: 'var(--primary-blue)', flexShrink: 0 }} />
                    <a 
                      href={`mailto:${member.email}`} 
                      style={{ color: 'inherit', textDecoration: 'none', wordBreak: 'break-all' }}
                      onMouseEnter={(e) => e.target.style.color = 'var(--primary-blue)'}
                      onMouseLeave={(e) => e.target.style.color = 'inherit'}
                    >
                      {member.email}
                    </a>
                  </div>
                  {member.contactNumber && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={14} style={{ color: 'var(--accent-teal)', flexShrink: 0 }} />
                      <a 
                        href={`tel:${member.contactNumber}`} 
                        style={{ color: 'inherit', textDecoration: 'none' }}
                        onMouseEnter={(e) => e.target.style.color = 'var(--accent-teal)'}
                        onMouseLeave={(e) => e.target.style.color = 'inherit'}
                      >
                        {member.contactNumber}
                      </a>
                    </div>
                  )}
                </div>

                {/* Social Networks Links */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  zIndex: 1
                }}>
                  {member.instagramLink && (
                    <a 
                      href={member.instagramLink} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="team-social-btn" 
                      title="Instagram Profile"
                      style={{
                        color: 'var(--text-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="social-icon">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </svg>
                    </a>
                  )}
                  {member.facebookLink && (
                    <a 
                      href={member.facebookLink} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="team-social-btn" 
                      title="Facebook Profile"
                      style={{
                        color: 'var(--text-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.25s ease'
                      }}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="social-icon">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Institution Info */}
        <div style={{ marginTop: '60px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <GraduationCap size={18} style={{ color: 'var(--primary-blue)' }} />
            <span>Aditya College of Engineering & Technology (ACFET), Yehlenka Kamkshipura-560089</span>
          </div>
        </div>

      </div>

      <style>{`
        .team-social-btn:hover {
          color: var(--primary-blue) !important;
          transform: translateY(-3px);
        }
        .team-social-btn:hover .social-icon {
          filter: drop-shadow(0 2px 6px var(--primary-blue-glow));
        }
      `}</style>
    </div>
  );
};

export default OurTeam;
