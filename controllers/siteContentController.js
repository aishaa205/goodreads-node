const SiteContent = require('../models/siteContent');
const sendResponse = require("../utils/responseUtil");

//get content by type (about or terms)
//example of calling the api http://localhost:3001/siteContent/about
exports.getContent = async (req, res) => {
  try {
    const { type } = req.params; // Get 'type' from route parameter
    if (!type) {
      return sendResponse(res, 400, null, "Type parameter is required");
    }

    const content = await SiteContent.findOne({ type });

    if (!content) {
      return sendResponse(res, 404, null, `${type} section not found`);
    }

    sendResponse(res, 200, content);
  } catch (error) {
    sendResponse(res, 500, null, "Failed to fetch content");
  }
};

// Update About or Terms
// body: { content: "New content" }
// example of calling the api http://localhost:3001/siteContent/about
exports.updateContent = async (req, res) => {
  try {
    const { type } = req.params;
    console.log(type);
    // Find content by type
    const content = await SiteContent.findOne({ type });

    if (!content) {
      // If no content found, create a new entry
      const newContent = new SiteContent({ type, content: req.body.content });
      const createdContent = await newContent.save();
      return sendResponse(res, 201, createdContent, `${type} section created successfully`);
    }

    // Update the existing content
    const updatedContent = await SiteContent.findOneAndUpdate(
      { type: type },
      { content: req.body.content },
      { new: true, upsert: true } // Creates document if it doesn't exist
    );

    sendResponse(res, 200, updatedContent, `${type} section updated successfully`);
  } catch (error) {
    sendResponse(res, 500, null, "Failed to update content"+ error.message);
  }
};
