const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors({
  origin: "*",  // Allow requests from the frontend
  credentials: true,
}));
app.use(express.json());

// In-memory storage for files
let files = [];

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload file endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  try {
    const { filename, path, mimetype } = req.file;
    const file = { _id: Date.now().toString(), filename, path, mimetype, comments: [] };
    files.push(file);
    res.status(201).json(file);
  } catch (err) {
    res.status(500).json({ error: "Failed to upload file" });
  }
});

// Get all files endpoint
app.get("/files", (req, res) => {
  res.status(200).json(files);
});

// Add comment to file
app.post("/files/:_id/comments", (req, res) => {
  try {
    
    const { _id } = req.params;
    const { text } = req.body;

    console.log( req.body,req.params)

    if (!text) return res.status(400).json({ error: "Comment text is required" });

    const file = files.find(f => f._id === _id);
    if (!file) return res.status(404).json({ error: "File not found" });

    const comment = { _id: Date.now().toString(), text, resolved: false };
    file.comments.push(comment);

    res.status(201).json(file);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

// Update a comment
app.put("/files/:fileId/comments/:commentId", (req, res) => {
  try {
    const { fileId, commentId } = req.params;
    const { text, resolved } = req.body;

    const file = files.find(f => f._id === fileId);
    if (!file) return res.status(404).json({ error: "File not found" });

    const comment = file.comments.find(c => c._id === commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (text) comment.text = text;
    if (resolved !== undefined) comment.resolved = resolved;
    
    res.status(200).json(file);
  } catch (err) {
    res.status(500).json({ error: "Failed to update comment" });
  }
});

// Delete a comment
app.delete("/files/:fileId/comments/:commentId", (req, res) => {
  try {
    const { fileId, commentId } = req.params;
    
    const file = files.find(f => f._id === fileId);
    if (!file) return res.status(404).json({ error: "File not found" });

    file.comments = file.comments.filter(comment => comment._id !== commentId);
    
    res.status(200).json(file);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
