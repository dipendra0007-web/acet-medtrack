const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'acfet_medtrack_secret_key_12345';

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};

const checkAccess = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    // Patients have full access to their own data
    if (req.user.role === 'patient' || req.user.role === 'admin') {
      return next();
    }
    // Parents must have the specific permission enabled
    if (req.user.role === 'parent') {
      if (req.user.permissions && req.user.permissions[permission]) {
        return next();
      }
      return res.status(403).json({ message: `Parent access for ${permission} is not enabled by the patient` });
    }
    // Doctors are passed to controllers to evaluate doctor-patient sharing relationships
    if (req.user.role === 'doctor') {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden: Access denied' });
  };
};

module.exports = {
  protect,
  authorize,
  checkAccess,
  JWT_SECRET
};
