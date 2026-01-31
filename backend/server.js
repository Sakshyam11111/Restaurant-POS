const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const staffRoutes = require('./routes/staffRoutes');
const customerRoutes = require('./routes/customerRoutes');

dotenv.config();

const app = express();

app.set('x-powered-by', false);
app.set('etag', false);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// MongoDB Connection with better error handling
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-pos', {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      bufferCommands: false,
      connectTimeoutMS: 10000,
    });
    console.log('✓ MongoDB Connected Successfully');
  } catch (err) {
    console.error('✗ MongoDB Connection Error:', err.message);
    console.error('  Make sure MongoDB is running and MONGODB_URI is correct');
    process.exit(1);
  }
};

connectDB();

// Connection event listeners
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/customer', customerRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Not Found' });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.keepAliveTimeout = 65000;
server.headersTimeout = 66000;
server.timeout = 60000;

module.exports = app;