const Document = require('../models/Document');
const fs = require('fs');
const path = require('path');

// 📤 Upload document
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const filePath = req.file.path.replace(/\\/g, '/');

    const doc = new Document({
      ownerAadhaar: req.body.ownerAadhaar,
      originalName: req.file.originalname,
      filename: req.file.filename,
      filePath,
    });

    await doc.save();
    res.status(200).json({ message: 'Document uploaded successfully', document: doc });
  } catch (err) {
    res.status(500).json({ message: 'Error uploading document', error: err.message });
  }
};

// 📥 Get documents (includes shared ones)
exports.getDocuments = async (req, res) => {
  try {
    const { aadhaar } = req.params;
    const docs = await Document.find({
      $or: [
        { ownerAadhaar: aadhaar },
        { sharedWith: aadhaar }
      ]
    });
    res.json({ documents: docs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🗑 Delete document
exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const filePath = path.join(__dirname, '..', doc.filePath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await doc.deleteOne();
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting document', error: err.message });
  }
};

// ✏ Update document
exports.updateDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    const oldPath = path.join(__dirname, '..', doc.filePath);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

    doc.filename = req.file.filename;
    doc.originalName = req.file.originalname;
    doc.filePath = req.file.path.replace(/\\/g, '/');

    await doc.save();
    res.json({ message: 'Document updated successfully', document: doc });
  } catch (err) {
    res.status(500).json({ message: 'Error updating document', error: err.message });
  }
};

// 🔗 Share document
exports.shareDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { targetAadhaar } = req.body;

    if (!targetAadhaar) {
      return res.status(400).json({ message: 'Target Aadhaar is required' });
    }

    const doc = await Document.findById(id);
    if (!doc) return res.status(404).json({ message: 'Document not found' });

    if (!doc.sharedWith.includes(targetAadhaar)) {
      doc.sharedWith.push(targetAadhaar);
      await doc.save();
    }

    res.json({ message: 'Document shared successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error sharing document', error: err.message });
  }
};
