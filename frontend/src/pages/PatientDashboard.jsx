import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import GlassCard from '../components/GlassCard';
import { 
  User, Calendar, Clock, Clipboard, FileText, Plus, Shield, Check, X, Search, Upload, Share2, BellRing, ShoppingBag, Truck, Bell 
} from 'lucide-react';
import { playBuzzer } from '../utils/audio';

const PatientDashboard = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('reminders');

  // Logistics Drivers State
  const [logisticsDrivers, setLogisticsDrivers] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const res = await api.get('/public/drivers');
        setLogisticsDrivers(res || []);
      } catch (err) {
        console.error('Error fetching drivers in PatientDashboard:', err);
      }
    };
    fetchDrivers();
  }, []);

  // Reminders State
  const [reminders, setReminders] = useState([]);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medSchedules, setMedSchedules] = useState(['08:00']);
  const [medInstruction, setMedInstruction] = useState('');
  const [medDuration, setMedDuration] = useState('7');
  const [medStartDate, setMedStartDate] = useState(new Date().toISOString().split('T')[0]);

  // Doctors & Appointments State
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookDate, setBookDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookSlot, setBookSlot] = useState('');
  const [bookNotes, setBookNotes] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpec, setFilterSpec] = useState('');

  // Medical Records State
  const [records, setRecords] = useState([]);
  const [recordTitle, setRecordTitle] = useState('');
  const [recordCategory, setRecordCategory] = useState('Report');
  const [uploadedFile, setUploadedFile] = useState({ fileName: '', fileUrl: '' });
  const [sharingRecord, setSharingRecord] = useState(null); // ID of record being shared

  // Profile Details State
  const [bloodGroup, setBloodGroup] = useState(user.patientDetails?.bloodGroup || '');
  const [allergies, setAllergies] = useState(user.patientDetails?.allergies?.join(', ') || '');
  const [conditions, setConditions] = useState(user.patientDetails?.conditions?.join(', ') || '');
  const [photo, setPhoto] = useState(user.photo || '');
  const [emergencyContact, setEmergencyContact] = useState({
    name: user.patientDetails?.emergencyContact?.name || '',
    phone: user.patientDetails?.emergencyContact?.phone || '',
    relation: user.patientDetails?.emergencyContact?.relation || ''
  });

  // Patient Location State
  const [patientCountry, setPatientCountry] = useState(user.patientDetails?.country || 'India');
  const [patientState, setPatientState] = useState(user.patientDetails?.state || '');
  const [patientCity, setPatientCity] = useState(user.patientDetails?.city || '');
  const [patientPincode, setPatientPincode] = useState(user.patientDetails?.pincode || '');
  const [patientLandmark, setPatientLandmark] = useState(user.patientDetails?.landmark || '');
  const [gpsLoading, setGpsLoading] = useState(false);

  const handleFetchGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.address) {
            const address = data.address;
            setPatientCountry(address.country || 'India');
            setPatientState(address.state || '');
            setPatientCity(address.city || address.town || address.village || address.suburb || '');
            setPatientPincode(address.postcode || '');
            setPatientLandmark(data.display_name?.split(',').slice(0, 2).join(',') || '');
          } else {
            alert(`Location fetched, but geocode details unavailable: ${latitude}, ${longitude}`);
          }
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          alert(`Location coordinates obtained: ${latitude}, ${longitude}`);
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        setGpsLoading(false);
        alert("Failed to access your location. Please check browser permissions.");
      }
    );
  };

  // Doctor area filter state
  const [showLocalOnly, setShowLocalOnly] = useState(false);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Parent Portal State
  const [parentUser, setParentUser] = useState(user.patientDetails?.parentAccess?.username || '');
  const [parentPass, setParentPass] = useState('');
  const [parentPermissions, setParentPermissions] = useState({
    medicalRecords: user.patientDetails?.parentAccess?.permissions?.medicalRecords || false,
    prescriptions: user.patientDetails?.parentAccess?.permissions?.prescriptions || false,
    medicineSchedules: user.patientDetails?.parentAccess?.permissions?.medicineSchedules || false,
    appointments: user.patientDetails?.parentAccess?.permissions?.appointments || false
  });

  // Status Alerts
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Orders state
  const [myOrders, setMyOrders] = useState([]);
  const prevOrderStatuses = useRef({});

  // Notifications state
  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  useEffect(() => {
    fetchDashboardData();
    fetchNotifications();
    // Poll notifications and dashboard data every 800ms (less than a second) for real-time tracking
    const pollInterval = setInterval(() => {
      fetchDashboardData();
      fetchNotifications();
    }, 800);

    const handleMedicationLogged = () => {
      fetchDashboardData();
    };
    window.addEventListener('medication-logged', handleMedicationLogged);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('medication-logged', handleMedicationLogged);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await api.get('/notifications');
      setNotifications(data || []);
      setUnreadCount((data || []).filter(n => !n.isRead).length);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  const handleMarkNotifRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const remindersData = await api.get('/reminders');
      setReminders(remindersData);
    } catch (err) {
      console.error('Failed to load reminders:', err);
    }

    try {
      const doctorsData = await api.get('/doctor/list');
      setDoctors(doctorsData);
    } catch (err) {
      console.error('Failed to load doctors list:', err);
    }

    try {
      const appointmentsData = await api.get('/appointments');
      if (Array.isArray(appointmentsData)) {
        setAppointments(appointmentsData.sort((a,b) => new Date(b.date + 'T' + b.timeSlot) - new Date(a.date + 'T' + a.timeSlot)));
      }
    } catch (err) {
      console.error('Failed to load appointments:', err);
    }

    try {
      const recordsData = await api.get('/patient/records');
      setRecords(recordsData);
    } catch (err) {
      console.error('Failed to load records:', err);
    }

    try {
      const ordersData = await api.get('/shop/orders/my');
      const prev = prevOrderStatuses.current || {};
      const next = {};
      
      (ordersData || []).forEach(order => {
        const orderId = order._id;
        const oldStatus = prev[orderId];
        const newStatus = order.status;
        next[orderId] = newStatus;
        
        if (oldStatus && oldStatus !== newStatus) {
          if (newStatus === 'Preparing') {
            playBuzzer('ready');
          } else if (newStatus === 'Out for Delivery') {
            playBuzzer('success');
          } else if (newStatus === 'Driver Reached') {
            playBuzzer('reached');
          } else if (newStatus === 'Delivered') {
            playBuzzer('success');
          }
        }
      });
      
      prevOrderStatuses.current = next;
      setMyOrders(ordersData || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
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

  // Medicine Reminders Handlers
  const handleAddScheduleField = () => {
    setMedSchedules([...medSchedules, '08:00']);
  };

  const handleRemoveScheduleField = (idx) => {
    const list = [...medSchedules];
    list.splice(idx, 1);
    setMedSchedules(list);
  };

  const handleScheduleTimeChange = (idx, value) => {
    const list = [...medSchedules];
    list[idx] = value;
    setMedSchedules(list);
  };

  const handleAddMedicine = async (e) => {
    e.preventDefault();
    if (!medName || !medDosage || medSchedules.length === 0 || !medDuration || !medStartDate) {
      return triggerError('Please fill in all medicine fields');
    }

    try {
      await api.post('/reminders', {
        name: medName,
        dosage: medDosage,
        schedule: medSchedules,
        instruction: medInstruction,
        durationDays: Number(medDuration),
        startDate: medStartDate
      });
      triggerSuccess(`Medication schedule for "${medName}" added successfully.`);
      setMedName('');
      setMedDosage('');
      setMedSchedules(['08:00']);
      setMedInstruction('');
      fetchDashboardData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const handleToggleReminder = async (id, currentActive) => {
    try {
      await api.put(`/reminders/${id}`, { active: !currentActive });
      triggerSuccess('Reminder status updated.');
      fetchDashboardData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const handleDeleteReminder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this reminder?')) return;
    try {
      await api.delete(`/reminders/${id}`);
      triggerSuccess('Reminder deleted.');
      fetchDashboardData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  // Appointment Handlers
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !bookDate || !bookSlot) {
      return triggerError('Select doctor, date, and timeslot');
    }

    try {
      await api.post('/appointments', {
        doctorId: selectedDoctor.id,
        date: bookDate,
        timeSlot: bookSlot,
        notes: bookNotes
      });
      triggerSuccess(`Appointment request with Dr. ${selectedDoctor.name} submitted successfully.`);
      setSelectedDoctor(null);
      setBookSlot('');
      setBookNotes('');
      fetchDashboardData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  // Medical Record Handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedFile({
        fileName: file.name,
        fileUrl: reader.result // Store base64 data url
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUploadRecord = async (e) => {
    e.preventDefault();
    if (!recordTitle || !uploadedFile.fileUrl) {
      return triggerError('Please select a file and enter a title');
    }

    try {
      await api.post('/patient/records', {
        title: recordTitle,
        category: recordCategory,
        fileName: uploadedFile.fileName,
        fileUrl: uploadedFile.fileUrl
      });
      triggerSuccess(`Document "${recordTitle}" uploaded successfully.`);
      setRecordTitle('');
      setUploadedFile({ fileName: '', fileUrl: '' });
      // Reset input element
      document.getElementById('recordFile').value = '';
      fetchDashboardData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const handleShareRecord = async (doctorId) => {
    if (!sharingRecord) return;
    try {
      await api.post(`/patient/records/${sharingRecord}/share`, { doctorId });
      triggerSuccess('Record shared successfully.');
      setSharingRecord(null);
      fetchDashboardData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  // Profile & Guardian Access Handlers
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const allergyArr = allergies.split(',').map(a => a.trim()).filter(Boolean);
      const conditionArr = conditions.split(',').map(c => c.trim()).filter(Boolean);

      await api.put('/patient/profile', {
        bloodGroup,
        allergies: allergyArr,
        conditions: conditionArr,
        emergencyContact,
        photo,
        country: patientCountry,
        state: patientState,
        city: patientCity,
        pincode: patientPincode,
        landmark: patientLandmark
      });
      triggerSuccess('Medical profile details and photo updated.');
      refreshUser();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const handleSetupParentPortal = async (e) => {
    e.preventDefault();
    if (!parentUser) return triggerError('Parent username is required');

    try {
      await api.post('/patient/parent-access', {
        username: parentUser,
        password: parentPass || undefined, // Send password only if typed
        permissions: parentPermissions
      });
      triggerSuccess('Parent Portal configurations saved successfully.');
      setParentPass('');
      refreshUser();
    } catch (err) {
      triggerError(err.message);
    }
  };

  // Calculate compliance statistics
  const getComplianceStats = () => {
    let totalLogs = 0;
    let takenLogs = 0;
    
    reminders.forEach(r => {
      r.history?.forEach(h => {
        totalLogs++;
        if (h.status === 'taken') takenLogs++;
      });
    });

    return {
      rate: totalLogs > 0 ? Math.round((takenLogs / totalLogs) * 100) : 100,
      total: totalLogs,
      taken: takenLogs
    };
  };

  const getNextDose = (reminder) => {
    if (!reminder.active) return 'Inactive';

    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const currentDateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

    if (currentDateStr > reminder.endDate) {
      return 'Completed (End Date Reached)';
    }

    const sortedSchedule = [...reminder.schedule].sort();

    // Check today's schedule
    for (const time of sortedSchedule) {
      const wasLogged = reminder.history?.some(h => h.date === currentDateStr && h.time === time);
      if (!wasLogged) {
        return `Today at ${time}`;
      }
    }

    // Next dose is tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDateStr = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;

    if (tomorrowDateStr > reminder.endDate) {
      return 'Completed (End Date Reached)';
    }

    return `Tomorrow at ${sortedSchedule[0]}`;
  };

  const compliance = getComplianceStats();
  const activeMedications = reminders.filter(r => r.active).length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending' || a.status === 'approved').length;

  // Area match scoring: pincode=3, city=2, state=1
  const getAreaMatchScore = (doc) => {
    let score = 0;
    if (patientPincode && doc.doctorDetails?.pincode && doc.doctorDetails.pincode === patientPincode) score += 3;
    else if (patientCity && doc.doctorDetails?.city && doc.doctorDetails.city.toLowerCase() === patientCity.toLowerCase()) score += 2;
    else if (patientState && doc.doctorDetails?.state && doc.doctorDetails.state.toLowerCase() === patientState.toLowerCase()) score += 1;
    return score;
  };

  const getAreaBadge = (doc) => {
    const score = getAreaMatchScore(doc);
    if (score >= 3) return { label: '📍 Same Pincode', color: 'var(--success-green)' };
    if (score === 2) return { label: '🏙️ Same City', color: 'var(--primary-blue)' };
    if (score === 1) return { label: '🗺️ Same State', color: 'var(--accent-teal)' };
    return null;
  };

  // Filters for Doctor Search
  const filteredDoctors = doctors
    .filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            doc.doctorDetails?.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpec = !filterSpec || doc.doctorDetails?.specialization === filterSpec;
      const matchesArea = !showLocalOnly || getAreaMatchScore(doc) > 0;
      return matchesSearch && matchesSpec && matchesArea;
    })
    .sort((a, b) => getAreaMatchScore(b) - getAreaMatchScore(a));

  const specializations = [...new Set(doctors.map(d => d.doctorDetails?.specialization).filter(Boolean))];

  return (
    <div className="container" style={{ padding: '40px 0 80px 0' }}>
      
      {/* Hello bar & Summary cards */}
      <div style={{ marginBottom: '32px' }} className="animate-fade-in-up">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Welcome back, {user.name}!</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Manage your personal medicine logs, schedules, and doctor consultations.</p>
          </div>

          {/* Notification Bell */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              onClick={() => setShowNotifPanel(!showNotifPanel)}
              style={{
                position: 'relative', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)',
                borderRadius: '50%', width: '48px', height: '48px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: unreadCount > 0 ? 'var(--warning-orange)' : 'var(--text-secondary)',
                transition: 'all 0.2s'
              }}
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: '2px', right: '2px',
                  background: 'var(--danger-red)', color: 'white',
                  fontSize: '0.65rem', borderRadius: '50%',
                  width: '18px', height: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800
                }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </button>

            {showNotifPanel && (
              <div style={{
                position: 'absolute', right: 0, top: '56px',
                width: '360px', maxHeight: '420px', overflowY: 'auto',
                background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)',
                borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                zIndex: 500
              }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--glass-border)', fontWeight: 700 }}>🔔 Notifications</div>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No notifications yet</div>
                ) : (
                  notifications.slice(0, 15).map(notif => (
                    <div
                      key={notif._id}
                      onClick={() => handleMarkNotifRead(notif._id)}
                      style={{
                        padding: '12px 20px', borderBottom: '1px solid var(--glass-border)',
                        cursor: 'pointer', background: notif.isRead ? 'transparent' : 'rgba(59, 130, 246, 0.05)'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '1.2rem' }}>
                          {notif.type === 'order_dispatch' ? '🛵' : notif.type === 'new_order' ? '📦' : '🔔'}
                        </span>
                        <div>
                          <div style={{ fontWeight: notif.isRead ? 500 : 700, fontSize: '0.85rem' }}>{notif.title}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '3px', lineHeight: '1.4' }}>{notif.message}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '4px' }}>{new Date(notif.createdAt).toLocaleString()}</div>
                        </div>
                        {!notif.isRead && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-blue)', flexShrink: 0, marginTop: '4px' }}></span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Success/Error Toasts */}
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
          }}>
            {successMsg}
          </div>
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
          }}>
            {errorMsg}
          </div>
        )}

        <div className="grid-3" style={{ marginTop: '24px' }}>
          <GlassCard style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'var(--primary-blue-glow)', color: 'var(--primary-blue)', borderRadius: '12px' }}>
              <Clock size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Active Medications</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{activeMedications}</h3>
            </div>
          </GlassCard>

          <GlassCard style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(20, 184, 166, 0.1)', color: 'var(--accent-teal)', borderRadius: '12px' }}>
              <Calendar size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Upcoming Consultations</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{pendingAppointments}</h3>
            </div>
          </GlassCard>

          <GlassCard style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-green)', borderRadius: '12px' }}>
              <BellRing size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Reminders Compliance</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{compliance.rate}%</h3>
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
          { id: 'reminders', name: 'Medicine reminders', icon: <Clock size={16} /> },
          { id: 'booking', name: 'Book Doctor', icon: <Calendar size={16} /> },
          { id: 'vault', name: 'Document Vault', icon: <FileText size={16} /> },
          { id: 'orders', name: `My Orders${myOrders.filter(o => o.status === 'Out for Delivery').length > 0 ? ' 🛵' : ''}`, icon: <ShoppingBag size={16} /> },
          { id: 'logistics', name: 'Logistics & Drivers', icon: <Truck size={16} /> },
          { id: 'profile', name: 'Profile & Guardian', icon: <User size={16} /> }
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
        
        {/* Medicine Reminders Panel */}
        {activeTab === 'reminders' && (
          <div className="grid-3" style={{ gridTemplateColumns: '1fr 2fr', gap: '32px' }} id="patient-reminders-grid">
            {/* Add Medication form */}
            <GlassCard style={{ height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} style={{ color: 'var(--primary-blue)' }} />
                Add Medication
              </h3>
              
              <form onSubmit={handleAddMedicine}>
                <div className="form-group">
                  <label className="form-label">Medicine Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={medName}
                    onChange={e => setMedName(e.target.value)}
                    placeholder="E.g. Paracetamol"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Dosage</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={medDosage}
                    onChange={e => setMedDosage(e.target.value)}
                    placeholder="E.g. 500mg, 1 tablet, 5ml"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Daily Alarms (Times)</label>
                  {medSchedules.map((time, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input 
                        type="time" 
                        className="form-control" 
                        value={time}
                        onChange={e => handleScheduleTimeChange(idx, e.target.value)}
                        required
                      />
                      {medSchedules.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveScheduleField(idx)}
                          className="btn btn-secondary"
                          style={{ padding: '0 12px', color: 'var(--danger-red)' }}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={handleAddScheduleField}
                    className="btn btn-secondary" 
                    style={{ width: '100%', fontSize: '0.8rem', padding: '6px', marginTop: '4px' }}
                  >
                    + Add alarm time
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">Duration (Days)</label>
                  <input 
                    type="number" 
                    min="1" 
                    className="form-control" 
                    value={medDuration}
                    onChange={e => setMedDuration(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input 
                    type="date" 
                    className="form-control" 
                    value={medStartDate}
                    onChange={e => setMedStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">Special Instructions</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={medInstruction}
                    onChange={e => setMedInstruction(e.target.value)}
                    placeholder="E.g. Take after meal"
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Schedule Medicine
                </button>
              </form>
            </GlassCard>

            {/* Reminders List & History */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Today's Intake Checklist */}
              <GlassCard style={{ border: '1.5px solid var(--primary-blue-glow)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}>
                  <Check size={20} style={{ color: 'var(--accent-teal)' }} />
                  Today's Medication Intake Checklist
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
                  Track your scheduled doses for today. Mark them as taken or missed directly from here.
                </p>

                {(() => {
                  const now = new Date();
                  const pad = n => String(n).padStart(2, '0');
                  const currentDateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

                  // Collect all scheduled doses for active reminders today
                  const todaysDoses = [];
                  reminders.forEach(rem => {
                    if (!rem.active) return;
                    if (currentDateStr < rem.startDate || currentDateStr > rem.endDate) return;

                    rem.schedule.forEach(time => {
                      // Find log status
                      const log = rem.history?.find(h => h.date === currentDateStr && h.time === time);
                      todaysDoses.push({
                        reminder: rem,
                        time,
                        status: log ? log.status : 'pending'
                      });
                    });
                  });

                  // Sort chronologically
                  todaysDoses.sort((a, b) => a.time.localeCompare(b.time));

                  if (todaysDoses.length === 0) {
                    return <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>No doses scheduled for today.</p>;
                  }

                  const handleDirectLog = async (reminderId, time, status) => {
                    try {
                      await api.post(`/reminders/${reminderId}/log`, {
                        date: currentDateStr,
                        time,
                        status
                      });
                      triggerSuccess(`Medication logged as ${status.toUpperCase()}!`);
                      // Dispatch event for real-time compliance sync across components
                      window.dispatchEvent(new CustomEvent('medication-logged', { 
                        detail: { reminderId, status, date: currentDateStr, time } 
                      }));
                      fetchDashboardData();
                    } catch (err) {
                      triggerError(err.message);
                    }
                  };

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {todaysDoses.map((dose, idx) => {
                        const statusColors = {
                          taken: 'var(--success-green)',
                          missed: 'var(--danger-red)',
                          pending: 'var(--primary-blue)'
                        };
                        return (
                          <div 
                            key={idx}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '12px 18px',
                              background: 'var(--bg-secondary)',
                              border: `1px solid ${dose.status === 'pending' ? 'var(--glass-border)' : statusColors[dose.status] + '33'}`,
                              borderRadius: '10px',
                              gap: '12px',
                              flexWrap: 'wrap'
                            }}
                          >
                            <div>
                              <strong style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>{dose.reminder.name}</strong>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '12px' }}>
                                Dosage: {dose.reminder.dosage}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-light)' }}>
                                <Clock size={12} /> Scheduled: {dose.time}
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {dose.status === 'pending' ? (
                                <div style={{ display: 'inline-flex', gap: '6px' }}>
                                  <button
                                    onClick={() => handleDirectLog(dose.reminder._id, dose.time, 'taken')}
                                    className="btn btn-teal"
                                    style={{ padding: '6px 12px', fontSize: '0.75rem', fontWeight: 700 }}
                                  >
                                    Mark Taken
                                  </button>
                                  <button
                                    onClick={() => handleDirectLog(dose.reminder._id, dose.time, 'missed')}
                                    className="btn btn-secondary"
                                    style={{ padding: '6px 12px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--danger-red)', borderColor: 'rgba(239, 68, 68, 0.15)' }}
                                  >
                                    Missed
                                  </button>
                                </div>
                              ) : (
                                <span style={{
                                  color: statusColors[dose.status],
                                  fontWeight: 800,
                                  fontSize: '0.78rem',
                                  textTransform: 'uppercase',
                                  background: statusColors[dose.status] + '15',
                                  padding: '4px 10px',
                                  borderRadius: '20px'
                                }}>
                                  {dose.status === 'taken' ? '✓ Taken' : '✗ Missed'}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </GlassCard>

              <GlassCard>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Active Schedules</h3>
                
                {reminders.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No active medicine schedules configured. Add one on the left.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {reminders.map(rem => (
                      <div key={rem._id} style={{
                        background: rem.active ? 'var(--bg-primary)' : 'rgba(0,0,0,0.05)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '16px',
                        opacity: rem.active ? 1 : 0.6
                      }}>
                        <div>
                          <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 700 }}>{rem.name}</h4>
                          <span style={{ fontSize: '0.85rem', color: 'var(--accent-teal)', fontWeight: 600, display: 'block', margin: '2px 0' }}>
                            Dosage: {rem.dosage} | Duration: {rem.durationDays} days ({rem.startDate} to {rem.endDate})
                          </span>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                            {rem.schedule.map((t, i) => (
                              <span key={i} style={{
                                background: 'var(--primary-blue-glow)',
                                color: 'var(--primary-blue)',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                fontWeight: 600
                              }}>
                                ⏰ {t}
                              </span>
                            ))}
                          </div>
                          
                          <div style={{ marginTop: '10px', fontSize: '0.85rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Next Intake: </span>
                            <strong style={{ 
                              color: getNextDose(rem).startsWith('Today') 
                                ? 'var(--warning-orange)' 
                                : getNextDose(rem).startsWith('Tomorrow') 
                                  ? 'var(--accent-teal)' 
                                  : 'var(--text-light)'
                            }}>
                              {getNextDose(rem)}
                            </strong>
                          </div>

                          {rem.instruction && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px', fontStyle: 'italic' }}>
                              Note: {rem.instruction}
                            </p>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleToggleReminder(rem._id, rem.active)}
                            className="btn btn-secondary"
                            style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                          >
                            {rem.active ? 'Disable' : 'Enable'}
                          </button>
                          
                          <button
                            onClick={() => handleDeleteReminder(rem._id)}
                            className="btn btn-secondary"
                            style={{ padding: '8px 12px', fontSize: '0.8rem', color: 'var(--danger-red)' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>

              {/* Compliance logs history */}
              <GlassCard>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Medication Intake Audit (Compliance History)</h3>
                
                {reminders.every(r => !r.history || r.history.length === 0) ? (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No intake logs recorded yet. Take your medications when alarms trigger.</p>
                ) : (
                  <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {reminders.flatMap(r => r.history.map(h => ({ ...h, medName: r.name })))
                      .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time))
                      .map((log, index) => (
                        <div key={index} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: '8px',
                          fontSize: '0.85rem'
                        }}>
                          <div>
                            <strong>{log.medName}</strong> - Scheduled time: {log.time} on {log.date}
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
                      ))
                    }
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        )}

        {/* Doctor consults & Booking Panel */}
        {activeTab === 'booking' && (
          <div className="grid-3" style={{ gridTemplateColumns: '2fr 1fr', gap: '32px' }} id="patient-booking-grid">
            {/* Search list of doctors */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <GlassCard>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Find Healthcare Specialists</h3>
                
                {/* Filters */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                  <div style={{ flexGrow: 1, position: 'relative' }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                    <input 
                      type="text" 
                      className="form-control" 
                      style={{ paddingLeft: '40px' }}
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Search by Doctor Name or Specialty..."
                    />
                  </div>
                  <select 
                    className="form-control" 
                    style={{ width: 'auto', minWidth: '160px' }}
                    value={filterSpec}
                    onChange={e => setFilterSpec(e.target.value)}
                  >
                    <option value="">All Specialties</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                  {/* Local doctor filter toggle */}
                  <button
                    type="button"
                    onClick={() => setShowLocalOnly(!showLocalOnly)}
                    style={{
                      padding: '10px 16px',
                      border: `1px solid ${showLocalOnly ? 'var(--success-green)' : 'var(--glass-border)'}`,
                      borderRadius: '8px',
                      background: showLocalOnly ? 'rgba(16,185,129,0.1)' : 'var(--bg-primary)',
                      color: showLocalOnly ? 'var(--success-green)' : 'var(--text-secondary)',
                      cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem',
                      display: 'flex', alignItems: 'center', gap: '6px',
                      transition: 'all 0.2s', whiteSpace: 'nowrap'
                    }}
                  >
                    📍 {showLocalOnly ? 'My Area Only' : 'All Areas'}
                  </button>
                </div>

                {/* Doctor Listing Grid */}
                {filteredDoctors.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>No approved doctors found matching search filters.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredDoctors.map(doc => (
                      <div key={doc.id} style={{
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Dr. {doc.name}</h4>
                            {(() => { const badge = getAreaBadge(doc); return badge ? (
                              <span style={{ background: `${badge.color}18`, color: badge.color, border: `1px solid ${badge.color}40`, padding: '2px 10px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 700 }}>
                                {badge.label}
                              </span>
                            ) : null; })()}
                          </div>
                          <span style={{ color: 'var(--primary-blue)', fontWeight: 600, fontSize: '0.85rem' }}>
                            Specialization: {doc.doctorDetails?.specialization} | Experience: {doc.doctorDetails?.experience} Years
                          </span>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                            Clinic: {doc.doctorDetails?.clinicInfo}
                          </p>
                          {(doc.doctorDetails?.city || doc.doctorDetails?.pincode) && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              📍 {[doc.doctorDetails?.city, doc.doctorDetails?.state, doc.doctorDetails?.pincode].filter(Boolean).join(', ')}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            setSelectedDoctor(doc);
                            if(doc.doctorDetails?.availability?.[0]?.slots?.[0]) {
                              setBookSlot(doc.doctorDetails.availability[0].slots[0]);
                            }
                          }}
                          className="btn btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          Select Doctor
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>

              {/* Consultation History */}
              <GlassCard>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Your Appointments Timeline</h3>
                {appointments.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)' }}>No appointment bookings found.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {appointments.map(appt => (
                      <div key={appt._id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '16px',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        background: 'var(--bg-secondary)',
                        fontSize: '0.9rem',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}>
                        <div>
                          <strong>Dr. {appt.doctorName}</strong> on {appt.date} at {appt.timeSlot}
                          {appt.notes && (
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                              Complaint: {appt.notes}
                            </p>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {appt.prescriptionId && (
                            <span style={{
                              background: 'var(--primary-blue-glow)',
                              color: 'var(--primary-blue)',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}>
                              Prescription Active
                            </span>
                          )}
                          <span style={{
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            fontSize: '0.75rem',
                            color: 
                              appt.status === 'approved' ? 'var(--success-green)' :
                              appt.status === 'pending' ? 'var(--warning-orange)' : 'var(--danger-red)'
                          }}>
                            {appt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Booking Form Side Panel */}
            <div>
              {selectedDoctor ? (
                <GlassCard style={{ border: '1px solid var(--primary-blue)' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Schedule Appointment</h3>
                  <div style={{
                    background: 'var(--bg-primary)',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '20px',
                    fontSize: '0.85rem'
                  }}>
                    Selected Doctor: <strong style={{ color: 'var(--primary-blue)' }}>Dr. {selectedDoctor.name}</strong>
                    <br />
                    Specialty: {selectedDoctor.doctorDetails?.specialization}
                  </div>

                  <form onSubmit={handleBookAppointment}>
                    <div className="form-group">
                      <label className="form-label">Consultation Date</label>
                      <input 
                        type="date" 
                        className="form-control" 
                        value={bookDate}
                        onChange={e => setBookDate(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Available Slots</label>
                      <select 
                        className="form-control"
                        value={bookSlot}
                        onChange={e => setBookSlot(e.target.value)}
                        required
                      >
                        {selectedDoctor.doctorDetails?.availability?.map(avail => 
                          avail.slots.map(s => (
                            <option key={`${avail.day}-${s}`} value={s}>
                              {avail.day}: {s}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    <div className="form-group" style={{ marginBottom: '24px' }}>
                      <label className="form-label">Brief Medical Complaint / Notes</label>
                      <textarea 
                        className="form-control" 
                        rows="3"
                        value={bookNotes}
                        onChange={e => setBookNotes(e.target.value)}
                        placeholder="E.g. High fever, headache"
                      ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="submit" className="btn btn-primary" style={{ flexGrow: 1 }}>
                        Book Slot
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setSelectedDoctor(null)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </GlassCard>
              ) : (
                <GlassCard style={{ textAlign: 'center', padding: '32px' }}>
                  <Calendar size={32} style={{ color: 'var(--text-light)', marginBottom: '12px' }} />
                  <h4 style={{ fontWeight: 600, marginBottom: '6px' }}>Scheduler Closed</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Select a doctor on the left to review availability slots and submit a booking.</p>
                </GlassCard>
              )}
            </div>
          </div>
        )}

        {/* Document Vault Panel */}
        {activeTab === 'vault' && (
          <div className="grid-3" style={{ gridTemplateColumns: '1fr 2fr', gap: '32px' }} id="patient-vault-grid">
            {/* Upload form */}
            <GlassCard style={{ height: 'fit-content' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Upload size={18} style={{ color: 'var(--primary-blue)' }} />
                Upload Document
              </h3>
              
              <form onSubmit={handleUploadRecord}>
                <div className="form-group">
                  <label className="form-label">Document Title</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={recordTitle}
                    onChange={e => setRecordTitle(e.target.value)}
                    placeholder="E.g. Blood Test Report, Chest X-Ray"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-control"
                    value={recordCategory}
                    onChange={e => setRecordCategory(e.target.value)}
                  >
                    <option value="Report">Laboratory Report</option>
                    <option value="Prescription">Doctor Prescription</option>
                    <option value="Lab Result">Lab Result Image</option>
                    <option value="Other">Other Document</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label className="form-label">Select File (PDF/Image)</label>
                  <input 
                    type="file" 
                    id="recordFile"
                    className="form-control"
                    onChange={handleFileChange}
                    accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,application/pdf"
                    required
                  />
                  {uploadedFile.fileName && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-teal)', display: 'block', marginTop: '6px', fontWeight: 600 }}>
                      Selected: {uploadedFile.fileName}
                    </span>
                  )}
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Upload to Vault
                </button>
              </form>
            </GlassCard>

            {/* List of uploaded files */}
            <GlassCard>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Your Vaulted Health Records</h3>
              
              {records.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)' }}>No uploaded health documents found. Add items on the left.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {records.map(rec => (
                    <div key={rec._id} style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '16px'
                    }}>
                      <div>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{rec.title}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Category: <strong>{rec.category}</strong> | Uploaded: {rec.uploadedAt?.split('T')[0]}
                        </span>
                        
                        {/* Doctor shares details */}
                        {rec.sharedWithDoctors && rec.sharedWithDoctors.length > 0 && (
                          <div style={{ marginTop: '8px', fontSize: '0.75rem', color: 'var(--accent-teal)', fontWeight: 600 }}>
                            Shared with {rec.sharedWithDoctors.length} Doctors
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <a 
                          href={rec.fileUrl} 
                          download={rec.fileName}
                          className="btn btn-secondary" 
                          style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                        >
                          Download
                        </a>
                        
                        <button
                          onClick={() => setSharingRecord(sharingRecord === rec._id ? null : rec._id)}
                          className="btn btn-primary"
                          style={{ padding: '8px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Share2 size={12} />
                          Share
                        </button>
                      </div>

                      {/* Doctor sharing submenu */}
                      {sharingRecord === rec._id && (
                        <div style={{
                          width: '100%',
                          marginTop: '12px',
                          padding: '12px',
                          background: 'var(--bg-secondary)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: '8px'
                        }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                            Select approved doctor to share this document with:
                          </span>
                          
                          {doctors.length === 0 ? (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No doctors available.</span>
                          ) : (
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              {doctors.map(doc => {
                                const isShared = rec.sharedWithDoctors?.includes(doc.id);
                                return (
                                  <button
                                    key={doc.id}
                                    type="button"
                                    onClick={() => handleShareRecord(doc.id)}
                                    disabled={isShared}
                                    className="btn btn-secondary"
                                    style={{
                                      padding: '4px 10px',
                                      fontSize: '0.75rem',
                                      background: isShared ? 'rgba(0,0,0,0.05)' : 'var(--bg-secondary)'
                                    }}
                                  >
                                    Dr. {doc.name} {isShared ? '(Shared)' : ''}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {/* Profile & Guardian Portal Panel */}
        {activeTab === 'profile' && (
          <div className="grid-2" style={{ gap: '32px' }} id="patient-profile-grid">
            {/* General Health info */}
            <GlassCard>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} style={{ color: 'var(--primary-blue)' }} />
                Personal Health Summary
              </h3>

              <form onSubmit={handleUpdateProfile}>
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
                      onChange={handlePhotoUpload} 
                      accept="image/png,image/jpeg,image/jpg,image/gif,image/webp" 
                      style={{ display: 'none' }} 
                    />
                  </label>
                </div>

                <div className="form-group">
                  <label className="form-label">Blood Group</label>
                  <select 
                    className="form-control"
                    value={bloodGroup}
                    onChange={e => setBloodGroup(e.target.value)}
                  >
                    <option value="">Select Blood Group</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Allergies (Comma separated)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={allergies}
                    onChange={e => setAllergies(e.target.value)}
                    placeholder="E.g. Penicillin, Peanuts, Pollen"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Chronic Conditions / History (Comma separated)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={conditions}
                    onChange={e => setConditions(e.target.value)}
                    placeholder="E.g. Hypertension, Diabetes Type 2"
                  />
                </div>

                <div style={{
                  background: 'var(--bg-primary)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>📍 Location / Address Details</h4>
                    <button
                      type="button"
                      onClick={handleFetchGPS}
                      disabled={gpsLoading}
                      className="btn btn-teal"
                      style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                    >
                      {gpsLoading ? 'Fetching GPS...' : '📍 Fetch My Location'}
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Country</label>
                      <input type="text" className="form-control" value={patientCountry} onChange={e => setPatientCountry(e.target.value)} placeholder="E.g. India" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State</label>
                      <input type="text" className="form-control" value={patientState} onChange={e => setPatientState(e.target.value)} placeholder="E.g. Andhra Pradesh" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input type="text" className="form-control" value={patientCity} onChange={e => setPatientCity(e.target.value)} placeholder="E.g. Kakinada" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Pincode</label>
                      <input type="text" className="form-control" value={patientPincode} onChange={e => setPatientPincode(e.target.value)} placeholder="E.g. 533003" />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Landmark / Area</label>
                    <input type="text" className="form-control" value={patientLandmark} onChange={e => setPatientLandmark(e.target.value)} placeholder="E.g. Near ACET Gate, Sector 4" />
                  </div>
                </div>

                <div style={{
                  background: 'var(--bg-primary)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  marginBottom: '24px'
                }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>Emergency Contact</h4>
                  <div className="form-group">
                    <label className="form-label">Contact Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={emergencyContact.name}
                      onChange={e => setEmergencyContact({ ...emergencyContact, name: e.target.value })}
                      placeholder="Contact person's name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Phone</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={emergencyContact.phone}
                      onChange={e => setEmergencyContact({ ...emergencyContact, phone: e.target.value })}
                      placeholder="Phone number"
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Relationship</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={emergencyContact.relation}
                      onChange={e => setEmergencyContact({ ...emergencyContact, relation: e.target.value })}
                      placeholder="E.g. Mother, Father, Spouse"
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Update Medical Profile
                </button>
              </form>
            </GlassCard>

            {/* Parent Guardian Access Panel */}
            <GlassCard style={{ border: '1px solid var(--primary-blue)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Shield size={18} style={{ color: 'var(--primary-blue)' }} />
                Parent/Guardian Access System
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
                Generate specific credentials for your parents or guardians. They can log in to view only the medical elements you grant permission to, in real time.
              </p>

              <form onSubmit={handleSetupParentPortal}>
                <div className="form-group">
                  <label className="form-label">Parent Portal Username</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={parentUser}
                    onChange={e => setParentUser(e.target.value)}
                    placeholder="Enter parent username"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Parent Portal Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    value={parentPass}
                    onChange={e => setParentPass(e.target.value)}
                    placeholder={user.patientDetails?.parentAccess?.username ? "•••••••• (Leave blank to keep existing)" : "Enter parent password"}
                  />
                </div>

                <div style={{
                  background: 'var(--bg-primary)',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid var(--glass-border)',
                  marginBottom: '24px'
                }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '12px' }}>Authorized Access Scopes</h4>
                  
                  {[
                    { key: 'medicalRecords', name: 'Can view medical files & report uploads' },
                    { key: 'prescriptions', name: 'Can view doctor digital prescriptions' },
                    { key: 'medicineSchedules', name: 'Can monitor medicine schedules & logs' },
                    { key: 'appointments', name: 'Can view consultation timelines' }
                  ].map(perm => (
                    <label key={perm.key} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.85rem',
                      marginBottom: '10px',
                      cursor: 'pointer'
                    }}>
                      <input 
                        type="checkbox" 
                        checked={parentPermissions[perm.key]}
                        onChange={e => setParentPermissions({ ...parentPermissions, [perm.key]: e.target.checked })}
                      />
                      <span>{perm.name}</span>
                    </label>
                  ))}
                </div>

                <button type="submit" className="btn btn-teal" style={{ width: '100%' }}>
                  Provision Parent Access
                </button>
              </form>
            </GlassCard>
          </div>
        )}

        {/* My Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <GlassCard>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingBag size={20} style={{ color: 'var(--primary-blue)' }} />
                My Pharmacy Orders
              </h3>

              {myOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
                  <ShoppingBag size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                  <p>No orders placed yet. Visit the <strong>Shop</strong> to order medicines.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {myOrders.map(order => (
                    <div key={order._id} style={{
                      border: `2px solid ${
                        order.status === 'Delivered' ? 'rgba(16, 185, 129, 0.3)' :
                        order.status === 'Out for Delivery' ? 'rgba(59, 130, 246, 0.5)' :
                        order.status === 'Driver Reached' ? 'var(--accent-teal)' :
                        order.status === 'Preparing' ? 'rgba(147, 51, 234, 0.5)' : 'var(--glass-border)'
                      }`,
                      borderRadius: '16px',
                      padding: '20px',
                      background: 
                        order.status === 'Out for Delivery' ? 'rgba(59, 130, 246, 0.04)' :
                        order.status === 'Driver Reached' ? 'rgba(20, 184, 166, 0.05)' :
                        order.status === 'Preparing' ? 'rgba(147, 51, 234, 0.04)' : 'transparent',
                      transition: 'all 0.3s'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Order #{order._id?.substring(0, 10)}...</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            {new Date(order.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700,
                          background: 
                            order.status === 'Delivered' ? 'rgba(16, 185, 129, 0.15)' :
                            order.status === 'Out for Delivery' ? 'rgba(59, 130, 246, 0.15)' :
                            order.status === 'Driver Reached' ? 'rgba(20, 184, 166, 0.2)' :
                            order.status === 'Preparing' ? 'rgba(147, 51, 234, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                          color:
                            order.status === 'Delivered' ? 'var(--success-green)' :
                            order.status === 'Out for Delivery' ? 'var(--primary-blue)' :
                            order.status === 'Driver Reached' ? 'var(--accent-teal)' :
                            order.status === 'Preparing' ? '#9333ea' : 'var(--warning-orange)'
                        }}>
                          {order.status === 'Out for Delivery' && <Truck size={12} />}
                          {order.status === 'Driver Reached' && <span>📍</span>}
                          {order.status}
                        </span>
                      </div>

                      {/* Items */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
                        {order.items.map((item, idx) => (
                          <span key={idx} style={{
                            background: 'var(--bg-primary)', border: '1px solid var(--glass-border)',
                            padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem'
                          }}>
                            {item.name} x{item.quantity}
                          </span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          <div>📍 Floor {order.floorName}, {order.address}</div>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '4px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Coords: {order.coordinates}</span>
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.coordinates)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: 'var(--primary-blue)',
                                textDecoration: 'underline',
                                fontWeight: 600,
                                fontSize: '0.75rem'
                              }}
                            >
                              🗺️ View Pin on Google Maps
                            </a>
                          </div>
                        </div>
                        <div style={{ fontWeight: 700 }}>₹{order.totalINR}</div>
                      </div>

                      {/* Driver Details - shown when dispatched or reached */}
                      {(order.status === 'Out for Delivery' || order.status === 'Driver Reached') && order.driverName && (
                        <div style={{
                          marginTop: '16px',
                          background: order.status === 'Driver Reached' ? 'rgba(20, 184, 166, 0.1)' : 'rgba(59, 130, 246, 0.08)',
                          border: order.status === 'Driver Reached' ? '2px solid var(--accent-teal)' : '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '12px',
                          padding: '16px',
                          animation: 'pulse 2s infinite'
                        }}>
                          {order.status === 'Driver Reached' ? (
                            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--accent-teal)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              📍 🔔 DRIVER REACHED YOUR LOCATION!
                            </div>
                          ) : (
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-blue)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Truck size={16} /> 🛵 Delivery Boy Assigned!
                            </div>
                          )}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.85rem' }}>
                            <div>
                              <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block' }}>Driver Name</span>
                              <strong>{order.driverName}</strong>
                            </div>
                            <div>
                              <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block' }}>Contact Number</span>
                              <strong style={{ color: 'var(--success-green)' }}>📞 {order.driverPhone}</strong>
                            </div>
                            {order.deliveryStreet && (
                              <div>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block' }}>Street</span>
                                <span>{order.deliveryStreet}</span>
                              </div>
                            )}
                            {order.deliveryFloor && (
                              <div>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block' }}>Floor/Room</span>
                                <span>{order.deliveryFloor}</span>
                              </div>
                            )}
                            {order.deliveryArea && (
                              <div>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block' }}>Area</span>
                                <span>{order.deliveryArea}</span>
                              </div>
                            )}
                            {order.deliveryLandmark && (
                              <div style={{ gridColumn: '1 / -1' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block' }}>Landmark</span>
                                <span>🏢 {order.deliveryLandmark}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {order.status === 'Delivered' && (
                        <div style={{
                          marginTop: '12px', padding: '10px 14px',
                          background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px',
                          color: 'var(--success-green)', fontSize: '0.85rem', fontWeight: 600,
                          display: 'flex', alignItems: 'center', gap: '6px'
                        }}>
                          ✅ Order delivered by {order.driverName || 'delivery driver'}. Thank you!
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {/* Verified Logistics/Drivers Panel */}
        {activeTab === 'logistics' && (
          <GlassCard>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Truck size={22} style={{ color: 'var(--primary-blue)' }} /> Platform Verified Logistics & Drivers
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              List of all active, background-verified delivery dispatch drivers registered on the platform.
            </p>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 8px' }}>Driver</th>
                    <th style={{ padding: '12px 8px' }}>Status</th>
                    <th style={{ padding: '12px 8px' }}>Vehicle Info</th>
                    <th style={{ padding: '12px 8px' }}>Verification Check</th>
                  </tr>
                </thead>
                <tbody>
                  {logisticsDrivers.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ padding: '24px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No verified drivers online.
                      </td>
                    </tr>
                  ) : (
                    logisticsDrivers.map(drv => (
                      <tr key={drv._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '14px 8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {drv.photo ? (
                            <img src={drv.photo} alt={drv.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-blue-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                              {drv.name.charAt(0)}
                            </div>
                          )}
                          {drv.name}
                        </td>
                        <td style={{ padding: '14px 8px' }}>
                          <span style={{
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            background: drv.status === 'active' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: drv.status === 'active' ? 'var(--success-green)' : 'var(--danger-red)'
                          }}>
                            {drv.status === 'active' ? '🟢 Active / Online' : '🔴 Offline'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 8px' }}>
                          <strong>{drv.vehicleName}</strong> ({drv.vehicleNumber})
                        </td>
                        <td style={{ padding: '14px 8px', fontWeight: 600, color: 'var(--accent-teal)' }}>
                          ✅ Background Verified Driver Tick
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}

      </div>

      {/* Media styling overrides for grid columns layout responsiveness */}
      <style>{`
        @media (max-width: 992px) {
          #patient-reminders-grid, #patient-booking-grid, #patient-vault-grid, #patient-profile-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PatientDashboard;
