// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');
const Customer = require('../models/Customer');

// Verify JWT Token
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in. Please log in to access this resource.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');

    // Check if user still exists
    let user;
    if (decoded.userType === 'staff') {
      user = await Staff.findById(decoded.id);
    } else if (decoded.userType === 'customer') {
      user = await Customer.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Your account has been deactivated. Please contact support.'
      });
    }

    // Grant access to protected route
    req.user = {
      userId: user._id,
      email: user.email,
      userType: decoded.userType,
      role: user.role || null
    };

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid token. Please log in again.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Your token has expired. Please log in again.'
      });
    }

    res.status(401).json({
      status: 'error',
      message: 'Authentication failed'
    });
  }
};

// Restrict to specific user types
exports.restrictTo = (...userTypes) => {
  return (req, res, next) => {
    if (!userTypes.includes(req.user.userType)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};

// Restrict to specific staff roles
exports.restrictToRole = (...roles) => {
  return (req, res, next) => {
    if (req.user.userType !== 'staff') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Staff only.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};