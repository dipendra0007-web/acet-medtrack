import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GlassCard from '../components/GlassCard';
import { UserPlus, User, Shield, Key, FileText, CheckCircle2, ShieldAlert, Car, MapPin, Phone, Upload } from 'lucide-react';

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1px solid var(--glass-border)',
  borderRadius: '8px',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  fontSize: '0.9rem',
  outline: 'none',
  boxSizing: 'border-box'
};

const fileToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onloadend = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Common location fields
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');

  // Doctor Fields
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [clinicInfo, setClinicInfo] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [licenseDoc, setLicenseDoc] = useState('');
  const [eduQualDoc, setEduQualDoc] = useState('');
  const [otherDoc, setOtherDoc] = useState('');
  const [licenseDocName, setLicenseDocName] = useState('');
  const [eduQualDocName, setEduQualDocName] = useState('');
  const [otherDocName, setOtherDocName] = useState('');

  // Driver Fields
  const [driverAge, setDriverAge] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [licensePhoto, setLicensePhoto] = useState('');
  const [licensePhotoName, setLicensePhotoName] = useState('');

  // Admin Fields
  const [adminSecret, setAdminSecret] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (e, setter, nameSetter) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    try {
      const base64 = await fileToBase64(file);
      setter(base64);
      nameSetter(file.name);
    } catch {
      setError('Failed to read file. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (password !== confirmPassword) return setError('Passwords do not match');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    if (role === 'driver' && (!licenseNumber || !vehicleNumber || !vehicleName)) {
      return setError('License number, vehicle number, and vehicle name are required');
    }
    if (role === 'driver' && (Number(driverAge) < 18)) {
      return setError('Driver must be at least 18 years old');
    }

    setLoading(true);

    const payload = { name, email, password, role };

    if (role === 'doctor') {
      payload.doctorDetails = {
        specialization: specialization || 'General Medicine',
        experience: Number(experience) || 1,
        clinicInfo: clinicInfo || '',
        country, state, city, pincode, landmark,
        contactNumber,
        licenseDocument: licenseDoc,
        educationQualification: eduQualDoc,
        otherDocuments: otherDoc
      };
    } else if (role === 'patient') {
      payload.patientDetails = { country, state, city, pincode, landmark };
    } else if (role === 'driver') {
      payload.driverDetails = {
        age: Number(driverAge),
        licenseNumber,
        vehicleNumber,
        vehicleName,
        licensePhoto
      };
    } else if (role === 'admin') {
      payload.adminSecret = adminSecret;
    }

    try {
      const data = await register(payload);
      if (role === 'doctor' || role === 'driver') {
        setSuccessMsg(data.message || 'Registration successful! Waiting for Admin approval.');
        setName(''); setEmail(''); setPassword(''); setConfirmPassword('');
        setSpecialization(''); setExperience(''); setClinicInfo('');
        setLicenseDoc(''); setEduQualDoc(''); setOtherDoc('');
        setDriverAge(''); setLicenseNumber(''); setVehicleNumber(''); setVehicleName(''); setLicensePhoto('');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Email might already be taken.');
    } finally {
      setLoading(false);
    }
  };

  const sectionStyle = {
    background: 'var(--primary-blue-glow)',
    padding: '16px',
    borderRadius: '10px',
    marginBottom: '20px',
    border: '1px solid var(--glass-border)'
  };

  const grid2 = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' };

  const FileUploadField = ({ label, value, name, onFile, accept = "image/*,.pdf" }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <label style={{
        display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px',
        border: '1px dashed var(--glass-border)', borderRadius: '8px',
        background: value ? 'rgba(16,185,129,0.08)' : 'var(--bg-primary)',
        cursor: 'pointer', fontSize: '0.85rem', color: value ? 'var(--success-green)' : 'var(--text-secondary)'
      }}>
        <Upload size={16} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {name || 'Click to upload file (max 5MB)'}
        </span>
        <input type="file" accept={accept} onChange={onFile} style={{ display: 'none' }} />
      </label>
      {value && <span style={{ fontSize: '0.75rem', color: 'var(--success-green)', marginTop: '4px', display: 'block' }}>✓ File loaded</span>}
    </div>
  );

  return (
    <div style={{ padding: '40px 0 80px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', minHeight: 'calc(100vh - 160px)' }} className="animate-fade-in-up">
      <div style={{ maxWidth: '560px', width: '100%', padding: '0 24px' }}>
        <GlassCard style={{ padding: '36px' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img src="/logo.jpg" alt="Logo" style={{ height: '50px', width: '50px', borderRadius: '50%', marginBottom: '8px' }} />
            <h2 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', fontWeight: 800 }}>Create Account</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Join the ACFET MEDTRACK healthcare network</p>
          </div>

          {/* Role selector */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            background: 'var(--bg-primary)', padding: '4px', borderRadius: '8px',
            marginBottom: '24px', border: '1px solid var(--glass-border)', gap: '4px'
          }}>
            {['patient', 'doctor', 'driver'].map(r => (
              <button key={r} type="button" onClick={() => { setRole(r); setError(''); setSuccessMsg(''); }} style={{
                padding: '8px 4px', border: 'none', borderRadius: '6px', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.78rem', textTransform: 'capitalize',
                background: role === r ? 'var(--bg-secondary)' : 'transparent',
                color: role === r ? 'var(--primary-blue)' : 'var(--text-secondary)',
                boxShadow: role === r ? 'var(--shadow-sm)' : 'none', transition: 'all 0.2s'
              }}>
                {r === 'patient' ? '🏥 Patient' : r === 'doctor' ? '👨‍⚕️ Doctor' : '🚗 Driver'}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid var(--danger-red)', color: 'var(--danger-red)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: '2px' }} /><span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid var(--success-green)', color: 'var(--success-green)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} /><span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Common Base Fields */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} placeholder="E.g. Praveen Kumar" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} placeholder="E.g. praveen@gmail.com" required />
            </div>
            <div style={grid2}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" required />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input type="password" className="form-control" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm password" required />
              </div>
            </div>

            {/* Patient Fields */}
            {role === 'patient' && (
              <div style={sectionStyle}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} /> Location Details
                </h3>
                <div style={grid2}>
                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <input type="text" className="form-control" value={country} onChange={e => setCountry(e.target.value)} placeholder="E.g. India" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input type="text" className="form-control" value={state} onChange={e => setState(e.target.value)} placeholder="E.g. Andhra Pradesh" />
                  </div>
                </div>
                <div style={grid2}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input type="text" className="form-control" value={city} onChange={e => setCity(e.target.value)} placeholder="E.g. Kakinada" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input type="text" className="form-control" value={pincode} onChange={e => setPincode(e.target.value)} placeholder="E.g. 533003" />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Landmark / Area</label>
                  <input type="text" className="form-control" value={landmark} onChange={e => setLandmark(e.target.value)} placeholder="E.g. Near ACET Gate" />
                </div>
              </div>
            )}

            {/* Doctor Fields */}
            {role === 'doctor' && (
              <>
                <div style={sectionStyle}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={16} /> Professional Details
                  </h3>
                  <div style={grid2}>
                    <div className="form-group">
                      <label className="form-label">Specialization *</label>
                      <input type="text" className="form-control" value={specialization} onChange={e => setSpecialization(e.target.value)} placeholder="E.g. Cardiologist" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Experience (Years) *</label>
                      <input type="number" min="1" className="form-control" value={experience} onChange={e => setExperience(e.target.value)} placeholder="E.g. 5" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Clinic / Hospital Info *</label>
                    <textarea className="form-control" value={clinicInfo} onChange={e => setClinicInfo(e.target.value)} placeholder="E.g. Aditya Health Care, Kakinada" rows="2" required></textarea>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Contact Number</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                      <input type="tel" className="form-control" style={{ paddingLeft: '38px' }} value={contactNumber} onChange={e => setContactNumber(e.target.value)} placeholder="+91 9876543210" />
                    </div>
                  </div>
                </div>

                <div style={{ ...sectionStyle, background: 'rgba(99,102,241,0.06)' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} /> Practice Location
                  </h3>
                  <div style={grid2}>
                    <div className="form-group">
                      <label className="form-label">Country</label>
                      <input type="text" className="form-control" value={country} onChange={e => setCountry(e.target.value)} placeholder="E.g. India" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">State</label>
                      <input type="text" className="form-control" value={state} onChange={e => setState(e.target.value)} placeholder="E.g. Andhra Pradesh" />
                    </div>
                  </div>
                  <div style={grid2}>
                    <div className="form-group">
                      <label className="form-label">City</label>
                      <input type="text" className="form-control" value={city} onChange={e => setCity(e.target.value)} placeholder="E.g. Kakinada" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Pincode</label>
                      <input type="text" className="form-control" value={pincode} onChange={e => setPincode(e.target.value)} placeholder="E.g. 533003" />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Landmark / Area</label>
                    <input type="text" className="form-control" value={landmark} onChange={e => setLandmark(e.target.value)} placeholder="E.g. Near Civil Hospital" />
                  </div>
                </div>

                <div style={{ ...sectionStyle, background: 'rgba(16,185,129,0.05)', borderColor: 'rgba(16,185,129,0.25)' }}>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Upload size={16} /> Verification Documents <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 400 }}>(Admin will review)</span>
                  </h3>
                  <FileUploadField label="Medical License / Registration Certificate *" value={licenseDoc} name={licenseDocName}
                    onFile={e => handleFileUpload(e, setLicenseDoc, setLicenseDocName)} accept="image/*,.pdf" />
                  <FileUploadField label="Educational Qualification Documents" value={eduQualDoc} name={eduQualDocName}
                    onFile={e => handleFileUpload(e, setEduQualDoc, setEduQualDocName)} accept="image/*,.pdf" />
                  <FileUploadField label="Other Supporting Documents (Optional)" value={otherDoc} name={otherDocName}
                    onFile={e => handleFileUpload(e, setOtherDoc, setOtherDocName)} accept="image/*,.pdf" />
                </div>
              </>
            )}

            {/* Driver Fields */}
            {role === 'driver' && (
              <div style={{ ...sectionStyle, background: 'rgba(245,158,11,0.06)', borderColor: 'rgba(245,158,11,0.25)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Car size={16} /> Driver & Vehicle Details
                </h3>
                <div style={grid2}>
                  <div className="form-group">
                    <label className="form-label">Your Age *</label>
                    <input type="number" min="18" max="70" className="form-control" value={driverAge} onChange={e => setDriverAge(e.target.value)} placeholder="E.g. 25" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Driver License Number *</label>
                    <input type="text" className="form-control" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} placeholder="E.g. AP0420020012345" required />
                  </div>
                </div>
                <div style={grid2}>
                  <div className="form-group">
                    <label className="form-label">Vehicle Name *</label>
                    <input type="text" className="form-control" value={vehicleName} onChange={e => setVehicleName(e.target.value)} placeholder="E.g. Honda Activa" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vehicle Number *</label>
                    <input type="text" className="form-control" value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value)} placeholder="E.g. AP39AA1234" required />
                  </div>
                </div>
                <FileUploadField label="Driving License Photo *" value={licensePhoto} name={licensePhotoName}
                  onFile={e => handleFileUpload(e, setLicensePhoto, setLicensePhotoName)} accept="image/*" />
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', marginBottom: 0 }}>
                  🔒 Your application will be reviewed by admin before you can log in.
                </p>
              </div>
            )}

            {/* Admin Fields */}
            {role === 'admin' && (
              <div style={sectionStyle}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size={16} /> Admin Authentication
                </h3>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Admin Secret Key</label>
                  <div style={{ position: 'relative' }}>
                    <Key size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)' }} />
                    <input type="password" className="form-control" style={{ paddingLeft: '38px' }} value={adminSecret} onChange={e => setAdminSecret(e.target.value)} placeholder="Enter project secret key" required />
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginTop: '6px' }}>
                    Note: Admin secret code is <strong>884822</strong>.
                  </span>
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '10px' }} disabled={loading}>
              <UserPlus size={18} />
              {loading ? 'Processing...' : 'Register Account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>Sign In</Link>
          </div>

        </GlassCard>
      </div>
    </div>
  );
};

export default Register;
