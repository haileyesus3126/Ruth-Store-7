import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Title from "../Components/Title";

const API_URL = import.meta.env.VITE_API_URL;

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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/api/products/${id}`);
        const data = await res.json();

        if (data.success) {
          const p = data.product;
          setForm({
            name: p.name || "",
            description: p.description || "",
            price: p.price || "",
            category: p.category || "",
            subCategory: p.subCategory || "",
            sizes: Array.isArray(p.sizes) ? p.sizes.join(", ") : "",
            stock: p.stock || "",
            bestseller: !!p.bestseller,
          });
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
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          category: form.category,
          subCategory: form.subCategory,
          sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
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
    } catch {
      setError("Server error while updating product.");
    } finally {
      setLoading(false);
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
        <input name="sizes" value={form.sizes} onChange={onChange} className="w-full border p-2 rounded" placeholder="S, M, L" />
        <input name="stock" type="number" value={form.stock} onChange={onChange} className="w-full border p-2 rounded" placeholder="Stock" />

        <label className="flex gap-2">
          <input name="bestseller" type="checkbox" checked={form.bestseller} onChange={onChange} />
          Bestseller
        </label>

        <button disabled={loading} className="bg-black text-white px-6 py-3 rounded">
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </main>
  );
};

export default AdminEditProduct;