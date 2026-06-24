import React, { useState, useEffect, useRef, useCallback } from 'react';
import PptxGenJS from 'pptxgenjs';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { 
  Play, Pause, ChevronLeft, ChevronRight, Maximize2, Minimize2, 
  Layout, Shield, Users, UserCheck, Calendar, Bell, FileText, 
  Download, Search, ShieldCheck, Cpu, Monitor, Phone, Info, Award, 
  CheckCircle2, Clock, Plus, Edit3, Trash2, X, Save, Image, Type
} from 'lucide-react';

/* ── Slides Content Data (18 Slides) ──────────────────────────────── */
const slidesData = [
  {
    id: 1,
    title: 'ACET MEDTRACK',
    subtitle: 'Smart Healthcare Management System',
    photoPrompt: 'Futuristic healthcare technology dashboard, doctor using tablet, digital heartbeat lines, holographic medical interface, premium blue lighting, modern hospital environment',
    imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=800&q=80',
    keyPoints: [
      'ACET MEDTRACK',
      'Healthcare Management System',
      'Digital Health Platform',
      'Student Innovation Project',
      'Smart Healthcare Solution'
    ],
    explanation: 'ACET MEDTRACK is a healthcare management platform developed by ACET students. It helps patients, doctors, parents, and administrators manage healthcare services digitally. The system aims to make healthcare safer, smarter, and more accessible.',
    accent: '#1d4ed8',
    type: 'cover'
  },
  {
    id: 1.5,
    title: 'Meet Our Team',
    subtitle: 'The Student Engineers Behind ACET MEDTRACK',
    photoPrompt: 'Professional student development team standing confidently in modern tech workspace',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    keyPoints: [
      'Dipendra Upadhayay',
      'Prince Yadav',
      'Manish Bishwakarma',
      'Pravej Hawari',
      'Prash Yadav & Deepak Lodh'
    ],
    explanation: 'ACET MEDTRACK was built by a passionate team of engineering students at Aditya College of Engineering & Technology. Each member brought their unique skills in development, design, and management to create this innovative healthcare platform.',
    accent: '#1d4ed8',
    type: 'team'
  },
  {
    id: 2,
    title: 'Problem Statement',
    subtitle: 'Challenges in Traditional Healthcare',
    photoPrompt: 'Patient confused with medicine schedules, paperwork, missed appointments, hospital documents scattered on desk',
    imageUrl: 'https://images.unsplash.com/photo-1584515901367-f1c2a1cf553f?auto=format&fit=crop&w=800&q=80',
    keyPoints: [
      'Missed Medicine Doses',
      'Lost Medical Records',
      'Appointment Difficulties',
      'Lack of Monitoring',
      'Paper-Based System'
    ],
    explanation: 'Many patients forget medicines and misplace important medical records. Booking appointments can also be time-consuming. Traditional healthcare systems lack proper digital monitoring and management.',
    accent: '#ef4444',
    type: 'problem'
  },
  {
    id: 3,
    title: 'Objectives',
    subtitle: 'Our Goals & Target Outcomes',
    photoPrompt: 'Digital healthcare transformation, doctor and patient using smart medical application',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    keyPoints: [
      'Digital Healthcare',
      'Easy Record Management',
      'Medicine Tracking',
      'Parent Monitoring',
      'Better Patient Care'
    ],
    explanation: 'The main objective is to create a centralized healthcare platform. It improves record management and medicine adherence. The system enhances healthcare accessibility and efficiency.',
    accent: '#10b981',
    type: 'list'
  },
  {
    id: 4,
    title: 'Proposed Solution',
    subtitle: 'The ACET MEDTRACK Approach',
    photoPrompt: 'Modern healthcare platform dashboard displayed on laptop and smartphone',
    imageUrl: 'https://images.unsplash.com/photo-1504813184591-01552ff75805?auto=format&fit=crop&w=800&q=80',
    keyPoints: [
      'One Integrated Platform',
      'Secure Data Storage',
      'Appointment Management',
      'Medicine Reminders',
      'Parent Access'
    ],
    explanation: 'ACET MEDTRACK provides a complete healthcare solution. Users can manage records, appointments, and medicines from one platform. The system also allows parents to monitor patient progress.',
    accent: '#06b6d4',
    type: 'grid'
  },
  {
    id: 5,
    title: 'System Architecture',
    subtitle: 'Secure & Modular Architecture',
    photoPrompt: 'Cloud server network, database architecture, API connections, futuristic technology diagram',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    keyPoints: [
      'React + Vite',
      'Node.js Backend',
      'Express API',
      'MongoDB Database',
      'JWT Security'
    ],
    explanation: 'The platform uses modern web technologies for high performance. React and Vite power the frontend while Node.js handles backend operations. MongoDB stores data securely with JWT authentication.',
    accent: '#8b5cf6',
    type: 'architecture'
  },
  {
    id: 6,
    title: 'User Roles',
    subtitle: 'Multi-User Authorization Control',
    photoPrompt: 'Four healthcare users representing Patient, Parent, Doctor, and Administrator',
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
    keyPoints: [
      'Patient',
      'Parent',
      'Doctor',
      'Admin',
      'Role-Based Access'
    ],
    explanation: 'Each user type has specific permissions and responsibilities. Patients manage health records, doctors provide treatment, parents monitor progress, and admins oversee the system. This ensures security and proper access control.',
    accent: '#f59e0b',
    type: 'roles'
  },
  {
    id: 7,
    title: 'Patient Dashboard',
    subtitle: 'Personalized Health Management Hub',
    photoPrompt: 'Professional healthcare dashboard showing prescriptions, records, appointments and analytics',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    keyPoints: [
      'Medical Records',
      'Prescriptions',
      'Medicine Tracker',
      'Reports',
      'Appointments'
    ],
    explanation: 'Patients can store and access their health information digitally. The dashboard provides quick access to medicines, prescriptions, and appointments. It serves as a personal healthcare center.',
    accent: '#1d4ed8',
    type: 'dashboard'
  },
  {
    id: 8,
    title: 'Medicine Alarm System',
    subtitle: 'Smart Schedule & Notifications',
    photoPrompt: 'Smartphone displaying medicine reminder alarm with notification and medicine bottle',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    keyPoints: [
      'Alarm Notification',
      'Dose Reminder',
      'Missed Dose Tracking',
      'Custom Alarm Tunes',
      'Daily Schedule'
    ],
    explanation: 'The medicine alarm system reminds patients to take medicines on time. Alerts include sounds and notifications. This feature improves medication adherence and health outcomes.',
    accent: '#e11d48',
    type: 'alarm'
  },
  {
    id: 9,
    title: 'Parent Access System',
    subtitle: 'Remote Family Supervision & Care',
    photoPrompt: 'Parent monitoring patient\'s healthcare data securely through mobile application',
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
    keyPoints: [
      'Secure Login',
      'Health Monitoring',
      'Prescription Access',
      'Appointment Tracking',
      'Notifications'
    ],
    explanation: 'Patients can provide access credentials to parents. Parents can monitor treatment progress and medicine schedules. This increases support and accountability in healthcare management.',
    accent: '#10b981',
    type: 'list'
  },
  {
    id: 10,
    title: 'Doctor Panel',
    subtitle: 'Clinical Record & Diagnostics Panel',
    photoPrompt: 'Doctor reviewing patient reports on tablet in modern clinic',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
    keyPoints: [
      'Appointment Management',
      'Patient Records',
      'Prescriptions',
      'Treatment Plans',
      'Profile Management'
    ],
    explanation: 'Doctors can manage consultations and patient records efficiently. They can create prescriptions and update treatment plans digitally. This reduces paperwork and improves healthcare delivery.',
    accent: '#6366f1',
    type: 'list'
  },
  {
    id: 11,
    title: 'Admin Dashboard',
    subtitle: 'System Operations & Quality Control',
    photoPrompt: 'Business analytics dashboard with healthcare charts and management statistics',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    keyPoints: [
      'User Management',
      'Analytics',
      'Reports',
      'Doctor Approval',
      'System Monitoring'
    ],
    explanation: 'The admin dashboard controls the entire platform. Administrators can manage users, monitor activities, and generate reports. It ensures smooth and secure operation of the system.',
    accent: '#ec4899',
    type: 'dashboard'
  },
  {
    id: 12,
    title: 'Key Features',
    subtitle: 'Value Proposition & Capabilities',
    photoPrompt: 'Healthcare feature icons arranged in modern technology layout',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    keyPoints: [
      'Medicine Alarm',
      'Digital Records',
      'Parent Access',
      'Online Appointments',
      'Real-Time Notifications'
    ],
    explanation: 'ACET MEDTRACK combines multiple healthcare features into one platform. These features improve convenience and efficiency. Users receive a seamless healthcare experience.',
    accent: '#06b6d4',
    type: 'grid'
  },
  {
    id: 13,
    title: 'Security Features',
    subtitle: 'Industry-Grade Security Layer',
    photoPrompt: 'Cybersecurity shield protecting healthcare data with encrypted digital network',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    keyPoints: [
      'JWT Authentication',
      'Password Encryption',
      'Secure APIs',
      'Data Protection',
      'Access Control'
    ],
    explanation: 'Patient information is highly sensitive and requires strong protection. Security features prevent unauthorized access and data breaches. The platform follows modern cybersecurity practices.',
    accent: '#f43f5e',
    type: 'security'
  },
  {
    id: 14,
    title: 'Technology Stack',
    subtitle: 'The Engineering Ecosystem',
    photoPrompt: 'React, Node.js, MongoDB, Express, JWT technology ecosystem visualization',
    imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=800&q=80',
    keyPoints: [
      'React.js',
      'Vite',
      'Node.js',
      'Express.js',
      'MongoDB'
    ],
    explanation: 'Modern technologies ensure high performance and scalability. The chosen stack supports secure and responsive web applications. It is suitable for healthcare management systems.',
    accent: '#8b5cf6',
    type: 'tech'
  },
  {
    id: 15,
    title: 'Website Demonstration',
    subtitle: 'High Fidelity Application Tour',
    photoPrompt: 'Premium website UI screens including home page, patient panel, doctor panel, admin panel',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    keyPoints: [
      'Home Page',
      'Patient Panel',
      'Doctor Panel',
      'Admin Dashboard',
      'Mobile Responsive Design'
    ],
    explanation: 'This slide showcases the website interface and functionality. Users can see how each panel works. The design is responsive and user-friendly across all devices.',
    accent: '#14b8a6',
    type: 'demo'
  },
  {
    id: 16,
    title: 'Future Scope',
    subtitle: 'Next-Generation Health Innovation',
    photoPrompt: 'AI healthcare assistant, telemedicine, wearable devices, futuristic hospital technology',
    imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80',
    keyPoints: [
      'AI Health Assistant',
      'Telemedicine',
      'Mobile App',
      'Smart Analytics',
      'Wearable Integration'
    ],
    explanation: 'Future versions will include advanced healthcare technologies. AI and telemedicine will improve patient support. Mobile applications will increase accessibility and convenience.',
    accent: '#f59e0b',
    type: 'timeline'
  },
  {
    id: 17,
    title: 'Team Members',
    subtitle: 'The Engineering Team behind Medtrack',
    photoPrompt: 'Professional student team standing confidently in modern technology workspace',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    keyPoints: [
      'Dipendra Upadhayay',
      'Prince Yadav',
      'Manish Bishwakarma',
      'Pravej Hawari',
      'Prash Yadav & Deepak Lodh'
    ],
    explanation: 'The project was developed by a dedicated student team. Each member contributed in development, design, database management, and marketing. Teamwork played a key role in the project\'s success.',
    accent: '#1d4ed8',
    type: 'team'
  },
  {
    id: 18,
    title: 'Conclusion & Thank You',
    subtitle: 'Your Health, Our Priority',
    photoPrompt: 'Modern healthcare technology background with glowing heartbeat line and hospital skyline',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    keyPoints: [
      'Smart Healthcare',
      'Digital Innovation',
      'Improved Patient Care',
      'Future Ready Solution',
      'Thank You'
    ],
    explanation: 'ACET MEDTRACK transforms traditional healthcare management into a digital experience. It improves patient care, accessibility, and efficiency. Thank you for your valuable time and attention.',
    accent: '#ef4444',
    type: 'thankyou'
  }
];

const teamDetails = [
  { name: 'Dipendra Upadhayay', role: 'Backend & Frontend Developer', badge: 'Fullstack Lead' },
  { name: 'Prince Yadav', role: 'UI/UX Designer', badge: 'Creative Lead' },
  { name: 'Manish Bishwakarma', role: 'Database Handler', badge: 'Data Architect' },
  { name: 'Pravej Hawari', role: 'Database Handler', badge: 'Data Security' },
  { name: 'Prash Yadav', role: 'Database Handler', badge: 'Systems Engineer' },
  { name: 'Deepak Lodh', role: 'Marketing Handler', badge: 'Community Outreach' }
];

/* ── Empty Slide Template ─────────────────────────────────── */
const EMPTY_SLIDE = {
  id: Date.now(),
  title: 'New Slide',
  subtitle: 'Subtitle here',
  photoPrompt: '',
  imageUrl: '',
  keyPoints: ['Point 1', 'Point 2', 'Point 3'],
  explanation: 'Explanation text for this slide.',
  accent: '#1d4ed8',
  type: 'list',
  backgroundColor: '#ffffff',
  textColor: '#1e293b',
  titleColor: '#1d4ed8',
  subtitleColor: '#d97706',
  fontFamily: 'Poppins'
};

export default function Presentation() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const [slides, setSlides] = useState(slidesData); // fallback to static until loaded
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [transitionDir, setTransitionDir] = useState('next');
  const presentationRef = useRef(null);
  const timerRef = useRef(null);

  // Edit Modal State
  const [editModal, setEditModal] = useState(null); // null | { mode: 'edit'|'add', slide: {...}, _id: string|null }
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [downloadingPptx, setDownloadingPptx] = useState(false);

  /* ── Fetch slides from API ─────────────────── */
  const loadSlides = useCallback(async () => {
    try {
      const data = await api.get('/slides');
      if (data && data.length > 0) {
        setSlides(data.sort((a, b) => a.id - b.id));
      }
    } catch (err) {
      console.warn('Could not load slides from API, using static data:', err);
    }
  }, []);

  useEffect(() => { loadSlides(); }, [loadSlides]);

  /* ── Edit Handlers ─────────────────────────── */
  const openEditModal = (mode) => {
    if (mode === 'add') {
      setEditModal({ mode: 'add', slide: { ...EMPTY_SLIDE, id: slides.length + 2 }, _id: null });
    } else {
      const s = slides[currentSlide];
      setEditModal({ mode: 'edit', slide: { ...s, keyPoints: [...(s.keyPoints || [])] }, _id: s._id || null });
    }
    setEditError('');
  };

  const closeEditModal = () => { setEditModal(null); setEditError(''); };

  const handleEditField = (field, value) => {
    setEditModal(prev => ({ ...prev, slide: { ...prev.slide, [field]: value } }));
  };

  const handleEditKeyPoint = (idx, value) => {
    const updated = [...editModal.slide.keyPoints];
    updated[idx] = value;
    setEditModal(prev => ({ ...prev, slide: { ...prev.slide, keyPoints: updated } }));
  };

  const addKeyPoint = () => {
    if (editModal.slide.keyPoints.length >= 8) return;
    setEditModal(prev => ({ ...prev, slide: { ...prev.slide, keyPoints: [...prev.slide.keyPoints, ''] } }));
  };

  const removeKeyPoint = (idx) => {
    if (editModal.slide.keyPoints.length <= 1) return;
    setEditModal(prev => ({ ...prev, slide: { ...prev.slide, keyPoints: prev.slide.keyPoints.filter((_, i) => i !== idx) } }));
  };

  const saveSlide = async () => {
    setEditSaving(true);
    setEditError('');
    try {
      const payload = { ...editModal.slide };
      if (editModal.mode === 'add') {
        await api.post('/slides', payload);
      } else {
        await api.put(`/slides/${editModal._id}`, payload);
      }
      await loadSlides();
      closeEditModal();
    } catch (err) {
      setEditError(err.message || 'Failed to save slide');
    } finally {
      setEditSaving(false);
    }
  };

  const deleteSlide = async () => {
    if (!window.confirm('Delete this slide permanently?')) return;
    try {
      await api.delete(`/slides/${slides[currentSlide]._id}`);
      setCurrentSlide(prev => Math.max(0, prev - 1));
      await loadSlides();
    } catch (err) {
      alert('Failed to delete slide');
    }
  };

  /* ── PPTX Download ─────────────────────────── */
  const downloadAsPptx = async () => {
    setDownloadingPptx(true);
    try {
      const pptx = new PptxGenJS();
      pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 inches (16:9)
      pptx.author = 'ACET MEDTRACK';
      pptx.company = 'Aditya College of Engineering & Technology';
      pptx.title = 'ACET MEDTRACK Presentation';

      slides.forEach((slide, idx) => {
        const pSlide = pptx.addSlide();
        const bg = slide.backgroundColor || '#ffffff';
        const titleClr = (slide.titleColor || '#1d4ed8').replace('#', '');
        const subClr = (slide.subtitleColor || '#d97706').replace('#', '');
        const txtClr = (slide.textColor || '#1e293b').replace('#', '');
        const accentClr = (slide.accent || '#1d4ed8').replace('#', '');
        const font = slide.fontFamily || 'Poppins';

        // White background
        pSlide.background = { color: bg.replace('#', '') };

        // College header banner
        pSlide.addShape(pptx.ShapeType.rect, {
          x: 0, y: 0, w: '100%', h: 0.45,
          fill: { color: '1d4ed8' },
          line: { type: 'none' }
        });
        pSlide.addText('Aditya College of Engineering & Technology', {
          x: 0.3, y: 0.04, w: 9, h: 0.35,
          fontSize: 9, bold: true, color: 'FFFFFF', fontFace: font
        });
        pSlide.addText(`Slide ${idx + 1} of ${slides.length}`, {
          x: 9.5, y: 0.04, w: 3, h: 0.35,
          fontSize: 8, color: 'FFFFFF', align: 'right', fontFace: font
        });

        // ACET MEDTRACK logo text at top right  
        pSlide.addText('ACET MEDTRACK', {
          x: 9.5, y: 0.04, w: 3.3, h: 0.35,
          fontSize: 9, bold: true, color: 'FFFFFF', align: 'right', fontFace: font
        });

        // Slide title
        pSlide.addText(slide.title, {
          x: 0.5, y: 0.7, w: 12.3, h: 1.0,
          fontSize: 36, bold: true, color: titleClr, fontFace: font,
          align: 'left'
        });

        // Slide subtitle (yellow)
        if (slide.subtitle) {
          pSlide.addText(slide.subtitle, {
            x: 0.5, y: 1.55, w: 12.3, h: 0.5,
            fontSize: 16, bold: true, color: subClr, fontFace: font,
            align: 'left'
          });
        }

        // Explanation paragraph
        if (slide.explanation) {
          pSlide.addText(slide.explanation, {
            x: 0.5, y: 2.15, w: 7.5, h: 1.5,
            fontSize: 11, color: txtClr, fontFace: font,
            italic: true, wrap: true, valign: 'top'
          });
        }

        // Key Points as a two-column bullet list
        if (slide.keyPoints && slide.keyPoints.length > 0) {
          slide.keyPoints.forEach((pt, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            pSlide.addShape(pptx.ShapeType.rect, {
              x: 0.5 + col * 4.0, y: 3.8 + row * 0.7, w: 3.7, h: 0.55,
              fill: { color: accentClr, transparency: 85 },
              line: { color: accentClr, pt: 1 },
              rounding: true
            });
            pSlide.addText(`• ${pt}`, {
              x: 0.6 + col * 4.0, y: 3.82 + row * 0.7, w: 3.5, h: 0.5,
              fontSize: 11, bold: true, color: accentClr, fontFace: font
            });
          });
        }

        // Add image if available (right side)
        if (slide.imageUrl && slide.type !== 'thankyou') {
          try {
            pSlide.addImage({
              path: slide.imageUrl,
              x: 8.4, y: 0.7, w: 4.5, h: 3.8,
              rounding: true,
              sizing: { type: 'cover', w: 4.5, h: 3.8 }
            });
          } catch (_) {}
        }

        // Footer divider line
        pSlide.addShape(pptx.ShapeType.line, {
          x: 0.3, y: 7.1, w: 12.7, h: 0,
          line: { color: 'e2e8f0', pt: 1 }
        });
        pSlide.addText('ACET MEDTRACK — Healthcare Management System', {
          x: 0.3, y: 7.15, w: 9, h: 0.3,
          fontSize: 7.5, color: '94a3b8', fontFace: font
        });
      });

      await pptx.writeFile({ fileName: 'ACET_MEDTRACK_Presentation.pptx' });
    } catch (err) {
      console.error('PPTX download error:', err);
      alert('Error downloading presentation. Please try again.');
    } finally {
      setDownloadingPptx(false);
    }
  };

  const goToSlide = useCallback((newIndex, dir = 'next') => {
    setTransitionDir(dir);
    setTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(newIndex);
      setTransitioning(false);
    }, 320);
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % slidesData.length, 'next');
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + slidesData.length) % slidesData.length, 'prev');
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTransitioning(true);
        setTransitionDir('next');
        setTimeout(() => {
          setCurrentSlide((prev) => {
            const next = (prev + 1) % slidesData.length;
            return next;
          });
          setTransitioning(false);
        }, 320);
      }, 6000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const toggleFullscreen = () => {
    if (!fullscreen) {
      if (presentationRef.current.requestFullscreen) {
        presentationRef.current.requestFullscreen();
      }
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setFullscreen(false);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const slide = slides[currentSlide] || slidesData[currentSlide];

  // Helper to render slide content layouts based on slide type
  const renderSlideContent = () => {
    switch (slide.type) {
      case 'cover':
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '40px',
            height: '100%',
            alignItems: 'center',
            animation: 'fadeIn 1s ease'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
              <div style={{
                background: '#eff6ff',
                padding: '16px',
                borderRadius: '50%',
                border: '2px dashed #1d4ed8',
                animation: 'pulse 3s infinite',
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 'fit-content'
              }}>
                {/* Floating Heartbeat SVG animation */}
                <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                  <path d="M10 50 H30 L40 20 L50 80 L60 40 L70 55 L75 50 H90" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              
              <div>
                <h1 style={{
                  fontSize: '4rem',
                  fontWeight: 900,
                  letterSpacing: '-2px',
                  color: '#1d4ed8',
                  marginBottom: '10px'
                }}>{slide.title}</h1>
                <p style={{
                  fontSize: '1.8rem',
                  color: '#d97706',
                  fontWeight: 600
                }}>{slide.subtitle}</p>
              </div>

              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginTop: '8px'
              }}>
                {slide.keyPoints.slice(1).map((pt, index) => (
                  <span key={index} style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    padding: '8px 18px',
                    borderRadius: '50px',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    color: '#1d4ed8'
                  }}>{pt}</span>
                ))}
              </div>

              <p style={{
                maxWidth: '750px',
                fontSize: '1.1rem',
                lineHeight: '1.7',
                color: '#1e293b',
                marginTop: '10px',
                fontStyle: 'italic'
              }}>{slide.explanation}</p>
            </div>

            {/* Right Side Cover Photo */}
            <div style={{
              height: '100%',
              minHeight: '380px',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 15px 35px rgba(0,0,0,0.06)'
            }}>
              <img 
                src={slide.imageUrl} 
                alt={slide.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        );

      case 'problem':
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '40px',
            height: '100%',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '50px',
                background: 'rgba(239, 68, 68, 0.08)',
                color: '#ef4444',
                fontSize: '0.85rem',
                fontWeight: 600,
                width: 'fit-content'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}></span>
                Systemic Issues Detected
              </div>
              <h2 style={{ fontSize: '3rem', fontWeight: 850, color: '#1d4ed8' }}>{slide.title}</h2>
              <p style={{ fontSize: '1.2rem', color: '#1e293b', lineHeight: '1.6' }}>{slide.explanation}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                {slide.keyPoints.map((pt, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#fef2f2',
                    border: '1px solid #fca5a5',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    transition: 'all 0.3s'
                  }}>
                    <span style={{ color: '#ef4444', fontWeight: 800 }}>0{i+1}</span>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Real Unsplash image for Problem Statement */}
            <div style={{
              height: '100%',
              minHeight: '350px',
              borderRadius: '24px',
              border: '1px solid #cbd5e1',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
            }}>
              <img 
                src={slide.imageUrl} 
                alt={slide.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        );

      case 'architecture':
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            gap: '30px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 850, color: '#1d4ed8' }}>{slide.title}</h2>
              <p style={{ color: '#d97706', fontSize: '1.2rem', fontWeight: 600 }}>{slide.subtitle}</p>
            </div>

            {/* Architectural Nodes Visual Flow */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              padding: '20px 0'
            }}>
              {[
                { name: 'React + Vite', detail: 'Frontend SPA Client', color: '#0284c7' },
                { name: 'Express API', detail: 'REST Routing layer', color: '#7c3aed' },
                { name: 'Node.js runtime', detail: 'App engine backend', color: '#16a34a' },
                { name: 'MongoDB', detail: 'NoSQL storage database', color: '#ea580c' },
                { name: 'JWT Secure token', detail: 'Role-based sessions', color: '#dc2626' }
              ].map((node, i) => (
                <React.Fragment key={i}>
                  <div style={{
                    background: '#f8fafc',
                    border: `2px solid ${node.color}`,
                    borderRadius: '16px',
                    padding: '20px',
                    width: '180px',
                    textAlign: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ fontWeight: 800, color: node.color, marginBottom: '6px', fontSize: '1.1rem' }}>{node.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 500 }}>{node.detail}</div>
                  </div>
                  {i < 4 && (
                    <div style={{ color: '#cbd5e1', fontSize: '1.5rem', fontWeight: 900 }}>→</div>
                  )}
                </React.Fragment>
              ))}
            </div>

            <p style={{
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'center',
              lineHeight: '1.8',
              color: '#1e293b',
              fontSize: '1.05rem',
              fontWeight: 500
            }}>{slide.explanation}</p>
          </div>
        );

      case 'roles':
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            gap: '30px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 850, color: '#1d4ed8' }}>{slide.title}</h2>
              <p style={{ color: '#d97706', fontSize: '1.2rem', fontWeight: 600 }}>{slide.subtitle}</p>
            </div>

            {/* Grid of Roles */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px'
            }}>
              {[
                { name: 'Patient', desc: 'Schedules medicine alerts, uploads diagnostics reports, books slots.', icon: '🩺', badge: 'End User', color: '#1d4ed8' },
                { name: 'Parent', desc: 'Linked access to view records, monitor medicine alarms & logs.', icon: '👨‍👩‍👧', badge: 'Supervisor', color: '#16a34a' },
                { name: 'Doctor', desc: 'Reviews patient metrics, updates prescriptions, schedules treatment.', icon: '👨‍⚕️', badge: 'Healthcare Pro', color: '#7c3aed' },
                { name: 'Admin', desc: 'Approves doctors, monitors database audit logs, shop inventory.', icon: '🛡️', badge: 'Controller', color: '#d97706' }
              ].map((role, i) => (
                <div key={i} style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '20px',
                  padding: '24px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ fontSize: '3rem', margin: '0 auto 5px' }}>{role.icon}</div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: role.color }}>{role.name}</h3>
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '3px 10px',
                    borderRadius: '50px',
                    background: `${role.color}15`,
                    color: role.color,
                    width: 'fit-content',
                    margin: '0 auto',
                    fontWeight: 700
                  }}>{role.badge}</span>
                  <p style={{ fontSize: '0.82rem', color: '#334155', lineHeight: '1.5' }}>{role.desc}</p>
                </div>
              ))}
            </div>

            <p style={{
              maxWidth: '850px',
              margin: '0 auto',
              textAlign: 'center',
              lineHeight: '1.8',
              color: '#1e293b',
              fontSize: '1.05rem',
              fontWeight: 500
            }}>{slide.explanation}</p>
          </div>
        );

      case 'dashboard':
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '0.9fr 1.1fr',
            gap: '40px',
            height: '100%',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '50px',
                background: 'rgba(6, 182, 212, 0.08)',
                color: '#0891b2',
                fontSize: '0.85rem',
                fontWeight: 600,
                width: 'fit-content'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0891b2' }}></span>
                System Dashboard View
              </div>
              <h2 style={{ fontSize: '3rem', fontWeight: 850, color: '#1d4ed8' }}>{slide.title}</h2>
              <p style={{ fontSize: '1.15rem', color: '#1e293b', lineHeight: '1.7' }}>{slide.explanation}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
                {slide.keyPoints.map((pt, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    padding: '12px 16px',
                    borderRadius: '12px'
                  }}>
                    <span style={{ color: '#0891b2', fontSize: '1.2rem' }}>✦</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Light themed simulated UI layout */}
            <div style={{
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 15px 35px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></div>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></div>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
                  <span style={{ fontSize: '0.8rem', color: '#475569', marginLeft: '10px', fontWeight: 600 }}>MEDTRACK Portal</span>
                </div>
                <div style={{ background: '#eff6ff', padding: '4px 10px', borderRadius: '50px', fontSize: '0.7rem', color: '#1d4ed8', fontWeight: 800 }}>ACTIVE SESSION</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[
                  { name: 'Prescriptions', count: '14 Active', icon: '📝', color: '#1d4ed8' },
                  { name: 'Next Dose', count: '08:00 AM', icon: '⏰', color: '#dc2626' },
                  { name: 'Lab Reports', count: '03 Loaded', icon: '📁', color: '#16a34a' }
                ].map((item, i) => (
                  <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>{item.icon}</div>
                    <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: item.color, marginTop: '2px' }}>{item.count}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', color: '#1e293b' }}>
                  <span style={{ fontWeight: 600 }}>Dose Adherence Rate</span>
                  <span style={{ color: '#16a34a', fontWeight: 800 }}>96.5%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                  <div style={{ width: '96.5%', height: '100%', background: '#16a34a', borderRadius: '10px' }}></div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'alarm':
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            height: '100%',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '50px',
                background: 'rgba(225, 29, 72, 0.08)',
                color: '#e11d48',
                fontSize: '0.85rem',
                fontWeight: 600,
                width: 'fit-content'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e11d48' }}></span>
                Smart Alarm System
              </div>
              <h2 style={{ fontSize: '3rem', fontWeight: 850, color: '#1d4ed8' }}>{slide.title}</h2>
              <p style={{ fontSize: '1.2rem', color: '#1e293b', lineHeight: '1.7' }}>{slide.explanation}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                {slide.keyPoints.map((pt, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#fff5f5',
                    border: '1px solid #fecaca',
                    padding: '12px 18px',
                    borderRadius: '12px'
                  }}>
                    <span style={{ color: '#e11d48', fontWeight: 800 }}>🔔</span>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Alarm Smartphone Mock (Light Theme) */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '260px',
                height: '480px',
                background: '#ffffff',
                border: '4px solid #cbd5e1',
                borderRadius: '38px',
                padding: '24px 16px',
                boxShadow: '0 15px 40px rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Notch */}
                <div style={{ width: '100px', height: '18px', background: '#cbd5e1', borderRadius: '50px', position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)' }} />

                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                  <div style={{ fontSize: '0.7rem', color: '#e11d48', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>Alert system</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1e293b', marginTop: '8px' }}>08:00 AM</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Thursday, June 24</div>
                </div>

                <div style={{
                  background: '#fff5f5',
                  border: '1px solid #fecaca',
                  borderRadius: '20px',
                  padding: '20px 14px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  alignItems: 'center'
                }}>
                  <div style={{ fontSize: '2.5rem', animation: 'bounce 1s infinite' }}>💊</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#1e293b' }}>Time for Medicine</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Aspirin - 1 Tablet</div>
                  </div>
                  <div style={{
                    width: '100%',
                    padding: '8px 0',
                    background: '#e11d48',
                    color: '#ffffff',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}>Mark Taken</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                  <div style={{ width: '40px', height: '4px', background: '#cbd5e1', borderRadius: '10px' }} />
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            height: '100%',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '50px',
                background: 'rgba(244, 63, 94, 0.08)',
                color: '#f43f5e',
                fontSize: '0.85rem',
                fontWeight: 600,
                width: 'fit-content'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f43f5e' }}></span>
                System Protection Profile
              </div>
              <h2 style={{ fontSize: '3rem', fontWeight: 850, color: '#1d4ed8' }}>{slide.title}</h2>
              <p style={{ fontSize: '1.2rem', color: '#1e293b', lineHeight: '1.7' }}>{slide.explanation}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginTop: '10px' }}>
                {slide.keyPoints.map((pt, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    padding: '12px 18px',
                    borderRadius: '12px'
                  }}>
                    <span style={{ color: '#f43f5e', fontSize: '1.2rem' }}>✓</span>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Real Unsplash image for Security */}
            <div style={{
              height: '100%',
              minHeight: '350px',
              borderRadius: '24px',
              border: '1px solid #cbd5e1',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
            }}>
              <img 
                src={slide.imageUrl} 
                alt={slide.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        );

      case 'tech':
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            gap: '30px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 850, color: '#1d4ed8' }}>{slide.title}</h2>
              <p style={{ color: '#d97706', fontSize: '1.2rem', fontWeight: 600 }}>{slide.subtitle}</p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '20px'
            }}>
              {[
                { name: 'React.js', role: 'UI Components', icon: '⚛️', color: '#0284c7' },
                { name: 'Vite', role: 'Build Tool / Bundler', icon: '⚡', color: '#7c3aed' },
                { name: 'Node.js', role: 'Runtime Engine', icon: '🟢', color: '#16a34a' },
                { name: 'Express.js', role: 'API Router Middleware', icon: '🚀', color: '#475569' },
                { name: 'MongoDB', role: 'Database Storage', icon: '🍃', color: '#15803d' }
              ].map((tech, i) => (
                <div key={i} style={{
                  background: '#f8fafc',
                  border: `2px solid ${tech.color}`,
                  borderRadius: '20px',
                  padding: '24px 16px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ fontSize: '3rem' }}>{tech.icon}</div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: tech.color }}>{tech.name}</h3>
                  <p style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 500 }}>{tech.role}</p>
                </div>
              ))}
            </div>

            <p style={{
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'center',
              lineHeight: '1.8',
              color: '#1e293b',
              fontSize: '1.05rem',
              fontWeight: 500
            }}>{slide.explanation}</p>
          </div>
        );

      case 'demo':
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px',
            height: '100%',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '50px',
                background: 'rgba(20, 184, 166, 0.08)',
                color: '#0d9488',
                fontSize: '0.85rem',
                fontWeight: 600,
                width: 'fit-content'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0d9488' }}></span>
                System Demonstration
              </div>
              <h2 style={{ fontSize: '3rem', fontWeight: 850, color: '#1d4ed8' }}>{slide.title}</h2>
              <p style={{ fontSize: '1.2rem', color: '#1e293b', lineHeight: '1.7' }}>{slide.explanation}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {slide.keyPoints.map((pt, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    padding: '12px 16px',
                    borderRadius: '12px'
                  }}>
                    <span style={{ color: '#0d9488', fontSize: '1.2rem' }}>✦</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Real Unsplash image for Demonstration */}
            <div style={{
              height: '100%',
              minHeight: '350px',
              borderRadius: '24px',
              border: '1px solid #cbd5e1',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
            }}>
              <img 
                src={slide.imageUrl} 
                alt={slide.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            gap: '30px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 850, color: '#1d4ed8' }}>{slide.title}</h2>
              <p style={{ color: '#d97706', fontSize: '1.2rem', fontWeight: 600 }}>{slide.subtitle}</p>
            </div>

            {/* Future scope timeline visual */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '16px',
              position: 'relative',
              padding: '20px 0'
            }}>
              {[
                { title: 'AI Health Assistant', icon: '🤖', desc: 'Predictive diagnostics' },
                { title: 'Telemedicine', icon: '📡', desc: 'Live video consulting' },
                { title: 'Mobile App', icon: '📱', desc: 'Android / iOS systems' },
                { title: 'Smart Analytics', icon: '📊', desc: 'Advanced analytics' },
                { title: 'Wearable Integration', icon: '⌚', desc: 'Biometrics tracking' }
              ].map((item, i) => (
                <div key={i} style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '20px',
                  padding: '20px 14px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ fontSize: '2.2rem' }}>{item.icon}</div>
                  <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#d97706' }}>{item.title}</h4>
                  <p style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 500 }}>{item.desc}</p>
                </div>
              ))}
            </div>

            <p style={{
              maxWidth: '850px',
              margin: '0 auto',
              textAlign: 'center',
              lineHeight: '1.8',
              color: '#1e293b',
              fontSize: '1.05rem',
              fontWeight: 500
            }}>{slide.explanation}</p>
          </div>
        );

      case 'team':
        return (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
            gap: '30px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 850, color: '#1d4ed8' }}>{slide.title}</h2>
              <p style={{ color: '#d97706', fontSize: '1.2rem', fontWeight: 600 }}>{slide.subtitle}</p>
            </div>

            {/* Team Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px'
            }}>
              {teamDetails.map((member, i) => (
                <div key={i} style={{
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.4rem',
                    fontWeight: 'bold',
                    border: '1.5px solid #1d4ed8'
                  }}>
                    {member.name[0]}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1d4ed8' }}>{member.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 500 }}>{member.role}</p>
                    <span style={{
                      fontSize: '0.65rem',
                      background: '#eff6ff',
                      color: '#1d4ed8',
                      padding: '2px 8px',
                      borderRadius: '50px',
                      fontWeight: 700,
                      marginTop: '4px',
                      display: 'inline-block',
                      border: '1px solid #bfdbfe'
                    }}>{member.badge}</span>
                  </div>
                </div>
              ))}
            </div>

            <p style={{
              maxWidth: '850px',
              margin: '0 auto',
              textAlign: 'center',
              lineHeight: '1.8',
              color: '#1e293b',
              fontSize: '1.05rem',
              fontStyle: 'italic',
              fontWeight: 500
            }}>{slide.explanation}</p>
          </div>
        );

      case 'thankyou':
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '40px',
            height: '100%',
            alignItems: 'center',
            animation: 'fadeIn 1s ease'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', textAlign: 'left' }}>
              <div style={{
                background: '#eff6ff',
                padding: '16px',
                borderRadius: '50%',
                border: '2px dashed #1d4ed8',
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 'fit-content'
              }}>
                {/* Pulse Heartbeat SVG */}
                <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                  <path d="M10 50 H30 L40 20 L50 80 L60 40 L70 55 L75 50 H90" stroke="#1d4ed8" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              
              <div>
                <h1 style={{
                  fontSize: '4.5rem',
                  fontWeight: 900,
                  letterSpacing: '-2px',
                  color: '#1d4ed8',
                  marginBottom: '10px'
                }}>{slide.title}</h1>
                <p style={{
                  fontSize: '2rem',
                  color: '#d97706',
                  fontWeight: 600
                }}>{slide.subtitle}</p>
              </div>

              <div style={{
                display: 'flex',
                gap: '16px',
                marginTop: '10px'
              }}>
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '12px 24px', borderRadius: '14px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>COMING SOON ON</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1d4ed8', marginTop: '4px' }}>Google Play Store</div>
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '12px 24px', borderRadius: '14px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>COMING SOON ON</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#7c3aed', marginTop: '4px' }}>Apple App Store</div>
                </div>
              </div>

              <p style={{
                maxWidth: '750px',
                fontSize: '1.1rem',
                lineHeight: '1.7',
                color: '#1e293b',
                marginTop: '10px'
              }}>{slide.explanation}</p>

              <div style={{
                fontSize: '0.9rem',
                color: '#1d4ed8',
                fontWeight: 600
              }}>
                Developed by Students of Aditya College of Engineering & Technology
              </div>
            </div>

            {/* Right Side Thank You Photo */}
            <div style={{
              height: '100%',
              minHeight: '380px',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 15px 35px rgba(0,0,0,0.06)'
            }}>
              <img 
                src={slide.imageUrl} 
                alt={slide.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        );

      default: // Standard layout
        return (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.1fr 0.9fr',
            gap: '40px',
            height: '100%',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 850, color: '#1d4ed8' }}>{slide.title}</h2>
              <p style={{ fontSize: '1.2rem', color: '#1e293b', lineHeight: '1.6' }}>{slide.explanation}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                {slide.keyPoints.map((pt, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#f8fafc',
                    border: '1px solid #cbd5e1',
                    padding: '14px 20px',
                    borderRadius: '14px'
                  }}>
                    <span style={{ color: '#1d4ed8', fontWeight: 'bold', fontSize: '1.2rem' }}>✦</span>
                    <span style={{ fontWeight: 600, color: '#1e293b' }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Real Unsplash image for Standard Slide */}
            <div style={{
              height: '100%',
              minHeight: '350px',
              borderRadius: '24px',
              border: '1px solid #cbd5e1',
              padding: '0px',
              display: 'flex',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
            }}>
              <img 
                src={slide.imageUrl} 
                alt={slide.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <>
    <div 
      ref={presentationRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: fullscreen ? '100vh' : '680px',
        background: '#ffffff',
        color: '#1e293b',
        borderRadius: fullscreen ? '0' : '20px',
        border: fullscreen ? 'none' : '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.06)',
        fontFamily: "'Poppins', 'Inter', sans-serif"
      }}
    >
      {/* Background Star animation grids (soft grey dots on white) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 0)',
        backgroundSize: '24px 24px',
        opacity: 0.8,
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      {/* Slide Navigation Header */}
      <div style={{
        padding: '20px 30px',
        background: 'rgba(248, 250, 252, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        {/* Top Left: Logo + Admin CRUD Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img 
            src="/logo.jpg" 
            alt="ACET Logo" 
            style={{ height: '40px', width: '40px', borderRadius: '8px', border: '1.5px solid #1d4ed8' }} 
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1d4ed8' }}>ACET MEDTRACK</span>
            <span style={{ fontSize: '0.65rem', color: '#1d4ed8', fontWeight: 600 }}>Aditya College of Engineering & Technology</span>
          </div>
          {isAdmin && (
            <div style={{ display: 'flex', gap: '6px', marginLeft: '12px' }}>
              <button onClick={() => openEditModal('edit')} title="Edit Current Slide"
                style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '7px', padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 600, color: '#1d4ed8' }}>
                <Edit3 size={13} /> Edit
              </button>
              <button onClick={() => openEditModal('add')} title="Add New Slide"
                style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '7px', padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 600, color: '#16a34a' }}>
                <Plus size={13} /> Add
              </button>
              <button onClick={deleteSlide} title="Delete Current Slide"
                style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '7px', padding: '5px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 600, color: '#dc2626' }}>
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Top Center: Current Slide Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: '#eff6ff',
            color: '#1d4ed8',
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '4px 10px',
            borderRadius: '50px',
            letterSpacing: '1px',
            border: '1px solid #bfdbfe'
          }}>SLIDE {currentSlide + 1} OF {slidesData.length}</span>
        </div>

        {/* Top Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Download PPTX */}
          <button 
            onClick={downloadAsPptx}
            disabled={downloadingPptx}
            title="Download as PowerPoint (.pptx)"
            style={{
              background: downloadingPptx ? '#f1f5f9' : '#1d4ed8',
              border: 'none',
              padding: '7px 14px',
              borderRadius: '8px',
              color: downloadingPptx ? '#64748b' : '#ffffff',
              cursor: downloadingPptx ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 700
            }}
          >
            <Download size={14} />
            {downloadingPptx ? 'Exporting...' : 'Download PPTX'}
          </button>

          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: isPlaying ? 'rgba(239, 68, 68, 0.1)' : '#f1f5f9',
              border: '1px solid #cbd5e1',
              padding: '6px 12px',
              borderRadius: '8px',
              color: isPlaying ? '#ef4444' : '#1e293b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button 
            onClick={toggleFullscreen}
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              padding: '6px 12px',
              borderRadius: '8px',
              color: '#1e293b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
              fontWeight: 600
            }}
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            Fullscreen
          </button>
        </div>
      </div>

      {/* Main Slide Content Area */}
      <div style={{
        flex: 1,
        padding: '40px 60px',
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: '#ffffff'
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          transition: 'opacity 0.32s ease, transform 0.32s ease',
          opacity: transitioning ? 0 : 1,
          transform: transitioning 
            ? (transitionDir === 'next' ? 'translateX(40px)' : 'translateX(-40px)') 
            : 'translateX(0)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {renderSlideContent()}
        </div>
      </div>

      {/* Bottom Nav Controller */}
      <div style={{
        padding: '20px 30px',
        background: 'rgba(248, 250, 252, 0.95)',
        borderTop: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10
      }}>
        <span style={{ fontSize: '0.8rem', color: '#1d4ed8', fontWeight: 600 }}>
          Aditya College of Engineering & Technology
        </span>

        {/* Slide Indicator Dots */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', maxWidth: '400px', padding: '4px' }}>
          {(slides || slidesData).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index, index > currentSlide ? 'next' : 'prev')}
              style={{
                width: index === currentSlide ? '20px' : '8px',
                height: '8px',
                borderRadius: '50px',
                background: index === currentSlide ? '#1d4ed8' : '#cbd5e1',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              title={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={prevSlide}
            style={{
              background: '#f1f5f9',
              border: '1px solid #cbd5e1',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#1e293b',
              cursor: 'pointer'
            }}
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            style={{
              background: '#1d4ed8',
              border: 'none',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>

    {/* ── Slide Edit Modal ───────────────────────────────────────── */}
    {editModal && (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 99999, padding: '20px'
      }}>
        <div style={{
          background: '#ffffff', borderRadius: '20px', padding: '32px',
          width: '100%', maxWidth: '760px', maxHeight: '90vh', overflowY: 'auto',
          boxShadow: '0 30px 60px rgba(0,0,0,0.18)'
        }}>
          {/* Modal Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1d4ed8', margin: 0 }}>
              {editModal.mode === 'add' ? '➕ Add New Slide' : '✏️ Edit Slide'}
            </h2>
            <button onClick={closeEditModal}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '4px' }}>
              <X size={22} />
            </button>
          </div>

          {editError && (
            <div style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', fontSize: '0.85rem' }}>
              {editError}
            </div>
          )}

          {/* Form Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {/* Title */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Slide Title *</label>
              <input value={editModal.slide.title}
                onChange={e => handleEditField('title', e.target.value)}
                className="form-input" style={{ width: '100%', fontWeight: 700, fontSize: '1rem' }}
                placeholder="Slide title" />
            </div>
            {/* Subtitle */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subtitle</label>
              <input value={editModal.slide.subtitle}
                onChange={e => handleEditField('subtitle', e.target.value)}
                className="form-input" style={{ width: '100%' }}
                placeholder="Subtitle or topic" />
            </div>
            {/* Explanation */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Explanation / Description</label>
              <textarea value={editModal.slide.explanation}
                onChange={e => handleEditField('explanation', e.target.value)}
                className="form-input" rows={3} style={{ width: '100%', resize: 'vertical' }}
                placeholder="3-line explanation for this slide" />
            </div>
            {/* Image URL */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <Image size={12} style={{ display: 'inline', marginRight: '4px' }} /> Image URL
              </label>
              <input value={editModal.slide.imageUrl}
                onChange={e => handleEditField('imageUrl', e.target.value)}
                className="form-input" style={{ width: '100%' }}
                placeholder="https://images.unsplash.com/..." />
              {editModal.slide.imageUrl && (
                <img src={editModal.slide.imageUrl} alt="preview"
                  style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px', border: '1px solid #e2e8f0' }}
                  onError={e => { e.target.style.display = 'none'; }} />
              )}
            </div>
            {/* Colors Row */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Title Color</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="color" value={editModal.slide.titleColor}
                  onChange={e => handleEditField('titleColor', e.target.value)}
                  style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }} />
                <input value={editModal.slide.titleColor}
                  onChange={e => handleEditField('titleColor', e.target.value)}
                  className="form-input" style={{ flex: 1 }} placeholder="#1d4ed8" />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subtitle Color</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="color" value={editModal.slide.subtitleColor}
                  onChange={e => handleEditField('subtitleColor', e.target.value)}
                  style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }} />
                <input value={editModal.slide.subtitleColor}
                  onChange={e => handleEditField('subtitleColor', e.target.value)}
                  className="form-input" style={{ flex: 1 }} placeholder="#d97706" />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Text Color</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="color" value={editModal.slide.textColor}
                  onChange={e => handleEditField('textColor', e.target.value)}
                  style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }} />
                <input value={editModal.slide.textColor}
                  onChange={e => handleEditField('textColor', e.target.value)}
                  className="form-input" style={{ flex: 1 }} placeholder="#1e293b" />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Background Color</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="color" value={editModal.slide.backgroundColor}
                  onChange={e => handleEditField('backgroundColor', e.target.value)}
                  style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }} />
                <input value={editModal.slide.backgroundColor}
                  onChange={e => handleEditField('backgroundColor', e.target.value)}
                  className="form-input" style={{ flex: 1 }} placeholder="#ffffff" />
              </div>
            </div>
            {/* Accent + Font */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Accent Color</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="color" value={editModal.slide.accent}
                  onChange={e => handleEditField('accent', e.target.value)}
                  style={{ width: '40px', height: '36px', border: 'none', borderRadius: '6px', cursor: 'pointer' }} />
                <input value={editModal.slide.accent}
                  onChange={e => handleEditField('accent', e.target.value)}
                  className="form-input" style={{ flex: 1 }} placeholder="#1d4ed8" />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <Type size={12} style={{ display: 'inline', marginRight: '4px' }} /> Font Family
              </label>
              <select value={editModal.slide.fontFamily}
                onChange={e => handleEditField('fontFamily', e.target.value)}
                className="form-input" style={{ width: '100%' }}>
                {['Poppins','Inter','Roboto','Outfit','Montserrat','Lato','Open Sans','Raleway','Nunito','Georgia'].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Key Points */}
            <div style={{ gridColumn: '1/-1' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Key Points (Bullet Items)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {editModal.slide.keyPoints.map((pt, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', width: '22px', textAlign: 'right', fontWeight: 700 }}>{idx + 1}.</span>
                    <input value={pt}
                      onChange={e => handleEditKeyPoint(idx, e.target.value)}
                      className="form-input" style={{ flex: 1 }}
                      placeholder={`Key point ${idx + 1}`} />
                    {editModal.slide.keyPoints.length > 1 && (
                      <button type="button" onClick={() => removeKeyPoint(idx)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '2px', display: 'flex' }}>
                        <X size={15} />
                      </button>
                    )}
                  </div>
                ))}
                {editModal.slide.keyPoints.length < 8 && (
                  <button type="button" onClick={addKeyPoint}
                    style={{ background: '#eff6ff', border: '1px dashed #93c5fd', borderRadius: '8px', padding: '7px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                    <Plus size={14} /> Add Key Point
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Save / Cancel */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button onClick={saveSlide} disabled={editSaving}
              style={{ flex: 1, background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: '10px', padding: '13px', fontWeight: 700, fontSize: '1rem', cursor: editSaving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <Save size={16} /> {editSaving ? 'Saving...' : 'Save Slide'}
            </button>
            <button onClick={closeEditModal}
              style={{ padding: '13px 20px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
