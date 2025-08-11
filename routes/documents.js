const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  uploadDocument,
  getDocuments,
  deleteDocument,
  updateDocument,
  shareDocument
} = require('../controllers/documentController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), uploadDocument);
router.get('/:aadhaar', getDocuments);
router.delete('/delete/:id', deleteDocument);
router.put('/update/:id', upload.single('file'), updateDocument);
router.post('/share/:id', shareDocument); // ✅ NEW SHARE ROUTE

module.exports = router;
