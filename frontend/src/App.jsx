import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AlarmNotification from './components/AlarmNotification';

// Import Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import OurTeam from './pages/OurTeam';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Shop from './pages/Shop';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            
            <main style={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/team" element={<OurTeam />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/patient" element={<Dashboard />} />
                <Route path="/doctor" element={<Dashboard />} />
                <Route path="/admin" element={<Dashboard />} />
                <Route path="/parent" element={<Dashboard />} />
                <Route path="/PATIENT" element={<Dashboard />} />
                <Route path="/DOCTOR" element={<Dashboard />} />
                <Route path="/ADMIN" element={<Dashboard />} />
                <Route path="/PARENT" element={<Dashboard />} />
              </Routes>
            </main>

            <Footer />
            
            {/* Global Medicine Alarms Engine */}
            <AlarmNotification />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
