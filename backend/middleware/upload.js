const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const uploadDirs = {
  assignments: 'uploads/assignments',
  lostfound: 'uploads/lostfound',
  events: 'uploads/events',
  profiles: 'uploads/profiles',
  menu: 'uploads/menu',
  documents: 'uploads/documents'
};

// Create directories if they don't exist
Object.values(uploadDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    
    // Determine upload path based on file field name or route
    if (file.fieldname === 'assignment' || req.path.includes('assignment')) {
      uploadPath = uploadDirs.assignments;
    } else if (file.fieldname === 'lostfound' || req.path.includes('lostfound')) {
      uploadPath = uploadDirs.lostfound;
    } else if (file.fieldname === 'event' || req.path.includes('event')) {
      uploadPath = uploadDirs.events;
    } else if (file.fieldname === 'profile' || req.path.includes('profile')) {
      uploadPath = uploadDirs.profiles;
    } else if (file.fieldname === 'menu' || req.path.includes('menu')) {
      uploadPath = uploadDirs.menu;
    } else {
      uploadPath = uploadDirs.documents;
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/zip',
    'application/x-zip-compressed'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed types: Images, PDF, Word, Excel, PowerPoint, Text, ZIP'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Different upload configurations
const uploadSingle = upload.single('file');
const uploadMultiple = upload.array('files', 10); // Max 10 files
const uploadFields = upload.fields([
  { name: 'assignment', maxCount: 5 },
  { name: 'documents', maxCount: 10 },
  { name: 'image', maxCount: 1 }
]);

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  uploadDirs
};
