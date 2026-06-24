import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import GlassCard from '../components/GlassCard';
import { 
  Users, Clock, FileText, Calendar, Lock, Heart, CheckCircle2, 
  FileSpreadsheet, Activity, PlusCircle, Trash2, X, Bell, Save
} from 'lucide-react';

/* ── helpers ─────────────────────────────────── */
const EMPTY_FORM = {
  name: '', dosage: '', instruction: '',
  startDate: '', endDate: '', durationDays: 7,
  schedule: ['08:00'],
};


const ParentDashboard = () => {
  const { user } = useAuth();
  
  // Data State
  const [reminders, setReminders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);

  // Medicine Reminder Form State
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchParentData();
  }, []);

  const fetchParentData = async () => {
    try {
      if (user.permissions?.medicineSchedules) {
        const rems = await api.get('/reminders');
        setReminders(rems);
      }
      if (user.permissions?.prescriptions) {
        const prescs = await api.get('/appointments/prescriptions');
        setPrescriptions(prescs);
      }
      if (user.permissions?.appointments) {
        const appts = await api.get('/appointments');
        setAppointments(appts.sort((a,b) => new Date(b.date + 'T' + b.timeSlot) - new Date(a.date + 'T' + a.timeSlot)));
      }
      if (user.permissions?.medicalRecords) {
        const recs = await api.get('/patient/records');
        setRecords(recs);
      }
    } catch (err) {
      console.error('Failed to load parent dashboard telemetry:', err);
    }
  };

  /* ── Medicine Reminder Handlers ── */
  const handleScheduleChange = (idx, val) => {
    const updated = [...form.schedule];
    updated[idx] = val;
    setForm(f => ({ ...f, schedule: updated }));
  };

  const addTimeSlot = () => {
    if (form.schedule.length >= 6) return;
    setForm(f => ({ ...f, schedule: [...f.schedule, '12:00'] }));
  };

  const removeTimeSlot = (idx) => {
    if (form.schedule.length <= 1) return;
    setForm(f => ({ ...f, schedule: f.schedule.filter((_, i) => i !== idx) }));
  };

  const handleSubmitReminder = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim()) { setFormError('Medicine name is required'); return; }
    if (!form.dosage.trim()) { setFormError('Dosage is required'); return; }
    if (!form.startDate || !form.endDate) { setFormError('Start and end dates are required'); return; }
    if (form.schedule.length === 0) { setFormError('At least one alarm time is required'); return; }
    setFormLoading(true);
    try {
      await api.post('/reminders', {
        ...form,
        durationDays: Number(form.durationDays),
        active: true
      });
      setShowForm(false);
      setForm(EMPTY_FORM);
      await fetchParentData();
    } catch (err) {
      setFormError(err.message || 'Failed to schedule medicine reminder');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteReminder = async (id) => {
    if (!window.confirm('Delete this medicine reminder?')) return;
    try {
      await api.delete(`/reminders/${id}`);
      await fetchParentData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Stats aggregation
  const getComplianceRate = () => {
    let total = 0;
    let taken = 0;
    reminders.forEach(r => {
      r.history?.forEach(h => {
        total++;
        if (h.status === 'taken') taken++;
      });
    });
    return total > 0 ? Math.round((taken / total) * 100) : 100;
  };

  const complianceRate = getComplianceRate();
  const activeMeds = reminders.filter(r => r.active).length;

  return (
    <div className="container" style={{ padding: '40px 0 80px 0' }}>
      
      {/* Hello Panel */}
      <div style={{ marginBottom: '32px' }} className="animate-fade-in-up">
        <h1 style={{ fontSize: '2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Users size={32} style={{ color: 'var(--primary-blue)' }} />
          Parent & Guardian Portal
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Real-time telemetry and compliance tracking for Patient:{' '}
          <strong style={{ color: 'var(--primary-blue)' }}>{user.patientName}</strong>
        </p>

        {/* Global Compliance Summary */}
        <div className="grid-3" style={{ marginTop: '24px' }}>
          <GlassCard style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'var(--primary-blue-glow)', color: 'var(--primary-blue)', borderRadius: '12px' }}>
              <Clock size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Active Medicines</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                {user.permissions?.medicineSchedules ? activeMeds : 'Restricted'}
              </h3>
            </div>
          </GlassCard>

          <GlassCard style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-green)', borderRadius: '12px' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Overall Compliance</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                {user.permissions?.medicineSchedules ? `${complianceRate}%` : 'Restricted'}
              </h3>
            </div>
          </GlassCard>

          <GlassCard style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(20, 184, 166, 0.1)', color: 'var(--accent-teal)', borderRadius: '12px' }}>
              <Activity size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Shared Records Count</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                {user.permissions?.medicalRecords ? records.length : 'Restricted'}
              </h3>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Columns: Left (Schedules & Logs), Right (Records, Prescriptions, Appointments) */}
      <div className="grid-2" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '32px' }} id="parent-dashboard-grid">
        
        {/* Left Column: Reminders */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Add Medicine Reminder Form */}
          {user.permissions?.medicineSchedules && (
            <GlassCard style={{ border: '1px solid rgba(29,78,216,0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showForm ? '20px' : '0' }}>
                <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                  <Bell size={18} style={{ color: 'var(--primary-blue)' }} />
                  Schedule Medicine Reminder
                </h3>
                <button
                  className="btn btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => { setShowForm(!showForm); setFormError(''); }}
                >
                  {showForm ? <><X size={14} /> Cancel</> : <><PlusCircle size={14} /> Add Reminder</>}
                </button>
              </div>

              {showForm && (
                <form onSubmit={handleSubmitReminder}>
                  {formError && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '0.85rem' }}>
                      {formError}
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Medicine Name *</label>
                      <input className="form-input" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="e.g. Paracetamol 500mg" required style={{ width: '100%' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Dosage *</label>
                      <input className="form-input" value={form.dosage} onChange={e => setForm(f => ({...f, dosage: e.target.value}))} placeholder="e.g. 1 tablet" required style={{ width: '100%' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Duration (Days)</label>
                      <input type="number" className="form-input" value={form.durationDays} min={1} max={365} onChange={e => setForm(f => ({...f, durationDays: e.target.value}))} style={{ width: '100%' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Start Date *</label>
                      <input type="date" className="form-input" value={form.startDate} onChange={e => setForm(f => ({...f, startDate: e.target.value}))} required style={{ width: '100%' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>End Date *</label>
                      <input type="date" className="form-input" value={form.endDate} onChange={e => setForm(f => ({...f, endDate: e.target.value}))} required style={{ width: '100%' }} />
                    </div>
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Instructions / Notes</label>
                      <input className="form-input" value={form.instruction} onChange={e => setForm(f => ({...f, instruction: e.target.value}))} placeholder="e.g. Take after meals" style={{ width: '100%' }} />
                    </div>

                    {/* Alarm Times */}
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>Alarm Times *</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                        {form.schedule.map((t, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <input
                              type="time"
                              className="form-input"
                              value={t}
                              onChange={e => handleScheduleChange(idx, e.target.value)}
                              style={{ width: '110px', padding: '6px 10px' }}
                            />
                            {form.schedule.length > 1 && (
                              <button type="button" onClick={() => removeTimeSlot(idx)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', display: 'flex', padding: '2px' }}>
                                <X size={14} />
                              </button>
                            )}
                          </div>
                        ))}
                        {form.schedule.length < 6 && (
                          <button type="button" onClick={addTimeSlot}
                            style={{ background: 'var(--primary-blue-glow)', border: '1px dashed var(--primary-blue)', color: 'var(--primary-blue)', borderRadius: '6px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <PlusCircle size={12} /> Add Time
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={formLoading}
                    style={{ marginTop: '16px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {formLoading ? 'Saving...' : <><Save size={16} /> Save Medicine Reminder</>}
                  </button>
                </form>
              )}
            </GlassCard>
          )}

          {/* Medication Schedule Monitor */}
          <GlassCard style={{ position: 'relative' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} style={{ color: 'var(--primary-blue)' }} />
              Medication Schedule Monitor
            </h3>

            {!user.permissions?.medicineSchedules ? (
              <div style={{
                padding: '40px 24px',
                textAlign: 'center',
                color: 'var(--text-secondary)'
              }}>
                <Lock size={36} style={{ color: 'var(--danger-red)', marginBottom: '12px' }} />
                <h4>Access Restricted</h4>
                <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>The patient has revoked or disabled parent access to medication schedules.</p>
              </div>
            ) : reminders.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No active medication schedules mapped.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {reminders.map(rem => (
                  <div key={rem._id} style={{
                    padding: '16px',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '10px',
                    background: rem.active ? 'var(--bg-primary)' : 'rgba(0,0,0,0.05)',
                    opacity: rem.active ? 1 : 0.6
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <strong style={{ fontSize: '1.05rem', display: 'block' }}>{rem.name}</strong>
                      <button onClick={() => handleDeleteReminder(rem._id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '2px', display: 'flex' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-teal)', fontWeight: 600 }}>
                      Dosage: {rem.dosage} | Duration: {rem.durationDays} Days
                    </span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                      {rem.schedule.map((t, idx) => (
                        <span key={idx} style={{
                          background: 'var(--primary-blue-glow)',
                          color: 'var(--primary-blue)',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          ⏰ {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Compliance History Log */}
          {user.permissions?.medicineSchedules && (
            <GlassCard>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Medication History (Taken Logs)</h3>
              
              {reminders.every(r => !r.history || r.history.length === 0) ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No intake logs recorded.</p>
              ) : (
                <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {reminders.flatMap(r => r.history.map(h => ({ ...h, medName: r.name })))
                    .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time))
                    .map((log, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        fontSize: '0.85rem'
                      }}>
                        <div>
                          <strong>{log.medName}</strong> at {log.time} on {log.date}
                        </div>
                        <span style={{
                          color: log.status === 'taken' ? 'var(--success-green)' : 'var(--danger-red)',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          fontSize: '0.75rem'
                        }}>
                          {log.status}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </GlassCard>
          )}

        </div>

        {/* Right Column: Prescriptions, Records, Appointments */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Digital Prescriptions */}
          <GlassCard>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileSpreadsheet size={18} style={{ color: 'var(--primary-blue)' }} />
              Clinician Prescriptions
            </h3>

            {!user.permissions?.prescriptions ? (
              <div style={{ textAlign: 'center', padding: '24px 12px' }}>
                <Lock size={24} style={{ color: 'var(--danger-red)', marginBottom: '8px' }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Access to digital prescriptions restricted by patient.</p>
              </div>
            ) : prescriptions.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No prescriptions recorded.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {prescriptions.map(pres => (
                  <div key={pres._id} style={{
                    padding: '14px',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    background: 'var(--bg-primary)',
                    fontSize: '0.85rem'
                  }}>
                    <strong style={{ fontSize: '0.95rem' }}>Dr. {pres.doctorName}</strong> ({pres.date})
                    <p style={{ fontStyle: 'italic', margin: '6px 0', color: 'var(--text-secondary)' }}>Notes: "{pres.notes}"</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', borderTop: '1px dashed var(--glass-border)', paddingTop: '6px', marginTop: '6px' }}>
                      {pres.medicines?.map((m, idx) => (
                        <div key={idx}>
                          💊 {m.name} ({m.dosage}) - Duration: {m.durationDays} Days
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Medical Records Vault */}
          <GlassCard>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} style={{ color: 'var(--accent-teal)' }} />
              Health Documents Vault
            </h3>

            {!user.permissions?.medicalRecords ? (
              <div style={{ textAlign: 'center', padding: '24px 12px' }}>
                <Lock size={24} style={{ color: 'var(--danger-red)', marginBottom: '8px' }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Access to document uploads restricted by patient.</p>
              </div>
            ) : records.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No reports vaulted.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {records.map(rec => (
                  <div key={rec._id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    background: 'var(--bg-primary)',
                    fontSize: '0.85rem'
                  }}>
                    <div>
                      <strong>{rec.title}</strong>
                      <br />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Category: {rec.category}</span>
                    </div>
                    <a 
                      href={rec.fileUrl} 
                      download={rec.fileName}
                      className="btn btn-secondary" 
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Appointments Timeline */}
          <GlassCard>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} style={{ color: 'var(--primary-blue)' }} />
              Consultations Timeline
            </h3>

            {!user.permissions?.appointments ? (
              <div style={{ textAlign: 'center', padding: '24px 12px' }}>
                <Lock size={24} style={{ color: 'var(--danger-red)', marginBottom: '8px' }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Access to consultations calendar restricted by patient.</p>
              </div>
            ) : appointments.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No appointment history.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {appointments.map(appt => (
                  <div key={appt._id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    background: 'var(--bg-primary)',
                    fontSize: '0.85rem'
                  }}>
                    <div>
                      Dr. {appt.doctorName}
                      <br />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Date: {appt.date} at {appt.timeSlot}</span>
                    </div>
                    <span style={{
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      alignSelf: 'center',
                      color: appt.status === 'approved' ? 'var(--success-green)' : 'var(--warning-orange)'
                    }}>{appt.status}</span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

        </div>

      </div>
      <style>{`
        @media (max-width: 992px) {
          #parent-dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ParentDashboard;
