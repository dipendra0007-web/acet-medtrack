import React, { useState, useEffect, useRef } from 'react';
import { api, API_BASE_URL } from '../utils/api';
import GlassCard from '../components/GlassCard';
import { 
  Shield, Users, UserCheck, Calendar, Bell, FileText, Download, Trash2, Search, Check, X, AlertTriangle, Plus, Edit, Phone, Mail, MessageSquare, Image, Video, ShoppingBag, ShoppingCart, MapPin, Monitor, Truck, Navigation, Clock, Send, User, ArrowLeft, Settings
} from 'lucide-react';
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');

  // App Releases State
  const [releases, setReleases] = useState([]);
  const [releaseName, setReleaseName] = useState('');
  const [releaseVersion, setReleaseVersion] = useState('');
  const [releaseDesc, setReleaseDesc] = useState('');
  // APK
  const [releaseFileName, setReleaseFileName] = useState('');
  const [releaseFileData, setReleaseFileData] = useState('');
  // IPA
  const [releaseIpaFileName, setReleaseIpaFileName] = useState('');
  const [releaseIpaFileData, setReleaseIpaFileData] = useState('');
  // Cover photo
  const [releasePhoto, setReleasePhoto] = useState('');
  const [releasePhotoFileName, setReleasePhotoFileName] = useState('');
  const [showReleaseForm, setShowReleaseForm] = useState(false);
  const [isUploadingRelease, setIsUploadingRelease] = useState(false);

  // Support Tickets State
  const [tickets, setTickets] = useState([]);
  const [activeTicket, setActiveTicket] = useState(null);
  const [activeTicketData, setActiveTicketData] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [ticketFilter, setTicketFilter] = useState('all'); // 'all' | 'pending' | 'replied'
  const adminChatEndRef = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Poll active ticket details
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
        console.error('Failed to poll active ticket details in admin:', err);
      }
    };

    fetchTicketDetails(); // Initial load

    const pollInterval = setInterval(fetchTicketDetails, 3000);
    return () => clearInterval(pollInterval);
  }, [activeTicket]);

  useEffect(() => {
    if (adminChatEndRef.current) {
      adminChatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTicketData?.replies]);

  // Admin Data State
  const [stats, setStats] = useState({ totalUsers: 0, totalPatients: 0, totalDoctors: 0, totalDrivers: 0, totalAppointments: 0, activeReminders: 0, pendingDoctors: 0, pendingDrivers: 0 });
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);

  // Our Team Management State
  const [teamMembers, setTeamMembers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [teamEmail, setTeamEmail] = useState('');
  const [teamRole, setTeamRole] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [teamPhoto, setTeamPhoto] = useState('');
  const [teamContact, setTeamContact] = useState('');
  const [teamInsta, setTeamInsta] = useState('');
  const [teamFb, setTeamFb] = useState('');
  const [showTeamForm, setShowTeamForm] = useState(false);

  // Reviews Moderation State
  const [allReviews, setAllReviews] = useState([]);

  // Gallery Manager State
  const [galleryItems, setGalleryItems] = useState([]);
  const [galType, setGalType] = useState('photo');
  const [galTitle, setGalTitle] = useState('');
  const [galSource, setGalSource] = useState('link');
  const [galUrl, setGalUrl] = useState('');
  const [showGalleryForm, setShowGalleryForm] = useState(false);

  // Shop Inventory & Orders States
  const [shopItems, setShopItems] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [showShopForm, setShowShopForm] = useState(false);
  const [isEditingShop, setIsEditingShop] = useState(false);
  const [editingShopId, setEditingShopId] = useState(null);
  const [shopItemName, setShopItemName] = useState('');
  const [shopItemDesc, setShopItemDesc] = useState('');
  const [shopItemPriceINR, setShopItemPriceINR] = useState(0);
  const [shopItemPriceUSD, setShopItemPriceUSD] = useState(0);
  const [shopItemStocks, setShopItemStocks] = useState(0);
  const [shopItemPhoto, setShopItemPhoto] = useState('');
  const [shopItemCategory, setShopItemCategory] = useState('Medicine');

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [deliveryStreet, setDeliveryStreet] = useState('');
  const [deliveryFloor, setDeliveryFloor] = useState('');
  const [deliveryArea, setDeliveryArea] = useState('');
  const [deliveryLandmark, setDeliveryLandmark] = useState('');
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [driversLoading, setDriversLoading] = useState(false);

  // ─── Delivery Locations Config States ───
  const [deliveryLocations, setDeliveryLocations] = useState([]);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [locState, setLocState] = useState('');
  const [locArea, setLocArea] = useState('');
  const [locRegion, setLocRegion] = useState('');
  const [locCountry, setLocCountry] = useState('India');
  const [locDistrict, setLocDistrict] = useState('');
  const [locWard, setLocWard] = useState('');
  const [locMapLink, setLocMapLink] = useState('');
  const [locLat, setLocLat] = useState('');
  const [locLng, setLocLng] = useState('');
  const [locSearchQuery, setLocSearchQuery] = useState('');

  // ─── Homepage Ads States ───
  const [adPopups, setAdPopups] = useState([]);
  const [showAdForm, setShowAdForm] = useState(false);
  const [isEditingAd, setIsEditingAd] = useState(false);
  const [editingAdId, setEditingAdId] = useState(null);
  const [adTitle, setAdTitle] = useState('');
  const [adDesc, setAdDesc] = useState('');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adLinkUrl, setAdLinkUrl] = useState('');
  const [adDuration, setAdDuration] = useState(5);
  const [adActive, setAdActive] = useState(true);

  // ─── Collaborators States ───
  const [collaborators, setCollaborators] = useState([]);
  const [showCollabForm, setShowCollabForm] = useState(false);
  const [isEditingCollab, setIsEditingCollab] = useState(false);
  const [editingCollabId, setEditingCollabId] = useState(null);
  const [collabName, setCollabName] = useState('');
  const [collabPhoto, setCollabPhoto] = useState('');
  const [collabLink, setCollabLink] = useState('');

  // ─── Detailed Verification Popups ───
  const [detailDoctor, setDetailDoctor] = useState(null);
  const [detailDriver, setDetailDriver] = useState(null);

  // ─── Site Customization States ───
  const [webSettings, setWebSettings] = useState(null);
  const [siteName, setSiteName] = useState('');
  const [siteLogo, setSiteLogo] = useState('');
  const [footLoc, setFootLoc] = useState('');
  const [footPhone, setFootPhone] = useState('');
  const [footCopyright, setFootCopyright] = useState('');
  const [splashActive, setSplashActive] = useState(true);
  const [splashText, setSplashText] = useState('');
  const [splashLogo, setSplashLogo] = useState('');
  const [navItemsList, setNavItemsList] = useState([]);
  
  // Custom sign-up requirements checklists
  const [patReqAge, setPatReqAge] = useState(false);
  const [patReqGender, setPatReqGender] = useState(false);
  const [patReqBlood, setPatReqBlood] = useState(false);
  const [patReqAllergies, setPatReqAllergies] = useState(false);

  const [drvReqAge, setDrvReqAge] = useState(true);
  const [drvReqLicensePhoto, setDrvReqLicensePhoto] = useState(true);
  const [drvReqVehicle, setDrvReqVehicle] = useState(true);

  const [docReqSpec, setDocReqSpec] = useState(true);
  const [docReqExp, setDocReqExp] = useState(true);
  const [docReqLicense, setDocReqLicense] = useState(true);
  
  // Link editor state
  const [linkEditorOpen, setLinkEditorOpen] = useState(false);
  const [isEditingLink, setIsEditingLink] = useState(false);
  const [editingLinkIdx, setEditingLinkIdx] = useState(null);
  const [linkLabel, setLinkLabel] = useState('');
  const [linkPath, setLinkPath] = useState('');

  const fetchAdminWebSettings = async () => {
    try {
      const data = await api.get('/admin/settings');
      if (data) {
        setWebSettings(data);
        setSiteName(data.websiteName || '');
        setSiteLogo(data.logo || '');
        setFootLoc(data.footerLocation || '');
        setFootPhone(data.footerPhone || '');
        setFootCopyright(data.footerCopyright || '');
        setSplashActive(data.openingAnimationActive ?? true);
        setSplashText(data.openingAnimationText || '');
        setSplashLogo(data.openingAnimationLogo || '');
        setNavItemsList(data.customNavLinks || []);
        
        setPatReqAge(data.patientRequireAge ?? false);
        setPatReqGender(data.patientRequireGender ?? false);
        setPatReqBlood(data.patientRequireBloodGroup ?? false);
        setPatReqAllergies(data.patientRequireAllergies ?? false);
        
        setDrvReqAge(data.driverRequireAge ?? true);
        setDrvReqLicensePhoto(data.driverRequireLicensePhoto ?? true);
        setDrvReqVehicle(data.driverRequireVehicleDetails ?? true);
        
        setDocReqSpec(data.doctorRequireSpecialization ?? true);
        setDocReqExp(data.doctorRequireExperience ?? true);
        setDocReqLicense(data.doctorRequireLicenseDocument ?? true);
      }
    } catch (err) {
      console.error('Failed to load admin settings:', err);
    }
  };

  const handleSaveWebSettings = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        websiteName: siteName,
        logo: siteLogo,
        footerLocation: footLoc,
        footerPhone: footPhone,
        footerCopyright: footCopyright,
        openingAnimationActive: splashActive,
        openingAnimationText: splashText,
        openingAnimationLogo: splashLogo,
        customNavLinks: navItemsList,
        
        patientRequireAge: patReqAge,
        patientRequireGender: patReqGender,
        patientRequireBloodGroup: patReqBlood,
        patientRequireAllergies: patReqAllergies,
        
        driverRequireAge: drvReqAge,
        driverRequireLicensePhoto: drvReqLicensePhoto,
        driverRequireVehicleDetails: drvReqVehicle,
        
        doctorRequireSpecialization: docReqSpec,
        doctorRequireExperience: docReqExp,
        doctorRequireLicenseDocument: docReqLicense
      };
      const updated = await api.post('/admin/settings', payload);
      alert('Website configurations and sign-up requirements saved successfully! Refresh page to see changes.');
      setWebSettings(updated);
    } catch (err) {
      console.error('Failed to update web settings:', err);
      alert('Failed to save settings: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSiteLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSiteLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSplashLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSplashLogo(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddNavLink = () => {
    if (!linkLabel || !linkPath) {
      alert('Please fill both label and target path!');
      return;
    }
    const newLink = { label: linkLabel, path: linkPath };
    if (isEditingLink) {
      const copy = [...navItemsList];
      copy[editingLinkIdx] = newLink;
      setNavItemsList(copy);
      setIsEditingLink(false);
      setEditingLinkIdx(null);
    } else {
      setNavItemsList([...navItemsList, newLink]);
    }
    setLinkLabel('');
    setLinkPath('');
    setLinkEditorOpen(false);
  };

  const handleEditNavLink = (idx) => {
    const target = navItemsList[idx];
    setLinkLabel(target.label || target.name || '');
    setLinkPath(target.path || '');
    setIsEditingLink(true);
    setEditingLinkIdx(idx);
    setLinkEditorOpen(true);
  };

  const handleDeleteNavLink = (idx) => {
    if (window.confirm('Are you sure you want to remove this navigation item?')) {
      setNavItemsList(navItemsList.filter((_, i) => i !== idx));
    }
  };

  // Leaflet CDN injection state for Delivery Locations
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // Notifications State
  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef(null);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchAdminData();
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const notifInterval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(notifInterval);
  }, []);

  useEffect(() => {
    if (activeTab === 'customization') {
      fetchAdminWebSettings();
    }
  }, [activeTab]);

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Inject Leaflet resources when activeTab is locations
  useEffect(() => {
    if (activeTab === 'locations' && !leafletLoaded) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);

      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => {
        setLeafletLoaded(true);
      };
      document.body.appendChild(script);

      return () => {
        if (document.head.contains(link)) document.head.removeChild(link);
        if (document.body.contains(script)) document.body.removeChild(script);
      };
    }
  }, [activeTab, leafletLoaded]);

  // Initialize Leaflet map for Admin Delivery Locations
  useEffect(() => {
    if (activeTab !== 'locations' || !leafletLoaded || !document.getElementById('admin-location-map')) return;

    const defaultLat = 13.1165;
    const defaultLng = 77.5755;

    let map;
    let marker;
    try {
      map = window.L.map('admin-location-map').setView([defaultLat, defaultLng], 14);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      marker = window.L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);
      
      mapRef.current = map;
      markerRef.current = marker;

      setLocLat(defaultLat.toFixed(5));
      setLocLng(defaultLng.toFixed(5));

      marker.on('dragend', function (event) {
        const position = marker.getLatLng();
        setLocLat(position.lat.toFixed(5));
        setLocLng(position.lng.toFixed(5));
      });

      map.on('click', function (event) {
        marker.setLatLng(event.latlng);
        setLocLat(event.latlng.lat.toFixed(5));
        setLocLng(event.latlng.lng.toFixed(5));
      });
    } catch (e) {
      console.error('Error initializing admin leaflet map:', e);
    }

    return () => {
      if (map) {
        map.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [leafletLoaded, activeTab]);

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

  const handleClearAllNotifs = async () => {
    try {
      await api.delete('/notifications');
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  };

  const fetchAdminData = async () => {
    try {
      const data = await api.get('/admin/dashboard');
      setStats(data.stats);
      setLogs(data.recentLogs);
    } catch (err) {
      console.error('Failed to load admin stats & logs:', err);
    }

    try {
      const allUsers = await api.get('/admin/users');
      setUsers(allUsers);
    } catch (err) {
      console.error('Failed to load users list:', err);
    }

    try {
      const teamData = await api.get('/team');
      setTeamMembers(teamData);
    } catch (err) {
      console.error('Failed to load team members:', err);
    }

    try {
      const reviewsData = await api.get('/admin/reviews');
      setAllReviews(reviewsData);
    } catch (err) {
      console.error('Failed to load reviews list:', err);
    }

    try {
      const galleryData = await api.get('/gallery');
      setGalleryItems(galleryData);
    } catch (err) {
      console.error('Failed to load gallery items:', err);
    }

    try {
      const shopData = await api.get('/shop');
      setShopItems(shopData);
    } catch (err) {
      console.error('Failed to load shop items:', err);
    }

    try {
      const ordersData = await api.get('/admin/orders');
      setAdminOrders(ordersData);
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    }

    try {
      const releasesData = await api.get('/releases');
      setReleases(releasesData);
    } catch (err) {
      console.error('Failed to load releases:', err);
    }

    try {
      const ticketData = await api.get('/contact');
      setTickets(ticketData || []);
    } catch (err) {
      console.error('Failed to load support tickets:', err);
    }

    // Fetch delivery locations config
    try {
      const locData = await api.get('/admin/delivery-locations');
      setDeliveryLocations(locData || []);
    } catch (err) {
      console.error('Failed to load delivery locations:', err);
    }

    // Fetch homepage ad popups
    try {
      const adData = await api.get('/admin/ad-popup');
      setAdPopups(adData || []);
    } catch (err) {
      console.error('Failed to load ad popups:', err);
    }

    // Fetch collaborators
    try {
      const collabData = await api.get('/admin/collaborators');
      setCollaborators(collabData || []);
    } catch (err) {
      console.error('Failed to load collaborators:', err);
    }

    // Fetch available drivers
    try {
      setDriversLoading(true);
      const driversData = await api.get('/driver/available');
      setAvailableDrivers(driversData || []);
      setDriversLoading(false);
    } catch (err) {
      setAvailableDrivers([]);
      setDriversLoading(false);
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

  // User Actions
  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete user ${name}? This action is irreversible.`)) return;

    try {
      await api.delete(`/admin/users/${id}`);
      triggerSuccess(`User "${name}" deleted successfully.`);
      fetchAdminData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const handleApproveDoctor = async (id, name, approved) => {
    try {
      await api.put(`/admin/doctors/${id}/approve`, { approved });
      triggerSuccess(approved ? `Doctor Dr. ${name} approved successfully.` : `Registration rejected for Dr. ${name}.`);
      fetchAdminData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const handleApproveDriver = async (id, name, approved) => {
    try {
      await api.put(`/admin/drivers/${id}/approve`, { approved });
      triggerSuccess(approved ? `Driver ${name} approved & can now log in.` : `Driver registration for ${name} rejected.`);
      fetchAdminData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      triggerSuccess(`User role updated to "${newRole}" successfully.`);
      fetchAdminData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const handleLocationSearch = async () => {
    if (!locSearchQuery) return;
    const parsedCoords = parseGoogleMapsUrl(locSearchQuery);
    if (parsedCoords) {
      const { lat, lng } = parsedCoords;
      setLocLat(lat.toFixed(5));
      setLocLng(lng.toFixed(5));
      if (mapRef.current && markerRef.current) {
        mapRef.current.setView([lat, lng], 16);
        markerRef.current.setLatLng([lat, lng]);
      }
      return;
    }

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locSearchQuery)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setLocLat(lat.toFixed(5));
        setLocLng(lon.toFixed(5));
        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([lat, lon], 16);
          markerRef.current.setLatLng([lat, lon]);
        }
      } else {
        alert("Location not found. Try searching a specific address.");
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
      alert("Search failed.");
    }
  };

  const parseGoogleMapsUrl = (url) => {
    const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
      return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
    }
    const qMatch = url.match(/[?&]q(?:uery)?=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) {
      return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
    }
    return null;
  };

  const handleAddDeliveryLocation = async (e) => {
    e.preventDefault();
    if (!locState || !locArea || !locLat || !locLng) {
      return triggerError('State, Area, Latitude, and Longitude are required.');
    }
    try {
      await api.post('/admin/delivery-locations', {
        region: locRegion,
        country: locCountry,
        state: locState,
        district: locDistrict,
        ward: locWard,
        locationMapLink: locMapLink,
        latitude: Number(locLat),
        longitude: Number(locLng),
        area: locArea
      });
      triggerSuccess(`Delivery location "${locArea}" configured successfully.`);
      setLocState('');
      setLocArea('');
      setLocRegion('');
      setLocCountry('India');
      setLocDistrict('');
      setLocWard('');
      setLocMapLink('');
      setLocSearchQuery('');
      setShowLocationForm(false);
      fetchAdminData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const handleDeleteDeliveryLocation = async (id, areaName) => {
    if (!window.confirm(`Are you sure you want to delete delivery location "${areaName}"?`)) return;
    try {
      await api.delete(`/admin/delivery-locations/${id}`);
      triggerSuccess(`Delivery location removed.`);
      fetchAdminData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const handleAdPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAdImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAdPopup = async (e) => {
    e.preventDefault();
    if (!adTitle) return triggerError('Ad Title is required.');
    try {
      const payload = {
        title: adTitle,
        description: adDesc,
        imageUrl: adImageUrl,
        linkUrl: adLinkUrl,
        duration: Number(adDuration || 5),
        active: adActive
      };

      if (isEditingAd) {
        await api.put(`/admin/ad-popup/${editingAdId}`, payload);
        triggerSuccess(`Homepage ad popup updated successfully.`);
      } else {
        await api.post('/admin/ad-popup', payload);
        triggerSuccess(`Homepage ad popup created successfully.`);
      }
      setAdTitle('');
      setAdDesc('');
      setAdImageUrl('');
      setAdLinkUrl('');
      setAdDuration(5);
      setAdActive(true);
      setShowAdForm(false);
      setIsEditingAd(false);
      setEditingAdId(null);
      fetchAdminData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const handleDeleteAdPopup = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete Ad Popup "${title}"?`)) return;
    try {
      await api.delete(`/admin/ad-popup/${id}`);
      triggerSuccess(`Ad Popup deleted successfully.`);
      fetchAdminData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const handleCollabPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setCollabPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCollaborator = async (e) => {
    e.preventDefault();
    if (!collabName || !collabLink) return triggerError('Name and website link are required.');
    try {
      const payload = {
        name: collabName,
        photo: collabPhoto,
        websiteLink: collabLink
      };

      if (isEditingCollab) {
        await api.put(`/admin/collaborators/${editingCollabId}`, payload);
        triggerSuccess(`Collaborator updated successfully.`);
      } else {
        await api.post('/admin/collaborators', payload);
        triggerSuccess(`Collaborator added successfully.`);
      }
      setCollabName('');
      setCollabPhoto('');
      setCollabLink('');
      setShowCollabForm(false);
      setIsEditingCollab(false);
      setEditingCollabId(null);
      fetchAdminData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const handleDeleteCollaborator = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete collaborator "${name}"?`)) return;
    try {
      await api.delete(`/admin/collaborators/${id}`);
      triggerSuccess(`Collaborator removed.`);
      fetchAdminData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  // When a registered driver is selected from dropdown, auto-fill name & phone
  const handleSelectRegisteredDriver = (driverId) => {
    setSelectedDriverId(driverId);
    if (!driverId) {
      setDriverName('');
      setDriverPhone('');
      return;
    }
    const found = availableDrivers.find(d => d.id === driverId);
    if (found) {
      setDriverName(found.name);
      setDriverPhone(found.email); // drivers may not always have a phone field
    }
  };



  // Team Actions
  const handleTeamPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setTeamPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleEditTeamClick = (member) => {
    setIsEditing(true);
    setEditingId(member._id);
    setTeamName(member.name);
    setTeamEmail(member.email);
    setTeamRole(member.role);
    setTeamDesc(member.description || '');
    setTeamPhoto(member.photo || '');
    setTeamContact(member.contactNumber || '');
    setTeamInsta(member.instagramLink || '');
    setTeamFb(member.facebookLink || '');
    setShowTeamForm(true);
  };

  const handleDeleteTeamMember = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete team member ${name}?`)) return;
    try {
      await api.delete(`/admin/team/${id}`);
      triggerSuccess(`Team member "${name}" deleted successfully.`);
      fetchAdminData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const handleSaveTeamMember = async (e) => {
    e.preventDefault();
    if (!teamName || !teamEmail || !teamRole) {
      return triggerError('Name, email, and role are required fields');
    }

    const payload = {
      name: teamName,
      email: teamEmail,
      role: teamRole,
      description: teamDesc,
      photo: teamPhoto,
      contactNumber: teamContact,
      instagramLink: teamInsta,
      facebookLink: teamFb
    };

    try {
      if (isEditing) {
        await api.put(`/admin/team/${editingId}`, payload);
        triggerSuccess(`Team member "${teamName}" updated successfully.`);
      } else {
        await api.post('/admin/team', payload);
        triggerSuccess(`Team member "${teamName}" created successfully.`);
      }
      setShowTeamForm(false);
      fetchAdminData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  // Reviews Actions
  const handleToggleReviewApprove = async (id, approved) => {
    try {
      await api.put(`/admin/reviews/${id}/approve`, { approved: !approved });
      triggerSuccess(`Review status updated successfully.`);
      fetchAdminData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      triggerSuccess('Review deleted successfully.');
      fetchAdminData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  // Gallery Actions
  const handleGalleryFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setGalUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveGalleryItem = async (e) => {
    e.preventDefault();
    if (!galTitle || !galUrl) {
      return triggerError('Title and media file/url are required.');
    }

    try {
      await api.post('/admin/gallery', {
        type: galType,
        title: galTitle,
        source: galSource,
        url: galUrl
      });
      triggerSuccess('Gallery item added successfully.');
      setGalTitle('');
      setGalUrl('');
      setShowGalleryForm(false);
      fetchAdminData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const handleDeleteGalleryItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gallery item?')) return;
    try {
      await api.delete(`/admin/gallery/${id}`);
      triggerSuccess('Gallery item deleted successfully.');
      fetchAdminData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  // Shop Inventory Handlers
  const handleShopPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setShopItemPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleEditShopClick = (item) => {
    setIsEditingShop(true);
    setEditingShopId(item._id);
    setShopItemName(item.name);
    setShopItemDesc(item.description);
    setShopItemPriceINR(item.priceINR);
    setShopItemPriceUSD(item.priceUSD);
    setShopItemStocks(item.stocks);
    setShopItemPhoto(item.photo);
    setShopItemCategory(item.category);
    setShowShopForm(true);
  };

  const handleDeleteShopItem = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete shop item "${name}"?`)) return;
    try {
      await api.delete(`/admin/shop/${id}`);
      triggerSuccess(`Shop item "${name}" deleted successfully.`);
      fetchAdminData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const handleSaveShopItem = async (e) => {
    e.preventDefault();
    if (!shopItemName || !shopItemDesc || !shopItemPriceINR || !shopItemPriceUSD || !shopItemPhoto || !shopItemCategory) {
      return triggerError('All shop item fields are required.');
    }

    const payload = {
      name: shopItemName,
      description: shopItemDesc,
      priceINR: Number(shopItemPriceINR),
      priceUSD: Number(shopItemPriceUSD),
      stocks: Number(shopItemStocks || 0),
      photo: shopItemPhoto,
      category: shopItemCategory
    };

    try {
      if (isEditingShop) {
        await api.put(`/admin/shop/${editingShopId}`, payload);
        triggerSuccess(`Shop item "${shopItemName}" updated successfully.`);
      } else {
        await api.post('/admin/shop', payload);
        triggerSuccess(`Shop item "${shopItemName}" created successfully.`);
      }
      setShowShopForm(false);
      setShopItemName('');
      setShopItemDesc('');
      setShopItemPriceINR(0);
      setShopItemPriceUSD(0);
      setShopItemStocks(0);
      setShopItemPhoto('');
      setShopItemCategory('Medicine');
      fetchAdminData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    if (newStatus === 'Out for Delivery') {
      const order = adminOrders.find(o => o._id === orderId);
      setSelectedOrder(order);
      setDriverName('');
      setDriverPhone('');
      return;
    }

    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      triggerSuccess(`Order status updated to "${newStatus}".`);
      fetchAdminData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const handleDispatchOrder = async (e) => {
    e.preventDefault();
    if (!driverName || !driverPhone) {
      return triggerError('Driver name and phone are required.');
    }

    try {
      await api.put(`/admin/orders/${selectedOrder._id}/status`, {
        status: 'Out for Delivery',
        driverId: selectedDriverId || '',
        driverName,
        driverPhone,
        deliveryStreet,
        deliveryFloor,
        deliveryArea,
        deliveryLandmark
      });
      triggerSuccess(`Order dispatched! Driver ${driverName} assigned successfully.`);
      setSelectedOrder(null);
      setSelectedDriverId('');
      setDriverName('');
      setDriverPhone('');
      setDeliveryStreet('');
      setDeliveryFloor('');
      setDeliveryArea('');
      setDeliveryLandmark('');
      fetchAdminData();
      fetchNotifications();
    } catch (err) {
      triggerError(err.message);
    }
  };

  // CSV Exporter
  const handleExportCSV = (roleType) => {
    const targetUsers = users.filter(u => u.role === roleType);
    if (targetUsers.length === 0) {
      return triggerError(`No users with role ${roleType.toUpperCase()} found to export.`);
    }

    // Define columns
    const headers = ['ID', 'Name', 'Email', 'Role', 'Created At'];
    
    const csvRows = [
      headers.join(','), // Header row
      ...targetUsers.map(u => [
        u._id || u.id,
        `"${u.name}"`,
        `"${u.email}"`,
        u.role,
        u.createdAt || ''
      ].join(','))
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `medtrack_${roleType}s_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerSuccess(`Exported ${targetUsers.length} ${roleType} records to CSV.`);
  };

  // App Releases Handlers
  const handleReleaseFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setReleaseFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => setReleaseFileData(reader.result);
    reader.readAsDataURL(file);
  };

  const handleIpaFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setReleaseIpaFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => setReleaseIpaFileData(reader.result);
    reader.readAsDataURL(file);
  };

  const handleReleasePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setReleasePhotoFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => setReleasePhoto(reader.result);
    reader.readAsDataURL(file);
  };

  const resetReleaseForm = () => {
    setReleaseName('');
    setReleaseVersion('');
    setReleaseDesc('');
    setReleaseFileName('');
    setReleaseFileData('');
    setReleaseIpaFileName('');
    setReleaseIpaFileData('');
    setReleasePhoto('');
    setReleasePhotoFileName('');
    const apkInput = document.getElementById('releaseFile');
    if (apkInput) apkInput.value = '';
    const ipaInput = document.getElementById('releaseIpaFile');
    if (ipaInput) ipaInput.value = '';
    const photoInput = document.getElementById('releasePhotoFile');
    if (photoInput) photoInput.value = '';
  };

  const handleSaveRelease = async (e) => {
    e.preventDefault();
    if (!releaseName || !releaseVersion) {
      return triggerError('App name and version are required.');
    }
    if (!releaseFileData && !releaseIpaFileData) {
      return triggerError('Please attach at least one file (.apk or .ipa).');
    }

    setIsUploadingRelease(true);
    try {
      await api.post('/releases', {
        name: releaseName,
        version: releaseVersion,
        description: releaseDesc,
        // APK
        fileName: releaseFileName,
        fileData: releaseFileData,
        // IPA
        ipaFileName: releaseIpaFileName,
        ipaFileData: releaseIpaFileData,
        // Photo
        photo: releasePhoto,
        photoFileName: releasePhotoFileName
      });
      triggerSuccess(`App release "${releaseName}" uploaded successfully.`);
      resetReleaseForm();
      setShowReleaseForm(false);
      fetchAdminData();
    } catch (err) {
      triggerError(err.message);
    } finally {
      setIsUploadingRelease(false);
    }
  };

  const handleDeleteRelease = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the release "${name}"?`)) return;

    try {
      await api.delete(`/releases/${id}`);
      triggerSuccess(`Release "${name}" deleted successfully.`);
      fetchAdminData();
    } catch (err) {
      triggerError(err.message);
    }
  };

  const handleAdminSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || isSendingReply) return;

    setIsSendingReply(true);
    try {
      const data = await api.post(`/contact/ticket/${activeTicket}/reply`, {
        text: replyText
      });
      setActiveTicketData(data);
      setReplyText('');
      
      // Refresh ticket list to update badges/sorting
      const ticketData = await api.get('/contact');
      setTickets(ticketData || []);
      
      triggerSuccess('Reply sent successfully.');
    } catch (err) {
      console.error('Failed to send admin reply:', err);
      triggerError('Failed to send reply');
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleFactoryReset = async () => {
    if (!window.confirm("⚠️ DANGER ZONE! ⚠️\n\nAre you sure you want to perform a factory reset?\nThis will clear all changes and restore default demo data!")) return;
    if (!window.confirm("FINAL CONFIRMATION: Restoring default seed data will log you out. Proceed?")) return;

    try {
      await api.post('/admin/factory-reset');
      triggerSuccess('System reset successfully. Logging out to reload...');
      setTimeout(() => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }, 3000);
    } catch (err) {
      console.error('Factory reset failed:', err);
      triggerError(err.message || 'Factory reset failed');
    }
  };

  // Filtered Users List
  const filteredUsers = users.filter(u => {
    if (!u || !u.name || !u.email) return false;
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="container" style={{ padding: '40px 0 80px 0' }}>
      
      {/* Hello Bar */}
      <div style={{ marginBottom: '32px' }} className="animate-fade-in-up">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={32} style={{ color: 'var(--primary-blue)' }} />
            System Administration Panel
          </h1>

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
                  fontWeight: 800, animation: 'pulse 2s infinite'
                }}>{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </button>

            {showNotifPanel && (
              <div style={{
                position: 'absolute', right: 0, top: '56px',
                width: '380px', maxHeight: '460px', overflowY: 'auto',
                background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)',
                borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
                zIndex: 500
              }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>🔔 Notifications ({notifications.length})</span>
                  {notifications.length > 0 && (
                    <button onClick={handleClearAllNotifs} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger-red)', fontSize: '0.8rem', fontWeight: 600 }}>Clear All</button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    No notifications yet
                  </div>
                ) : (
                  notifications.slice(0, 20).map(notif => (
                    <div
                      key={notif._id}
                      onClick={() => handleMarkNotifRead(notif._id)}
                      style={{
                        padding: '14px 20px',
                        borderBottom: '1px solid var(--glass-border)',
                        cursor: 'pointer',
                        background: notif.isRead ? 'transparent' : 'rgba(59, 130, 246, 0.04)',
                        transition: 'background 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>
                          {notif.type === 'order_dispatch' ? '🛵' : notif.type === 'new_order' ? '📦' : notif.type === 'approval' ? '✅' : '🔔'}
                        </span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: notif.isRead ? 500 : 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{notif.title}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>{notif.message}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '6px' }}>
                            <Clock size={10} style={{ verticalAlign: 'middle', marginRight: '3px' }} />
                            {new Date(notif.createdAt).toLocaleString()}
                          </div>
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
        <p style={{ color: 'var(--text-secondary)' }}>Oversee user registrations, active consults, approval pipelines, and audit system logs.</p>

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

        {/* Analytics Grid */}
        <div className="grid-3" style={{ marginTop: '24px' }}>
          <GlassCard style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'var(--primary-blue-glow)', color: 'var(--primary-blue)', borderRadius: '12px' }}>
              <Users size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Total Accounts</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.totalUsers}</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                Patients: {stats.totalPatients} | Doctors: {stats.totalDoctors}
              </span>
            </div>
          </GlassCard>

          <GlassCard style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(20, 184, 166, 0.1)', color: 'var(--accent-teal)', borderRadius: '12px' }}>
              <Calendar size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Active Appointments</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.totalAppointments}</h3>
            </div>
          </GlassCard>

          <GlassCard style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            border: stats.pendingDoctors > 0 ? '1.5px solid var(--warning-orange)' : '1px solid var(--glass-border)',
            boxShadow: stats.pendingDoctors > 0 ? '0 0 15px rgba(245, 158, 11, 0.15)' : 'var(--glass-shadow)'
          }}>
            <div style={{ 
              padding: '12px', 
              background: stats.pendingDoctors > 0 ? 'rgba(245, 158, 11, 0.15)' : 'var(--primary-blue-glow)', 
              color: stats.pendingDoctors > 0 ? 'var(--warning-orange)' : 'var(--primary-blue)',
              borderRadius: '12px' 
            }}>
              <UserCheck size={24} />
            </div>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Pending Doctor Approvals</span>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{stats.pendingDoctors}</h3>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Horizontal Tabbed Responsive Layout */}
      <div style={{ display: 'flex', gap: '24px', flexDirection: 'column', marginTop: '32px' }} className="admin-dashboard-layout">
        
        {/* Horizontal Navigation */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row', 
          flexWrap: 'wrap', 
          gap: '6px', 
          padding: '8px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '12px',
          border: '1px solid var(--glass-border)',
          backdropFilter: 'blur(10px)'
        }} className="admin-navbar-horizontal">
          {[
            { id: 'users', name: 'User Management', icon: <Users size={16} /> },
            { id: 'approvals', name: `Approval Pipeline (${stats.pendingDoctors})`, icon: <UserCheck size={16} /> },
            { id: 'drivers', name: `Driver Management ${stats.pendingDrivers > 0 ? `(${stats.pendingDrivers})` : ''}`, icon: <Truck size={16} /> },
            { id: 'team', name: 'Our Team Management', icon: <Users size={16} /> },
            { id: 'reviews', name: 'Review Moderation', icon: <MessageSquare size={16} /> },
            { id: 'gallery', name: 'Gallery Manager', icon: <Image size={16} /> },
            { id: 'shop', name: 'Shop Inventory', icon: <ShoppingBag size={16} /> },
            { id: 'orders', name: 'Order Dispatcher', icon: <ShoppingCart size={16} /> },
            { id: 'revenue', name: 'Revenue & Earnings', icon: <span style={{fontSize:'14px'}}>💰</span> },
            { id: 'logs', name: 'System Audit Logs', icon: <FileText size={16} /> },
            { id: 'releases', name: 'App Releases', icon: <Download size={16} /> },
            { id: 'messages', name: 'Get in Touch', icon: <MessageSquare size={16} /> },
            { id: 'locations', name: 'Delivery Locations', icon: <MapPin size={16} /> },
            { id: 'homepage-ads', name: 'Homepage Ad Manager', icon: <Monitor size={16} /> },
            { id: 'collaborators', name: 'Collaborators Panel', icon: <Users size={16} /> },
            { id: 'customization', name: 'Site Customization', icon: <Settings size={16} /> },
            { id: 'reset', name: 'Factory Reset', icon: <span style={{fontSize:'14px'}}>🔄</span> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                border: 'none',
                background: activeTab === tab.id ? 'var(--primary-blue-glow)' : 'transparent',
                color: activeTab === tab.id ? 'var(--primary-blue)' : 'var(--text-secondary)',
                fontWeight: activeTab === tab.id ? 700 : 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '3px solid var(--primary-blue)' : '3px solid transparent',
                borderRadius: '6px',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Pane */}
        <div style={{ width: '100%' }} className="admin-main-content">
          <div className="tab-content animate-fade-in-up">
        
        {/* User Management Panel */}
        {activeTab === 'users' && (
          <GlassCard>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Registered Accounts Vault</h3>
            
            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ flexGrow: 1, position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ paddingLeft: '40px' }}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Search by User Name or Email Address..."
                />
              </div>
              <select 
                className="form-control"
                style={{ width: 'auto', minWidth: '160px' }}
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
              >
                <option value="">All Account Roles</option>
                <option value="patient">Patients</option>
                <option value="doctor">Doctors</option>
                <option value="admin">Administrators</option>
              </select>
            </div>

            {/* Users Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.9rem',
                textAlign: 'left'
              }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '12px 8px' }}>Photo</th>
                    <th style={{ padding: '12px 8px' }}>User Name</th>
                    <th style={{ padding: '12px 8px' }}>Email Address</th>
                    <th style={{ padding: '12px 8px' }}>Role</th>
                    <th style={{ padding: '12px 8px' }}>Registration status</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '24px 8px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                        No records found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => (
                      <tr key={u._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '10px 8px' }}>
                          {u.photo ? (
                            <img 
                              src={u.photo} 
                              alt={u.name} 
                              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--glass-border)' }} 
                            />
                          ) : (
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, var(--primary-blue), var(--accent-teal))',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '0.85rem'
                            }}>
                              {u.name.charAt(0)}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '14px 8px', fontWeight: 600 }}>{u.name}</td>
                        <td style={{ padding: '14px 8px' }}>{u.email}</td>
                        <td style={{ padding: '14px 8px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            background: 
                              u.role === 'admin' ? 'rgba(239, 68, 68, 0.1)' :
                              u.role === 'doctor' ? 'rgba(20, 184, 166, 0.1)' : 'var(--primary-blue-glow)',
                            color:
                              u.role === 'admin' ? 'var(--danger-red)' :
                              u.role === 'doctor' ? 'var(--accent-teal)' : 'var(--primary-blue)'
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ padding: '14px 8px' }}>
                          <span style={{
                            fontSize: '0.8rem',
                            color: u.role === 'doctor' && !u.doctorApproved ? 'var(--warning-orange)' : 'var(--success-green)',
                            fontWeight: 600
                          }}>
                            {u.role === 'doctor' && !u.doctorApproved ? 'Pending Approval' : 'Active'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            <select
                              value={u.role}
                              onChange={(e) => {
                                if (window.confirm(`Change ${u.name}'s role to ${e.target.value}?`)) {
                                  handleUpdateUserRole(u._id || u.id, e.target.value);
                                }
                              }}
                              style={{
                                padding: '6px 8px',
                                borderRadius: '6px',
                                background: 'var(--bg-primary)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--glass-border)',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer'
                              }}
                            >
                              <option value="patient">Patient</option>
                              <option value="doctor">Doctor</option>
                              <option value="driver">Driver</option>
                              <option value="admin">Admin</option>
                            </select>
                            <button
                              onClick={() => handleDeleteUser(u._id || u.id, u.name)}
                              className="btn btn-secondary"
                              style={{
                                padding: '6px 10px',
                                fontSize: '0.75rem',
                                color: 'var(--danger-red)',
                                borderColor: 'rgba(239, 68, 68, 0.15)'
                              }}
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}

        {/* Pending Approvals Panel */}
        {activeTab === 'approvals' && (
          <GlassCard>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Doctor Verification Pipeline</h3>
            
            {users.filter(u => u.role === 'doctor' && !u.doctorApproved).length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No new doctor registration requests currently pending review.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {users.filter(u => u.role === 'doctor' && !u.doctorApproved).map(doc => (
                  <div key={doc._id} style={{
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
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Dr. {doc.name}</h4>
                      <span style={{ color: 'var(--primary-blue)', fontWeight: 600, fontSize: '0.85rem' }}>
                        Email: {doc.email} | Specialization: {doc.doctorDetails?.specialization} | Experience: {doc.doctorDetails?.experience} Years
                      </span>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                        Clinic Details: {doc.doctorDetails?.clinicInfo}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setDetailDoctor(doc)}
                        className="btn btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                      >
                        🔍 View Credentials
                      </button>
                      <button
                        onClick={() => handleApproveDoctor(doc._id, doc.name, true)}
                        className="btn btn-teal"
                        style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                      >
                        <Check size={14} /> Approve License
                      </button>
                      <button
                        onClick={() => { if (window.confirm(`Reject Dr. ${doc.name}?`)) handleApproveDoctor(doc._id, doc.name, false); }}
                        className="btn btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '0.85rem', color: 'var(--danger-red)' }}
                      >
                        <X size={14} /> Reject Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        )}

        {/* Audit Trail Logs Panel */}
        {activeTab === 'logs' && (
          <GlassCard>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Platform Activity Logs (Audit Trail)</h3>
            
            {logs.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No audit logs recorded yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '450px', overflowY: 'auto' }}>
                {logs.map((log, index) => (
                  <div key={log._id || index} style={{
                    padding: '12px 16px',
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div>
                      <strong style={{
                        color:
                          log.action === 'DELETE_USER' || log.action === 'REJECT_DOCTOR' ? 'var(--danger-red)' :
                          log.action === 'APPROVE_DOCTOR' ? 'var(--success-green)' : 'var(--primary-blue)',
                        marginRight: '8px'
                      }}>
                        [{log.action}]
                      </strong>
                      <span>{log.details}</span>
                      <br />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                        Actor: {log.userName} ({log.userRole})
                      </span>
                    </div>
                    
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {log.timestamp?.replace('T', ' ').split('.')[0]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        )}

        {/* Driver Management Panel */}
        {activeTab === 'drivers' && (
          <GlassCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Truck size={22} /> Driver Management
              </h3>
              <button onClick={fetchAdminData} style={{ padding: '8px 16px', border: '1px solid var(--glass-border)', borderRadius: '8px', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem' }}>
                🔄 Refresh
              </button>
            </div>

            {/* Pending Approval Section */}
            {(() => {
              const pendingDrivers = users.filter(u => u.role === 'driver' && !u.driverDetails?.approved);
              return pendingDrivers.length > 0 ? (
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: 'var(--warning-orange)', color: 'white', borderRadius: '12px', padding: '2px 10px', fontSize: '0.8rem' }}>{pendingDrivers.length}</span>
                    Pending Driver Approvals
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {pendingDrivers.map(driver => (
                      <div key={driver._id} style={{
                        background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.05))',
                        border: '1px solid rgba(245,158,11,0.4)',
                        borderRadius: '14px', padding: '20px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                            <div style={{
                              width: '52px', height: '52px', borderRadius: '50%',
                              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'white', fontWeight: 800, fontSize: '1.3rem', flexShrink: 0
                            }}>{driver.name?.charAt(0)}</div>
                            <div>
                              <h4 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '4px' }}>{driver.name}</h4>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>{driver.email}</p>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.8rem' }}>
                                <span style={{ background: 'var(--bg-primary)', padding: '3px 10px', borderRadius: '10px' }}>
                                  🚗 {driver.driverDetails?.vehicleName} · {driver.driverDetails?.vehicleNumber}
                                </span>
                                <span style={{ background: 'var(--bg-primary)', padding: '3px 10px', borderRadius: '10px' }}>
                                  🪪 {driver.driverDetails?.licenseNumber}
                                </span>
                                <span style={{ background: 'var(--bg-primary)', padding: '3px 10px', borderRadius: '10px' }}>
                                  🎂 Age: {driver.driverDetails?.age}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '10px', flexShrink: 0, flexWrap: 'wrap' }}>
                            <button
                              onClick={() => setDetailDriver(driver)}
                              style={{ padding: '10px 20px', background: 'var(--primary-blue)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                            >🔍 View Details</button>
                            <button
                              onClick={() => handleApproveDriver(driver._id, driver.name, true)}
                              style={{ padding: '10px 20px', background: 'var(--success-green)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                            ><Check size={16} /> Approve</button>
                            <button
                              onClick={() => { if (window.confirm(`Reject and remove driver ${driver.name}?`)) handleApproveDriver(driver._id, driver.name, false); }}
                              style={{ padding: '10px 20px', background: 'var(--danger-red)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                            ><X size={16} /> Reject</button>
                          </div>
                        </div>

                        {/* License Photo Preview */}
                        {driver.driverDetails?.licensePhoto && (
                          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid var(--glass-border)' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>📸 License Photo:</p>
                            <img src={driver.driverDetails.licensePhoto} alt="License" style={{ maxHeight: '160px', maxWidth: '100%', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--glass-border)' }} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}

            {/* Approved / Active Drivers */}
            {(() => {
              const approvedDrivers = users.filter(u => u.role === 'driver' && u.driverDetails?.approved);
              return (
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ background: 'var(--success-green)', color: 'white', borderRadius: '12px', padding: '2px 10px', fontSize: '0.8rem' }}>{approvedDrivers.length}</span>
                    Approved Drivers
                  </h4>
                  {approvedDrivers.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No approved drivers yet. Approve registrations above.</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                      {approvedDrivers.map(driver => {
                        const statusColor = driver.driverDetails?.status === 'active' ? 'var(--success-green)' : driver.driverDetails?.status === 'on_delivery' ? 'var(--warning-orange)' : 'var(--danger-red)';
                        return (
                          <div key={driver._id} style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '18px', border: '1px solid var(--glass-border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-blue), var(--accent-teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, flexShrink: 0 }}>
                                {driver.name?.charAt(0)}
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{driver.name}</h4>
                                <span style={{ background: `${statusColor}20`, color: statusColor, padding: '1px 8px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 700 }}>
                                  ● {driver.driverDetails?.status === 'active' ? 'Online' : driver.driverDetails?.status === 'on_delivery' ? 'On Delivery' : 'Offline'}
                                </span>
                              </div>
                            </div>
                            <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-secondary)' }}>
                              <div>🚗 <strong style={{ color: 'var(--text-primary)' }}>{driver.driverDetails?.vehicleName}</strong> · {driver.driverDetails?.vehicleNumber}</div>
                              <div>🪪 License: {driver.driverDetails?.licenseNumber}</div>
                              <div>📧 {driver.email}</div>
                            </div>
                            <button
                              onClick={() => { if (window.confirm(`Delete driver ${driver.name}?`)) handleDeleteUser(driver._id, driver.name); }}
                              style={{ marginTop: '12px', width: '100%', padding: '8px', background: 'transparent', border: '1px solid var(--danger-red)', borderRadius: '8px', color: 'var(--danger-red)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                            ><Trash2 size={14} /> Remove Driver</button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
          </GlassCard>
        )}

        {/* Our Team Management Panel */}
        {activeTab === 'team' && (
          <GlassCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Development Team Management</h3>
              {!showTeamForm && (
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setEditingId(null);
                    setTeamName('');
                    setTeamEmail('');
                    setTeamRole('');
                    setTeamDesc('');
                    setTeamPhoto('');
                    setTeamContact('');
                    setTeamInsta('');
                    setTeamFb('');
                    setShowTeamForm(true);
                  }}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} /> Add Team Member
                </button>
              )}
            </div>

            {showTeamForm && (
              <div style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '28px'
              }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 700 }}>
                  {isEditing ? 'Edit Team Member Details' : 'Register New Team Member'}
                </h4>
                <form onSubmit={handleSaveTeamMember}>
                  <div className="grid-2" style={{ gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={teamName}
                        onChange={e => setTeamName(e.target.value)}
                        placeholder="E.g. Dipendra Upadhayay"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input 
                        type="email" 
                        className="form-control" 
                        value={teamEmail}
                        onChange={e => setTeamEmail(e.target.value)}
                        placeholder="E.g. dipendra@gmail.com"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Role *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={teamRole}
                        onChange={e => setTeamRole(e.target.value)}
                        placeholder="E.g. Backend Developer"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Contact Number</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={teamContact}
                        onChange={e => setTeamContact(e.target.value)}
                        placeholder="E.g. +91 8886665432"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Instagram Profile Link</label>
                      <input 
                        type="url" 
                        className="form-control" 
                        value={teamInsta}
                        onChange={e => setTeamInsta(e.target.value)}
                        placeholder="E.g. https://instagram.com/username"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Facebook Profile Link</label>
                      <input 
                        type="url" 
                        className="form-control" 
                        value={teamFb}
                        onChange={e => setTeamFb(e.target.value)}
                        placeholder="E.g. https://facebook.com/username"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Profile Description</label>
                    <textarea 
                      className="form-control" 
                      value={teamDesc}
                      onChange={e => setTeamDesc(e.target.value)}
                      placeholder="Write a brief bio about their contributions..."
                      rows="2"
                    ></textarea>
                  </div>

                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label">Profile Photo (Base64 file upload)</label>
                    <input 
                      type="file" 
                      className="form-control" 
                      onChange={handleTeamPhotoUpload}
                      accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                    />
                    {teamPhoto && (
                      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img 
                          src={teamPhoto} 
                          alt="Preview" 
                          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--glass-border)' }} 
                        />
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-teal)', fontWeight: 600 }}>Image upload loaded successfully</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>
                      {isEditing ? 'Update Details' : 'Create Member'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowTeamForm(false)} 
                      className="btn btn-secondary"
                      style={{ padding: '10px 20px' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.9rem',
                textAlign: 'left'
              }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '12px 8px' }}>Photo</th>
                    <th style={{ padding: '12px 8px' }}>Name</th>
                    <th style={{ padding: '12px 8px' }}>Role</th>
                    <th style={{ padding: '12px 8px' }}>Email</th>
                    <th style={{ padding: '12px 8px' }}>Contact No</th>
                    <th style={{ padding: '12px 8px' }}>Socials</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '24px 8px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                        No team members configured. Visit the About Us page to seed defaults, or add a member above.
                      </td>
                    </tr>
                  ) : (
                    teamMembers.map(member => (
                      <tr key={member._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '10px 8px' }}>
                          {member.photo ? (
                            <img 
                              src={member.photo} 
                              alt={member.name} 
                              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--glass-border)' }} 
                            />
                          ) : (
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, var(--primary-blue), var(--accent-teal))',
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '0.95rem'
                            }}>
                              {member.name.charAt(0)}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '14px 8px', fontWeight: 600 }}>{member.name}</td>
                        <td style={{ padding: '14px 8px' }}>{member.role}</td>
                        <td style={{ padding: '14px 8px' }}>{member.email}</td>
                        <td style={{ padding: '14px 8px' }}>{member.contactNumber || '-'}</td>
                        <td style={{ padding: '14px 8px' }}>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            {member.instagramLink ? (
                              <a href={member.instagramLink} target="_blank" rel="noreferrer" title="Instagram" style={{ color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#e1306c'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary-blue)'}>
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                </svg>
                              </a>
                            ) : <span style={{ color: 'var(--text-light)' }}>-</span>}
                            {member.facebookLink ? (
                              <a href={member.facebookLink} target="_blank" rel="noreferrer" title="Facebook" style={{ color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#1877f2'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--primary-blue)'}>
                                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                </svg>
                              </a>
                            ) : <span style={{ color: 'var(--text-light)' }}>-</span>}
                          </div>
                        </td>
                        <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              onClick={() => handleEditTeamClick(member)}
                              className="btn btn-secondary"
                              style={{ padding: '6px 10px', fontSize: '0.75rem', color: 'var(--primary-blue)' }}
                            >
                              <Edit size={12} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteTeamMember(member._id, member.name)}
                              className="btn btn-secondary"
                              style={{ padding: '6px 10px', fontSize: '0.75rem', color: 'var(--danger-red)', borderColor: 'rgba(239, 68, 68, 0.15)' }}
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}

        {/* CSV Exporter Panel */}
        {activeTab === 'export' && (
          <div className="grid-2" style={{ gap: '32px' }}>
            <GlassCard style={{ textAlign: 'center', padding: '36px' }}>
              <Users size={36} style={{ color: 'var(--primary-blue)', marginBottom: '12px' }} />
              <h3>Export Patient Data</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '8px 0 24px 0' }}>
                Download structured records of all registered patients, including email directories and profile indices, in CSV format.
              </p>
              <button 
                onClick={() => handleExportCSV('patient')}
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Download size={16} /> Export Patients CSV
              </button>
            </GlassCard>

            <GlassCard style={{ textAlign: 'center', padding: '36px' }}>
              <UserCheck size={36} style={{ color: 'var(--accent-teal)', marginBottom: '12px' }} />
              <h3>Export Doctor Listings</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '8px 0 24px 0' }}>
                Download directories of all clinical accounts, specializing credentials, and experience indices in CSV format.
              </p>
              <button 
                onClick={() => handleExportCSV('doctor')}
                className="btn btn-teal" 
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Download size={16} /> Export Doctors CSV
              </button>
            </GlassCard>
          </div>
        )}

        {/* Review Moderation Panel */}
        {activeTab === 'reviews' && (
          <GlassCard>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Patient Feedback & Reviews Moderation</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
              Approve or delete reviews submitted by patients from the Home Page. Approved reviews are displayed in the testimonials section of the website.
            </p>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.9rem',
                textAlign: 'left'
              }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '12px 8px' }}>User Info</th>
                    <th style={{ padding: '12px 8px' }}>Rating</th>
                    <th style={{ padding: '12px 8px' }}>Comment</th>
                    <th style={{ padding: '12px 8px' }}>Status</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allReviews.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: '24px 8px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                        No reviews submitted yet.
                      </td>
                    </tr>
                  ) : (
                    allReviews.map(review => (
                      <tr key={review._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '14px 8px' }}>
                          <div style={{ fontWeight: 600 }}>{review.name}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{review.email}</div>
                        </td>
                        <td style={{ padding: '14px 8px', color: 'var(--warning-orange)', fontWeight: 700 }}>
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </td>
                        <td style={{ padding: '14px 8px', maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                          {review.comment}
                        </td>
                        <td style={{ padding: '14px 8px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: review.approved ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            color: review.approved ? 'var(--success-green)' : 'var(--warning-orange)'
                          }}>
                            {review.approved ? 'Approved' : 'Pending Approval'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              onClick={() => handleToggleReviewApprove(review._id, review.approved)}
                              className="btn btn-secondary"
                              style={{ 
                                padding: '6px 10px', 
                                fontSize: '0.75rem', 
                                color: review.approved ? 'var(--warning-orange)' : 'var(--success-green)',
                                borderColor: review.approved ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)'
                              }}
                            >
                              {review.approved ? 'Unapprove' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleDeleteReview(review._id)}
                              className="btn btn-secondary"
                              style={{ padding: '6px 10px', fontSize: '0.75rem', color: 'var(--danger-red)', borderColor: 'rgba(239, 68, 68, 0.15)' }}
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}

        {/* Gallery Manager Panel */}
        {activeTab === 'gallery' && (
          <GlassCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Media Gallery Manager</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                  Manage the photos and videos displayed on the public Gallery page.
                </p>
              </div>
              {!showGalleryForm && (
                <button 
                  onClick={() => {
                    setGalType('photo');
                    setGalTitle('');
                    setGalSource('link');
                    setGalUrl('');
                    setShowGalleryForm(true);
                  }}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} /> Add Gallery Media
                </button>
              )}
            </div>

            {showGalleryForm && (
              <div style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '28px'
              }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 700 }}>
                  Upload or Link New Gallery Media
                </h4>
                <form onSubmit={handleSaveGalleryItem}>
                  <div className="grid-3" style={{ gap: '16px', marginBottom: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Media Type *</label>
                      <select 
                        className="form-control" 
                        value={galType}
                        onChange={e => setGalType(e.target.value)}
                        required
                      >
                        <option value="photo">Photo</option>
                        <option value="video">Video</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Source Type *</label>
                      <select 
                        className="form-control" 
                        value={galSource}
                        onChange={e => {
                          setGalSource(e.target.value);
                          setGalUrl('');
                        }}
                        required
                      >
                        <option value="link">External Web Link</option>
                        <option value="upload">Base64 File Upload</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Media Title *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={galTitle}
                        onChange={e => setGalTitle(e.target.value)}
                        placeholder="E.g. ACET Annual Medical Camp 2026"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label">
                      {galSource === 'upload' ? 'Upload Media File *' : 'Media URL Link *'}
                    </label>
                    {galSource === 'upload' ? (
                      <input 
                        type="file" 
                        className="form-control" 
                        onChange={handleGalleryFileUpload}
                        accept={galType === 'photo' ? 'image/jpeg,image/png,image/gif,image/webp,image/jpg' : 'video/mp4,video/webm,video/ogg,video/quicktime'}
                        required
                        capture={undefined}
                      />
                    ) : (
                      <input 
                        type="url" 
                        className="form-control" 
                        value={galUrl}
                        onChange={e => setGalUrl(e.target.value)}
                        placeholder={galType === 'photo' ? 'E.g. https://images.unsplash.com/...' : 'E.g. https://www.youtube.com/watch?v=...'}
                        required
                      />
                    )}
                    
                    {galUrl && galType === 'photo' && (
                      <div style={{ marginTop: '12px' }}>
                        <img 
                          src={galUrl} 
                          alt="Preview" 
                          style={{ maxHeight: '150px', borderRadius: '8px', border: '1px solid var(--glass-border)' }} 
                        />
                      </div>
                    )}

                    {galUrl && galType === 'video' && galSource === 'link' && (
                      <div style={{ marginTop: '12px', fontSize: '0.85rem', color: 'var(--accent-teal)', fontWeight: 600 }}>
                        Video link registered: {galUrl}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>
                      Add to Gallery
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowGalleryForm(false)} 
                      className="btn btn-secondary"
                      style={{ padding: '10px 20px' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.9rem',
                textAlign: 'left'
              }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '12px 8px' }}>Preview</th>
                    <th style={{ padding: '12px 8px' }}>Title</th>
                    <th style={{ padding: '12px 8px' }}>Type</th>
                    <th style={{ padding: '12px 8px' }}>Source</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {galleryItems.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: '24px 8px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                        No gallery items added yet.
                      </td>
                    </tr>
                  ) : (
                    galleryItems.map(item => (
                      <tr key={item._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '10px 8px' }}>
                          {item.type === 'photo' ? (
                            <img 
                              src={item.url} 
                              alt={item.title} 
                              style={{ width: '60px', height: '40px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--glass-border)' }} 
                            />
                          ) : (
                            <div style={{
                              width: '60px',
                              height: '40px',
                              borderRadius: '4px',
                              background: '#1a1a1a',
                              color: '#fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 600
                            }}>
                              Video
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '14px 8px', fontWeight: 600 }}>{item.title}</td>
                        <td style={{ padding: '14px 8px', textTransform: 'capitalize' }}>{item.type}</td>
                        <td style={{ padding: '14px 8px', textTransform: 'capitalize' }}>{item.source}</td>
                        <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDeleteGalleryItem(item._id)}
                            className="btn btn-secondary"
                            style={{ padding: '6px 10px', fontSize: '0.75rem', color: 'var(--danger-red)', borderColor: 'rgba(239, 68, 68, 0.15)' }}
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}

        {/* Shop Inventory Panel */}
        {activeTab === 'shop' && (
          <GlassCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Pharmacy Store Inventory</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                  Add, update, or remove medical catalog items and update stock counts.
                </p>
              </div>
              {!showShopForm && (
                <button 
                  onClick={() => {
                    setIsEditingShop(false);
                    setEditingShopId(null);
                    setShopItemName('');
                    setShopItemDesc('');
                    setShopItemPriceINR(0);
                    setShopItemPriceUSD(0);
                    setShopItemStocks(0);
                    setShopItemPhoto('');
                    setShopItemCategory('Medicine');
                    setShowShopForm(true);
                  }}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} /> Add Inventory Item
                </button>
              )}
            </div>

            {showShopForm && (
              <div style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '28px'
              }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', fontWeight: 700 }}>
                  {isEditingShop ? 'Edit Inventory Item' : 'Add New Inventory Item'}
                </h4>
                <form onSubmit={handleSaveShopItem}>
                  <div className="grid-3" style={{ gap: '16px', marginBottom: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Item Name *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={shopItemName}
                        onChange={e => setShopItemName(e.target.value)}
                        placeholder="E.g. Paracetamol 500mg"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select 
                        className="form-control"
                        value={shopItemCategory}
                        onChange={e => setShopItemCategory(e.target.value)}
                        required
                      >
                        <option value="Medicine">Medicine / Drugs</option>
                        <option value="Device">Medical Devices</option>
                        <option value="Wellness">Wellness & Hygiene</option>
                        <option value="Other">Other Supply</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Stock Levels *</label>
                      <input 
                        type="number" 
                        min="0"
                        className="form-control" 
                        value={shopItemStocks}
                        onChange={e => setShopItemStocks(e.target.value)}
                        placeholder="Quantity"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid-2" style={{ gap: '16px', marginBottom: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Price in Indian Currency (INR, ₹) *</label>
                      <input 
                        type="number" 
                        min="0"
                        step="0.01"
                        className="form-control" 
                        value={shopItemPriceINR}
                        onChange={e => setShopItemPriceINR(e.target.value)}
                        placeholder="Price in ₹"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Price in USD ($) *</label>
                      <input 
                        type="number" 
                        min="0"
                        step="0.01"
                        className="form-control" 
                        value={shopItemPriceUSD}
                        onChange={e => setShopItemPriceUSD(e.target.value)}
                        placeholder="Price in $"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Item Description *</label>
                    <textarea 
                      className="form-control" 
                      value={shopItemDesc}
                      onChange={e => setShopItemDesc(e.target.value)}
                      placeholder="Write brief description of uses or dosage..."
                      rows="2"
                      required
                    ></textarea>
                  </div>

                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label className="form-label">Item Image (Base64 file upload) *</label>
                    <input 
                      type="file" 
                      className="form-control" 
                      onChange={handleShopPhotoUpload}
                      accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                      required={!isEditingShop}
                    />
                    {shopItemPhoto && (
                      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img 
                          src={shopItemPhoto} 
                          alt="Preview" 
                          style={{ width: '60px', height: '60px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--glass-border)' }} 
                        />
                        <span style={{ fontSize: '0.8rem', color: 'var(--accent-teal)', fontWeight: 600 }}>Item photo loaded successfully</span>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '10px 20px' }}>
                      {isEditingShop ? 'Update Item' : 'Add Item'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowShopForm(false)} 
                      className="btn btn-secondary"
                      style={{ padding: '10px 20px' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.9rem',
                textAlign: 'left'
              }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '12px 8px' }}>Image</th>
                    <th style={{ padding: '12px 8px' }}>Name</th>
                    <th style={{ padding: '12px 8px' }}>Category</th>
                    <th style={{ padding: '12px 8px' }}>Stock</th>
                    <th style={{ padding: '12px 8px' }}>INR Price</th>
                    <th style={{ padding: '12px 8px' }}>USD Price</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shopItems.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '24px 8px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                        No inventory items added yet.
                      </td>
                    </tr>
                  ) : (
                    shopItems.map(item => (
                      <tr key={item._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '10px 8px' }}>
                          <img 
                            src={item.photo} 
                            alt={item.name} 
                            style={{ width: '48px', height: '36px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--glass-border)' }} 
                          />
                        </td>
                        <td style={{ padding: '14px 8px', fontWeight: 600 }}>{item.name}</td>
                        <td style={{ padding: '14px 8px' }}>{item.category}</td>
                        <td style={{ padding: '14px 8px', color: item.stocks > 0 ? 'inherit' : 'var(--danger-red)', fontWeight: item.stocks > 0 ? 500 : 700 }}>
                          {item.stocks}
                        </td>
                        <td style={{ padding: '14px 8px', fontWeight: 600 }}>₹{item.priceINR}</td>
                        <td style={{ padding: '14px 8px' }}>${item.priceUSD.toFixed(2)}</td>
                        <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              onClick={() => handleEditShopClick(item)}
                              className="btn btn-secondary"
                              style={{ padding: '6px 10px', fontSize: '0.75rem', color: 'var(--primary-blue)' }}
                            >
                              <Edit size={12} /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteShopItem(item._id, item.name)}
                              className="btn btn-secondary"
                              style={{ padding: '6px 10px', fontSize: '0.75rem', color: 'var(--danger-red)', borderColor: 'rgba(239, 68, 68, 0.15)' }}
                            >
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}

        {/* Order Dispatcher Panel */}
        {activeTab === 'orders' && (
          <GlassCard>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Campus Pharmacy Orders Dispatcher</h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '0.9rem',
                textAlign: 'left'
              }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '12px 8px' }}>Order Details</th>
                    <th style={{ padding: '12px 8px' }}>Patient Info</th>
                    <th style={{ padding: '12px 8px' }}>Delivery Address</th>
                    <th style={{ padding: '12px 8px' }}>Items Ordered</th>
                    <th style={{ padding: '12px 8px' }}>Total Amount</th>
                    <th style={{ padding: '12px 8px' }}>Status</th>
                    <th style={{ padding: '12px 8px', textAlign: 'right' }}>Dispatcher Action</th>
                  </tr>
                </thead>
                <tbody>
                  {adminOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '24px 8px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                        No orders received yet.
                      </td>
                    </tr>
                  ) : (
                    adminOrders.map(order => (
                      <tr key={order._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '14px 8px' }}>
                          <div style={{ fontWeight: 600, fontSize: '0.8rem' }}>ID: {order._id.substring(0, 10)}...</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{order.createdAt?.replace('T', ' ').split('.')[0]}</div>
                        </td>
                        <td style={{ padding: '14px 8px' }}>
                          <div style={{ fontWeight: 600 }}>{order.patientName}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}><Phone size={10} style={{ verticalAlign: 'middle', marginRight: '2px' }} /> {order.contactDetails}</div>
                        </td>
                        <td style={{ padding: '14px 8px', fontSize: '0.85rem' }}>
                          <div>Floor {order.floorName}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>{order.address}</div>
                          <div style={{ color: 'var(--accent-teal)', fontSize: '0.7rem', display: 'flex', gap: '2px', alignItems: 'center', marginTop: '2px', flexWrap: 'wrap' }}>
                            <MapPin size={10} /> Lat/Lng: {order.coordinates}
                          </div>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.coordinates)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              color: 'var(--primary-blue)',
                              textDecoration: 'underline',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              marginTop: '6px'
                            }}
                          >
                            🗺️ Google Maps (Driver Link)
                          </a>
                        </td>
                        <td style={{ padding: '14px 8px', fontSize: '0.8rem' }}>
                          {order.items.map((item, idx) => (
                            <div key={idx}>
                              • {item.name} <strong>x{item.quantity}</strong>
                            </div>
                          ))}
                        </td>
                        <td style={{ padding: '14px 8px' }}>
                          <div style={{ fontWeight: 600 }}>₹{order.totalINR}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>${order.totalUSD.toFixed(2)}</div>
                        </td>
                        <td style={{ padding: '14px 8px' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: 
                              order.status === 'Delivered' ? 'rgba(16, 185, 129, 0.1)' :
                              order.status === 'Out for Delivery' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            color: 
                              order.status === 'Delivered' ? 'var(--success-green)' :
                              order.status === 'Out for Delivery' ? 'var(--primary-blue)' : 'var(--warning-orange)'
                          }}>
                            {order.status}
                          </span>
                          
                          {order.status === 'Out for Delivery' && (
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                              Driver: {order.driverName} ({order.driverPhone})
                            </div>
                          )}
                        </td>
                        <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            {order.status === 'Received' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order._id, 'Out for Delivery')}
                                className="btn btn-primary"
                                style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                              >
                                Ship Order
                              </button>
                            )}
                            {order.status === 'Out for Delivery' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(order._id, 'Delivered')}
                                className="btn btn-teal"
                                style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                              >
                                Delivered Check
                              </button>
                            )}
                            <span style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>
                              {order.status === 'Delivered' ? 'Completed ✓' : ''}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}

        {/* Dispatch Driver details entry modal */}
        {selectedOrder && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(11, 19, 41, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, overflowY: 'auto'
          }}>
            <GlassCard style={{ width: '520px', padding: '28px', margin: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
              <h3 style={{ marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'center', fontSize: '1.25rem' }}>
                <Truck size={22} style={{ color: 'var(--primary-blue)' }} />
                Assign Delivery Driver
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
                Patient will receive a real-time notification with driver details on assignment.
              </p>
              
              {/* Order Summary */}
              <div style={{ background: 'var(--bg-primary)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '0.85rem', lineHeight: '1.6' }}>
                <div><strong>Order:</strong> #{selectedOrder._id?.substring(0, 10)}... &nbsp;|&nbsp; <strong>Patient:</strong> {selectedOrder.patientName} &nbsp;|&nbsp; <strong>Total:</strong> ₹{selectedOrder.totalINR}</div>
                <div style={{ borderTop: '1px solid var(--glass-border)', marginTop: '8px', paddingTop: '8px' }}>
                  <strong>Exact Location:</strong> Floor {selectedOrder.floorName}, {selectedOrder.address}
                </div>
                <div style={{ marginTop: '4px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  <strong>Coordinates:</strong> {selectedOrder.coordinates}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedOrder.coordinates)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: 'var(--primary-blue)',
                      textDecoration: 'underline',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      marginLeft: '4px'
                    }}
                  >
                    🗺️ Open Driver Route Link
                  </a>
                </div>
              </div>

              <form onSubmit={handleDispatchOrder}>
                <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--primary-blue)', marginBottom: '12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <Truck size={14} /> Driver Information
                  </h4>

                  {/* Quick Select Registered Driver */}
                  {availableDrivers.length > 0 && (
                    <div className="form-group">
                      <label className="form-label">🚗 Select Registered Driver (Auto-fill)</label>
                      <select
                        className="form-control"
                        value={selectedDriverId}
                        onChange={e => handleSelectRegisteredDriver(e.target.value)}
                      >
                        <option value="">— Or enter manually below —</option>
                        {availableDrivers.map(d => (
                          <option key={d.id} value={d.id}>
                            {d.name} · {d.driverDetails?.vehicleName} · {d.driverDetails?.status === 'active' ? '🟢 Online' : d.driverDetails?.status === 'on_delivery' ? '🟡 On Delivery' : '🔴 Offline'}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {driversLoading && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>Loading registered drivers...</p>}

                  <div className="grid-2" style={{ gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Driver Name *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={driverName} 
                        onChange={e => setDriverName(e.target.value)} 
                        placeholder="E.g. Ramesh Kumar"
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Driver Contact Phone *</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={driverPhone} 
                        onChange={e => setDriverPhone(e.target.value)} 
                        placeholder="E.g. +91 9988776655" 
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-teal)', marginBottom: '12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <Navigation size={14} /> Delivery Location Details
                  </h4>
                  <div className="form-group">
                    <label className="form-label">Street Address</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={deliveryStreet} 
                      onChange={e => setDeliveryStreet(e.target.value)} 
                      placeholder="E.g. 12 Main Road, Block A"
                    />
                  </div>
                  <div className="grid-2" style={{ gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Floor / Room No.</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={deliveryFloor} 
                        onChange={e => setDeliveryFloor(e.target.value)} 
                        placeholder="E.g. Floor 3, Room 301"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Area / Locality</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={deliveryArea} 
                        onChange={e => setDeliveryArea(e.target.value)} 
                        placeholder="E.g. Yelahanka, Bangalore"
                      />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label className="form-label">Landmark (Optional)</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={deliveryLandmark} 
                      onChange={e => setDeliveryLandmark(e.target.value)} 
                      placeholder="E.g. Near ACET Gate, Beside Canteen"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button type="submit" className="btn btn-teal" style={{ flexGrow: 1, display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                    <Truck size={16} /> Dispatch & Notify Patient
                  </button>
                  <button type="button" onClick={() => { setSelectedOrder(null); setDriverName(''); setDriverPhone(''); setDeliveryStreet(''); setDeliveryFloor(''); setDeliveryArea(''); setDeliveryLandmark(''); }} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            </GlassCard>
          </div>
        )}

        {/* ─── Revenue & Earnings Tab ─── */}
        {activeTab === 'revenue' && (() => {
          // Compute revenue stats from orders
          const completedOrders = adminOrders.filter(o => o.status === 'delivered' || o.status === 'dispatched' || o.status === 'confirmed');
          const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.totalINR || 0), 0);
          const pendingRevenue = adminOrders.filter(o => o.status === 'pending').reduce((sum, o) => sum + (o.totalINR || 0), 0);
          const avgOrderValue = completedOrders.length > 0 ? Math.round(totalRevenue / completedOrders.length) : 0;

          // Monthly buckets from orders
          const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          const monthlyRevenue = Array(12).fill(0);
          adminOrders.forEach(o => {
            const d = new Date(o.createdAt || o.date || Date.now());
            const m = d.getMonth();
            monthlyRevenue[m] += (o.totalINR || 0);
          });
          // Fill with demo data if no real orders
          const hasRealData = adminOrders.length > 0;
          const chartData = hasRealData ? monthlyRevenue : [12400, 18700, 15200, 22100, 19800, 28400, 31200, 25600, 34100, 29700, 38400, 42800];
          const maxVal = Math.max(...chartData, 1);

          // SVG area chart dimensions
          const W = 800, H = 180, PAD = 40;
          const pts = chartData.map((v, i) => {
            const x = PAD + (i / 11) * (W - 2 * PAD);
            const y = H - PAD - (v / maxVal) * (H - 2 * PAD);
            return [x, y];
          });
          const linePath = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ');
          const areaPath = `${linePath} L${pts[pts.length-1][0]},${H-PAD} L${pts[0][0]},${H-PAD} Z`;

          // Category breakdown
          const catMap = {};
          adminOrders.forEach(o => {
            o.items?.forEach(item => {
              const cat = item.category || 'Other';
              catMap[cat] = (catMap[cat] || 0) + (item.priceINR || 0) * (item.quantity || 1);
            });
          });
          const cats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
          const catColors = ['#1d4ed8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Stats Row */}
              <div id="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                {[
                  { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, sub: `${completedOrders.length} completed orders`, color: '#10b981', bg: 'rgba(16,185,129,0.08)', icon: '💰' },
                  { label: 'Pending Revenue', value: `₹${pendingRevenue.toLocaleString('en-IN')}`, sub: `${adminOrders.filter(o=>o.status==='pending').length} pending orders`, color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: '⏳' },
                  { label: 'Avg. Order Value', value: `₹${avgOrderValue.toLocaleString('en-IN')}`, sub: 'Per completed order', color: '#1d4ed8', bg: 'rgba(29,78,216,0.08)', icon: '📊' },
                  { label: 'Total Orders', value: adminOrders.length, sub: 'All time', color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', icon: '📦' }
                ].map((card, i) => (
                  <GlassCard key={i} style={{ border: `1px solid ${card.color}30`, background: card.bg }}>
                    <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{card.icon}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>{card.label}</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 900, color: card.color }}>{card.value}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '4px' }}>{card.sub}</div>
                  </GlassCard>
                ))}
              </div>

              {/* Area Chart */}
              <GlassCard>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>📈 Monthly Revenue Flow</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', background: 'var(--primary-blue-glow)', color: 'var(--primary-blue)', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>
                    {hasRealData ? 'Live Data' : 'Demo Data'}
                  </span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <svg width="100%" viewBox={`0 0 ${W} ${H+20}`} style={{ display: 'block', minWidth: '500px' }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.02" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    {[0.25, 0.5, 0.75, 1].map((f, i) => (
                      <g key={i}>
                        <line x1={PAD} y1={H - PAD - f*(H-2*PAD)} x2={W-PAD} y2={H - PAD - f*(H-2*PAD)} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4,4" />
                        <text x={PAD-6} y={H - PAD - f*(H-2*PAD) + 4} textAnchor="end" fontSize="10" fill="#94a3b8">
                          ₹{Math.round(maxVal * f / 1000)}k
                        </text>
                      </g>
                    ))}
                    {/* Area fill */}
                    <path d={areaPath} fill="url(#revGrad)" />
                    {/* Line */}
                    <path d={linePath} fill="none" stroke="#1d4ed8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Data points */}
                    {pts.map(([x, y], i) => (
                      <g key={i}>
                        <circle cx={x} cy={y} r="4" fill="#ffffff" stroke="#1d4ed8" strokeWidth="2" />
                        <text x={x} y={H-PAD+16} textAnchor="middle" fontSize="9" fill="#64748b">{months[i]}</text>
                        {chartData[i] > 0 && (
                          <text x={x} y={y-8} textAnchor="middle" fontSize="8" fill="#1d4ed8" fontWeight="bold">
                            ₹{Math.round(chartData[i]/1000)}k
                          </text>
                        )}
                      </g>
                    ))}
                  </svg>
                </div>
              </GlassCard>

              {/* 2-col: Category Breakdown + Recent Transactions */}
              <div id="admin-revenue-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '20px' }}>
                {/* Category Breakdown */}
                <GlassCard>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>🛒 Revenue by Category</h3>
                  {cats.length === 0 ? (
                    <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      No category data available yet.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {cats.slice(0, 6).map(([cat, amt], i) => {
                        const pct = Math.round((amt / (totalRevenue || 1)) * 100);
                        return (
                          <div key={cat}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{cat}</span>
                              <span style={{ fontSize: '0.85rem', color: catColors[i % catColors.length], fontWeight: 700 }}>₹{amt.toLocaleString('en-IN')} ({pct}%)</span>
                            </div>
                            <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ width: `${pct}%`, height: '100%', background: catColors[i % catColors.length], borderRadius: '4px', transition: 'width 1s ease' }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </GlassCard>

                {/* Transactions Table */}
                <GlassCard>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px' }}>🧾 Recent Transactions</h3>
                  <div style={{ overflowX: 'auto', maxHeight: '360px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-secondary)', position: 'sticky', top: 0, background: 'var(--bg-secondary)' }}>
                          <th style={{ padding: '10px 8px', textAlign: 'left' }}>Order ID</th>
                          <th style={{ padding: '10px 8px', textAlign: 'left' }}>Customer</th>
                          <th style={{ padding: '10px 8px', textAlign: 'left' }}>Date</th>
                          <th style={{ padding: '10px 8px', textAlign: 'right' }}>Amount</th>
                          <th style={{ padding: '10px 8px', textAlign: 'center' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminOrders.length === 0 ? (
                          <tr><td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>No orders yet.</td></tr>
                        ) : (
                          [...adminOrders].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 30).map((o, i) => {
                            const statusColors = { delivered: '#10b981', dispatched: '#1d4ed8', confirmed: '#f59e0b', pending: '#94a3b8', cancelled: '#ef4444' };
                            const sc = statusColors[o.status] || '#94a3b8';
                            return (
                              <tr key={o._id || i} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '10px 8px', fontWeight: 600, color: 'var(--primary-blue)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                  #{(o._id || '').slice(-6).toUpperCase()}
                                </td>
                                <td style={{ padding: '10px 8px' }}>{o.patientName || o.userName || 'Unknown'}</td>
                                <td style={{ padding: '10px 8px', color: 'var(--text-secondary)' }}>
                                  {new Date(o.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                                </td>
                                <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>
                                  ₹{(o.totalINR || 0).toLocaleString('en-IN')}
                                </td>
                                <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                                  <span style={{ background: sc + '18', color: sc, padding: '2px 8px', borderRadius: '20px', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase' }}>
                                    {o.status || 'pending'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </GlassCard>
              </div>
            </div>
          );
        })()}

        {/* ─── App Releases Tab ─── */}
        {activeTab === 'releases' && (
          <GlassCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Download size={22} style={{ color: 'var(--primary-blue)' }} />
                  App Releases Management
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                  Publish Android (.apk) and iOS (.ipa) builds. Uploaded releases appear on the public Download page.
                </p>
              </div>
              {!showReleaseForm && (
                <button
                  onClick={() => setShowReleaseForm(true)}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} /> New Release
                </button>
              )}
            </div>

            {/* ── Upload Form ── */}
            {showReleaseForm && (
              <div style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--glass-border)',
                borderRadius: '16px',
                padding: '28px',
                marginBottom: '32px'
              }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '20px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📦 Upload New App Release
                </h4>
                <form onSubmit={handleSaveRelease}>
                  {/* Row 1: Name + Version */}
                  <div className="grid-2" style={{ gap: '16px', marginBottom: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">App Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={releaseName}
                        onChange={e => setReleaseName(e.target.value)}
                        placeholder="E.g. ACET MedTrack"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Version *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={releaseVersion}
                        onChange={e => setReleaseVersion(e.target.value)}
                        placeholder="E.g. v2.1.0"
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={releaseDesc}
                      onChange={e => setReleaseDesc(e.target.value)}
                      placeholder="What's new in this release? Bug fixes, new features..."
                      rows="3"
                    ></textarea>
                  </div>

                  {/* Cover Photo */}
                  <div style={{
                    background: 'rgba(59, 130, 246, 0.04)',
                    border: '1px dashed var(--primary-blue)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                      <Image size={14} style={{ color: 'var(--primary-blue)' }} /> App Cover Photo (from Gallery)
                    </label>
                    <input
                      type="file"
                      id="releasePhotoFile"
                      className="form-control"
                      onChange={handleReleasePhotoChange}
                      accept="image/*"
                    />
                    {releasePhoto && (
                      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={releasePhoto}
                          alt="Cover preview"
                          style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '10px', border: '2px solid var(--glass-border)' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--success-green)' }}>✅ Photo selected</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{releasePhotoFileName}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* File inputs */}
                  <div className="grid-2" style={{ gap: '16px', marginBottom: '24px' }}>
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.04)',
                      border: '1px dashed var(--success-green)',
                      borderRadius: '12px',
                      padding: '16px'
                    }}>
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                        🤖 Android APK File
                      </label>
                      <input
                        type="file"
                        id="releaseFile"
                        className="form-control"
                        onChange={handleReleaseFileChange}
                        accept=".apk"
                      />
                      {releaseFileName && (
                        <div style={{ fontSize: '0.78rem', color: 'var(--success-green)', marginTop: '8px', fontWeight: 600 }}>
                          ✅ {releaseFileName}
                        </div>
                      )}
                    </div>

                    <div style={{
                      background: 'rgba(139, 92, 246, 0.04)',
                      border: '1px dashed #8b5cf6',
                      borderRadius: '12px',
                      padding: '16px'
                    }}>
                      <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                        🍏 iOS IPA File
                      </label>
                      <input
                        type="file"
                        id="releaseIpaFile"
                        className="form-control"
                        onChange={handleIpaFileChange}
                        accept=".ipa"
                      />
                      {releaseIpaFileName && (
                        <div style={{ fontSize: '0.78rem', color: '#8b5cf6', marginTop: '8px', fontWeight: 600 }}>
                          ✅ {releaseIpaFileName}
                        </div>
                      )}
                    </div>
                  </div>

                  {isUploadingRelease && (
                    <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(59,130,246,0.08)', borderRadius: '8px', border: '1px solid var(--primary-blue)', fontSize: '0.85rem', color: 'var(--primary-blue)', fontWeight: 600 }}>
                      ⏳ Uploading files... This may take a moment for large files.
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ padding: '12px 28px', display: 'flex', alignItems: 'center', gap: '8px' }}
                      disabled={isUploadingRelease}
                    >
                      <Download size={16} />
                      {isUploadingRelease ? 'Publishing Release...' : 'Publish Release'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { resetReleaseForm(); setShowReleaseForm(false); }}
                      className="btn btn-secondary"
                      style={{ padding: '12px 20px' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── Releases Cards Grid ── */}
            {releases.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: 'var(--text-secondary)'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📦</div>
                <div style={{ fontWeight: 600, fontSize: '1.05rem', marginBottom: '6px' }}>No releases yet</div>
                <div style={{ fontSize: '0.85rem' }}>Click "New Release" to publish your first app build.</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {releases.map(rel => {
                  const hasApk = rel.filePath && rel.fileName;
                  const hasIpa = rel.ipaFilePath && rel.ipaFileName;
                  const platformLabel = rel.platform === 'both' ? '🤖 + 🍏' : rel.platform === 'ios' ? '🍏 iOS' : '🤖 Android';
                  const platformColor = rel.platform === 'both' ? '#f59e0b' : rel.platform === 'ios' ? '#8b5cf6' : '#10b981';
                  return (
                    <div
                      key={rel._id || rel.id}
                      style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                      }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                    >
                      {/* Cover Photo */}
                      <div style={{ position: 'relative', height: '160px', background: 'linear-gradient(135deg, #0f2057 0%, #1a3a8a 100%)', overflow: 'hidden' }}>
                        {rel.photo ? (
                          <img
                            src={rel.photo.startsWith('/uploads') ? `${API_BASE_URL.replace('/api', '')}${rel.photo}` : rel.photo}
                            alt={rel.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.9 }}
                          />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3.5rem' }}>📱</div>
                        )}
                        <div style={{
                          position: 'absolute', top: '10px', right: '10px',
                          background: platformColor + '22',
                          border: `1px solid ${platformColor}`,
                          color: platformColor,
                          fontSize: '0.72rem', fontWeight: 700,
                          padding: '3px 10px', borderRadius: '20px',
                          backdropFilter: 'blur(6px)'
                        }}>{platformLabel}</div>
                        <div style={{
                          position: 'absolute', bottom: '10px', left: '10px',
                          background: 'rgba(0,0,0,0.55)',
                          color: 'white',
                          fontSize: '0.72rem', fontWeight: 700,
                          padding: '3px 10px', borderRadius: '20px',
                          backdropFilter: 'blur(6px)'
                        }}>v{rel.version}</div>
                      </div>

                      {/* Card Body */}
                      <div style={{ padding: '16px' }}>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '6px', color: 'var(--text-primary)' }}>{rel.name}</div>
                        {rel.description && (
                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.5' }}>
                            {rel.description.length > 100 ? rel.description.slice(0, 100) + '…' : rel.description}
                          </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-light)', marginBottom: '14px' }}>
                          <span>📅 {rel.uploadedAt?.split('T')[0]}</span>
                          <span>⬇️ APK: {rel.downloadCount || 0} · IPA: {rel.ipaDownloadCount || 0}</span>
                        </div>

                        {/* File sizes */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
                          {hasApk && (
                            <span style={{ fontSize: '0.72rem', background: 'rgba(16,185,129,0.1)', color: 'var(--success-green)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                              APK {rel.fileSize > 1024*1024 ? `${(rel.fileSize/1024/1024).toFixed(1)}MB` : `${(rel.fileSize/1024).toFixed(0)}KB`}
                            </span>
                          )}
                          {hasIpa && (
                            <span style={{ fontSize: '0.72rem', background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                              IPA {rel.ipaFileSize > 1024*1024 ? `${(rel.ipaFileSize/1024/1024).toFixed(1)}MB` : `${(rel.ipaFileSize/1024).toFixed(0)}KB`}
                            </span>
                          )}
                        </div>

                        {/* Download + Delete */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {hasApk && (
                            <a
                              href={`${API_BASE_URL}/releases/${rel._id || rel.id}/download`}
                              style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                padding: '8px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 700,
                                background: 'rgba(16,185,129,0.1)', color: 'var(--success-green)', border: '1px solid rgba(16,185,129,0.3)',
                                transition: 'all 0.2s'
                              }}
                            >
                              🤖 APK
                            </a>
                          )}
                          {hasIpa && (
                            <a
                              href={`${API_BASE_URL}/releases/${rel._id || rel.id}/download-ipa`}
                              style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                padding: '8px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 700,
                                background: 'rgba(139,92,246,0.1)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.3)',
                                transition: 'all 0.2s'
                              }}
                            >
                              🍏 IPA
                            </a>
                          )}
                          <button
                            onClick={() => handleDeleteRelease(rel._id || rel.id, rel.name)}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                              padding: '8px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                              background: 'rgba(239,68,68,0.08)', color: 'var(--danger-red)', border: '1px solid rgba(239,68,68,0.2)',
                              transition: 'all 0.2s'
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>
        )}

        {/* ─── Get in Touch Tab (Ticketing Support chats) ─── */}
        {activeTab === 'messages' && (() => {
          const isMobile = windowWidth < 768;
          const filteredTickets = tickets.filter(t => {
            if (ticketFilter === 'pending') return t.status === 'pending';
            if (ticketFilter === 'replied') return t.status === 'replied';
            return true;
          });

          return (
            <GlassCard style={{ padding: '24px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={22} style={{ color: 'var(--primary-blue)' }} />
                  Get in Touch Support Inbox
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
                  Converse with public users in real-time (3-second polling sync) and answer their inquiries.
                </p>
              </div>

              {/* Chat Split Layout */}
              <div style={{ display: 'flex', gap: '20px', minHeight: '520px', position: 'relative' }}>
                
                {/* LEFT COLUMN: Tickets list (hidden on mobile when a chat is open) */}
                {(!isMobile || !activeTicket) && (
                  <div style={{
                    width: isMobile ? '100%' : '340px',
                    borderRight: isMobile ? 'none' : '1px solid var(--glass-border)',
                    paddingRight: isMobile ? 0 : '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    flexShrink: 0
                  }}>
                    {/* Filter buttons */}
                    <div style={{
                      display: 'flex',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: '8px',
                      padding: '4px',
                      border: '1px solid var(--glass-border)'
                    }}>
                      {['all', 'pending', 'replied'].map(f => (
                        <button
                          key={f}
                          onClick={() => setTicketFilter(f)}
                          style={{
                            flex: 1,
                            padding: '6px 8px',
                            border: 'none',
                            borderRadius: '6px',
                            background: ticketFilter === f ? 'var(--primary-blue-glow)' : 'transparent',
                            color: ticketFilter === f ? 'var(--primary-blue)' : 'var(--text-secondary)',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            transition: 'all 0.2s'
                          }}
                        >
                          {f}
                        </button>
                      ))}
                    </div>

                    {/* Scrollable list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', maxHeight: '420px', paddingRight: '4px' }}>
                      {filteredTickets.length === 0 ? (
                        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                          No tickets in this folder.
                        </div>
                      ) : (
                        filteredTickets.map(t => {
                          const isSelected = activeTicket === (t._id || t.id);
                          return (
                            <div
                              key={t._id || t.id}
                              onClick={() => setActiveTicket(t._id || t.id)}
                              style={{
                                background: isSelected ? 'var(--primary-blue-glow)' : 'rgba(255,255,255,0.01)',
                                border: '1px solid var(--glass-border)',
                                borderColor: isSelected ? 'var(--primary-blue)' : 'var(--glass-border)',
                                borderRadius: '8px',
                                padding: '12px 14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', fontWeight: 600 }}>
                                  {new Date(t.createdAt).toLocaleDateString()}
                                </span>
                                <span style={{
                                  background: t.status === 'replied' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                                  color: t.status === 'replied' ? 'var(--success-green)' : 'var(--warning-orange)',
                                  fontSize: '0.62rem',
                                  fontWeight: 800,
                                  padding: '2px 6px',
                                  borderRadius: '10px',
                                  textTransform: 'uppercase'
                                }}>
                                  {t.status}
                                </span>
                              </div>
                              <h4 style={{ fontSize: '0.88rem', fontWeight: 700, margin: '4px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--text-primary)' }}>
                                {t.subject}
                              </h4>
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {t.name} • {t.email}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* RIGHT COLUMN: Active Chat details */}
                {(!isMobile || activeTicket) && (
                  <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '12px',
                    border: isMobile ? 'none' : '1px solid var(--glass-border)',
                    padding: isMobile ? 0 : '16px',
                    background: isMobile ? 'transparent' : 'rgba(0,0,0,0.1)'
                  }}>
                    {!activeTicket ? (
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flex: 1,
                        color: 'var(--text-secondary)',
                        textAlign: 'center',
                        padding: '40px'
                      }}>
                        <MessageSquare size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                        <h4 style={{ margin: 0, fontWeight: 700 }}>No Support Conversation Selected</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '6px' }}>
                          Select a ticket from the left panel to review message threads and send replies.
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        {/* Chat Header */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          borderBottom: '1px solid var(--glass-border)',
                          paddingBottom: '12px',
                          marginBottom: '14px'
                        }}>
                          {isMobile && (
                            <button
                              onClick={() => setActiveTicket(null)}
                              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                            >
                              <ArrowLeft size={20} />
                            </button>
                          )}
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {activeTicketData ? activeTicketData.subject : 'Loading Ticket...'}
                            </h4>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>
                              User: {activeTicketData?.name} ({activeTicketData?.email})
                            </span>
                          </div>
                          {activeTicketData && (
                            <span style={{
                              background: activeTicketData.status === 'replied' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                              color: activeTicketData.status === 'replied' ? 'var(--success-green)' : 'var(--warning-orange)',
                              fontSize: '0.65rem',
                              fontWeight: 850,
                              padding: '3px 8px',
                              borderRadius: '12px',
                              textTransform: 'uppercase'
                            }}>
                              {activeTicketData.status}
                            </span>
                          )}
                        </div>

                        {/* Message Pane Scroll */}
                        <div style={{
                          flex: 1,
                          maxHeight: '320px',
                          overflowY: 'auto',
                          background: 'rgba(0,0,0,0.15)',
                          borderRadius: '8px',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '16px',
                          marginBottom: '16px',
                          border: '1px solid var(--glass-border)'
                        }}>
                          {/* Original inquiry bubble */}
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
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-light)' }}>{activeTicketData.name} (Original Request)</span>
                              </div>
                              <p style={{ fontSize: '0.85rem', margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                                {activeTicketData.message}
                              </p>
                              <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-light)', marginTop: '6px', textAlign: 'right' }}>
                                {new Date(activeTicketData.createdAt).toLocaleString()}
                              </span>
                            </div>
                          )}

                          {/* Subsequent Replies */}
                          {activeTicketData && activeTicketData.replies && activeTicketData.replies.map((reply, idx) => {
                            const isAdmin = reply.sender === 'admin';
                            return (
                              <div
                                key={idx}
                                style={{
                                  alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                                  background: isAdmin ? 'var(--primary-blue-glow)' : 'rgba(255, 255, 255, 0.05)',
                                  border: isAdmin ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid var(--glass-border)',
                                  borderRadius: '12px',
                                  padding: '10px 14px',
                                  maxWidth: '85%'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                  {isAdmin ? (
                                    <>
                                      <Shield size={11} style={{ color: 'var(--primary-blue)' }} />
                                      <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary-blue)' }}>Me (Admin)</span>
                                    </>
                                  ) : (
                                    <>
                                      <User size={11} style={{ color: 'var(--text-light)' }} />
                                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-light)' }}>{activeTicketData.name}</span>
                                    </>
                                  )}
                                </div>
                                <p style={{ fontSize: '0.85rem', margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                                  {reply.text}
                                </p>
                                <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--text-light)', marginTop: '4px', textAlign: 'right' }}>
                                  {new Date(reply.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            );
                          })}
                          <div ref={adminChatEndRef} />
                        </div>

                        {/* Reply Form */}
                        <form onSubmit={handleAdminSendReply} style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Type response reply..."
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            required
                            disabled={isSendingReply}
                            style={{ flex: 1, borderRadius: '8px', padding: '10px 14px' }}
                          />
                          <button
                            type="submit"
                            className="btn btn-teal"
                            style={{ padding: '0 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            disabled={isSendingReply || !replyText.trim()}
                          >
                            <Send size={16} /> Reply
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </GlassCard>
          );
        })()}

        {/* Factory Reset Panel */}
        {activeTab === 'reset' && (
          <GlassCard style={{ padding: '32px', textAlign: 'center', border: '1px solid var(--danger-red)', background: 'rgba(239, 68, 68, 0.04)' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '16px'
              }}>
                ⚠️
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--danger-red)', marginBottom: '12px' }}>
                System Factory Reset (Danger Zone)
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '24px', fontSize: '0.95rem' }}>
                Performing a factory reset will overwrite all current database files (users, slides, medical records, reminders, contact messages, etc.) and restore them to the default seed state.
              </p>
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid var(--danger-red)',
                color: 'var(--danger-red)',
                padding: '16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                textAlign: 'left',
                lineHeight: '1.5',
                marginBottom: '32px'
              }}>
                <strong>Critical Notes:</strong>
                <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
                  <li>All patient appointments and medicine alarms will be reset.</li>
                  <li>Any newly uploaded app releases will be deleted.</li>
                  <li>Admin and user accounts will reset to their original credentials.</li>
                  <li>You will be logged out automatically upon success to synchronize states.</li>
                </ul>
              </div>
              <button
                onClick={handleFactoryReset}
                className="btn btn-primary"
                style={{
                  background: 'var(--danger-red)',
                  borderColor: 'var(--danger-red)',
                  padding: '14px 28px',
                  fontSize: '1rem',
                  boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)'
                }}
              >
                Perform Factory Reset
              </button>
            </div>
          </GlassCard>
        )}

        {/* Site Customization Panel */}
        {activeTab === 'customization' && (
          <GlassCard>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Settings size={24} style={{ color: 'var(--primary-blue)' }} /> Site Identity & Appearance Customization
            </h3>

            <form onSubmit={handleSaveWebSettings} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* Section 1: Brand details */}
              <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '24px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', color: 'var(--primary-blue)' }}>
                  🌐 Main Website Identity
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flexWrap: 'wrap' }} className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Website Name / Brand Title *</label>
                    <input type="text" className="form-control" value={siteName} onChange={e => setSiteName(e.target.value)} required placeholder="E.g. ACET MEDTRACK" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Website Header Logo</label>
                    <input type="file" className="form-control" accept="image/*" onChange={handleSiteLogoUpload} />
                    {siteLogo && (
                      <div style={{ marginTop: '10px' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Logo Preview:</span>
                        <img src={siteLogo} alt="Logo" style={{ display: 'block', height: '50px', width: '50px', borderRadius: '50%', border: '1px solid var(--glass-border)', marginTop: '6px', objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 2: Opening splash animation */}
              <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '24px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', color: 'var(--primary-blue)' }}>
                  🎬 Website Opening Splash Animation
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <input type="checkbox" id="splashActive" checked={splashActive} onChange={e => setSplashActive(e.target.checked)} />
                  <label htmlFor="splashActive" style={{ fontSize: '0.88rem', fontWeight: 600, cursor: 'pointer' }}>Enable Opening Load Splash Animation on public website</label>
                </div>
                {splashActive && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-2">
                    <div className="form-group">
                      <label className="form-label">Splash Welcome Text</label>
                      <input type="text" className="form-control" value={splashText} onChange={e => setSplashText(e.target.value)} placeholder="E.g. ACET MEDTRACK" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Splash Graphic / Custom Logo</label>
                      <input type="file" className="form-control" accept="image/*" onChange={handleSplashLogoUpload} />
                      {splashLogo && (
                        <div style={{ marginTop: '10px' }}>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Splash Logo Preview:</span>
                          <img src={splashLogo} alt="Splash Logo" style={{ display: 'block', height: '60px', width: '60px', borderRadius: '50%', border: '1px solid var(--glass-border)', marginTop: '6px', objectFit: 'cover' }} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Checklist requirements section */}
              <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '24px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', color: 'var(--primary-blue)' }}>
                  ✅ Registration Checklist / Required Field Ticks
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>Configure which additional profile fields users must fill during login/signup registration.</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', flexWrap: 'wrap' }} className="grid-3">
                  {/* Patient ticks */}
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px', color: 'var(--accent-teal)' }}>Patient Fields</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={patReqAge} onChange={e => setPatReqAge(e.target.checked)} />
                        Require Age
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={patReqGender} onChange={e => setPatReqGender(e.target.checked)} />
                        Require Gender
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={patReqBlood} onChange={e => setPatReqBlood(e.target.checked)} />
                        Require Blood Group
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={patReqAllergies} onChange={e => setPatReqAllergies(e.target.checked)} />
                        Require Allergies
                      </label>
                    </div>
                  </div>

                  {/* Driver ticks */}
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px', color: 'var(--warning-orange)' }}>Driver Fields</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={drvReqAge} onChange={e => setDrvReqAge(e.target.checked)} />
                        Require Driver Age
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={drvReqLicensePhoto} onChange={e => setDrvReqLicensePhoto(e.target.checked)} />
                        Require License Photo Upload
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={drvReqVehicle} onChange={e => setDrvReqVehicle(e.target.checked)} />
                        Require Vehicle Details
                      </label>
                    </div>
                  </div>

                  {/* Doctor ticks */}
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '10px', color: 'var(--primary-blue)' }}>Doctor Fields</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={docReqSpec} onChange={e => setDocReqSpec(e.target.checked)} />
                        Require Specialization
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={docReqExp} onChange={e => setDocReqExp(e.target.checked)} />
                        Require Experience Years
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input type="checkbox" checked={docReqLicense} onChange={e => setDocReqLicense(e.target.checked)} />
                        Require License Document Upload
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Footer Configurations */}
              <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '24px' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px', color: 'var(--primary-blue)' }}>
                  📞 Footer Contact & Copyright Configurations
                </h4>
                <div className="form-group">
                  <label className="form-label">Footer Location Address *</label>
                  <textarea className="form-control" rows="2" value={footLoc} onChange={e => setFootLoc(e.target.value)} required placeholder="ADITYA COLLEGE OF ENGINEERING, YEHLENKA KAMKSHIPURA-560089" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Footer Contact Phone Number *</label>
                    <input type="text" className="form-control" value={footPhone} onChange={e => setFootPhone(e.target.value)} required placeholder="+91 8792714127" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Footer Copyright Disclaimer *</label>
                    <input type="text" className="form-control" value={footCopyright} onChange={e => setFootCopyright(e.target.value)} required placeholder="© 2026 ACET MEDTRACK – Crafted by Dipendra Upadhayay and TEAM" />
                  </div>
                </div>
              </div>

              {/* Section 4: Header Navigation links */}
              <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '8px' }}>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--primary-blue)' }}>
                    🔗 Header Navigation Links Customization
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingLink(false);
                      setEditingLinkIdx(null);
                      setLinkLabel('');
                      setLinkPath('');
                      setLinkEditorOpen(true);
                    }}
                    className="btn btn-primary"
                    style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={14} /> Add Nav Link
                  </button>
                </div>

                {linkEditorOpen && (
                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
                    <h5 style={{ margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 700 }}>
                      {isEditingLink ? '✏️ Edit Navigation Link' : '➕ Add Navigation Link'}
                    </h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }} className="grid-2">
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Link Label *</label>
                        <input type="text" className="form-control" value={linkLabel} onChange={e => setLinkLabel(e.target.value)} placeholder="E.g. Services" />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Target Route / URL Path *</label>
                        <input type="text" className="form-control" value={linkPath} onChange={e => setLinkPath(e.target.value)} placeholder="E.g. /services" />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button type="button" onClick={handleAddNavLink} className="btn btn-teal" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                        {isEditingLink ? 'Save Link' : 'Add Link'}
                      </button>
                      <button type="button" onClick={() => setLinkEditorOpen(false)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                        <th style={{ padding: '8px' }}>Label</th>
                        <th style={{ padding: '8px' }}>Target Path</th>
                        <th style={{ padding: '8px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {navItemsList.length === 0 ? (
                        <tr>
                          <td colSpan="3" style={{ padding: '16px 8px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No navigation items configured. Add links to populate your header navbar.
                          </td>
                        </tr>
                      ) : (
                        navItemsList.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <td style={{ padding: '10px 8px', fontWeight: 600 }}>{item.label || item.name}</td>
                            <td style={{ padding: '10px 8px', fontFamily: 'monospace' }}>{item.path}</td>
                            <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                              <div style={{ display: 'inline-flex', gap: '6px' }}>
                                <button type="button" onClick={() => handleEditNavLink(idx)} className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: '0.72rem' }}>
                                  Edit
                                </button>
                                <button type="button" onClick={() => handleDeleteNavLink(idx)} className="btn btn-secondary" style={{ padding: '3px 8px', fontSize: '0.72rem', color: 'var(--danger-red)', borderColor: 'rgba(239,68,68,0.15)' }}>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Submit panel */}
              <button
                type="submit"
                className="btn btn-teal"
                style={{
                  padding: '14px 28px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  alignSelf: 'flex-start',
                  boxShadow: '0 0 15px rgba(20, 184, 166, 0.25)'
                }}
              >
                Save Site Configurations
              </button>
            </form>
          </GlassCard>
        )}

        {/* Configured Delivery Locations Panel */}
        {activeTab === 'locations' && (
          <GlassCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={22} style={{ color: 'var(--primary-blue)' }} /> Configured Delivery Locations
              </h3>
              {!showLocationForm && (
                <button onClick={() => setShowLocationForm(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={16} /> Configure Location
                </button>
              )}
            </div>

            {showLocationForm && (
              <form onSubmit={handleAddDeliveryLocation} style={{ background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Add Delivery Area</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }} className="grid-3">
                  <div className="form-group">
                    <label className="form-label">Country *</label>
                    <input type="text" className="form-control" placeholder="E.g. India" value={locCountry} onChange={e => setLocCountry(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State *</label>
                    <input type="text" className="form-control" placeholder="E.g. Andhra Pradesh" value={locState} onChange={e => setLocState(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Region / Zone</label>
                    <input type="text" className="form-control" placeholder="E.g. South Zone" value={locRegion} onChange={e => setLocRegion(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }} className="grid-3">
                  <div className="form-group">
                    <label className="form-label">District / City *</label>
                    <input type="text" className="form-control" placeholder="E.g. East Godavari" value={locDistrict} onChange={e => setLocDistrict(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ward / Sector *</label>
                    <input type="text" className="form-control" placeholder="E.g. Ward 12" value={locWard} onChange={e => setLocWard(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Area / Locality Name *</label>
                    <input type="text" className="form-control" placeholder="E.g. Aditya Campus Yelahanka" value={locArea} onChange={e => setLocArea(e.target.value)} required />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">Location Google Map Link / URL</label>
                  <input type="url" className="form-control" placeholder="E.g. https://maps.google.com/?q=..." value={locMapLink} onChange={e => setLocMapLink(e.target.value)} />
                </div>

                <div style={{ marginBottom: '14px' }} className="form-group">
                  <label className="form-label">🔍 Search Area / Address (Sets coordinates on Map)</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input type="text" className="form-control" placeholder="Type area address to geocode..." value={locSearchQuery} onChange={e => setLocSearchQuery(e.target.value)} />
                    <button type="button" onClick={handleLocationSearch} className="btn btn-teal">Search</button>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label">Pin Coordinates (Drag marker on map or click map) *</label>
                  <div id="admin-location-map" style={{ height: '220px', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#eee', marginBottom: '8px' }}></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Latitude</span>
                      <input type="number" step="any" className="form-control" value={locLat} onChange={e => setLocLat(e.target.value)} required />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Longitude</span>
                      <input type="number" step="any" className="form-control" value={locLng} onChange={e => setLocLng(e.target.value)} required />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-teal">Save Location</button>
                  <button type="button" onClick={() => setShowLocationForm(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            )}

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--glass-border)', color: 'var(--text-secondary)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 8px' }}>Area / Locality</th>
                    <th style={{ padding: '10px 8px' }}>Ward</th>
                    <th style={{ padding: '10px 8px' }}>District</th>
                    <th style={{ padding: '10px 8px' }}>State</th>
                    <th style={{ padding: '10px 8px' }}>Region</th>
                    <th style={{ padding: '10px 8px' }}>Country</th>
                    <th style={{ padding: '10px 8px' }}>Coordinates</th>
                    <th style={{ padding: '10px 8px' }}>Map Link</th>
                    <th style={{ padding: '10px 8px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveryLocations.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ padding: '24px 8px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                        No delivery locations configured. Add one to set up delivery service areas.
                      </td>
                    </tr>
                  ) : (
                    deliveryLocations.map(loc => (
                      <tr key={loc._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <td style={{ padding: '14px 8px', fontWeight: 600 }}>📍 {loc.area}</td>
                        <td style={{ padding: '14px 8px' }}>{loc.ward || '-'}</td>
                        <td style={{ padding: '14px 8px' }}>{loc.district || '-'}</td>
                        <td style={{ padding: '14px 8px' }}>{loc.state}</td>
                        <td style={{ padding: '14px 8px' }}>{loc.region || '-'}</td>
                        <td style={{ padding: '14px 8px' }}>{loc.country || '-'}</td>
                        <td style={{ padding: '14px 8px', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                          {loc.latitude?.toFixed(4)}, {loc.longitude?.toFixed(4)}
                        </td>
                        <td style={{ padding: '14px 8px' }}>
                          {loc.locationMapLink ? (
                            <a href={loc.locationMapLink} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-teal)', textDecoration: 'underline' }}>
                              View Map
                            </a>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td style={{ padding: '14px 8px', textAlign: 'right' }}>
                          <button onClick={() => handleDeleteDeliveryLocation(loc._id, loc.area)} className="btn btn-secondary" style={{ padding: '4px 8px', color: 'var(--danger-red)', fontSize: '0.78rem' }}>
                            <Trash2 size={12} /> Remove
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}

        {/* Homepage Ad Manager Panel */}
        {activeTab === 'homepage-ads' && (
          <GlassCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Monitor size={22} style={{ color: 'var(--primary-blue)' }} /> Homepage Ad Manager
              </h3>
              {!showAdForm && (
                <button onClick={() => {
                  setIsEditingAd(false);
                  setEditingAdId(null);
                  setAdTitle('');
                  setAdDesc('');
                  setAdImageUrl('');
                  setAdLinkUrl('');
                  setAdDuration(5);
                  setAdActive(true);
                  setShowAdForm(true);
                }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={16} /> Create Ad Overlay
                </button>
              )}
            </div>

            {showAdForm && (
              <form onSubmit={handleSaveAdPopup} style={{ background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>{isEditingAd ? 'Edit Ad Overlay' : 'Create Homepage Ad Overlay'}</h4>

                <div className="form-group">
                  <label className="form-label">Ad Title / Announcement Header *</label>
                  <input type="text" className="form-control" placeholder="E.g. Special Holiday Health Pack Discount!" value={adTitle} onChange={e => setAdTitle(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Short Description / Subtitle</label>
                  <textarea className="form-control" rows="2" placeholder="E.g. Get 20% off all medicine purchases this week only. Use coupon code..." value={adDesc} onChange={e => setAdDesc(e.target.value)}></textarea>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div className="form-group">
                    <label className="form-label">Target Link Website URL</label>
                    <input type="url" className="form-control" placeholder="E.g. https://website.com/promo" value={adLinkUrl} onChange={e => setAdLinkUrl(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Skip Ad Timer Duration (seconds) *</label>
                    <input type="number" min="3" max="30" className="form-control" value={adDuration} onChange={e => setAdDuration(e.target.value)} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Ad Banner Photo / Graphic Upload</label>
                  <input type="file" className="form-control" accept="image/*" onChange={handleAdPhotoUpload} />
                  {adImageUrl && (
                    <div style={{ marginTop: '10px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Banner Preview:</span>
                      <img src={adImageUrl} alt="Banner Preview" style={{ display: 'block', maxHeight: '160px', borderRadius: '8px', border: '1px solid var(--glass-border)', marginTop: '6px' }} />
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <input type="checkbox" id="adActive" checked={adActive} onChange={e => setAdActive(e.checked || e.target.checked)} />
                  <label htmlFor="adActive" style={{ fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}>Mark Ad Popup Active (Only one ad can be active at a time)</label>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-teal">Save Ad Overlay</button>
                  <button type="button" onClick={() => setShowAdForm(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {adPopups.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', gridColumn: '1 / -1' }}>No ad popups created yet. Add one to show a splash overlay on landing page.</p>
              ) : (
                adPopups.map(ad => (
                  <div key={ad._id} style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '18px', border: ad.active ? '2px solid var(--success-green)' : '1px solid var(--glass-border)', position: 'relative' }}>
                    {ad.active && (
                      <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--success-green)', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '8px' }}>
                        ACTIVE
                      </span>
                    )}
                    <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '8px', paddingRight: '50px' }}>{ad.title}</h4>
                    {ad.description && <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>{ad.description}</p>}
                    
                    {ad.imageUrl && (
                      <img src={ad.imageUrl} alt={ad.title} style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '12px' }} />
                    )}

                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
                      <div>⏱️ Timer: {ad.duration} seconds</div>
                      {ad.linkUrl && <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>🔗 Link: <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer">{ad.linkUrl}</a></div>}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => {
                        setIsEditingAd(true);
                        setEditingAdId(ad._id);
                        setAdTitle(ad.title);
                        setAdDesc(ad.description || '');
                        setAdImageUrl(ad.imageUrl || '');
                        setAdLinkUrl(ad.linkUrl || '');
                        setAdDuration(ad.duration || 5);
                        setAdActive(ad.active);
                        setShowAdForm(true);
                      }} className="btn btn-secondary" style={{ flexGrow: 1, padding: '6px', fontSize: '0.78rem' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteAdPopup(ad._id, ad.title)} className="btn btn-secondary" style={{ padding: '6px', fontSize: '0.78rem', color: 'var(--danger-red)', borderColor: 'rgba(239,68,68,0.15)' }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        )}

        {/* Collaborators Panel */}
        {activeTab === 'collaborators' && (
          <GlassCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Users size={22} style={{ color: 'var(--primary-blue)' }} /> Collaborators & Partners Panel
              </h3>
              {!showCollabForm && (
                <button onClick={() => {
                  setIsEditingCollab(false);
                  setEditingCollabId(null);
                  setCollabName('');
                  setCollabPhoto('');
                  setCollabLink('');
                  setShowCollabForm(true);
                }} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Plus size={16} /> Add Collaborator
                </button>
              )}
            </div>

            {showCollabForm && (
              <form onSubmit={handleSaveCollaborator} style={{ background: 'var(--bg-primary)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>{isEditingCollab ? 'Edit Collaborator' : 'Add Collaborator'}</h4>

                <div className="form-group">
                  <label className="form-label">Collaborator / Sponsor Name *</label>
                  <input type="text" className="form-control" placeholder="E.g. Apollo Pharmacy or WHO" value={collabName} onChange={e => setCollabName(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Website Link / URL *</label>
                  <input type="url" className="form-control" placeholder="E.g. https://apollo.com" value={collabLink} onChange={e => setCollabLink(e.target.value)} required />
                </div>

                <div className="form-group">
                  <label className="form-label">Logo / Photo</label>
                  <input type="file" className="form-control" accept="image/*" onChange={handleCollabPhotoUpload} />
                  {collabPhoto && (
                    <div style={{ marginTop: '10px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Logo Preview:</span>
                      <img src={collabPhoto} alt="Logo Preview" style={{ display: 'block', maxHeight: '100px', maxWidth: '100px', borderRadius: '8px', border: '1px solid var(--glass-border)', marginTop: '6px', objectFit: 'contain' }} />
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-teal">Save Collaborator</button>
                  <button type="button" onClick={() => setShowCollabForm(false)} className="btn btn-secondary">Cancel</button>
                </div>
              </form>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
              {collaborators.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', gridColumn: '1 / -1' }}>No collaborators configured. Add partners to show them on the Home page.</p>
              ) : (
                collaborators.map(c => (
                  <div key={c._id} style={{ background: 'var(--bg-primary)', borderRadius: '12px', padding: '16px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
                      {c.photo ? (
                        <img src={c.photo} alt={c.name} style={{ height: '70px', width: '70px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff', padding: '4px' }} />
                      ) : (
                        <div style={{ height: '70px', width: '70px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary-blue), var(--accent-teal))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '1.5rem' }}>
                          {c.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>{c.name}</h4>
                    <a href={c.websiteLink} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: 'var(--primary-blue)', display: 'block', marginBottom: '14px', textDecoration: 'underline', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Visit Website
                    </a>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => {
                        setIsEditingCollab(true);
                        setEditingCollabId(c._id);
                        setCollabName(c.name);
                        setCollabPhoto(c.photo || '');
                        setCollabLink(c.websiteLink);
                        setShowCollabForm(true);
                      }} className="btn btn-secondary" style={{ flexGrow: 1, padding: '4px', fontSize: '0.75rem' }}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteCollaborator(c._id, c.name)} className="btn btn-secondary" style={{ padding: '4px', fontSize: '0.75rem', color: 'var(--danger-red)', borderColor: 'rgba(239,68,68,0.15)' }}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        )}

        {/* Doctor Verification Details Modal */}
        {detailDoctor && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(11, 19, 41, 0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
          }}>
            <GlassCard style={{ width: '560px', padding: '28px', margin: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Dr. {detailDoctor.name} - Verification Details</h3>
                <button onClick={() => setDetailDoctor(null)} style={{ border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
                <div><strong>Email:</strong> {detailDoctor.email}</div>
                <div><strong>Specialization:</strong> {detailDoctor.doctorDetails?.specialization}</div>
                <div><strong>Experience:</strong> {detailDoctor.doctorDetails?.experience} Years</div>
                <div><strong>Clinic Address:</strong> {detailDoctor.doctorDetails?.clinicInfo}</div>
                <div><strong>Contact Number:</strong> {detailDoctor.doctorDetails?.contactNumber || '—'}</div>
                
                {/* Doctor Documents */}
                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '14px', marginTop: '8px' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '10px' }}>Verification Documents</h4>
                  
                  {detailDoctor.doctorDetails?.licenseDocument ? (
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Medical License / Registration:</span>
                      {detailDoctor.doctorDetails.licenseDocument.startsWith('data:application/pdf') ? (
                        <a href={detailDoctor.doctorDetails.licenseDocument} download={`Dr_${detailDoctor.name}_License.pdf`} className="btn btn-teal" style={{ display: 'inline-block', fontSize: '0.8rem', padding: '6px 12px' }}>Download License PDF</a>
                      ) : (
                        <img src={detailDoctor.doctorDetails.licenseDocument} alt="License" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--glass-border)' }} />
                      )}
                    </div>
                  ) : <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No License Document Uploaded</p>}

                  {detailDoctor.doctorDetails?.educationQualification && (
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Educational Qualification Certificate:</span>
                      {detailDoctor.doctorDetails.educationQualification.startsWith('data:application/pdf') ? (
                        <a href={detailDoctor.doctorDetails.educationQualification} download={`Dr_${detailDoctor.name}_Education.pdf`} className="btn btn-teal" style={{ display: 'inline-block', fontSize: '0.8rem', padding: '6px 12px' }}>Download Education PDF</a>
                      ) : (
                        <img src={detailDoctor.doctorDetails.educationQualification} alt="Education Cert" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--glass-border)' }} />
                      )}
                    </div>
                  )}

                  {detailDoctor.doctorDetails?.otherDocuments && (
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Other Supporting Documents:</span>
                      {detailDoctor.doctorDetails.otherDocuments.startsWith('data:application/pdf') ? (
                        <a href={detailDoctor.doctorDetails.otherDocuments} download={`Dr_${detailDoctor.name}_Other.pdf`} className="btn btn-teal" style={{ display: 'inline-block', fontSize: '0.8rem', padding: '6px 12px' }}>Download Support PDF</a>
                      ) : (
                        <img src={detailDoctor.doctorDetails.otherDocuments} alt="Other Doc" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--glass-border)' }} />
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                <button
                  onClick={() => { handleApproveDoctor(detailDoctor._id, detailDoctor.name, true); setDetailDoctor(null); }}
                  className="btn btn-teal"
                  style={{ flexGrow: 1 }}
                >
                  Approve Registration
                </button>
                <button
                  onClick={() => { if (window.confirm(`Reject Dr. ${detailDoctor.name}?`)) { handleApproveDoctor(detailDoctor._id, detailDoctor.name, false); setDetailDoctor(null); } }}
                  className="btn btn-secondary"
                  style={{ color: 'var(--danger-red)' }}
                >
                  Reject
                </button>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Driver Verification Details Modal */}
        {detailDriver && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(11, 19, 41, 0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
          }}>
            <GlassCard style={{ width: '500px', padding: '28px', margin: '20px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Driver: {detailDriver.name} - Verification</h3>
                <button onClick={() => setDetailDriver(null)} style={{ border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
                <div><strong>Email:</strong> {detailDriver.email}</div>
                <div><strong>Age:</strong> {detailDriver.driverDetails?.age} Years</div>
                <div><strong>Vehicle Name:</strong> {detailDriver.driverDetails?.vehicleName}</div>
                <div><strong>Vehicle Number:</strong> {detailDriver.driverDetails?.vehicleNumber}</div>
                <div><strong>License Number:</strong> {detailDriver.driverDetails?.licenseNumber}</div>
                
                {detailDriver.driverDetails?.licensePhoto && (
                  <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '14px', marginTop: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>📸 License Photo:</span>
                    <img src={detailDriver.driverDetails.licensePhoto} alt="License Photo" style={{ width: '100%', maxHeight: '260px', objectFit: 'contain', borderRadius: '8px', border: '1px solid var(--glass-border)' }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
                <button
                  onClick={() => { handleApproveDriver(detailDriver._id, detailDriver.name, true); setDetailDriver(null); }}
                  className="btn btn-teal"
                  style={{ flexGrow: 1 }}
                >
                  Approve Driver
                </button>
                <button
                  onClick={() => { if (window.confirm(`Reject driver ${detailDriver.name}?`)) { handleApproveDriver(detailDriver._id, detailDriver.name, false); setDetailDriver(null); } }}
                  className="btn btn-secondary"
                  style={{ color: 'var(--danger-red)' }}
                >
                  Reject
                </button>
              </div>
            </GlassCard>
          </div>
        )}

          </div> {/* Close tab-content animate-fade-in-up */}
        </div> {/* Close Content Pane */}
      </div> {/* Close Vertical Sidebar Responsive Split Layout */}
    </div>
  );
};

export default AdminDashboard;
