const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection (direct string, no dotenv)
mongoose.connect(
  "mongodb+srv://ss4689878:8YPhJSP5cJTZPL6d@securedocscluster.zwlwqp7.mongodb.net/secureDocs?retryWrites=true&w=majority&appName=secureDocsCluster",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(() => console.log("✅ MongoDB Atlas connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
