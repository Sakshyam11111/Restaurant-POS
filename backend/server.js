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

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/restaurant-pos', {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 2,
  bufferCommands: false,
})
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 0);

app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/customer', customerRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ status: 'error', message: err.message || 'Internal Server Error' });
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