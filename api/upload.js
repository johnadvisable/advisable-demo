import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ESM-friendly __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Get the path from the request body or use the default media directory
    const uploadPath = req.body.path 
      ? path.dirname(path.join(__dirname, '../public', req.body.path)) 
      : path.join(__dirname, '../public/media');
    
    // Create the directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Use the filename from the path or generate a new one
    const filename = req.body.path ? path.basename(req.body.path) : `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  }
});

// Create the multer upload instance
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  }
});

// Handle file uploads
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // Return the file path (relative to the public directory)
    const filePath = req.body.path || `/media/${req.file.filename}`;
    
    return res.status(200).json({
      success: true,
      filePath,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({
      success: false,
      message: 'Error uploading file',
      error: error.message
    });
  }
});

export default router;
