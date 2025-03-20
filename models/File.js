const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  path: { type: String, required: true },
  mimetype: { type: String, required: true },
  comments: [{ text: String, resolved: Boolean }],
});

module.exports = mongoose.model("File", fileSchema);
