const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true,
  },
  title: {
    type: String,
    required: [true, 'Video title is required'],
    trim: true,
  },
  category: {
    type: String,
    trim: true,
    default: 'General',
  },
  videoUrl: {
    type: String,
    required: [true, 'Video file URL is required'],
    trim: true,
  },
  thumbnailUrl: {
    type: String,
    trim: true,
  },
  views: {
    type: String,
    trim: true,
    default: '0 Views',
  },
  duration: {
    type: String,
    trim: true,
    default: '0:15',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Video', VideoSchema);
