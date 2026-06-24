import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Shield, Clock, Users, ArrowRight, Star, Send } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { api, API_BASE_URL } from '../utils/api';

const Home = () => {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  // Reviews states
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', rating: 5, comment: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  // Releases state
  const [releases, setReleases] = useState([]);

  // Landing stats state
  const [landingStats, setLandingStats] = useState({
    patients: '2,400+',
    doctors: '80+',
    doses: '15K+',
    accuracy: '98.7%'
  });

  useEffect(() => {
    fetchApprovedReviews();
    fetchPublicStats();
    fetchReleases();
  }, []);

  const fetchReleases = async () => {
    try {
      const data = await api.get('/releases');
      setReleases(data || []);
    } catch (err) {
      console.error('Failed to load releases in Home:', err);
    }
  };

  const fetchApprovedReviews = async () => {
    try {
      const data = await api.get('/reviews');
      setReviews(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  };

  const fetchPublicStats = async () => {
    try {
      const data = await api.get('/public-stats');
      setLandingStats({
        patients: `${data.patients}+`,
        doctors: `${data.doctors}+`,
        doses: `${(data.doses / 1000).toFixed(0)}K+`,
        accuracy: `${data.accuracy}%`
      });
    } catch (err) {
      console.error('Failed to load public stats:', err);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      try {
        const data = await api.post('/contact', {
          name: contactForm.name,
          email: contactForm.email,
          subject: 'General Inquiry from Landing Page',
          message: contactForm.message
        });

        // Save ticket details in localStorage to allow chat follow-ups
        const existing = JSON.parse(localStorage.getItem('medtrack_tickets') || '[]');
        existing.push({
          id: data._id || data.id,
          subject: data.subject,
          createdAt: data.createdAt || new Date().toISOString()
        });
        localStorage.setItem('medtrack_tickets', JSON.stringify(existing));

        setSubmitted(true);
        setContactForm({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } catch (err) {
        console.error('Submit contact message failed:', err);
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.email || !reviewForm.comment) {
      setReviewError('Please fill in name, email, and comment fields.');
      return;
    }

    try {
      await api.post('/reviews', reviewForm);
      setReviewSuccess('Thank you! Your review has been submitted and is awaiting administrator moderation.');
      setReviewError('');
      setReviewSubmitted(true);
      setReviewForm({ name: '', email: '', rating: 5, comment: '' });
      setTimeout(() => {
        setReviewSubmitted(false);
        setReviewSuccess('');
      }, 6000);
    } catch (err) {
      setReviewError(err.message || 'Failed to submit review. Please try again.');
    }
  };

  const features = [
    {
      icon: <Clock size={24} style={{ color: 'var(--primary-blue)' }} />,
      title: "Medicine Alarms",
      desc: "Receive real-time browser alerts and audible reminders for medicine schedules, ensuring you never miss a dose."
    },
    {
      icon: <Shield size={24} style={{ color: 'var(--accent-teal)' }} />,
      title: "Secure Health Records",
      desc: "Upload lab results, prescriptions, and health histories with state-of-the-art encryption and role permissions."
    },
    {
      icon: <Users size={24} style={{ color: 'var(--primary-blue)' }} />,
      title: "Parent Portal Access",
      desc: "Provision restricted credentials for guardians to monitor medication schedules and records remotely in real time."
    },
    {
      icon: <Heart size={24} style={{ color: 'var(--danger-red)' }} />,
      title: "Doctor Appointments",
      desc: "Browse certified practitioners by specialty and book consultations directly with automated digital prescriptions."
    }
  ];

  const stats = [
    { number: landingStats.patients, label: "Registered Patients" },
    { number: landingStats.doctors, label: "Specialist Doctors" },
    { number: landingStats.doses, label: "Doses Handled" },
    { number: landingStats.accuracy, label: "Reminders Accuracy" }
  ];

  // Fallback default testimonials if no reviews are approved yet
  const defaultTestimonials = [
    {
      comment: "ACET Medtrack transformed how I care for my diabetic father. The parent monitoring and audible alarm features ensure his medication is always on time, even when I'm at work.",
      name: "Sneha Reddy",
      email: "sneha@gmail.com",
      rating: 5
    },
    {
      comment: "As a practitioner, Medtrack simplifies my daily consultations. The digital prescriptions interface syncs with the patient's mobile schedules, cutting down follow-up calls significantly.",
      name: "Dr. K. Raghavan",
      email: "raghavan@gmail.com",
      rating: 5
    }
  ];

  const activeReviews = reviews.length > 0 ? reviews : defaultTestimonials;

  return (
    <div style={{ paddingBottom: '80px' }} className="animate-fade-in-up">
      
      {/* Hero Section */}
      <section style={{
        padding: '80px 0 60px 0',
        textAlign: 'center',
        background: 'radial-gradient(circle, var(--primary-blue-glow) 0%, transparent 70%)'
      }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <span style={{
            display: 'inline-block',
            background: 'var(--primary-blue-glow)',
            color: 'var(--primary-blue)',
            fontWeight: 700,
            fontSize: '0.85rem',
            padding: '6px 16px',
            borderRadius: '20px',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '24px'
          }}>
            Aditya College of Engineering & Technology
          </span>
          
          <h1 style={{
            fontSize: 'calc(2.5rem + 1.5vw)',
            fontWeight: 800,
            lineHeight: 1.15,
            color: 'var(--text-primary)',
            marginBottom: '20px'
          }}>
            Your Health, <span style={{ color: 'var(--primary-blue)' }}>Our Priority</span>
          </h1>
          
          <p style={{
            fontSize: 'calc(1rem + 0.25vw)',
            color: 'var(--text-secondary)',
            marginBottom: '36px',
            lineHeight: 1.6
          }}>
            Welcome to **ACET MEDTRACK** — a unified digital healthcare ecosystem linking patients, doctors, and family guardians to automate medication routines and protect medical histories.
          </p>

          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              Create Account
              <ArrowRight size={18} />
            </Link>
            <Link to="/services" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section style={{ padding: '40px 0' }}>
        <div className="container">
          <GlassCard style={{
            padding: '32px',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div className="grid-4" style={{ textAlign: 'center' }}>
              {stats.map((s, idx) => (
                <div key={idx} style={{
                  borderRight: idx < stats.length - 1 ? '1px solid var(--glass-border)' : 'none',
                  padding: '12px'
                }}>
                  <h3 style={{
                    fontSize: '2.25rem',
                    fontWeight: 800,
                    color: 'var(--primary-blue)',
                    marginBottom: '4px'
                  }}>{s.number}</h3>
                  <span style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 500
                  }}>{s.label}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Comprehensive Healthcare Tools</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Discover how ACET MEDTRACK leverages full-stack architectures to improve medical tracking.
            </p>
          </div>

          <div className="grid-4">
            {features.map((feat, idx) => (
              <GlassCard key={idx} interactive={true} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  alignSelf: 'flex-start',
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'var(--bg-primary)'
                }}>
                  {feat.icon}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{feat.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {feat.desc}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials (Real User Experiences) */}
      <section style={{ padding: '60px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Real User Experiences</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Loved by patients and healthcare professionals alike.</p>
          </div>

          <div className="grid-2" style={{ gap: '24px', marginBottom: '40px' }}>
            {activeReviews.map((t, idx) => (
              <GlassCard key={t._id || idx} style={{ padding: '32px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} size={16} fill="var(--warning-orange)" color="var(--warning-orange)" />
                  ))}
                </div>
                <p style={{ fontSize: '1rem', fontStyle: 'italic', marginBottom: '20px', color: 'var(--text-primary)' }}>
                  "{t.comment}"
                </p>
                <div>
                  <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{t.name}</strong>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t.email}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Downloads & Releases Section */}
      {releases.length > 0 && (
        <section style={{ padding: '60px 0', background: 'radial-gradient(circle, var(--primary-blue-glow) 0%, transparent 60%)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>System Downloads & Apps</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                Download our latest native Android packages (.apk), system config templates, and user manuals.
              </p>
            </div>
            <div className="grid-3" style={{ gap: '24px' }}>
              {releases.map(rel => {
                const isApk = rel.fileName.endsWith('.apk');
                return (
                  <GlassCard key={rel._id || rel.id} interactive={true} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px', height: '100%' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <span style={{ fontSize: '2rem' }}>{isApk ? '🤖' : '📄'}</span>
                        <span style={{
                          background: 'var(--primary-blue-glow)',
                          color: 'var(--primary-blue)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: '12px'
                        }}>
                          {rel.version}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>{rel.name}</h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>
                        {rel.description || 'No description provided.'}
                      </p>
                    </div>
                    <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: 500 }}>
                        Size: {rel.fileSize > 1024 * 1024 
                          ? `${(rel.fileSize / (1024 * 1024)).toFixed(1)} MB` 
                          : `${(rel.fileSize / 1024).toFixed(0)} KB`
                        }
                      </span>
                      <a
                        href={`${API_BASE_URL}/releases/${rel._id || rel.id}/download`}
                        className="btn btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.82rem' }}
                      >
                        Download File
                      </a>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Review Submission & General Contact Forms */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '40px' }}>
            
            {/* Submit a Review Form */}
            <GlassCard style={{ padding: '36px' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Write a Review</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Share your experience using ACET MEDTRACK with our team.
              </p>

              {reviewSubmitted && reviewSuccess ? (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid var(--success-green)',
                  color: 'var(--success-green)',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontWeight: 600
                }}>
                  {reviewSuccess}
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit}>
                  {reviewError && (
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid var(--danger-red)',
                      color: 'var(--danger-red)',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      marginBottom: '16px',
                      fontWeight: 600
                    }}>{reviewError}</div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={reviewForm.name} 
                      onChange={e => setReviewForm({...reviewForm, name: e.target.value})}
                      required 
                      placeholder="E.g. Sneha Reddy"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      value={reviewForm.email} 
                      onChange={e => setReviewForm({...reviewForm, email: e.target.value})}
                      required 
                      placeholder="E.g. sneha@gmail.com"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Rating (1 to 5 Stars)</label>
                    <select 
                      className="form-control"
                      value={reviewForm.rating}
                      onChange={e => setReviewForm({...reviewForm, rating: Number(e.target.value)})}
                    >
                      <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                      <option value="3">⭐⭐⭐ (3 Stars)</option>
                      <option value="2">⭐⭐ (2 Stars)</option>
                      <option value="1">⭐ (1 Star)</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label">Your Review Feedback</label>
                    <textarea 
                      className="form-control" 
                      rows="4" 
                      value={reviewForm.comment} 
                      onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}
                      required 
                      placeholder="Write your feedback details here..."
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-teal" style={{ width: '100%', padding: '14px' }}>
                    Submit Review Feedback
                  </button>
                </form>
              )}
            </GlassCard>

            {/* General Contact Ticket Form */}
            <GlassCard style={{ padding: '36px' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Have Questions? Get in Touch</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
                Submit a general inquiry ticket to the ACET support desk.
              </p>

              {submitted ? (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid var(--success-green)',
                  color: 'var(--success-green)',
                  padding: '16px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  fontWeight: 600
                }}>
                  Thank you! Your message has been sent successfully.
                </div>
              ) : (
                <form onSubmit={handleContactSubmit}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={contactForm.name} 
                      onChange={e => setContactForm({...contactForm, name: e.target.value})}
                      required 
                      placeholder="Enter your name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      value={contactForm.email} 
                      onChange={e => setContactForm({...contactForm, email: e.target.value})}
                      required 
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label">Your Message</label>
                    <textarea 
                      className="form-control" 
                      rows="4" 
                      value={contactForm.message} 
                      onChange={e => setContactForm({...contactForm, message: e.target.value})}
                      required 
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
                    Send Ticket Message
                    <Send size={16} />
                  </button>
                </form>
              )}
            </GlassCard>
          </div>
        </div>
      </section>

      {styleInjection}
    </div>
  );
};

const styleInjection = (
  <style>{`
    @media (max-width: 768px) {
      div[style*="borderRight"] {
        border-right: none !important;
        border-bottom: 1px solid var(--glass-border);
        padding-bottom: 20px;
        margin-bottom: 20px;
      }
      div[style*="borderRight"]:last-child {
        border-bottom: none !important;
        margin-bottom: 0;
        padding-bottom: 0;
        padding-top: 0;
      }
    }
  `}</style>
);

export default Home;
