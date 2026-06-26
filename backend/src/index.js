require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

// Ensure upload directories exist
const uploadDirs = [
  path.join(__dirname, '../uploads'),
  path.join(__dirname, '../uploads/videos'),
  path.join(__dirname, '../uploads/thumbnails')
];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const campaignsRouter = require('./routes/campaigns');
const testimonialsRouter = require('./routes/testimonials');
const videosRouter = require('./routes/videos');
const contactRouter = require('./routes/contact');
const influencerRouter = require('./routes/influencer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'] }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/videos', express.static(path.join(__dirname, '../videos')));
// Serve testimonial videos static files
app.use('/testimonialVideos', express.static(path.join(__dirname, '../videos/TestimonialVideos')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'WhoInfluence API is running', timestamp: new Date() });
});

// Routes
app.use('/api/campaigns', campaignsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/videos', videosRouter);
app.use('/api/contact', contactRouter);
app.use('/api/influencer', influencerRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 WhoInfluence API running at http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
