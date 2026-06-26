const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');
const initialVideos = require('../data/videos.json');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'video') {
      cb(null, path.join(__dirname, '../../uploads/videos'));
    } else if (file.fieldname === 'thumbnail') {
      cb(null, path.join(__dirname, '../../uploads/thumbnails'));
    } else {
      cb(new Error('Invalid field name'), null);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Configure upload limits & file filters
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max video size
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'video') {
      const isVideo = file.mimetype.startsWith('video/');
      if (isVideo) cb(null, true);
      else cb(new Error('Only video files are allowed for video upload!'), false);
    } else if (file.fieldname === 'thumbnail') {
      const isImage = file.mimetype.startsWith('image/');
      if (isImage) cb(null, true);
      else cb(new Error('Only image files are allowed for thumbnail upload!'), false);
    } else {
      cb(new Error('Unknown field'), false);
    }
  }
});

// Get all videos
router.get('/', async (req, res) => {
  try {
    let videosList = await Video.find({}).sort({ createdAt: -1 });

    // Seed database if empty and MongoDB is connected
    if (videosList.length === 0) {
      console.log('🌱 Seeding videos database from JSON...');
      const seedData = initialVideos.map((v) => ({
        brand: v.brand,
        title: v.title,
        category: v.category || 'General',
        videoUrl: v.thumbnail || '',
        thumbnailUrl: '',
        views: v.views || '0 Views',
        duration: v.duration || '0:15',
      }));
      await Video.insertMany(seedData);
      videosList = await Video.find({}).sort({ createdAt: -1 });
    }

    res.json({ success: true, data: videosList });
  } catch (err) {
    console.error('⚠️ Database error in GET /api/videos, falling back to JSON:', err.message);
    res.json({ success: true, data: initialVideos });
  }
});

// Upload a new video
router.post('/upload', upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), async (req, res) => {
  try {
    const { brand, title, category, views, duration } = req.body;

    if (!brand || !title) {
      return res.status(400).json({ success: false, message: 'Brand and Title are required.' });
    }

    if (!req.files || !req.files['video'] || req.files['video'].length === 0) {
      return res.status(400).json({ success: false, message: 'Video file is required.' });
    }

    const videoFile = req.files['video'][0];
    const videoUrl = `/uploads/videos/${videoFile.filename}`;

    let thumbnailUrl = '';
    if (req.files['thumbnail'] && req.files['thumbnail'].length > 0) {
      const thumbnailFile = req.files['thumbnail'][0];
      thumbnailUrl = `/uploads/thumbnails/${thumbnailFile.filename}`;
    }

    // Save to Database
    const newVideo = new Video({
      brand,
      title,
      category: category || 'General',
      videoUrl,
      thumbnailUrl,
      views: views || '0 Views',
      duration: duration || '0:15'
    });

    await newVideo.save();
    console.log(`📹 New video uploaded: "${title}" by ${brand}`);

    res.status(201).json({
      success: true,
      message: 'Video uploaded successfully!',
      data: newVideo
    });
  } catch (err) {
    console.error('❌ Upload video route error:', err.message);
    res.status(500).json({ success: false, message: err.message || 'Server error occurred during upload.' });
  }
});

module.exports = router;
