import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, ShoppingCart, Trash2, Plus, Minus, MapPin, Phone, Building, Check, ArrowRight, AlertTriangle
} from 'lucide-react';

const Shop = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Cart State
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  
  // Checkout State
  const [showCheckout, setShowCheckout] = useState(false);
  const [contactDetails, setContactDetails] = useState('');
  const [address, setAddress] = useState('');
  const [floorName, setFloorName] = useState('');
  const [coordinates, setCoordinates] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [successOrderDetails, setSuccessOrderDetails] = useState(null);

  // Leaflet CDN injection state
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    fetchShopCatalog();

    // Dynamically inject Leaflet CDN
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
  }, []);

  // Initialize Map when Checkout tab opens
  useEffect(() => {
    if (!leafletLoaded || !showCheckout || !document.getElementById('checkout-map')) return;

    // Aditya College Yelahanka, Bangalore Coordinates
    const defaultLat = 13.1165;
    const defaultLng = 77.5755;

    let map;
    try {
      map = window.L.map('checkout-map').setView([defaultLat, defaultLng], 14);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      let marker = window.L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);
      setCoordinates(`${defaultLat.toFixed(5)}, ${defaultLng.toFixed(5)}`);

      marker.on('dragend', function (event) {
        const position = marker.getLatLng();
        setCoordinates(`${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`);
      });

      map.on('click', function (event) {
        marker.setLatLng(event.latlng);
        setCoordinates(`${event.latlng.lat.toFixed(5)}, ${event.latlng.lng.toFixed(5)}`);
      });
    } catch (e) {
      console.error('Error initializing Leaflet map:', e);
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [leafletLoaded, showCheckout]);

  const fetchShopCatalog = async () => {
    try {
      const data = await api.get('/shop');
      setItems(data);
    } catch (err) {
      console.error('Error fetching catalog:', err);
      setError('Unable to fetch shop inventory. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Cart operations
  const addToCart = (item) => {
    if (item.stocks <= 0) return;
    
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.itemId === item._id);
      if (existing) {
        if (existing.quantity >= item.stocks) return prevCart; // limit to stock
        return prevCart.map((i) =>
          i.itemId === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, {
        itemId: item._id,
        name: item.name,
        quantity: 1,
        priceINR: item.priceINR,
        priceUSD: item.priceUSD,
        maxStock: item.stocks,
        photo: item.photo
      }];
    });
    setShowCart(true);
  };

  const updateCartQty = (itemId, delta) => {
    setCart((prevCart) => {
      return prevCart.map((i) => {
        if (i.itemId !== itemId) return i;
        const newQty = i.quantity + delta;
        if (newQty <= 0) return null;
        if (newQty > i.maxStock) return i;
        return { ...i, quantity: newQty };
      }).filter(Boolean);
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => prevCart.filter(i => i.itemId !== itemId));
  };

  // Totals calculations
  const totalINR = cart.reduce((sum, item) => sum + (item.priceINR * item.quantity), 0);
  const totalUSD = cart.reduce((sum, item) => sum + (item.priceUSD * item.quantity), 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in as a patient to place orders.');
      return;
    }
    if (cart.length === 0) return;
    if (!contactDetails || !address || !floorName || !coordinates) {
      alert('Please fill out all checkout fields.');
      return;
    }

    setSubmittingOrder(true);
    try {
      const payload = {
        items: cart.map(i => ({
          itemId: i.itemId,
          name: i.name,
          quantity: i.quantity,
          priceINR: i.priceINR,
          priceUSD: i.priceUSD
        })),
        totalINR,
        totalUSD,
        contactDetails,
        address,
        floorName,
        coordinates
      };

      const res = await api.post('/shop/order', payload);
      setSuccessOrderDetails(res.order);
      setCart([]);
      setOrderSuccess(true);
      setShowCheckout(false);
      setShowCart(false);
    } catch (err) {
      alert(err.message || 'Failed to submit order.');
    } finally {
      setSubmittingOrder(false);
    }
  };

  return (
    <div style={{ padding: '60px 0 80px 0' }} className="animate-fade-in-up">
      <div className="container">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--primary-blue-glow)',
              color: 'var(--primary-blue)',
              fontSize: '0.85rem',
              fontWeight: 700,
              padding: '6px 16px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              marginBottom: '12px'
            }}>
              <ShoppingBag size={14} />
              ACET Pharmacy Store
            </span>
            <h1 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-title)' }}>
              Certified Medicine & Health Supplies
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
              Order prescription drugs, sanitizers, and diagnostic tools directly to campus.
            </p>
          </div>

          <button 
            onClick={() => setShowCart(!showCart)}
            className="btn btn-primary"
            style={{ position: 'relative', display: 'flex', gap: '8px', alignItems: 'center' }}
          >
            <ShoppingCart size={18} />
            View Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})
            {cart.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'var(--danger-red)',
                color: 'white',
                fontSize: '0.75rem',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {/* Order success notification panel */}
        {orderSuccess && successOrderDetails && (
          <GlassCard style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '2px solid var(--success-green)',
            padding: '24px',
            borderRadius: '16px',
            marginBottom: '32px',
            position: 'relative'
          }}>
            <h3 style={{ color: 'var(--success-green)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.3rem' }}>
              <Check size={24} />
              Order Placed Successfully!
            </h3>
            <p style={{ marginTop: '8px', fontSize: '0.95rem' }}>
              Your order ID is <strong>{successOrderDetails._id || successOrderDetails.id}</strong>. 
              The medicine dispatcher has received your items. You can monitor the dispatch status and delivery driver details from your Patient Dashboard.
            </p>
            <div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Delivery address: Floor {successOrderDetails.floorName}, {successOrderDetails.address}
            </div>
            <button 
              onClick={() => setOrderSuccess(false)}
              style={{
                position: 'absolute', right: '16px', top: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)'
              }}
            >
              ✕
            </button>
          </GlassCard>
        )}

        {/* Catalog and Cart Split Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: showCart ? '3fr 2fr' : '1fr', gap: '32px', transition: 'all 0.3s' }}>
          
          {/* Catalog Grid */}
          <div>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', minHeight: '200px', alignItems: 'center' }}>
                <div className="pulse-alarm" style={{ width: '40px', height: '40px', background: 'var(--primary-blue)', borderRadius: '50%' }}></div>
              </div>
            ) : error ? (
              <div style={{ color: 'var(--danger-red)', padding: '20px', border: '1px solid var(--danger-red)', background: 'rgba(239,68,68,0.1)', borderRadius: '8px' }}>
                {error}
              </div>
            ) : items.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <p style={{ color: 'var(--text-secondary)' }}>No items in the store database yet. Ask an admin to add supplies.</p>
              </div>
            ) : (
              <div className="grid-3" style={{ gridTemplateColumns: showCart ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '24px' }}>
                {items.map((item) => (
                  <GlassCard 
                    key={item._id} 
                    style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '16px' }}
                  >
                    <div style={{
                      width: '100%',
                      aspectRatio: '4/3',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: 'rgba(0,0,0,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img 
                        src={item.photo} 
                        alt={item.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300';
                        }}
                      />
                    </div>
                    
                    <span style={{
                      fontSize: '0.75rem',
                      background: 'var(--primary-blue-glow)',
                      color: 'var(--primary-blue)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      alignSelf: 'flex-start',
                      marginTop: '12px',
                      fontWeight: 600
                    }}>{item.category}</span>

                    <h3 style={{ fontSize: '1.1rem', marginTop: '8px', fontWeight: 700 }}>{item.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', flexGrow: 1 }}>{item.description}</p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                      <div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>₹{item.priceINR}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>${item.priceUSD.toFixed(2)}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ 
                          fontSize: '0.8rem', 
                          color: item.stocks > 0 ? 'var(--success-green)' : 'var(--danger-red)',
                          fontWeight: 600,
                          display: 'block',
                          marginBottom: '4px'
                        }}>
                          {item.stocks > 0 ? `${item.stocks} in stock` : 'Out of stock'}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          disabled={item.stocks <= 0}
                          className="btn btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                        >
                          Add +
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>

          {/* Cart Sidebar Panel */}
          {showCart && (
            <div className="animate-fade-in-up">
              <GlassCard style={{ padding: '24px', position: 'sticky', top: '96px', border: '1px solid var(--primary-blue-glow)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
                    <ShoppingCart size={20} />
                    Shopping Cart
                  </h3>
                  <button onClick={() => setShowCart(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>✕</button>
                </div>

                {cart.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 0' }}>
                    <p style={{ color: 'var(--text-secondary)' }}>Your cart is empty.</p>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '350px', overflowY: 'auto', marginBottom: '20px' }}>
                      {cart.map((item) => (
                        <div key={item.itemId} style={{ display: 'flex', gap: '12px', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
                          <img src={item.photo} alt={item.name} style={{ width: '48px', height: '48px', borderRadius: '4px', objectFit: 'cover' }} />
                          <div style={{ flexGrow: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              ₹{item.priceINR} | ${item.priceUSD.toFixed(2)}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <button onClick={() => updateCartQty(item.itemId, -1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Minus size={12} /></button>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                            <button onClick={() => updateCartQty(item.itemId, 1)} style={{ width: '24px', height: '24px', borderRadius: '4px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Plus size={12} /></button>
                          </div>
                          <button onClick={() => removeFromCart(item.itemId)} style={{ background: 'transparent', border: 'none', color: 'var(--danger-red)', cursor: 'pointer', padding: '4px' }}><Trash2 size={16} /></button>
                        </div>
                      ))}
                    </div>

                    <div style={{ borderTop: '2px solid var(--glass-border)', paddingTop: '16px', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold' }}>
                        <span>Total (INR):</span>
                        <span style={{ fontSize: '1.2rem', color: 'var(--primary-blue)' }}>₹{totalINR}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        <span>Total (USD):</span>
                        <span>${totalUSD.toFixed(2)}</span>
                      </div>
                    </div>

                    {showCheckout ? (
                      /* Checkout Form Inside Cart Panel */
                      <form onSubmit={handlePlaceOrder} style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }} className="animate-fade-in-up">
                        <h4 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', gap: '6px', alignItems: 'center' }}><MapPin size={16} /> Checkout Delivery Details</h4>
                        
                        {!user && (
                          <div style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--warning-orange)', padding: '10px', borderRadius: '8px', fontSize: '0.8rem', marginBottom: '12px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <AlertTriangle size={16} />
                            Please register/login as a Patient first.
                          </div>
                        )}

                        <div className="form-group">
                          <label className="form-label">Contact Mobile Number *</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={contactDetails} 
                            onChange={e => setContactDetails(e.target.value)} 
                            placeholder="E.g. +91 8792714127" 
                            required 
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Delivery Street Address *</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={address} 
                            onChange={e => setAddress(e.target.value)} 
                            placeholder="E.g. Kamakshipura, Yelahanka, ACET Campus" 
                            required 
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Floor / Building / Room Name *</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={floorName} 
                            onChange={e => setFloorName(e.target.value)} 
                            placeholder="E.g. Block C, Floor 3, Lab 304" 
                            required 
                          />
                        </div>

                        {/* Leaflet Pin Map Selector */}
                        <div className="form-group">
                          <label className="form-label">
                            Pin Location on Google Maps *
                          </label>
                          <div 
                            id="checkout-map" 
                            style={{ 
                              height: '180px', 
                              borderRadius: '8px', 
                              border: '1px solid var(--glass-border)',
                              background: '#eee',
                              marginBottom: '8px'
                            }}
                          ></div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Selected Coordinates: <strong>{coordinates || 'Fetching...'}</strong>
                          </span>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                          <button 
                            type="submit" 
                            className="btn btn-teal" 
                            style={{ flexGrow: 1 }}
                            disabled={submittingOrder || !user}
                          >
                            {submittingOrder ? 'Placing Order...' : 'Confirm Order'}
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setShowCheckout(false)} 
                            className="btn btn-secondary"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button 
                        onClick={() => setShowCheckout(true)}
                        className="btn btn-teal"
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        Proceed to Checkout
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </>
                )}
              </GlassCard>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Shop;
