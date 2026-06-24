import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { playAlarmSound } from '../utils/audio';
import { Clock, Check, X, Bell } from 'lucide-react';
import GlassCard from './GlassCard';

const AlarmNotification = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [activeAlarm, setActiveAlarm] = useState(null); // { reminder, time, date }
  const [triggeredAlarms, setTriggeredAlarms] = useState(new Set()); // Tracks 'reminderId-date-time'
  const soundIntervalRef = useRef(null);

  // Request browser notification permissions on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Fetch reminders when user is logged in
  const fetchReminders = async () => {
    if (user && (user.role === 'patient' || user.role === 'parent')) {
      try {
        const data = await api.get('/reminders');
        setReminders(data.filter(r => r.active));
      } catch (err) {
        console.error('Failed to load reminders for alarm checks:', err);
      }
    }
  };

  useEffect(() => {
    fetchReminders();
    // Poll for new reminders every 30 seconds
    const pollInterval = setInterval(fetchReminders, 30000);
    return () => clearInterval(pollInterval);
  }, [user]);

  // Main time-checking interval
  useEffect(() => {
    if (!user || (user.role !== 'patient' && user.role !== 'parent') || reminders.length === 0) {
      return;
    }

    const checkTime = () => {
      const now = new Date();
      // Use LOCAL time string for HH:MM comparison (not UTC)
      const pad = n => String(n).padStart(2, '0');
      const currentHourMin = `${pad(now.getHours())}:${pad(now.getMinutes())}`; // "HH:MM" in local TZ
      // Use LOCAL date string for date boundary checks (not UTC toISOString which can shift day)
      const currentDateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`; // "YYYY-MM-DD" local

      reminders.forEach(reminder => {
        // Validate date bounds
        if (currentDateStr < reminder.startDate || currentDateStr > reminder.endDate) {
          return;
        }

        reminder.schedule.forEach(schedTime => {
          if (schedTime === currentHourMin) {
            const alarmKey = `${reminder._id}-${currentDateStr}-${schedTime}`;
            
            // Check if alarm already triggered in this minute
            if (!triggeredAlarms.has(alarmKey) && !activeAlarm) {
              setTriggeredAlarms(prev => {
                const next = new Set(prev);
                next.add(alarmKey);
                return next;
              });

              // Trigger Alarm!
              triggerAlarm(reminder, schedTime, currentDateStr);
            }
          }
        });
      });
    };

    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [user, reminders, triggeredAlarms, activeAlarm]);

  // Handle playing sound repeatedly when alarm is active
  useEffect(() => {
    if (activeAlarm) {
      // Play immediately
      playAlarmSound();
      // Repeat sound every 5 seconds
      soundIntervalRef.current = setInterval(() => {
        playAlarmSound();
      }, 5000);
    } else {
      if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
        soundIntervalRef.current = null;
      }
    }

    return () => {
      if (soundIntervalRef.current) {
        clearInterval(soundIntervalRef.current);
      }
    };
  }, [activeAlarm]);

  const triggerAlarm = (reminder, time, date) => {
    setActiveAlarm({ reminder, time, date });

    // Spawn Browser Notification if permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('ACFET MEDTRACK - Medicine Reminder!', {
        body: `It's time to take ${reminder.name} (${reminder.dosage}).\nInstruction: ${reminder.instruction}`,
        icon: '/logo.jpg',
        tag: 'medication-alarm',
        requireInteraction: true
      });
    }
  };

  const handleLogCompliance = async (status) => {
    if (!activeAlarm) return;

    const { reminder, time, date } = activeAlarm;

    try {
      // POST compliance log to API
      await api.post(`/reminders/${reminder._id}/log`, {
        date,
        time,
        status
      });

      // Dispatch custom event for real-time dashboard sync
      window.dispatchEvent(new CustomEvent('medication-logged', {
        detail: { reminderId: reminder._id, status, date, time }
      }));

      // Clear alarm state
      setActiveAlarm(null);
      
      // Refresh reminders list (pulls history changes)
      fetchReminders();
    } catch (err) {
      console.error('Error logging compliance:', err);
      // Fallback close if backend has errors
      setActiveAlarm(null);
    }
  };

  if (!activeAlarm) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.65)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '24px'
    }}>
      <GlassCard style={{
        maxWidth: '480px',
        width: '100%',
        padding: '32px',
        border: '2px solid var(--danger-red)',
        boxShadow: '0 0 40px rgba(239, 68, 68, 0.45)',
        textAlign: 'center',
        background: 'var(--bg-secondary)',
        animation: 'fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Pulsating Bell Icon */}
        <div style={{
          display: 'inline-flex',
          padding: '16px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.15)',
          color: 'var(--danger-red)',
          marginBottom: '20px'
        }} className="pulse-alarm">
          <Bell size={36} />
        </div>

        <h2 style={{
          color: 'var(--text-primary)',
          fontSize: '1.75rem',
          marginBottom: '8px',
          fontWeight: 800
        }}>
          Medicine Reminder!
        </h2>
        
        <p style={{
          fontSize: '1rem',
          color: 'var(--text-secondary)',
          marginBottom: '24px'
        }}>
          Scheduled at <strong style={{ color: 'var(--primary-blue)' }}>{activeAlarm.time}</strong>
        </p>

        <div style={{
          background: 'var(--bg-primary)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '32px',
          border: '1px solid var(--glass-border)'
        }}>
          <h3 style={{
            fontSize: '1.4rem',
            color: 'var(--text-primary)',
            marginBottom: '6px',
            fontWeight: 700
          }}>
            {activeAlarm.reminder.name}
          </h3>
          <span style={{
            display: 'inline-block',
            fontWeight: 600,
            fontSize: '0.95rem',
            color: 'var(--accent-teal)',
            marginBottom: '10px'
          }}>
            Dosage: {activeAlarm.reminder.dosage}
          </span>
          {activeAlarm.reminder.instruction && (
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              fontStyle: 'italic',
              borderTop: '1px solid var(--glass-border)',
              paddingTop: '10px',
              marginTop: '4px'
            }}>
              Instructions: {activeAlarm.reminder.instruction}
            </p>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px'
        }}>
          <button
            onClick={() => handleLogCompliance('taken')}
            className="btn btn-teal"
            style={{
              padding: '14px',
              fontSize: '1rem',
              fontWeight: 700
            }}
          >
            <Check size={18} />
            Taken
          </button>
          
          <button
            onClick={() => handleLogCompliance('missed')}
            className="btn btn-secondary"
            style={{
              padding: '14px',
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--danger-red)',
              borderColor: 'rgba(239, 68, 68, 0.2)'
            }}
          >
            <X size={18} />
            Missed
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default AlarmNotification;
