const express = require("express");
const router = express.Router();
const upload = require("../middleware/multerConfig");
const fileController = require("../controllers/fileController");

router.post("/upload", upload.single("file"), fileController.uploadFile);
router.get("/files", fileController.getAllFiles);
router.post("/files/:id/comments", fileController.addComment);
router.put("/files/:fileId/comments/:commentId", fileController.updateComment);
router.delete("/files/:fileId/comments/:commentId", fileController.deleteComment);

module.exports = router;
