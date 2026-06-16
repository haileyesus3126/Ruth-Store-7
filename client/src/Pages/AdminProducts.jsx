import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Title from "../Components/Title";

const API_URL = import.meta.env.VITE_API_URL;

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.products);
      } else {
        setError(data.message || "Failed to load products.");
      }
    } catch {
      setError("Server error while loading products.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Delete failed.");
        return;
      }

      fetchProducts();
    } catch {
      alert("Server error while deleting product.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center py-20">Loading products...</p>;

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-6">
        <Title
          as="h1"
          eyebrow="ADMIN"
          text1="Manage"
          text2="Products"
          align="left"
        />

        <Link
          to="/admin/products/new"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Add Product
        </Link>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="overflow-x-auto bg-white border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const img = product.images?.[0]
                ? `${API_URL}${product.images[0]}`
                : "/fallback.png";

              return (
                <tr key={product._id} className="border-t">
                  <td className="p-3">
                    <img
                      src={img}
                      alt={product.name}
                      className="w-14 h-14 object-contain bg-gray-100 rounded"
                    />
                  </td>

                  <td className="p-3 font-medium">{product.name}</td>
                  <td className="p-3">{product.category}</td>
                  <td className="p-3">${product.price}</td>
                  <td className="p-3">{product.stock}</td>

                  <td className="p-3 flex gap-3">
                    <Link
                      to={`/admin/products/edit/${product._id}`}
                      className="text-blue-600 underline"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="text-red-600 underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default AdminProducts;