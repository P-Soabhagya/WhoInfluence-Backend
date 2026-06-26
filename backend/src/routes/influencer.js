const express = require('express');
const router = express.Router();
const { sendMail, buildInfluencerEmailHTML } = require('../utils/emailService');
const Influencer = require('../models/Influencer');
const saveToExcel = require('../services/excelService');

router.post('/', async (req, res) => {
  const { name, phone, email, socialLink, message } = req.body;

  if (!name || !email || !phone || !socialLink) {
    return res.status(400).json({ success: false, message: 'All fields (Name, Phone, Email, Social Link) are required.' });
  }

  // Log to console for server-side records
  console.log('\n=== New Influencer Application ===');
  console.log(`Name: ${name}`);
  console.log(`Phone: ${phone}`);
  console.log(`Email: ${email}`);
  console.log(`Social Link: ${socialLink}`);
  console.log(`Message: ${message || 'N/A'}`);
  console.log('==================================\n');

  try {
    // 1. Save application to MongoDB
    const newInfluencer = new Influencer({ name, phone, email, socialLink, message });
    await newInfluencer.save();
    await saveToExcel({
      name,
      email,
      phone,
      socialLinks: socialLink,
      message,
    });
    console.log(`💾 Saved to Database with ID: ${newInfluencer._id}`);

    // 2. Send email notification
    try {
      await sendMail({
        subject: `🌟 New Influencer Application: ${name}`,
        html: buildInfluencerEmailHTML(name, phone, email, socialLink, message),
      });
    } catch (err) {
      console.error('⚠️ Email delivery failed, but application was saved to DB:', err.message);
    }

    res.json({ success: true, message: "Application received! Our talent team will reach out soon." });
  } catch (dbError) {
    console.error('❌ Failed to save influencer to Database:', dbError.message);
    res.status(500).json({ success: false, message: 'Failed to save application. Please try again.' });
  }
});

module.exports = router;
