import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const AdminRoute = ({ children }) => {
  const { user } = useContext(ShopContext);

  if (!user) {
    return <Navigate to="/login?redirect=/admin/products/new" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;