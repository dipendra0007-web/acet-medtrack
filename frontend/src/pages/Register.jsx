import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import { UserPlus, User, Shield, Key, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('patient'); // patient, doctor, admin
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Doctor Fields
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [clinicInfo, setClinicInfo] = useState('');

  // Admin Fields
  const [adminSecret, setAdminSecret] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    const payload = {
      name,
      email,
      password,
      role
    };

    if (role === 'doctor') {
      payload.doctorDetails = {
        specialization: specialization || 'General Medicine',
        experience: Number(experience) || 1,
        clinicInfo: clinicInfo || ''
      };
    } else if (role === 'admin') {
      payload.adminSecret = adminSecret;
    }

    try {
      const data = await register(payload);
      if (role === 'doctor') {
        setSuccessMsg(data.message || 'Registration successful! Waiting for Admin approval.');
        // Reset form
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setSpecialization('');
        setExperience('');
        setClinicInfo('');
      } else {
        // Patients and admins are auto-logged in, navigate to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Email might already be taken.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '60px 0 80px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 160px)'
    }} className="animate-fade-in-up">
      <div style={{ maxWidth: '500px', width: '100%', padding: '0 24px' }}>
        <GlassCard style={{ padding: '36px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img 
              src="/logo.jpg" 
              alt="Logo" 
              style={{ height: '50px', width: '50px', borderRadius: '50%', marginBottom: '8px' }} 
            />
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: 800 }}>
              Create Account
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Join the ACFET MEDTRACK healthcare network
            </p>
          </div>

          {/* Role selector buttons */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'var(--bg-primary)',
            padding: '4px',
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid var(--glass-border)',
            gap: '4px'
          }}>
            {['patient', 'doctor'].map(r => (
              <button
                key={r}
                type="button"
                onClick={() => { setRole(r); setError(''); setSuccessMsg(''); }}
                style={{
                  padding: '8px 4px',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  textTransform: 'capitalize',
                  background: role === r ? 'var(--bg-secondary)' : 'transparent',
                  color: role === r ? 'var(--primary-blue)' : 'var(--text-secondary)',
                  boxShadow: role === r ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.2s'
                }}
              >
                {r}
              </button>
            ))}
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--danger-red)',
              color: 'var(--danger-red)',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid var(--success-green)',
              color: 'var(--success-green)',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--success-green)' }} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="E.g. Praveen Kumar"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-control" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="E.g. praveen@gmail.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input 
                type="password" 
                className="form-control" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                required
              />
            </div>

            {/* Doctor Fields */}
            {role === 'doctor' && (
              <div style={{
                background: 'var(--primary-blue-glow)',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid var(--glass-border)'
              }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={16} />
                  Professional Details
                </h3>
                
                <div className="form-group">
                  <label className="form-label">Specialization</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={specialization}
                    onChange={e => setSpecialization(e.target.value)}
                    placeholder="E.g. Cardiologist, Pediatrician"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Experience (Years)</label>
                  <input 
                    type="number" 
                    min="1"
                    className="form-control" 
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                    placeholder="E.g. 5"
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Clinic Info & Address</label>
                  <textarea 
                    className="form-control" 
                    value={clinicInfo}
                    onChange={e => setClinicInfo(e.target.value)}
                    placeholder="E.g. Aditya Health Care, Kakinada"
                    rows="2"
                    required
                  ></textarea>
                </div>
              </div>
            )}

            {/* Admin Fields */}
            {role === 'admin' && (
              <div style={{
                background: 'var(--primary-blue-glow)',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '1px solid var(--glass-border)'
              }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size={16} />
                  Admin Authentication
                </h3>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Admin Secret Key</label>
                  <div style={{ position: 'relative' }}>
                    <Key size={16} style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-light)'
                    }} />
                    <input 
                      type="password" 
                      className="form-control" 
                      style={{ paddingLeft: '38px' }}
                      value={adminSecret}
                      onChange={e => setAdminSecret(e.target.value)}
                      placeholder="Enter project secret key"
                      required
                    />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '6px' }}>
                    Note: To register an Admin, use the project secret code <strong>884822</strong>.
                  </span>
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '10px' }}
              disabled={loading}
            >
              <UserPlus size={18} />
              {loading ? 'Processing...' : 'Register Account'}
            </button>
          </form>

          <div style={{
            textAlign: 'center',
            marginTop: '24px',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)'
          }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>
              Sign In
            </Link>
          </div>

        </GlassCard>
      </div>
    </div>
  );
};

export default Register;
