const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['about', 'terms'], // Only "about" or "terms" allowed
    required: true,
    unique: true // Ensure only one document per type
  },
  content: { type: String, required: true }
}, { timestamps: true }); // Adds createdAt and updatedAt fields

module.exports = mongoose.model('SiteContent', siteContentSchema);
