const express = require("express");

const {
  getAllProducts,
  getSingleProduct,
  getBestSellerProducts,
  getLatestProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/bestseller", getBestSellerProducts);
router.get("/latest", getLatestProducts);
router.get("/:id", getSingleProduct);

router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;