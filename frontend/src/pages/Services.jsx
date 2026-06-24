import React from 'react';
import GlassCard from '../components/GlassCard';
import { Clock, Shield, Users, Heart, Clipboard, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Services = () => {
  const serviceList = [
    {
      icon: <Clock size={28} />,
      title: "Audible Medicine Alarms",
      desc: "Set exact schedules, dosage quantities, and directions. The platform plays synthesizer alarm chimes and displays full-screen browser modals to keep you on schedule.",
      color: "var(--primary-blue)"
    },
    {
      icon: <Shield size={28} />,
      title: "Digital Health Records",
      desc: "Securely upload and categorize laboratory results, clinic summaries, and medical reports. Patients control sharing permissions with doctors.",
      color: "var(--accent-teal)"
    },
    {
      icon: <Users size={28} />,
      title: "Parent/Guardian Access",
      desc: "Authorize parents using custom usernames/passwords. Parents get a tailored viewing dashboard with real-time sync of active medication compliance.",
      color: "var(--primary-blue)"
    },
    {
      icon: <Heart size={28} />,
      title: "Doctor Booking Channel",
      desc: "Browse approved specialists, check consultation times, and submit appointments. Doctors accept, reject, or suggest timeslots.",
      color: "var(--danger-red)"
    },
    {
      icon: <Clipboard size={28} />,
      title: "Digital Prescriptions",
      desc: "Doctor-written prescriptions synchronize automatically with patient medication reminders, ensuring zero manual scheduling errors.",
      color: "var(--accent-teal)"
    },
    {
      icon: <Moon size={28} />,
      title: "Dark & Light Mode Integration",
      desc: "Toggle interface themes seamlessly to match environmental lighting. Designed with accessible contrast ratios for elderly patients.",
      color: "var(--warning-orange)"
    }
  ];

  return (
    <div style={{ padding: '60px 0 80px 0' }} className="animate-fade-in-up">
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Our Services & Features</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
            ACFET MEDTRACK provides a secure digital platform to centralize and automate clinical requirements.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid-3" style={{ marginBottom: '60px' }}>
          {serviceList.map((service, idx) => (
            <GlassCard key={idx} interactive={true} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                alignSelf: 'flex-start',
                padding: '12px',
                borderRadius: '12px',
                background: 'var(--bg-primary)',
                color: service.color
              }}>
                {service.icon}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{service.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {service.desc}
              </p>
            </GlassCard>
          ))}
        </div>

        {/* CTA */}
        <GlassCard style={{
          background: 'linear-gradient(135deg, var(--bg-secondary), var(--primary-blue-glow))',
          padding: '40px',
          textAlign: 'center',
          borderRadius: 'var(--radius-lg)'
        }}>
          <h2 style={{ marginBottom: '12px', fontSize: '1.75rem' }}>Ready to Take Control of Your Health?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px auto' }}>
            Register as a patient or login using your parental access code to start monitoring health status.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/login" className="btn btn-secondary">Login here</Link>
          </div>
        </GlassCard>

      </div>
    </div>
  );
};

export default Services;
