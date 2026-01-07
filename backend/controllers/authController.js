// controllers/authController.js
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');
const Customer = require('../models/Customer');

// Generate JWT Token
const generateToken = (id, userType) => {
  return jwt.sign(
    { id, userType }, 
    process.env.JWT_SECRET || 'your-secret-key-change-in-production',
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

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
    }

    // Find staff and include password
    const staff = await Staff.findOne({ email }).select('+password');
    
    if (!staff || !staff.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials or account is inactive'
      });
    }

    // Check password
    const isPasswordCorrect = await staff.comparePassword(password);
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
      message: 'Login failed'
    });
  }
};

// Customer Signup
exports.customerSignup = async (req, res) => {
  try {
    const { email, password, confirmPassword, fullName, phone } = req.body;

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

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({
        status: 'error',
        message: 'Customer with this email already exists'
      });
    }

    // Create new customer
    const customer = await Customer.create({
      email,
      password,
      fullName,
      phone
    });

    // Generate token
    const token = generateToken(customer._id, 'customer');

    res.status(201).json({
      status: 'success',
      message: 'Customer account created successfully',
      data: {
        user: customer,
        token
      }
    });
  } catch (error) {
    console.error('Customer Signup Error:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to create customer account'
    });
  }
};

// Customer Login
exports.customerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email and password are required'
      });
    }

    // Find customer and include password
    const customer = await Customer.findOne({ email }).select('+password');
    
    if (!customer || !customer.isActive) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials or account is inactive'
      });
    }

    // Check password
    const isPasswordCorrect = await customer.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid credentials'
      });
    }

    // Update last login
    customer.lastLogin = new Date();
    await customer.save();

    // Generate token
    const token = generateToken(customer._id, 'customer');

    // Remove password from response
    customer.password = undefined;

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        user: customer,
        token
      }
    });
  } catch (error) {
    console.error('Customer Login Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Login failed'
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
    
    let user;
    if (userType === 'staff') {
      user = await Staff.findById(userId);
    } else {
      user = await Customer.findById(userId);
    }

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