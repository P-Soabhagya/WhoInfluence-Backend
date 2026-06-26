const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const testimonialsPath = path.join(__dirname, '../data/testimonials.json');

// Helper function to read testimonials from file
const readTestimonials = () => {
  try {
    const data = fs.readFileSync(testimonialsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading testimonials file:', error);
    return [];
  }
};

// Helper function to write testimonials to file
const writeTestimonials = (data) => {
  try {
    fs.writeFileSync(testimonialsPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing testimonials file:', error);
    return false;
  }
};

router.get('/', (req, res) => {
  const list = readTestimonials();
  res.json({ success: true, data: list });
});

router.post('/', (req, res) => {
  const { name, role, text, title, reviewerType, stars } = req.body;
  
  if (!name || !role || !text) {
    return res.status(400).json({ success: false, message: 'Name, role, and text are required fields.' });
  }

  const list = readTestimonials();
  const newId = list.length > 0 ? Math.max(...list.map(t => t.id), 0) + 1 : 1;

  const newTestimonial = {
    id: newId,
    name,
    role,
    text,
    ...(title && { title }),
    ...(reviewerType && { reviewerType }),
    ...(stars && { stars: Number(stars) })
  };

  list.push(newTestimonial);
  
  if (writeTestimonials(list)) {
    res.status(201).json({ success: true, data: newTestimonial });
  } else {
    res.status(500).json({ success: false, message: 'Failed to write testimonial to storage.' });
  }
});

module.exports = router;
