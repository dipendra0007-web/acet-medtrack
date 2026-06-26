import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import GlassCard from '../components/GlassCard';
import {
  Truck, Package, CheckCircle, MapPin, Phone, Car, User,
  Navigation, Activity, Clock, AlertCircle, ToggleLeft, ToggleRight, Map
} from 'lucide-react';

const DriverDashboard = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('active');
  const [stats, setStats] = useState({ totalDeliveries: 0, activeDeliveries: 0, completedDeliveries: 0 });
  const [activeOrders, setActiveOrders] = useState([]);
  const [deliveryHistory, setDeliveryHistory] = useState([]);
  const [driverStatus, setDriverStatus] = useState(user?.driverDetails?.status || 'active');
  const [locationSyncing, setLocationSyncing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchDriverData();
    // Auto-sync location on mount
    syncLocation();
  }, []);

  const fetchDriverData = async () => {
    try {
      const data = await api.get('/driver/dashboard');
      setStats(data.stats);
      setActiveOrders(data.activeOrders || []);
      setDeliveryHistory(data.deliveryHistory || []);
      setDriverStatus(data.driver?.driverDetails?.status || 'active');
    } catch (err) {
      console.error('Failed to load driver data:', err);
    }
  };

  const triggerSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(''), 4000); };
  const triggerError = (msg) => { setErrorMsg(msg); setTimeout(() => setErrorMsg(''), 4000); };

  const syncLocation = () => {
    if (!navigator.geolocation) return;
    setLocationSyncing(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          await api.put('/driver/location', {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
          setLocationSyncing(false);
        } catch (err) {
          setLocationSyncing(false);
        }
      },
      () => setLocationSyncing(false),
      { timeout: 5000 }
    );
  };

  const handleToggleStatus = async () => {
    const newStatus = driverStatus === 'active' ? 'inactive' : 'active';
    try {
      await api.put('/driver/status', { status: newStatus });
      setDriverStatus(newStatus);
      triggerSuccess(`You are now ${newStatus === 'active' ? 'Online 🟢' : 'Offline 🔴'}`);
      refreshUser();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const statusColor = driverStatus === 'active' ? 'var(--success-green)' : driverStatus === 'on_delivery' ? 'var(--warning-orange)' : 'var(--danger-red)';
  const statusLabel = driverStatus === 'active' ? 'Online' : driverStatus === 'on_delivery' ? 'On Delivery' : 'Offline';

  const tabs = [
    { id: 'active', label: 'Active Deliveries', icon: <Truck size={16} /> },
    { id: 'history', label: 'Delivery History', icon: <CheckCircle size={16} /> },
    { id: 'profile', label: 'My Profile', icon: <User size={16} /> }
  ];

  return (
    <div className="container" style={{ padding: '40px 0 80px 0' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }} className="animate-fade-in-up">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '2.5rem' }}>🚗</span>
              Welcome, {user.name}!
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>Delivery Driver Dashboard — Manage your active deliveries</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Status Toggle */}
            <button
              onClick={handleToggleStatus}
              disabled={driverStatus === 'on_delivery'}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px',
                border: `2px solid ${statusColor}`, borderRadius: '24px',
                background: `${statusColor}18`, cursor: driverStatus === 'on_delivery' ? 'not-allowed' : 'pointer',
                color: statusColor, fontWeight: 700, fontSize: '0.9rem',
                transition: 'all 0.3s'
              }}
            >
              {driverStatus === 'active' ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
              {statusLabel}
            </button>

            {/* Location Sync */}
            <button
              onClick={syncLocation}
              style={{
                padding: '10px 16px', border: '1px solid var(--glass-border)',
                borderRadius: '8px', background: 'var(--glass-bg)',
                color: locationSyncing ? 'var(--primary-blue)' : 'var(--text-secondary)',
                cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px'
              }}
            >
              <Navigation size={16} style={{ animation: locationSyncing ? 'spin 1s linear infinite' : 'none' }} />
              {locationSyncing ? 'Syncing...' : 'Sync GPS'}
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid var(--success-green)', color: 'var(--success-green)', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>{successMsg}</div>}
      {errorMsg && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger-red)', color: 'var(--danger-red)', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' }}>{errorMsg}</div>}

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total Deliveries', value: stats.totalDeliveries, icon: <Package size={22} />, color: 'var(--primary-blue)' },
          { label: 'Active Now', value: stats.activeDeliveries, icon: <Truck size={22} />, color: 'var(--warning-orange)' },
          { label: 'Completed', value: stats.completedDeliveries, icon: <CheckCircle size={22} />, color: 'var(--success-green)' }
        ].map(card => (
          <GlassCard key={card.label} style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ color: card.color, marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>{card.icon}</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{card.label}</div>
          </GlassCard>
        ))}
      </div>

      {/* Tab Nav */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px', background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px',
            border: 'none', cursor: 'pointer', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem',
            background: activeTab === tab.id ? 'var(--primary-blue-glow)' : 'transparent',
            color: activeTab === tab.id ? 'var(--primary-blue)' : 'var(--text-secondary)',
            borderBottom: activeTab === tab.id ? '3px solid var(--primary-blue)' : '3px solid transparent',
            transition: 'all 0.2s'
          }}>
            {tab.icon}{tab.label}
          </button>
        ))}
      </div>

      {/* Active Deliveries */}
      {activeTab === 'active' && (
        <GlassCard>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={20} /> Active Deliveries
            {stats.activeDeliveries > 0 && <span style={{ background: 'var(--warning-orange)', color: 'white', borderRadius: '12px', padding: '2px 10px', fontSize: '0.8rem' }}>{stats.activeDeliveries}</span>}
          </h3>
          {activeOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-secondary)' }}>
              <Truck size={48} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>No active deliveries</p>
              <p style={{ fontSize: '0.85rem' }}>Make sure you're marked online. Orders will appear here when assigned by admin.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeOrders.map(order => (
                <div key={order._id} style={{
                  background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.05))',
                  border: '1px solid rgba(245,158,11,0.3)', borderRadius: '14px', padding: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ background: 'var(--warning-orange)', color: 'white', borderRadius: '6px', padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700 }}>OUT FOR DELIVERY</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>#{order._id?.substring(0, 10)}</span>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Patient: {order.patientName}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {order.items?.length} item(s) · ₹{order.totalINR}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {order.coordinates && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.coordinates)}`}
                          target="_blank" rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '8px 14px', background: 'var(--primary-blue)', color: 'white',
                            borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none'
                          }}
                        >
                          <Map size={14} /> Open Maps
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div style={{ background: 'var(--bg-primary)', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
                    <h5 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                      <MapPin size={14} /> DELIVERY ADDRESS
                    </h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem' }}>
                      {order.deliveryStreet && <div><strong>Street:</strong> {order.deliveryStreet}</div>}
                      {order.deliveryFloor && <div><strong>Floor/Room:</strong> {order.deliveryFloor}</div>}
                      {order.deliveryArea && <div><strong>Area:</strong> {order.deliveryArea}</div>}
                      {order.deliveryLandmark && <div><strong>Landmark:</strong> {order.deliveryLandmark}</div>}
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '0.85rem' }}>
                      <strong>Full Address:</strong> Floor {order.floorName}, {order.address}
                    </div>
                    {order.contactDetails && (
                      <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary-blue)', fontSize: '0.85rem' }}>
                        <Phone size={13} /><strong>Contact:</strong> {order.contactDetails}
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <strong>Items:</strong> {order.items?.map(i => `${i.name} x${i.quantity}`).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      )}

      {/* Delivery History */}
      {activeTab === 'history' && (
        <GlassCard>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={20} /> Delivery History ({stats.completedDeliveries})
          </h3>
          {deliveryHistory.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No completed deliveries yet.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 8px' }}>Order ID</th>
                    <th style={{ padding: '10px 8px' }}>Patient</th>
                    <th style={{ padding: '10px 8px' }}>Amount</th>
                    <th style={{ padding: '10px 8px' }}>Date</th>
                    <th style={{ padding: '10px 8px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryHistory.map(order => (
                    <tr key={order._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '10px 8px', fontFamily: 'monospace', fontSize: '0.8rem' }}>#{order._id?.substring(0, 8)}</td>
                      <td style={{ padding: '10px 8px', fontWeight: 600 }}>{order.patientName}</td>
                      <td style={{ padding: '10px 8px' }}>₹{order.totalINR}</td>
                      <td style={{ padding: '10px 8px', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                        {new Date(order.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <span style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--success-green)', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700 }}>✓ Delivered</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      )}

      {/* Driver Profile */}
      {activeTab === 'profile' && (
        <GlassCard>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} /> Driver Profile & Credentials
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {/* Personal Info */}
            <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary-blue), var(--accent-teal))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 800, fontSize: '1.5rem'
                }}>
                  {user.name?.charAt(0)}
                </div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user.name}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{user.email}</p>
                  <span style={{ background: `${statusColor}20`, color: statusColor, padding: '2px 10px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 700 }}>● {statusLabel}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Age</span>
                  <span style={{ fontWeight: 600 }}>{user.driverDetails?.age || '—'} years</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>License No.</span>
                  <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{user.driverDetails?.licenseNumber || '—'}</span>
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '20px' }}>
              <h5 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
                <Car size={16} /> Vehicle Details
              </h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Vehicle Name</span>
                  <span style={{ fontWeight: 600 }}>{user.driverDetails?.vehicleName || '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Vehicle Number</span>
                  <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{user.driverDetails?.vehicleNumber || '—'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Approval Status</span>
                  <span style={{ color: user.driverDetails?.approved ? 'var(--success-green)' : 'var(--warning-orange)', fontWeight: 700 }}>
                    {user.driverDetails?.approved ? '✓ Verified' : '⏳ Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* License Photo */}
            {user.driverDetails?.licensePhoto && (
              <div style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '20px' }}>
                <h5 style={{ marginBottom: '12px', fontWeight: 700 }}>License Document</h5>
                <img
                  src={user.driverDetails.licensePhoto}
                  alt="Driver License"
                  style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--glass-border)' }}
                />
              </div>
            )}
          </div>
        </GlassCard>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default DriverDashboard;
