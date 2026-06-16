const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, adminOnly, upload.array("images", 5), (req, res) => {
  const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);

  res.status(200).json({
    success: true,
    message: "Images uploaded successfully",
    images: imageUrls,
  });
});

module.exports = router;