import React, { useState, useEffect, useRef } from 'react';
import GlassCard from '../components/GlassCard';
import { Mail, Phone, MapPin, Send, HelpCircle, ArrowLeft, Clock, MessageSquare, User, Shield } from 'lucide-react';
import { api } from '../utils/api';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [activeTab, setActiveTab] = useState('new'); // 'new' | 'chats'

  // Tickets state
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [activeTicketData, setActiveTicketData] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Load existing tickets from localStorage
    const stored = JSON.parse(localStorage.getItem('medtrack_tickets') || '[]');
    setTickets(stored);
  }, []);

  // Poll for ticket updates when a ticket is opened in chat
  useEffect(() => {
    if (!activeTicket) {
      setActiveTicketData(null);
      return;
    }

    const fetchTicketDetails = async () => {
      try {
        const data = await api.get(`/contact/ticket/${activeTicket}`);
        setActiveTicketData(data);
      } catch (err) {
        console.error('Failed to poll ticket details:', err);
      }
    };

    fetchTicketDetails(); // Initial load

    const pollInterval = setInterval(fetchTicketDetails, 3000);
    return () => clearInterval(pollInterval);
  }, [activeTicket]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTicketData?.replies]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.name && form.email && form.subject && form.message) {
      try {
        const data = await api.post('/contact', form);
        
        // Save in state & localStorage
        const stored = JSON.parse(localStorage.getItem('medtrack_tickets') || '[]');
        const newTicket = {
          id: data._id || data.id,
          subject: data.subject,
          createdAt: data.createdAt || new Date().toISOString()
        };
        const updated = [newTicket, ...stored];
        localStorage.setItem('medtrack_tickets', JSON.stringify(updated));
        setTickets(updated);

        setSent(true);
        setForm({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSent(false), 5000);
        
        // Open active chat tab and set the active ticket
        setActiveTicket(data._id || data.id);
        setActiveTab('chats');
      } catch (err) {
        console.error('Failed to submit contact ticket:', err);
      }
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || isSendingReply) return;

    setIsSendingReply(true);
    try {
      const data = await api.post(`/contact/ticket/${activeTicket}/reply`, {
        text: replyText
      });
      setActiveTicketData(data);
      setReplyText('');
    } catch (err) {
      console.error('Failed to send reply message:', err);
    } finally {
      setIsSendingReply(false);
    }
  };

  const contactOptions = [
    {
      icon: <MapPin size={22} />,
      title: "Our Campus Location",
      details: "Aditya College of Engineering & Technology, Surampalem, ADB Road, East Godavari District, Andhra Pradesh, India - 533437."
    },
    {
      icon: <Phone size={22} />,
      title: "Telephone Support",
      details: "+91 8792714127 (Mon-Sat, 9AM-5PM IST)"
    },
    {
      icon: <Mail size={22} />,
      title: "Official Email Enquiries",
      details: "dipendra@steptrendy.com"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M12.012 1.985c-5.529 0-10.026 4.497-10.026 10.026 0 1.767.46 3.427 1.264 4.887l-1.343 4.903 5.022-1.317c1.402.763 3.003 1.197 4.71 1.197 5.529 0 10.026-4.497 10.026-10.026 0-5.529-4.497-10.026-10.026-10.026zm5.54 14.288c-.219.614-1.286 1.117-1.778 1.18-.342.044-.789.078-1.286-.08-3.155-1.002-5.187-4.148-5.345-4.36-.157-.212-1.264-1.685-1.264-3.21 0-1.526.789-2.278 1.073-2.583.284-.305.614-.383.82-.383.206 0 .411.001.59.01.183.009.43.006.671.58.252.597.859 2.086.934 2.238.075.152.124.329.025.529-.1.2-.249.329-.395.503-.146.173-.306.386-.131.691.176.305.779 1.28 1.67 2.072 1.15 1.025 2.115 1.343 2.417 1.493.303.15.48.125.66-.082.179-.208.779-.905.986-1.212.207-.306.413-.257.697-.151.284.106 1.798.847 2.109.996.311.149.518.223.593.351.075.128.075.742-.144 1.356z" />
        </svg>
      ),
      title: "WhatsApp Chat Support",
      details: (
        <a href="https://wa.me/918792714127" target="_blank" rel="noreferrer" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>
          Launch WhatsApp Chat (+91 8792714127)
        </a>
      )
    }
  ];

  return (
    <div style={{ padding: '60px 0 80px 0' }} className="animate-fade-in-up">
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Contact Us</h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
            Reach out to our project developers, college administration, or technical support desk.
          </p>
        </div>

        <div className="grid-2" style={{ gap: '40px' }}>
          {/* Info Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Communication Desks</h2>
            
            {contactOptions.map((opt, idx) => (
              <GlassCard key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'var(--primary-blue-glow)',
                  color: 'var(--primary-blue)',
                  flexShrink: 0
                }}>
                  {opt.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '4px' }}>{opt.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {opt.details}
                  </p>
                </div>
              </GlassCard>
            ))}

            {/* Quick FAQs panel */}
            <GlassCard style={{ marginTop: '12px', borderLeft: '4px solid var(--accent-teal)' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                <HelpCircle size={18} style={{ color: 'var(--accent-teal)' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Student Project Enquiries</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                This is an academic development submission by students of ACFET. For source requests or institutional queries, contact the development leads via email.
              </p>
            </GlassCard>
          </div>

          {/* Tabbed Communication Panel */}
          <GlassCard style={{ padding: '30px', display: 'flex', flexDirection: 'column', minHeight: '520px' }}>
            
            {/* Tabs Navigation */}
            {!activeTicket && (
              <div style={{
                display: 'flex',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                padding: '4px',
                border: '1px solid var(--glass-border)',
                marginBottom: '24px'
              }}>
                <button
                  onClick={() => setActiveTab('new')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    borderRadius: '6px',
                    background: activeTab === 'new' ? 'var(--primary-blue-glow)' : 'transparent',
                    color: activeTab === 'new' ? 'var(--primary-blue)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Send size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  Submit Ticket
                </button>
                <button
                  onClick={() => setActiveTab('chats')}
                  style={{
                    flex: 1,
                    padding: '10px',
                    border: 'none',
                    borderRadius: '6px',
                    background: activeTab === 'chats' ? 'var(--primary-blue-glow)' : 'transparent',
                    color: activeTab === 'chats' ? 'var(--primary-blue)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <MessageSquare size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
                  My Support Chats ({tickets.length})
                </button>
              </div>
            )}

            {/* TAB CONTENT: SUBMIT TICKET FORM */}
            {!activeTicket && activeTab === 'new' && (
              <div className="animate-fade-in-up">
                <h2 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>Send Support Ticket</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
                  Fill in your details and we will direct your message to the appropriate handler.
                </p>

                {sent ? (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid var(--success-green)',
                    color: 'var(--success-green)',
                    padding: '16px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontWeight: 600,
                    marginTop: '20px'
                  }}>
                    Support Request Submitted! Opening chat portal...
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={form.name} 
                        onChange={e => setForm({...form, name: e.target.value})}
                        required 
                        placeholder="E.g. Praveen Kumar"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        value={form.email} 
                        onChange={e => setForm({...form, email: e.target.value})}
                        required 
                        placeholder="E.g. praveen@gmail.com"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Subject</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={form.subject} 
                        onChange={e => setForm({...form, subject: e.target.value})}
                        required 
                        placeholder="E.g. Alarm schedule issue"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: '24px' }}>
                      <label className="form-label">Message</label>
                      <textarea 
                        className="form-control" 
                        rows="4" 
                        value={form.message} 
                        onChange={e => setForm({...form, message: e.target.value})}
                        required 
                        placeholder="Type details of your inquiry..."
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
                      Submit Ticket
                      <Send size={16} />
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB CONTENT: MY SUPPORT CHATS LIST */}
            {!activeTicket && activeTab === 'chats' && (
              <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '6px' }}>Active Support Tickets</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
                  Select an inquiry thread below to converse with our administrators in real time.
                </p>

                {tickets.length === 0 ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flex: 1,
                    color: 'var(--text-secondary)',
                    padding: '40px 0',
                    textAlign: 'center'
                  }}>
                    <MessageSquare size={36} style={{ marginBottom: '12px', opacity: 0.4 }} />
                    <span style={{ fontSize: '0.9rem' }}>No support chats registered on this browser.</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
                    {tickets.map(ticket => (
                      <div
                        key={ticket.id}
                        onClick={() => setActiveTicket(ticket.id)}
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: '8px',
                          padding: '14px 16px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary-blue)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                      >
                        <div style={{ minWidth: 0, flex: 1, marginRight: '16px' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {ticket.subject}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={10} />
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span style={{
                          background: 'var(--primary-blue-glow)',
                          color: 'var(--primary-blue)',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '12px'
                        }}>
                          Open Chat
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TICKETING ACTIVE CHAT WINDOW */}
            {activeTicket && (
              <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                
                {/* Chat Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderBottom: '1px solid var(--glass-border)',
                  paddingBottom: '14px',
                  marginBottom: '16px'
                }}>
                  <button
                    onClick={() => setActiveTicket(null)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px'
                    }}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {activeTicketData ? activeTicketData.subject : 'Loading Ticket...'}
                    </h3>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
                      Ticket ID: #{activeTicket.substring(activeTicket.length - 8)}
                    </span>
                  </div>
                  {activeTicketData && (
                    <span style={{
                      background: activeTicketData.status === 'replied' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: activeTicketData.status === 'replied' ? 'var(--success-green)' : 'var(--warning-orange)',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      textTransform: 'uppercase'
                    }}>
                      {activeTicketData.status === 'replied' ? 'Replied' : 'Pending'}
                    </span>
                  )}
                </div>

                {/* Chat Message Scroll List */}
                <div style={{
                  flex: 1,
                  maxHeight: '340px',
                  overflowY: 'auto',
                  background: 'rgba(0,0,0,0.15)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  marginBottom: '16px',
                  border: '1px solid var(--glass-border)'
                }}>
                  {/* Original Inquiry Message */}
                  {activeTicketData && (
                    <div style={{
                      alignSelf: 'flex-start',
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      maxWidth: '85%'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                        <User size={12} style={{ color: 'var(--text-light)' }} />
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)' }}>{activeTicketData.name} (Original Inquiry)</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                        {activeTicketData.message}
                      </p>
                      <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-light)', marginTop: '6px', textAlign: 'right' }}>
                        {new Date(activeTicketData.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  )}

                  {/* Thread Replies */}
                  {activeTicketData && activeTicketData.replies && activeTicketData.replies.map((reply, i) => {
                    const isAdmin = reply.sender === 'admin';
                    return (
                      <div
                        key={i}
                        style={{
                          alignSelf: isAdmin ? 'flex-start' : 'flex-end',
                          background: isAdmin ? 'rgba(29, 78, 216, 0.15)' : 'var(--primary-blue-glow)',
                          border: isAdmin ? '1px solid rgba(29, 78, 216, 0.3)' : '1px solid rgba(59, 130, 246, 0.25)',
                          borderRadius: '12px',
                          padding: '10px 14px',
                          maxWidth: '85%'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          {isAdmin ? (
                            <>
                              <Shield size={11} style={{ color: 'var(--primary-blue)' }} />
                              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-blue)' }}>MedTrack Staff</span>
                            </>
                          ) : (
                            <>
                              <User size={11} style={{ color: 'var(--text-light)' }} />
                              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-light)' }}>Me</span>
                            </>
                          )}
                        </div>
                        <p style={{ fontSize: '0.85rem', margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.4', color: 'var(--text-primary)' }}>
                          {reply.text}
                        </p>
                        <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--text-light)', marginTop: '4px', textAlign: 'right' }}>
                          {new Date(reply.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                {/* Reply Form Footer */}
                <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type follow-up message..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    required
                    style={{ flex: 1, borderRadius: '8px', padding: '10px 14px' }}
                    disabled={isSendingReply}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: '0 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    disabled={isSendingReply || !replyText.trim()}
                  >
                    <Send size={16} />
                  </button>
                </form>

              </div>
            )}

          </GlassCard>
        </div>

      </div>
    </div>
  );
};

export default Contact;
