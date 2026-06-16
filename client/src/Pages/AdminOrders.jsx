import React, { useEffect, useState } from "react";
import Title from "../Components/Title";

const API_URL = import.meta.env.VITE_API_URL;

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.success) {
      setOrders(data.orders);
    }
  };

  const updateStatus = async (id, orderStatus) => {
    const token = localStorage.getItem("token");

    await fetch(`${API_URL}/api/orders/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderStatus }),
    });

    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      <Title
        as="h1"
        eyebrow="ADMIN"
        text1="Manage"
        text2="Orders"
        align="left"
      />

      <div className="space-y-5">
        {orders.map((order) => (
          <div key={order._id} className="border rounded-lg p-5 bg-white">
            <div className="flex justify-between flex-wrap gap-3">
              <div>
                <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                <p className="text-sm text-gray-600">
                  Customer: {order.user?.name} ({order.user?.email})
                </p>
                <p className="text-sm text-gray-600">
                  Total: ${order.totalPrice}
                </p>
              </div>

              <select
                value={order.orderStatus}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                className="border p-2 rounded"
              >
                <option value="placed">Placed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="mt-4 text-sm">
              {order.items.map((item, index) => (
                <p key={index}>
                  {item.name} × {item.quantity} — ${item.price}
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default AdminOrders;