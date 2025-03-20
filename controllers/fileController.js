const File = require("../models/File");

// Upload a file
exports.uploadFile = async (req, res) => {
  try {
    const { filename, path, mimetype } = req.file;
    const file = new File({ filename, path, mimetype, comments: [] });
    await file.save();
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ error: "Failed to upload file" });
  }
};

// Get all files
exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch files" });
  }
};

// Add a comment
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const file = await File.findById(id);
    if (!file) return res.status(404).json({ error: "File not found" });

    file.comments.push({ text, resolved: false });
    await file.save();
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ error: "Failed to add comment" });
  }
};

// Update a comment
exports.updateComment = async (req, res) => {
  try {
    const { fileId, commentId } = req.params;
    const { text, resolved } = req.body;

    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ error: "File not found" });

    const comment = file.comments.id(commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (text) comment.text = text;
    if (resolved !== undefined) comment.resolved = resolved;

    await file.save();
    res.status(200).json(file);
  } catch (err) {
    res.status(500).json({ error: "Failed to update comment" });
  }
};

// Delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const { fileId, commentId } = req.params;

    const file = await File.findById(fileId);
    if (!file) return res.status(404).json({ error: "File not found" });

    file.comments = file.comments.filter(comment => comment._id.toString() !== commentId);

    await file.save();
    res.status(200).json(file);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
};
