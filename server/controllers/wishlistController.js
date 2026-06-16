const User = require("../models/userModel");
const Product = require("../models/productModel");

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist.product");

    res.status(200).json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const user = await User.findById(req.user._id);

    const alreadyExists = user.wishlist.find(
      (item) => item.product.toString() === productId
    );

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    user.wishlist.push({
      product: productId,
    });

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate(
      "wishlist.product"
    );

    res.status(200).json({
      success: true,
      message: "Added to wishlist",
      wishlist: updatedUser.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user._id);

    user.wishlist = user.wishlist.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate(
      "wishlist.product"
    );

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
      wishlist: updatedUser.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const clearWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.wishlist = [];

    await user.save();

    res.status(200).json({
      success: true,
      message: "Wishlist cleared",
      wishlist: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
};