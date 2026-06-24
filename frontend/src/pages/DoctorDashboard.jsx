import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import GlassCard from '../components/GlassCard';
import { 
  Calendar, Check, X, Clipboard, Edit3, User, Plus, Clock, FileText, Settings, HeartPulse, CheckSquare 
} from 'lucide-react';

const DoctorDashboard = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('appointments');

  // Stats & Appointments
  const [stats, setStats] = useState({ totalAppointments: 0, pendingAppointments: 0, approvedAppointments: 0, patientsTreated: 0 });
  const [appointments, setAppointments] = useState([]);
  const [reschedulingAppt, setReschedulingAppt] = useState(null); // ID of appt being rescheduled
  const [newDate, setNewDate] = useState('');
  const [newSlot, setNewSlot] = useState('');

  // Prescription State
  const [prescriptionAppt, setPrescriptionAppt] = useState(null); // Selected appointment object
  const [consultNotes, setConsultNotes] = useState('');
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', schedule: ['08:00'], durationDays: 7, instructions: '' }]);

  // Shared medical records
  const [sharedRecords, setSharedRecords] = useState([]);

  // Profile Details State
  const [specialization, setSpecialization] = useState(user.doctorDetails?.specialization || '');
  const [experience, setExperience] = useState(user.doctorDetails?.experience || '');
  const [clinicInfo, setClinicInfo] = useState(user.doctorDetails?.clinicInfo || '');
  const [availability, setAvailability] = useState(user.doctorDetails?.availability || []);
  const [photo, setPhoto] = useState(user.photo || '');

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const data = await api.get('/doctor/dashboard');
      setStats(data.stats);
    } catch (err) {
      console.error('Failed to load doctor stats:', err);
    }

    try {
      const appts = await api.get('/appointments');
      if (Array.isArray(appts)) {
        setAppointments(appts.sort((a,b) => new Date(b.date + 'T' + b.timeSlot) - new Date(a.date + 'T' + a.timeSlot)));
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    }

    try {
      const shared = await api.get('/patient/shared-records');
      setSharedRecords(shared);
    } catch (err) {
      console.error('Failed to load shared records:', err);
    }
  };

  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const triggerError = (msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(''), 4000);
  };

  // Appointment Status Updates
  const handleApptAction = async (apptId, status) => {
    try {
      await api.put(`/appointments/${apptId}`, { status });
      triggerSuccess(`Appointment request status updated to ${status.toUpperCase()}.`);
      fetchDoctorData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!newDate || !newSlot) return triggerError('Provide date and slot');

    try {
      await api.put(`/appointments/${reschedulingAppt}`, {
        date: newDate,
        timeSlot: newSlot,
        status: 'rescheduled'
      });
      triggerSuccess('Appointment rescheduled successfully.');
      setReschedulingAppt(null);
      setNewDate('');
      setNewSlot('');
      fetchDoctorData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  // Prescription dynamic fields
  const handleAddMedField = () => {
    setMedicines([...medicines, { name: '', dosage: '', schedule: ['08:00'], durationDays: 7, instructions: '' }]);
  };

  const handleRemoveMedField = (idx) => {
    const list = [...medicines];
    list.splice(idx, 1);
    setMedicines(list);
  };

  const handleMedFieldChange = (idx, field, value) => {
    const list = [...medicines];
    if (field === 'schedule') {
      list[idx][field] = value.split(',').map(s => s.trim());
    } else {
      list[idx][field] = value;
    }
    setMedicines(list);
  };

  const handleWritePrescription = async (e) => {
    e.preventDefault();
    if (!prescriptionAppt) return triggerError('Select an appointment');
    
    // Validate medicines
    const invalid = medicines.some(m => !m.name || !m.dosage || m.schedule.length === 0);
    if (invalid) return triggerError('Please fill in Name, Dosage, and Schedules for all medicines');

    try {
      await api.post(`/appointments/${prescriptionAppt._id}/prescription`, {
        notes: consultNotes,
        medicines
      });
      triggerSuccess('Prescription submitted and synced to patient alarms successfully.');
      setPrescriptionAppt(null);
      setConsultNotes('');
      setMedicines([{ name: '', dosage: '', schedule: ['08:00'], durationDays: 7, instructions: '' }]);
      fetchDoctorData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  // Doctor Professional Settings
  const handleSaveProfileSettings = async (e) => {
    e.preventDefault();
    try {
      await api.put('/doctor/profile', {
        specialization,
        experience,
        clinicInfo,
        availability,
        photo
      });
      triggerSuccess('Professional profile updated successfully.');
      refreshUser();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const handleAddSlot = (dayIdx, slotTime) => {
    if (!slotTime) return;
    const list = [...availability];
    if (!list[dayIdx].slots.includes(slotTime)) {
      list[dayIdx].slots.push(slotTime);
      list[dayIdx].slots.sort();
      setAvailability(list);
    }
  };

  const handleRemoveSlot = (dayIdx, slotIdx) => {
    const list = [...availability];
    list[dayIdx].slots.splice(slotIdx, 1);
    setAvailability(list);
  };

  const initializeDefaultSlots = () => {
    setAvailability([
      { day: 'Monday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
      { day: 'Tuesday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
      { day: 'Wednesday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
      { day: 'Thursday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
      { day: 'Friday', slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] }
    ]);
  };

  return (
    <div className="container" style={{ padding: '40px 0 80px 0' }}>
      
      {/* Welcome Bar */}
      <div style={{ marginBottom: '32px' }} className="animate-fade-in-up">
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Welcome, Dr. {user.name}!</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage doctor profile settings, consultations calendars, and digital prescriptions.</p>

        {successMsg && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid var(--success-green)',
            color: 'var(--success-green)',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            marginTop: '16px',
            fontWeight: 600
          }}>{successMsg}</div>
        )}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--danger-red)',
            color: 'var(--danger-red)',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            marginTop: '16px',
            fontWeight: 600
          }}>{errorMsg}</div>
        )}

        {/* Doctor Summary Stats */}
        <div className="grid-4" style={{ marginTop: '24px' }}>
          <GlassCard style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'var(--primary-blue-glow)', color: 'var(--primary-blue)', borderRadius: '12px' }}>
              <Calendar size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Bookings</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.totalAppointments}</h3>
            </div>
          </GlassCard>

          <GlassCard style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(251, 191, 36, 0.1)', color: 'var(--warning-orange)', borderRadius: '12px' }}>
              <Clock size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Pending Requests</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.pendingAppointments}</h3>
            </div>
          </GlassCard>

          <GlassCard style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-green)', borderRadius: '12px' }}>
              <CheckSquare size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Approved Consults</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.approvedAppointments}</h3>
            </div>
          </GlassCard>

          <GlassCard style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(20, 184, 166, 0.1)', color: 'var(--accent-teal)', borderRadius: '12px' }}>
              <HeartPulse size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Patients Treated</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.patientsTreated}</h3>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--glass-border)',
        marginBottom: '32px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {[
          { id: 'appointments', name: 'Appointments Manager', icon: <Calendar size={16} /> },
          { id: 'prescribe', name: 'Write Prescription', icon: <Clipboard size={16} /> },
          { id: 'shared', name: 'Patient Shared Vault', icon: <FileText size={16} /> },
          { id: 'settings', name: 'Consultation Settings', icon: <Settings size={16} /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '12px 20px',
              border: 'none',
              background: 'transparent',
              color: activeTab === tab.id ? 'var(--primary-blue)' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              borderBottom: activeTab === tab.id ? '3px solid var(--primary-blue)' : '3px solid transparent',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.icon}
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="tab-content animate-fade-in-up">
        
        {/* Appointments Panel */}
        {activeTab === 'appointments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <GlassCard>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Your Consultations Calendar</h3>
              
              {appointments.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No appointment bookings found.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {appointments.map(appt => (
                    <div key={appt._id} style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '12px',
                      padding: '20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '16px'
                    }}>
                      <div>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Patient: {appt.patientName}</h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--primary-blue)', fontWeight: 600, display: 'block', marginTop: '2px' }}>
                          Scheduled: {appt.date} at {appt.timeSlot}
                        </span>
                        {appt.notes && (
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px', fontStyle: 'italic' }}>
                            Complaint: "{appt.notes}"
                          </p>
                        )}
                        <span style={{
                          display: 'inline-block',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          marginTop: '10px',
                          color: 
                            appt.status === 'approved' ? 'var(--success-green)' :
                            appt.status === 'pending' ? 'var(--warning-orange)' : 'var(--danger-red)'
                        }}>
                          Status: {appt.status}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {appt.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApptAction(appt._id, 'approved')}
                              className="btn btn-teal"
                              style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                            >
                              <Check size={14} /> Accept
                            </button>
                            <button
                              onClick={() => handleApptAction(appt._id, 'rejected')}
                              className="btn btn-secondary"
                              style={{ padding: '8px 12px', fontSize: '0.8rem', color: 'var(--danger-red)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                            >
                              <X size={14} /> Reject
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => {
                            setReschedulingAppt(appt._id);
                            setNewDate(appt.date);
                            setNewSlot(appt.timeSlot);
                          }}
                          className="btn btn-secondary"
                          style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                        >
                          <Edit3 size={14} /> Reschedule
                        </button>

                        {appt.status === 'approved' && !appt.prescriptionId && (
                          <button
                            onClick={() => {
                              setPrescriptionAppt(appt);
                              setActiveTab('prescribe');
                            }}
                            className="btn btn-primary"
                            style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                          >
                            Prescribe
                          </button>
                        )}
                      </div>

                      {/* Inline reschedule dialog */}
                      {reschedulingAppt === appt._id && (
                        <div style={{
                          width: '100%',
                          marginTop: '16px',
                          borderTop: '1px solid var(--glass-border)',
                          paddingTop: '16px'
                        }}>
                          <form onSubmit={handleRescheduleSubmit} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                            <div className="form-group" style={{ marginBottom: 0, flexGrow: 1 }}>
                              <label className="form-label">New Date</label>
                              <input 
                                type="date" 
                                className="form-control" 
                                value={newDate}
                                onChange={e => setNewDate(e.target.value)}
                                required
                              />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0, flexGrow: 1 }}>
                              <label className="form-label">New Slot</label>
                              <input 
                                type="time" 
                                className="form-control" 
                                value={newSlot}
                                onChange={e => setNewSlot(e.target.value)}
                                required
                              />
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>
                                Save Changes
                              </button>
                              <button 
                                type="button" 
                                onClick={() => setReschedulingAppt(null)} 
                                className="btn btn-secondary"
                                style={{ padding: '10px 20px' }}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {/* Prescription Panel */}
        {activeTab === 'prescribe' && (
          <div className="grid-3" style={{ gridTemplateColumns: '1fr 2fr', gap: '32px' }} id="doctor-prescribe-grid">
            {/* Consultation select */}
            <GlassCard style={{ height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Select Approved Booking</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Choose an approved appointment slot to attach a digital prescription for:
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {appointments.filter(a => a.status === 'approved' && !a.prescriptionId).length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>No active consultations waiting for prescriptions.</p>
                ) : (
                  appointments.filter(a => a.status === 'approved' && !a.prescriptionId).map(appt => (
                    <button
                      key={appt._id}
                      onClick={() => setPrescriptionAppt(appt)}
                      style={{
                        padding: '12px 16px',
                        background: prescriptionAppt?._id === appt._id ? 'var(--primary-blue-glow)' : 'var(--bg-secondary)',
                        border: prescriptionAppt?._id === appt._id ? '1.5px solid var(--primary-blue)' : '1px solid var(--glass-border)',
                        color: 'var(--text-primary)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                        fontSize: '0.85rem'
                      }}
                    >
                      <strong>{appt.patientName}</strong>
                      <br />
                      Date: {appt.date} at {appt.timeSlot}
                    </button>
                  ))
                )}
              </div>
            </GlassCard>

            {/* Prescription Composer */}
            <div>
              {prescriptionAppt ? (
                <GlassCard>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>
                    Prescription Composer for: <span style={{ color: 'var(--primary-blue)' }}>{prescriptionAppt.patientName}</span>
                  </h3>

                  <form onSubmit={handleWritePrescription}>
                    <div className="form-group">
                      <label className="form-label">Consultation Notes / Diagnoses</label>
                      <textarea 
                        className="form-control" 
                        rows="3"
                        value={consultNotes}
                        onChange={e => setConsultNotes(e.target.value)}
                        placeholder="E.g. Diagnosed with mild upper respiratory infection. Advised bedrest."
                      ></textarea>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '6px' }}>
                        Prescribed Medicines
                      </h4>

                      {medicines.map((med, idx) => (
                        <div key={idx} style={{
                          background: 'var(--bg-primary)',
                          borderRadius: '8px',
                          padding: '16px',
                          border: '1px solid var(--glass-border)',
                          marginBottom: '12px',
                          position: 'relative'
                        }}>
                          {medicines.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMedField(idx)}
                              style={{
                                position: 'absolute',
                                right: '12px',
                                top: '12px',
                                border: 'none',
                                background: 'transparent',
                                color: 'var(--danger-red)',
                                cursor: 'pointer'
                              }}
                            >
                              <X size={16} />
                            </button>
                          )}

                          <div className="grid-2" style={{ gap: '12px', marginBottom: '12px' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label" style={{ fontSize: '0.8rem' }}>Medicine Name</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                value={med.name}
                                onChange={e => handleMedFieldChange(idx, 'name', e.target.value)}
                                placeholder="E.g. Cetirizine"
                                required
                              />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label" style={{ fontSize: '0.8rem' }}>Dosage & Volume</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                value={med.dosage}
                                onChange={e => handleMedFieldChange(idx, 'dosage', e.target.value)}
                                placeholder="E.g. 10mg, 1 tablet"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid-3" style={{ gap: '12px', gridTemplateColumns: '2fr 1fr 2fr', marginBottom: 0 }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label" style={{ fontSize: '0.8rem' }}>Alarms (Times, comma-separated)</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                value={med.schedule.join(', ')}
                                onChange={e => handleMedFieldChange(idx, 'schedule', e.target.value)}
                                placeholder="08:00, 20:00"
                                required
                              />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label" style={{ fontSize: '0.8rem' }}>Duration (Days)</label>
                              <input 
                                type="number" 
                                className="form-control" 
                                value={med.durationDays}
                                onChange={e => handleMedFieldChange(idx, 'durationDays', e.target.value)}
                                required
                              />
                            </div>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label className="form-label" style={{ fontSize: '0.8rem' }}>Instructions</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                value={med.instructions}
                                onChange={e => handleMedFieldChange(idx, 'instructions', e.target.value)}
                                placeholder="Take before meals"
                              />
                            </div>
                          </div>

                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={handleAddMedField}
                        className="btn btn-secondary"
                        style={{ fontSize: '0.8rem', padding: '6px 12px', width: '100%', marginTop: '4px' }}
                      >
                        + Add another medicine
                      </button>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
                      Sign and Prescribe (Auto-syncs alarms)
                    </button>
                  </form>
                </GlassCard>
              ) : (
                <GlassCard style={{ textAlign: 'center', padding: '40px' }}>
                  <Clipboard size={36} style={{ color: 'var(--text-light)', marginBottom: '16px' }} />
                  <h4>Prescription Workspace Blank</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Select an approved patient consultation booking from the left to compile digital prescriptions.</p>
                </GlassCard>
              )}
            </div>
          </div>
        )}

        {/* Shared records Panel */}
        {activeTab === 'shared' && (
          <GlassCard>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Patient-shared Health Vault</h3>
            
            {sharedRecords.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No patient documents or laboratory files are shared with you currently.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {sharedRecords.map(rec => (
                  <GlassCard key={rec._id} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-primary)' }}>
                    <div>
                      <span style={{
                        background: 'var(--primary-blue-glow)',
                        color: 'var(--primary-blue)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        textTransform: 'uppercase'
                      }}>
                        {rec.category}
                      </span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '8px' }}>{rec.title}</h4>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Uploaded at: {rec.uploadedAt?.split('T')[0]}
                      </span>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', borderTop: '1px solid var(--glass-border)', paddingTop: '12px' }}>
                      <a 
                        href={rec.fileUrl} 
                        download={rec.fileName}
                        className="btn btn-secondary" 
                        style={{ padding: '6px 12px', fontSize: '0.8rem', width: '100%', justifyContent: 'center' }}
                      >
                        Download Report
                      </a>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </GlassCard>
        )}

        {/* Configuration settings Panel */}
        {activeTab === 'settings' && (
          <div className="grid-2" style={{ gap: '32px' }} id="doctor-settings-grid">
            <GlassCard>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Professional Details</h3>
              
              <form onSubmit={handleSaveProfileSettings}>
                <div className="form-group" style={{ textAlign: 'center', marginBottom: '24px' }}>
                  {photo ? (
                    <img 
                      src={photo} 
                      alt="Profile" 
                      style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-blue)', margin: '0 auto 12px auto', display: 'block', boxShadow: 'var(--shadow-md)' }} 
                    />
                  ) : (
                    <div style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--primary-blue), var(--accent-teal))',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '2rem',
                      margin: '0 auto 12px auto',
                      boxShadow: 'var(--shadow-md)'
                    }}>
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <label className="btn btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', fontSize: '0.8rem', padding: '6px 16px', borderRadius: '20px' }}>
                    Select Profile Photo
                    <input 
                      type="file" 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onloadend = () => setPhoto(reader.result);
                        reader.readAsDataURL(file);
                      }} 
                      accept="image/png,image/jpeg,image/jpg,image/gif,image/webp" 
                      style={{ display: 'none' }} 
                    />
                  </label>
                </div>

                <div className="form-group">
                  <label className="form-label">Consultation Specialization</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={specialization}
                    onChange={e => setSpecialization(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Consultation Experience (Years)</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={experience}
                    onChange={e => setExperience(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">Clinic Location / Information</label>
                  <textarea 
                    className="form-control" 
                    rows="3"
                    value={clinicInfo}
                    onChange={e => setClinicInfo(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Save Profile Settings
                </button>
              </form>
            </GlassCard>

            <GlassCard>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Availability Hours Manager</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Add or remove consultation timeslots for weekdays. Patient bookings search this list.
              </p>

              {availability.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <button onClick={initializeDefaultSlots} className="btn btn-teal">
                    Initialize Default Calendar Slots
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '420px', overflowY: 'auto' }}>
                  {availability.map((dayObj, dayIdx) => {
                    return (
                      <div key={dayObj.day} style={{
                        background: 'var(--bg-primary)',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: '1px solid var(--glass-border)'
                      }}>
                        <strong style={{ fontSize: '0.9rem', display: 'block', marginBottom: '8px' }}>{dayObj.day}</strong>
                        
                        {/* Slots render */}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                          {dayObj.slots.map((slot, slotIdx) => (
                            <span key={slot} style={{
                              background: 'var(--bg-secondary)',
                              border: '1px solid var(--glass-border)',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}>
                              {slot}
                              <X 
                                size={12} 
                                style={{ color: 'var(--danger-red)', cursor: 'pointer' }} 
                                onClick={() => handleRemoveSlot(dayIdx, slotIdx)}
                              />
                            </span>
                          ))}
                        </div>

                        {/* Quick add slot */}
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input 
                            type="time" 
                            id={`add-time-${dayIdx}`}
                            className="form-control" 
                            style={{ width: 'auto', padding: '4px 8px', fontSize: '0.8rem' }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById(`add-time-${dayIdx}`);
                              handleAddSlot(dayIdx, input.value);
                            }}
                            className="btn btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </GlassCard>
          </div>
        )}

      </div>
      <style>{`
        @media (max-width: 992px) {
          #doctor-prescribe-grid, #doctor-settings-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DoctorDashboard;
