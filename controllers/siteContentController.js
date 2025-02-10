const SiteContent = require('../models/siteContent');

//get content by type (about or terms)
//example of calling the api http://localhost:3001/siteContent/about
exports.getContentByType = async (req, res) => {
  try {
    const { type } = req.params; // Get 'type' from route parameter
    if (!type) {
       return res.status(400).send({ message: "Type is required" });
    }
    const content = await SiteContent.findOne({ type });
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }
     res.status(200).send(content);
  } catch (error) {
     res.status(500).send(error);
  }
};

// Get all content
// example of calling the api http://localhost:3001/siteContent/
exports.getContent = async (req, res) => {
  try {
    const content = await SiteContent.find();
    if (!content) return res.status(404).json({ message: "Content not found" });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
};

// Update About or Terms
// body: { content: "New content" }
// example of calling the api http://localhost:3001/siteContent/about
// example of calling the api http://localhost:3001/siteContent/terms
//  Update or create content
exports.updateContent = async (req, res) => {
  try {
    const { content } = req.body;
    const updatedContent = await SiteContent.findOneAndUpdate(
      { type: req.params.type },
      { content },
      { new: true, upsert: true } // upsert: true creates the document if it doesn't exist
    );
    res.json(updatedContent);
  } catch (error) {
    res.status(500).json({ message: "Error updating content", error });
  }
};
