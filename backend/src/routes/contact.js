const express = require('express');
const router = express.Router();
const { sendMail, buildContactEmailHTML } = require('../utils/emailService');
const Contact = require('../models/Contact');
const saveToExcel = require('../services/excelservice');

router.post('/', async (req, res) => {
  const { name, email, brand, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
  }

  // Log to console for server-side records
  console.log('\n=== New Contact Submission ===');
  console.log(`Name: ${name}`);
  console.log(`Email: ${email}`);
  console.log(`Brand: ${brand || 'N/A'}`);
  console.log(`Message: ${message}`);
  console.log('==============================\n');

  try {
    // 1. Save submission to MongoDB
    const newContact = new Contact({ name, email, brand, message });
    await newContact.save();
    await saveToExcel({
      name,
      email,
      brand,
      message,
    });
    console.log(`💾 Saved to Database with ID: ${newContact._id}`);

    // 2. Send email notification
    try {
      await sendMail({
        subject: `🔔 New Contact: ${name}${brand ? ` (${brand})` : ''}`,
        html: buildContactEmailHTML(name, email, brand, message),
      });
    } catch (err) {
      console.error('⚠️ Email delivery failed, but submission was saved to DB:', err.message);
    }

    res.json({ success: true, message: "Thank you! We'll get back to you within 24 hours." });
  } catch (dbError) {
    console.error('❌ Failed to save contact to Database:', dbError.message);
    res.status(500).json({ success: false, message: 'Failed to save submission. Please try again.' });
  }
});

module.exports = router;
