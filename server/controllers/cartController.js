const User = require("../models/userModel");
const Product = require("../models/productModel");

const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");

    res.status(200).json({
      success: true,
      cart: user.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, size = "default", quantity = 1 } = req.body;

    const product = await Product.findById(productId);

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const user = await User.findById(req.user._id);

    const existingItem = user.cart.find(
      (item) =>
        item.product.toString() === productId && item.size === String(size)
    );

    if (existingItem) {
      existingItem.quantity += Number(quantity) || 1;
    } else {
      user.cart.push({
        product: productId,
        size,
        quantity: Number(quantity) || 1,
      });
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate(
      "cart.product"
    );

    res.status(200).json({
      success: true,
      message: "Added to cart",
      cart: updatedUser.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId, size = "default", quantity } = req.body;

    const user = await User.findById(req.user._id);

    const item = user.cart.find(
      (cartItem) =>
        cartItem.product.toString() === productId &&
        cartItem.size === String(size)
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    if (Number(quantity) <= 0) {
      user.cart = user.cart.filter(
        (cartItem) =>
          !(
            cartItem.product.toString() === productId &&
            cartItem.size === String(size)
          )
      );
    } else {
      item.quantity = Number(quantity);
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate(
      "cart.product"
    );

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart: updatedUser.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId, size = "default" } = req.body;

    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      (item) =>
        !(item.product.toString() === productId && item.size === String(size))
    );

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate(
      "cart.product"
    );

    res.status(200).json({
      success: true,
      message: "Removed from cart",
      cart: updatedUser.cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.cart = [];

    await user.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart: [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};