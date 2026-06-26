const dns = require('dns');
// Configure public DNS servers to resolve MongoDB SRV records on Windows
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (dnsErr) {
  console.warn('⚠️ Failed to configure public DNS servers, using default:', dnsErr.message);
}

require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Video = require('../models/Video');
const initialVideos = require('../data/videos.json');

const seedDatabase = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    // 2. Clear current Videos
    console.log('🧹 Clearing existing videos from database...');
    await Video.deleteMany({});
    console.log('✅ Collection cleared!');

    // 3. Prepare Seed Data
    console.log(`🌱 Preparing to seed ${initialVideos.length} videos...`);
    const seedData = initialVideos.map((v) => ({
      brand: v.brand,
      title: v.title,
      category: v.category || 'General',
      videoUrl: v.thumbnail || '',
      thumbnailUrl: '',
      views: v.views || '0 Views',
      duration: v.duration || '0:15',
    }));

    // 4. Insert Seed Data
    await Video.insertMany(seedData);
    console.log('🚀 Successfully seeded database with all featured videos!');

    // 5. Disconnect
    await mongoose.connection.close();
    console.log('🔌 Connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seedDatabase();
