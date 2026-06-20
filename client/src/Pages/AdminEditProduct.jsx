import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Title from "../Components/Title";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const getImageUrl = (image) => {
  if (!image) return "/fallback.png";
  if (image.startsWith("http")) return image;
  if (image.startsWith("/uploads")) return `${API_URL}${image}`;
  return image;
};

const AdminEditProduct = () => {
  const { id } = useParams();
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

  const [currentImages, setCurrentImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        const data = await res.json();

        if (data.success) {
          const product = data.product;

          setForm({
            name: product.name || "",
            description: product.description || "",
            price: product.price || "",
            category: product.category || "",
            subCategory: product.subCategory || "",
            sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : "",
            stock: product.stock || "",
            bestseller: !!product.bestseller,
          });

          setCurrentImages(product.images || []);
        } else {
          setError(data.message || "Product not found.");
        }
      } catch {
        setError("Failed to load product.");
      }
    };

    fetchProduct();
  }, [id]);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
  };

  const uploadImages = async (token) => {
    if (!newImages.length) {
      return currentImages;
    }

    setUploadingImages(true);

    const formData = new FormData();

    newImages.forEach((image) => {
      formData.append("images", image);
    });

    const res = await fetch(`${API_URL}/api/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    setUploadingImages(false);

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Image upload failed.");
    }

    return data.images;
  };

  const removeCurrentImage = (imageToRemove) => {
    setCurrentImages((prev) => prev.filter((img) => img !== imageToRemove));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in as admin.");
        return;
      }

      const uploadedImages = await uploadImages(token);

      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "PUT",
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
            ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean)
            : ["default"],
          stock: Number(form.stock),
          bestseller: form.bestseller,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Update failed.");
        return;
      }

      navigate("/admin/products");
    } catch (err) {
      setError(err.message || "Server error while updating product.");
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <Title
        as="h1"
        eyebrow="ADMIN"
        text1="Edit"
        text2="Product"
        align="left"
      />

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={onSubmit} className="bg-white border rounded-xl p-6 space-y-4">
        <input name="name" value={form.name} onChange={onChange} className="w-full border p-2 rounded" placeholder="Name" />

        <textarea name="description" value={form.description} onChange={onChange} className="w-full border p-2 rounded" placeholder="Description" />

        <input name="price" type="number" value={form.price} onChange={onChange} className="w-full border p-2 rounded" placeholder="Price" />

        <input name="category" value={form.category} onChange={onChange} className="w-full border p-2 rounded" placeholder="Category" />

        <input name="subCategory" value={form.subCategory} onChange={onChange} className="w-full border p-2 rounded" placeholder="Sub Category" />

        <input name="sizes" value={form.sizes} onChange={onChange} className="w-full border p-2 rounded" placeholder="S, M, L or default" />

        <input name="stock" type="number" value={form.stock} onChange={onChange} className="w-full border p-2 rounded" placeholder="Stock" />

        <label className="flex gap-2">
          <input name="bestseller" type="checkbox" checked={form.bestseller} onChange={onChange} />
          Bestseller
        </label>

        <div>
          <label className="block text-sm font-medium mb-2">
            Current Images
          </label>

          {currentImages.length === 0 ? (
            <p className="text-sm text-gray-500">No images yet.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {currentImages.map((img) => (
                <div key={img} className="relative border rounded p-2">
                  <img
                    src={getImageUrl(img)}
                    alt="Product"
                    className="w-24 h-24 object-contain bg-gray-100"
                  />

                  <button
                    type="button"
                    onClick={() => removeCurrentImage(img)}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Upload New Images
          </label>

          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={(e) => setNewImages(Array.from(e.target.files || []))}
            className="w-full border p-2 rounded"
          />

          {newImages.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              {newImages.length} new image{newImages.length === 1 ? "" : "s"} selected
            </p>
          )}
        </div>

        <button
          disabled={loading}
          className="bg-black text-white px-6 py-3 rounded disabled:bg-gray-500"
        >
          {loading
            ? uploadingImages
              ? "Uploading Images..."
              : "Saving..."
            : "Save Product"}
        </button>
      </form>
    </main>
  );
};

export default AdminEditProduct;