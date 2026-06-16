const express = require("express");

const {
  createOrder,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
  updateOrderStatus,
  markOrderPaid,
} = require("../controllers/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

router.get("/", protect, adminOnly, getAllOrders);
router.get("/:id", protect, getSingleOrder);

router.put("/:id/status", protect, adminOnly, updateOrderStatus);
router.put("/:id/pay", protect, adminOnly, markOrderPaid);

module.exports = router;