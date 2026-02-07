// controllers/authController.js
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');

// Generate JWT Token
const generateToken = (id, userType) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }
  
  return jwt.sign(
    { id, userType }, 
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Staff Signup
exports.staffSignup = async (req, res) => {
  try {
    const { email, password, confirmPassword, fullName, role } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Passwords do not match'
      });
    }

    // Check if staff already exists
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({
        status: 'error',
        message: 'Staff member with this email already exists'
      });
    }

    // Create new staff
    const staff = await Staff.create({
      email,
      password,
      fullName,
      role: role || 'waiter'
    });

    // Generate token
    const token = generateToken(staff._id, 'staff');

    res.status(201).json({
      status: 'success',
      message: 'Staff account created successfully',
      data: {
        user: staff,
        token
      }
    });
  } catch (error) {
    console.error('Staff Signup Error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to create staff account'
    });
  }
};

// Staff Login
exports.staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for:', email);

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
    }

    // Find staff and include password
    const staff = await Staff.findOne({ email }).select('+password');
    
    console.log('Staff found:', staff ? 'Yes' : 'No');

    if (!staff) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    if (!staff.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Account is inactive. Please contact support.'
      });
    }

    // Check password
    const isPasswordCorrect = await staff.comparePassword(password);
    console.log('Password correct:', isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Update last login
    staff.lastLogin = new Date();
    await staff.save();

    // Generate token
    const token = generateToken(staff._id, 'staff');

    // Remove password from response
    staff.password = undefined;

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: staff,
        token
      }
    });
  } catch (error) {
    console.error('Staff Login Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed: ' + error.message
    });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Logout failed'
    });
  }
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
  try {
    const { userType, userId } = req.user;
    
    if (userType !== 'staff') {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }
    
    const user = await Staff.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get user information'
    });
  }
};