import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../utils/api';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    logo: '',
    websiteName: 'ACET MEDTRACK',
    footerLocation: 'ACET Campus, NH-16, Aditya Nagar, Surampalem, East Godavari, Andhra Pradesh, India',
    footerPhone: '+91 8792714127',
    footerCopyright: '© 2026 ACET MEDTRACK – Crafted by Dipendra Upadhayay and TEAM',
    openingAnimationActive: true,
    openingAnimationText: 'ACET MEDTRACK',
    openingAnimationLogo: '',
    customNavLinks: [
      { label: 'Home', path: '/' },
      { label: 'About Us', path: '/about' },
      { label: 'Services', path: '/services' },
      { label: 'Our Team', path: '/team' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'Shop', path: '/shop' },
      { label: 'Contact Us', path: '/contact' }
    ]
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const data = await api.get('/public/settings');
      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to fetch web settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, fetchSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
export default SettingsContext;
