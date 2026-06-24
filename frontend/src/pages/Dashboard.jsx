import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PatientDashboard from './PatientDashboard';
import DoctorDashboard from './DoctorDashboard';
import ParentDashboard from './ParentDashboard';
import AdminDashboard from './AdminDashboard';
import GlassCard from '../components/GlassCard';

const Dashboard = () => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 160px)'
      }}>
        <GlassCard style={{ padding: '32px', textAlign: 'center', maxWidth: '320px', width: '100%' }}>
          <div className="pulse-alarm" style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--primary-blue)',
            margin: '0 auto 16px auto'
          }}></div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading Session...</h3>
        </GlassCard>
      </div>
    );
  }

  // Session guard
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Route to the appropriate sub-dashboard based on role
  switch (user.role) {
    case 'patient':
      return <PatientDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'parent':
      return <ParentDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return (
        <div className="container" style={{ padding: '60px 0' }}>
          <GlassCard style={{ border: '1px solid var(--danger-red)', padding: '24px', textAlign: 'center' }}>
            <h2 style={{ color: 'var(--danger-red)', marginBottom: '12px' }}>Role Resolution Error</h2>
            <p>Your user profile has an unrecognized authorization level. Please contact support.</p>
          </GlassCard>
        </div>
      );
  }
};

export default Dashboard;
