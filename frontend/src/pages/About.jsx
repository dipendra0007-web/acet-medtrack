import React, { useState, useEffect } from 'react';
import GlassCard from '../components/GlassCard';
import { Shield, BookOpen, GraduationCap, Mail, Phone } from 'lucide-react';
import { api } from '../utils/api';
import { useSettings } from '../context/SettingsContext';

const About = () => {
  const { settings } = useSettings();
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await api.get('/team');
        setTeam(data);
      } catch (err) {
        console.error('Failed to fetch team members:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <div style={{ padding: '60px 0 80px 0' }} className="animate-fade-in-up">
      <div className="container">
        
        {/* Intro */}
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
            <GraduationCap size={16} />
            Academic Innovation Project
          </span>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{settings?.aboutTitle || 'About ACFET MEDTRACK'}</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.7' }}>
            {settings?.aboutSubtitle || 'ACFET MEDTRACK is a full-stack, production-ready healthcare management web portal engineered by the students of Aditya College of Engineering & Technology (ACFET). Our mission is to bridge technical design and practical utility, offering individuals and medical professionals a secure, automated environment for health tracking.'}
          </p>
        </div>

        {/* Project Pillars */}
        <div className="grid-3" style={{ marginBottom: '80px' }}>
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'var(--primary-blue-glow)', color: 'var(--primary-blue)', borderRadius: '8px', alignSelf: 'flex-start' }}>
              <Shield size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{settings?.aboutPillar1Title || 'Data Security First'}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {settings?.aboutPillar1Desc || 'All records, reports, and logins are guarded by custom JWT checks and cryptographically hashed credentials.'}
            </p>
          </GlassCard>
          
          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'rgba(20, 184, 166, 0.1)', color: 'var(--accent-teal)', borderRadius: '8px', alignSelf: 'flex-start' }}>
              <BookOpen size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{settings?.aboutPillar2Title || 'Digital Transformation'}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {settings?.aboutPillar2Desc || 'Replacing ancient paper-based records with structured digital prescriptions, analytics, and automated reminders.'}
            </p>
          </GlassCard>

          <GlassCard style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '10px', background: 'var(--primary-blue-glow)', color: 'var(--primary-blue)', borderRadius: '8px', alignSelf: 'flex-start' }}>
              <GraduationCap size={20} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{settings?.aboutPillar3Title || 'Student Innovation'}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {settings?.aboutPillar3Desc || 'Engineered from scratch using modern web practices to represent practical technical problem-solving.'}
            </p>
          </GlassCard>
        </div>

        {/* Team Section */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Our Development Team</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Meet the talented students behind ACFET MEDTRACK.</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
              Loading development team members...
            </div>
          ) : team.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px' }}>
              No team members configured yet.
            </div>
          ) : (
            <div className="grid-3">
              {team.map((member, idx) => (
                <GlassCard key={member._id || idx} interactive={true} style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '24px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    marginBottom: '20px'
                  }}>
                    {member.photo ? (
                      <img 
                        src={member.photo} 
                        alt={member.name} 
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid var(--primary-blue)',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary-blue), var(--accent-teal))',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '1.4rem',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        {member.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 800, margin: 0 }}>{member.name}</h3>
                      <span style={{ fontSize: '0.85rem', color: 'var(--primary-blue)', fontWeight: 600 }}>{member.role}</span>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6', flexGrow: 1, marginBottom: '24px' }}>
                    {member.description || 'No description provided.'}
                  </p>

                  {/* Contact details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Mail size={14} style={{ color: 'var(--primary-blue)' }} />
                      <a href={`mailto:${member.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{member.email}</a>
                    </div>
                    {member.contactNumber && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone size={14} style={{ color: 'var(--accent-teal)' }} />
                        <a href={`tel:${member.contactNumber}`} style={{ color: 'inherit', textDecoration: 'none' }}>{member.contactNumber}</a>
                      </div>
                    )}
                  </div>

                  {/* Socials */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    color: 'var(--text-light)'
                  }}>
                    {member.instagramLink && (
                      <a href={member.instagramLink} target="_blank" rel="noreferrer" className="team-social" title="Instagram Profile">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </a>
                    )}
                    {member.facebookLink && (
                      <a href={member.facebookLink} target="_blank" rel="noreferrer" className="team-social" title="Facebook Profile">
                        <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                      </a>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>

      </div>
      <style>{`
        .team-social {
          transition: all 0.2s ease;
          color: var(--text-light);
        }
        .team-social:hover {
          color: var(--primary-blue);
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

export default About;
