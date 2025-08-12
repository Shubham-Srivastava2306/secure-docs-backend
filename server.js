const fs = require('fs');
const path = require('path'); // ✅ Only declared once

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log('✅ uploads/ folder created at startup');
} else {
  console.log('✅ uploads/ folder already exists');
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Register routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/docs', require('./routes/documents'));

// MongoDB connection
mongoose.connect(
  "mongodb+srv://ss4689878:8YPhJSP5cJTZPL6d@securedocscluster.zwlwqp7.mongodb.net/secureDocs?retryWrites=true&w=majority&appName=secureDocsCluster"
)
.then(() => console.log("✅ MongoDB Atlas connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Catch-all route
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});
