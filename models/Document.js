const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  ownerAadhaar: { type: String, required: true },
  filePath: { type: String, required: true },
  originalName: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  sharedWith: [String],
});

module.exports = mongoose.model('Document', documentSchema);