const Slide = require('../models/Slide');
const { logEvent } = require('../utils/logger');

const defaultSlides = [
  {
    id: 1,
    title: 'ACET MEDTRACK',
    subtitle: 'Smart Healthcare Management System',
    photoPrompt: 'Futuristic healthcare technology dashboard, doctor using tablet, digital heartbeat lines, holographic medical interface, premium blue lighting, modern hospital environment',
    imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1ea0ac7a63?auto=format&fit=crop&w=800&q=80',
    keyPoints: ['ACET MEDTRACK', 'Healthcare Management System', 'Digital Health Platform', 'Student Innovation Project', 'Smart Healthcare Solution'],
    explanation: 'ACET MEDTRACK is a healthcare management platform developed by ACET students. It helps patients, doctors, parents, and administrators manage healthcare services digitally. The system aims to make healthcare safer, smarter, and more accessible.',
    accent: '#1d4ed8',
    type: 'cover',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    titleColor: '#1d4ed8',
    subtitleColor: '#d97706',
    fontFamily: 'Poppins'
  },
  {
    id: 1.5,
    title: 'Meet Our Team',
    subtitle: 'The Student Engineers Behind ACET MEDTRACK',
    photoPrompt: 'Professional student development team standing confidently in modern tech workspace',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    keyPoints: ['Dipendra Upadhayay', 'Prince Yadav', 'Manish Bishwakarma', 'Pravej Hawari', 'Prash Yadav & Deepak Lodh'],
    explanation: 'ACET MEDTRACK was built by a passionate team of engineering students at Aditya College of Engineering & Technology. Each member brought their unique skills in development, design, and management to create this innovative healthcare platform.',
    accent: '#1d4ed8',
    type: 'team',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    titleColor: '#1d4ed8',
    subtitleColor: '#d97706',
    fontFamily: 'Poppins'
  },
  {
    id: 2,
    title: 'Problem Statement',
    subtitle: 'Challenges in Traditional Healthcare',
    photoPrompt: 'Patient confused with medicine schedules, paperwork, missed appointments, hospital documents scattered on desk',
    imageUrl: 'https://images.unsplash.com/photo-1584515901367-f1c2a1cf553f?auto=format&fit=crop&w=800&q=80',
    keyPoints: ['Missed Medicine Doses', 'Lost Medical Records', 'Appointment Difficulties', 'Lack of Monitoring', 'Paper-Based System'],
    explanation: 'Many patients forget medicines and misplace important medical records. Booking appointments can also be time-consuming. Traditional healthcare systems lack proper digital monitoring and management.',
    accent: '#ef4444',
    type: 'problem',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    titleColor: '#1d4ed8',
    subtitleColor: '#d97706',
    fontFamily: 'Poppins'
  },
  {
    id: 3,
    title: 'Objectives',
    subtitle: 'Our Goals & Target Outcomes',
    photoPrompt: 'Digital healthcare transformation, doctor and patient using smart medical application',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
    keyPoints: ['Digital Healthcare', 'Easy Record Management', 'Medicine Tracking', 'Parent Monitoring', 'Better Patient Care'],
    explanation: 'The main objective is to create a centralized healthcare platform. It improves record management and medicine adherence. The system enhances healthcare accessibility and efficiency.',
    accent: '#10b981',
    type: 'list',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    titleColor: '#1d4ed8',
    subtitleColor: '#d97706',
    fontFamily: 'Poppins'
  },
  {
    id: 4,
    title: 'Proposed Solution',
    subtitle: 'The ACET MEDTRACK Approach',
    photoPrompt: 'Modern healthcare platform dashboard displayed on laptop and smartphone',
    imageUrl: 'https://images.unsplash.com/photo-1504813184591-01552ff75805?auto=format&fit=crop&w=800&q=80',
    keyPoints: ['One Integrated Platform', 'Secure Data Storage', 'Appointment Management', 'Medicine Reminders', 'Parent Access'],
    explanation: 'ACET MEDTRACK provides a complete healthcare solution. Users can manage records, appointments, and medicines from one platform. The system also allows parents to monitor patient progress.',
    accent: '#06b6d4',
    type: 'grid',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    titleColor: '#1d4ed8',
    subtitleColor: '#d97706',
    fontFamily: 'Poppins'
  },
  {
    id: 5,
    title: 'System Architecture',
    subtitle: 'Secure & Modular Architecture',
    photoPrompt: 'Cloud server network, database architecture, API connections, futuristic technology diagram',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    keyPoints: ['React + Vite', 'Node.js Backend', 'Express API', 'MongoDB Database', 'JWT Security'],
    explanation: 'The platform uses modern web technologies for high performance. React and Vite power the frontend while Node.js handles backend operations. MongoDB stores data securely with JWT authentication.',
    accent: '#8b5cf6',
    type: 'architecture',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    titleColor: '#1d4ed8',
    subtitleColor: '#d97706',
    fontFamily: 'Poppins'
  },
  {
    id: 6,
    title: 'User Roles',
    subtitle: 'Multi-User Authorization Control',
    photoPrompt: 'Four healthcare users representing Patient, Parent, Doctor, and Administrator',
    imageUrl: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
    keyPoints: ['Patient', 'Parent', 'Doctor', 'Admin', 'Role-Based Access'],
    explanation: 'Each user type has specific permissions and responsibilities. Patients manage health records, doctors provide treatment, parents monitor progress, and admins oversee the system. This ensures security and proper access control.',
    accent: '#f59e0b',
    type: 'roles',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    titleColor: '#1d4ed8',
    subtitleColor: '#d97706',
    fontFamily: 'Poppins'
  },
  {
    id: 7,
    title: 'Patient Dashboard',
    subtitle: 'Personalized Health Management Hub',
    photoPrompt: 'Professional healthcare dashboard showing prescriptions, records, appointments and analytics',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    keyPoints: ['Medical Records', 'Prescriptions', 'Medicine Tracker', 'Reports', 'Appointments'],
    explanation: 'Patients can store and access their health information digitally. The dashboard provides quick access to medicines, prescriptions, and appointments. It serves as a personal healthcare center.',
    accent: '#1d4ed8',
    type: 'dashboard',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    titleColor: '#1d4ed8',
    subtitleColor: '#d97706',
    fontFamily: 'Poppins'
  },
  {
    id: 8,
    title: 'Medicine Alarm System',
    subtitle: 'Smart Schedule & Notifications',
    photoPrompt: 'Smartphone displaying medicine reminder alarm with notification and medicine bottle',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    keyPoints: ['Alarm Notification', 'Dose Reminder', 'Missed Dose Tracking', 'Custom Alarm Tunes', 'Daily Schedule'],
    explanation: 'The medicine alarm system reminds patients to take medicines on time. Alerts include sounds and notifications. This feature improves medication adherence and health outcomes.',
    accent: '#e11d48',
    type: 'alarm',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    titleColor: '#1d4ed8',
    subtitleColor: '#d97706',
    fontFamily: 'Poppins'
  },
  {
    id: 9,
    title: 'Parent Access System',
    subtitle: 'Remote Family Supervision & Care',
    photoPrompt: 'Parent monitoring patient\'s healthcare data securely through mobile application',
    imageUrl: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
    keyPoints: ['Secure Login', 'Health Monitoring', 'Prescription Access', 'Appointment Tracking', 'Notifications'],
    explanation: 'Patients can provide access credentials to parents. Parents can monitor treatment progress and medicine schedules. This increases support and accountability in healthcare management.',
    accent: '#10b981',
    type: 'list',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    titleColor: '#1d4ed8',
    subtitleColor: '#d97706',
    fontFamily: 'Poppins'
  },
  {
    id: 10,
    title: 'Doctor Panel',
    subtitle: 'Clinical Record & Diagnostics Panel',
    photoPrompt: 'Doctor reviewing patient reports on tablet in modern clinic',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80',
    keyPoints: ['Appointment Management', 'Patient Records', 'Prescriptions', 'Treatment Plans', 'Profile Management'],
    explanation: 'Doctors can manage consultations and patient records efficiently. They can create prescriptions and update treatment plans digitally. This reduces paperwork and improves healthcare delivery.',
    accent: '#6366f1',
    type: 'list',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    titleColor: '#1d4ed8',
    subtitleColor: '#d97706',
    fontFamily: 'Poppins'
  },
  {
    id: 11,
    title: 'Admin Dashboard',
    subtitle: 'System Operations & Quality Control',
    photoPrompt: 'Business analytics dashboard with healthcare charts and management statistics',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    keyPoints: ['User Management', 'Analytics', 'Reports', 'Doctor Approval', 'System Monitoring'],
    explanation: 'The admin dashboard controls the entire platform. Administrators can manage users, monitor activities, and generate reports. It ensures smooth and secure operation of the system.',
    accent: '#ec4899',
    type: 'dashboard',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    titleColor: '#1d4ed8',
    subtitleColor: '#d97706',
    fontFamily: 'Poppins'
  },
  {
    id: 12,
    title: 'Key Features',
    subtitle: 'Value Proposition & Capabilities',
    photoPrompt: 'Healthcare feature icons arranged in modern technology layout',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    keyPoints: ['Medicine Alarm', 'Digital Records', 'Parent Access', 'Online Appointments', 'Real-Time Notifications'],
    explanation: 'ACET MEDTRACK combines multiple healthcare features into one platform. These features improve convenience and efficiency. Users receive a seamless healthcare experience.',
    accent: '#06b6d4',
    type: 'grid',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    titleColor: '#1d4ed8',
    subtitleColor: '#d97706',
    fontFamily: 'Poppins'
  },
  {
    id: 13,
    title: 'Security Features',
    subtitle: 'Industry-Grade Security Layer',
    photoPrompt: 'Cybersecurity shield protecting healthcare data with encrypted digital network',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    keyPoints: ['JWT Authentication', 'Password Encryption', 'Secure APIs', 'Data Protection', 'Access Control'],
    explanation: 'Patient information is highly sensitive and requires strong protection. Security features prevent unauthorized access and data breaches. The platform follows modern cybersecurity practices.',
    accent: '#f43f5e',
    type: 'security',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    titleColor: '#1d4ed8',
    subtitleColor: '#d97706',
    fontFamily: 'Poppins'
  },
  {
    id: 14,
    title: 'Technology Stack',
    subtitle: 'The Engineering Ecosystem',
    photoPrompt: 'React, Node.js, MongoDB, Express, JWT technology ecosystem visualization',
    imageUrl: 'https://images.unsplash.com/photo-1618401471353-b98aedd07871?auto=format&fit=crop&w=800&q=80',
    keyPoints: ['React.js', 'Vite', 'Node.js', 'Express.js', 'MongoDB'],
    explanation: 'Modern technologies ensure high performance and scalability. The chosen stack supports secure and responsive web applications. It is suitable for healthcare management systems.',
    accent: '#8b5cf6',
    type: 'tech',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    titleColor: '#1d4ed8',
    subtitleColor: '#d97706',
    fontFamily: 'Poppins'
  },
  {
    id: 15,
    title: 'Website Demonstration',
    subtitle: 'High Fidelity Application Tour',
    photoPrompt: 'Premium website UI screens including home page, patient panel, doctor panel, admin panel',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    keyPoints: ['Home Page', 'Patient Panel', 'Doctor Panel', 'Admin Dashboard', 'Mobile Responsive Design'],
    explanation: 'This slide showcases the website interface and functionality. Users can see how each panel works. The design is responsive and user-friendly across all devices.',
    accent: '#14b8a6',
    type: 'demo',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    titleColor: '#1d4ed8',
    subtitleColor: '#d97706',
    fontFamily: 'Poppins'
  },
  {
    id: 16,
    title: 'Future Scope',
    subtitle: 'Next-Generation Health Innovation',
    photoPrompt: 'AI healthcare assistant, telemedicine, wearable devices, futuristic hospital technology',
    imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80',
    keyPoints: ['AI Health Assistant', 'Telemedicine', 'Mobile App', 'Smart Analytics', 'Wearable Integration'],
    explanation: 'Future versions will include advanced healthcare technologies. AI and telemedicine will improve patient support. Mobile applications will increase accessibility and convenience.',
    accent: '#f59e0b',
    type: 'timeline',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    titleColor: '#1d4ed8',
    subtitleColor: '#d97706',
    fontFamily: 'Poppins'
  },
  {
    id: 17,
    title: 'Team Members',
    subtitle: 'The Engineering Team behind Medtrack',
    photoPrompt: 'Professional student team standing confidently in modern technology workspace',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    keyPoints: ['Dipendra Upadhayay', 'Prince Yadav', 'Manish Bishwakarma', 'Pravej Hawari', 'Prash Yadav & Deepak Lodh'],
    explanation: 'The project was developed by a dedicated student team. Each member contributed in development, design, database management, and marketing. Teamwork played a key role in the project\'s success.',
    accent: '#1d4ed8',
    type: 'team',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    titleColor: '#1d4ed8',
    subtitleColor: '#d97706',
    fontFamily: 'Poppins'
  },
  {
    id: 18,
    title: 'Conclusion & Thank You',
    subtitle: 'Your Health, Our Priority',
    photoPrompt: 'Modern healthcare technology background with glowing heartbeat line and hospital skyline',
    imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
    keyPoints: ['Smart Healthcare', 'Digital Innovation', 'Improved Patient Care', 'Future Ready Solution', 'Thank You'],
    explanation: 'ACET MEDTRACK transforms traditional healthcare management into a digital experience. It improves patient care, accessibility, and efficiency. Thank you for your valuable time and attention.',
    accent: '#ef4444',
    type: 'thankyou',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    titleColor: '#1d4ed8',
    subtitleColor: '#d97706',
    fontFamily: 'Poppins'
  }
];

const getSlides = async (req, res) => {
  try {
    let slides = await Slide.find({});
    if (!slides || slides.length === 0) {
      console.log('[Slide Controller] Seeding initial slides...');
      for (const s of defaultSlides) {
        await Slide.create(s);
      }
      slides = await Slide.find({});
    }
    slides.sort((a, b) => a.id - b.id);
    res.json(slides);
  } catch (error) {
    console.error('Get slides error:', error);
    res.status(500).json({ message: 'Server error loading slides' });
  }
};

const createSlide = async (req, res) => {
  const { id, title, subtitle, photoPrompt, imageUrl, keyPoints, explanation, accent, type, backgroundColor, textColor, titleColor, subtitleColor, fontFamily } = req.body;
  if (!id || !title) {
    return res.status(400).json({ message: 'ID and Title are required' });
  }
  try {
    const newSlide = await Slide.create({
      id: Number(id),
      title,
      subtitle: subtitle || '',
      photoPrompt: photoPrompt || '',
      imageUrl: imageUrl || '',
      keyPoints: keyPoints || [],
      explanation: explanation || '',
      accent: accent || '#1d4ed8',
      type: type || 'standard',
      backgroundColor: backgroundColor || '#ffffff',
      textColor: textColor || '#1e293b',
      titleColor: titleColor || '#1d4ed8',
      subtitleColor: subtitleColor || '#d97706',
      fontFamily: fontFamily || 'Poppins'
    });
    await logEvent('CREATE_SLIDE', req.user.id, req.user.name, req.user.role, `Created new slide: "${title}"`);
    res.status(201).json(newSlide);
  } catch (error) {
    console.error('Create slide error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSlide = async (req, res) => {
  const slideId = req.params.id;
  try {
    const slide = await Slide.findById(slideId);
    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }
    const updated = await Slide.findByIdAndUpdate(slideId, { $set: req.body }, { new: true });
    await logEvent('UPDATE_SLIDE', req.user.id, req.user.name, req.user.role, `Updated slide "${slide.title}"`);
    res.json(updated);
  } catch (error) {
    console.error('Update slide error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteSlide = async (req, res) => {
  const slideId = req.params.id;
  try {
    const slide = await Slide.findById(slideId);
    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }
    await Slide.deleteOne({ _id: slideId });
    await logEvent('DELETE_SLIDE', req.user.id, req.user.name, req.user.role, `Deleted slide "${slide.title}"`);
    res.json({ message: 'Slide deleted successfully' });
  } catch (error) {
    console.error('Delete slide error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getSlides,
  createSlide,
  updateSlide,
  deleteSlide
};
