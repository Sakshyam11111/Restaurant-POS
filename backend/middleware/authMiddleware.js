const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 'error',
        message: 'You are not logged in. Please log in to access this resource.'
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({
        status: 'error',
        message: 'Server configuration error'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Handle admin authentication
    if (decoded.userType === 'admin') {
      req.user = {
        userId: decoded.id,
        userType: 'admin',
        role: 'admin',
        isAdmin: true
      };
      return next();
    }

    // Handle staff authentication
    if (decoded.userType !== 'staff') {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid user type'
      });
    }

    const user = await Staff.findById(decoded.id);

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

    req.user = {
      userId: user._id,
      email: user.email,
      userType: 'staff',
      role: user.role,
      isAdmin: false
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
      message: 'Authentication failed: ' + error.message
    });
  }
};

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

exports.restrictToRole = (...roles) => {
  return (req, res, next) => {
    if (req.user.userType !== 'staff' && req.user.userType !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Staff or Admin only.'
      });
    }

    // Allow admin to access all routes
    if (req.user.userType === 'admin' || req.user.isAdmin) {
      return next();
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

// Middleware to check if user is admin
exports.requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      status: 'error',
      message: 'Admin access required'
    });
  }
  next();
};