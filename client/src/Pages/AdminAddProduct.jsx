import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../Components/Title";

const API_URL = import.meta.env.VITE_API_URL;

const AdminAddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    sizes: "",
    stock: "",
    bestseller: false,
  });

  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setSuccess("");
  };

  const validate = () => {
    if (!form.name.trim()) return "Product name is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.price || Number(form.price) <= 0) return "Valid price is required.";
    if (!form.category.trim()) return "Category is required.";
    if (!form.subCategory.trim()) return "Sub category is required.";
    if (!form.stock || Number(form.stock) < 0) return "Valid stock is required.";
    if (!images.length) return "At least one image is required.";
    return "";
  };

  const uploadImages = async (token) => {
    const formData = new FormData();

    images.forEach((image) => {
      formData.append("images", image);
    });

    const response = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Image upload failed.");
    }

    return data.images;
  };

  const createProduct = async (token, uploadedImages) => {
    const response = await fetch(`${API_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        images: uploadedImages,
        category: form.category.trim(),
        subCategory: form.subCategory.trim(),
        sizes: form.sizes
          ? form.sizes.split(",").map((size) => size.trim()).filter(Boolean)
          : ["default"],
        stock: Number(form.stock),
        bestseller: form.bestseller,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Product creation failed.");
    }

    return data.product;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in as admin.");
        return;
      }

      const uploadedImages = await uploadImages(token);
      const product = await createProduct(token, uploadedImages);

      setSuccess("Product created successfully.");

      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        subCategory: "",
        sizes: "",
        stock: "",
        bestseller: false,
      });

      setImages([]);

      setTimeout(() => {
        navigate(`/product/${product._id}`);
      }, 1000);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-gray-800">
      <Title
        as="h1"
        eyebrow="ADMIN"
        text1="Add"
        text2="Product"
        align="left"
        subtitle="Upload images and create a new product in MongoDB."
        className="mb-6"
      />

      <form
        onSubmit={onSubmit}
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5"
      >
        {error && (
          <p className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </p>
        )}

        {success && (
          <p className="bg-green-100 text-green-700 px-4 py-2 rounded text-sm">
            {success}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Birthday Greeting Card"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Describe the product..."
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={onChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="19.99"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={onChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="50"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              name="category"
              value={form.category}
              onChange={onChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Cards"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Sub Category</label>
            <input
              name="subCategory"
              value={form.subCategory}
              onChange={onChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Birthday"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Sizes
          </label>
          <input
            name="sizes"
            value={form.sizes}
            onChange={onChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="S, M, L or leave empty for default"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Product Images
          </label>
          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={(e) => setImages(Array.from(e.target.files || []))}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />

          {images.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">
              {images.length} image{images.length === 1 ? "" : "s"} selected
            </p>
          )}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            name="bestseller"
            type="checkbox"
            checked={form.bestseller}
            onChange={onChange}
          />
          Mark as bestseller
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded text-white ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-800"
          }`}
        >
          {loading ? "Creating Product..." : "Create Product"}
        </button>
      </form>
    </main>
  );
};

export default AdminAddProduct;