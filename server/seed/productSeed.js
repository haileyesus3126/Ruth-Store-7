const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/productModel");

dotenv.config();

const products = [
  {
    name: "Women Round Neck Cotton Top",
    description:
      "A lightweight cotton top with a round neckline and short sleeves.",
    price: 100,
    images: ["/assets/p_img1.png"],
    category: "Women",
    subCategory: "Topwear",
    sizes: ["S", "M", "L"],
    bestseller: true,
    stock: 20,
  },
  {
    name: "Men Round Neck Pure Cotton T-shirt",
    description:
      "A pure cotton t-shirt with a round neckline and comfortable fit.",
    price: 200,
    images: [
      "/assets/p_img2_1.png",
      "/assets/p_img2_2.png",
      "/assets/p_img2_3.png",
      "/assets/p_img2_4.png",
    ],
    category: "Men",
    subCategory: "Topwear",
    sizes: ["M", "L", "XL"],
    bestseller: true,
    stock: 25,
  },
  {
    name: "Girls Round Neck Cotton Top",
    description:
      "A soft cotton top designed for kids with a simple round neck style.",
    price: 220,
    images: ["/assets/p_img3.png"],
    category: "Kids",
    subCategory: "Topwear",
    sizes: ["S", "L", "XL"],
    bestseller: true,
    stock: 18,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("Products seeded successfully");

    process.exit();
  } catch (error) {
    console.error("Product seeding failed:", error.message);
    process.exit(1);
  }
};

seedProducts();