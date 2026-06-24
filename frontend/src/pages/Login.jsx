import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import { LogIn, Users, Mail, Lock, ShieldAlert } from 'lucide-react';

const Login = () => {
  const { login, loginParent } = useAuth();
  const navigate = useNavigate();

  const [isParent, setIsParent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [parentUsername, setParentUsername] = useState('');
  const [parentPassword, setParentPassword] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isParent) {
        if (!parentUsername || !parentPassword) {
          throw new Error('Please fill in both parental username and password');
        }
        await loginParent(parentUsername, parentPassword);
      } else {
        if (!email || !password) {
          throw new Error('Please fill in both email and password');
        }
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      padding: '80px 0 100px 0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 160px)'
    }} className="animate-fade-in-up">
      <div style={{ maxWidth: '440px', width: '100%', padding: '0 24px' }}>
        <GlassCard style={{ padding: '36px' }}>
          
          {/* Header branding */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <img 
              src="/logo.jpg" 
              alt="Logo" 
              style={{ height: '54px', width: '54px', borderRadius: '50%', marginBottom: '12px' }} 
            />
            <h2 style={{ fontSize: '1.6rem', color: 'var(--text-primary)', fontWeight: 800 }}>
              Access Portal
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              Welcome back to ACFET MEDTRACK
            </p>
          </div>

          {/* Toggle Switches */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            background: 'var(--bg-primary)',
            padding: '4px',
            borderRadius: '8px',
            marginBottom: '28px',
            border: '1px solid var(--glass-border)'
          }}>
            <button
              onClick={() => { setIsParent(false); setError(''); }}
              style={{
                padding: '10px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                background: !isParent ? 'var(--bg-secondary)' : 'transparent',
                color: !isParent ? 'var(--primary-blue)' : 'var(--text-secondary)',
                boxShadow: !isParent ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              Standard Login
            </button>
            
            <button
              onClick={() => { setIsParent(true); setError(''); }}
              style={{
                padding: '10px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                background: isParent ? 'var(--bg-secondary)' : 'transparent',
                color: isParent ? 'var(--primary-blue)' : 'var(--text-secondary)',
                boxShadow: isParent ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              Parent Portal
            </button>
          </div>

          {/* Error display */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--danger-red)',
              color: 'var(--danger-red)',
              padding: '12px 16px',
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

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {!isParent ? (
              <>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-light)'
                    }} />
                    <input 
                      type="email" 
                      className="form-control" 
                      style={{ paddingLeft: '44px' }}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-light)'
                    }} />
                    <input 
                      type="password" 
                      className="form-control" 
                      style={{ paddingLeft: '44px' }}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="form-group">
                  <label className="form-label">Parent Username</label>
                  <div style={{ position: 'relative' }}>
                    <Users size={18} style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-light)'
                    }} />
                    <input 
                      type="text" 
                      className="form-control" 
                      style={{ paddingLeft: '44px' }}
                      value={parentUsername}
                      onChange={e => setParentUsername(e.target.value)}
                      placeholder="Patient-generated username"
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">Parent Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--text-light)'
                    }} />
                    <input 
                      type="password" 
                      className="form-control" 
                      style={{ paddingLeft: '44px' }}
                      value={parentPassword}
                      onChange={e => setParentPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
              disabled={loading}
            >
              <LogIn size={18} />
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

        </GlassCard>
      </div>
    </div>
  );
};

export default Login;
