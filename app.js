const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Import route files
const documentRoutes = require('./routes/documents');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Register API routes BEFORE static frontend
app.use('/api/docs', documentRoutes);
app.use('/api/auth', authRoutes);

// Serve uploaded files


// Serve frontend files
app.use(express.static(path.join(__dirname, '../client')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// MongoDB and server start
mongoose.connect('mongodb://localhost:27017/secureDocs', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
})
.catch(err => console.error('❌ MongoDB connection error:', err));
