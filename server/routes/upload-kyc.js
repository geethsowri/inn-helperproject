const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'kyc-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit for documents
  },
  fileFilter: function (req, file, cb) {
    // Check if file is an image or PDF
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image files and PDFs are allowed!'), false);
    }
  }
});

router.post('/upload-kyc', upload.single('kyc'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = `/uploads/${req.file.filename}`;
    
    res.status(200).json({
      message: 'KYC document uploaded successfully',
      fileName: req.file.filename,
      filePath: filePath,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (error) {
    console.error('Error uploading KYC document:', error);
    res.status(500).json({ error: 'Failed to upload KYC document' });
  }
});

// New route for base64 KYC uploads
router.post('/upload-kyc-base64', (req, res) => {
  try {
    const { fileName, base64, fileSize } = req.body;
    
    if (!fileName || !base64) {
      return res.status(400).json({ error: 'Missing fileName or base64 data' });
    }

    // Convert base64 to buffer
    const base64Data = base64.replace(/^data:image\/[a-z]+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(fileName);
    const newFileName = 'kyc-' + uniqueSuffix + fileExtension;
    const filePath = path.join(uploadsDir, newFileName);
    
    // Write file to disk
    fs.writeFileSync(filePath, buffer);
    
    res.status(200).json({
      message: 'KYC document uploaded successfully',
      fileName: newFileName,
      filePath: `/uploads/${newFileName}`,
      originalName: fileName,
      size: fileSize || buffer.length
    });
  } catch (error) {
    console.error('Error uploading KYC document from base64:', error);
    res.status(500).json({ error: 'Failed to upload KYC document' });
  }
});

module.exports = router;
