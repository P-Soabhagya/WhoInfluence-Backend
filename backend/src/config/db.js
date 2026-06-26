const mongoose = require('mongoose');
const dns = require('dns');

// Configure public DNS servers to resolve MongoDB SRV records on Windows
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (dnsErr) {
  console.warn('⚠️ Failed to configure public DNS servers, using default:', dnsErr.message);
}

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URL;
    if (!connStr) {
      throw new Error('MONGO_URL environment variable is not defined in .env');
    }

    console.log('🔌 Connecting to MongoDB...');
    const conn = await mongoose.connect(connStr);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
