// src/App.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import Home from "./Pages/Home";
import Collection from "./Pages/Collection";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Cart from "./Pages/Cart";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import PlaceOrder from "./Pages/PlaceOrder";
import Orders from "./Pages/Orders";
import Product from "./Pages/Product";

import BrandsPage from "./Pages/BrandsPage";
import HolidaysPage from "./Pages/HolidaysPage";
import InterestsPage from "./Pages/InterestsPage";
import OccasionsPage from "./Pages/OccasionsPage";
import VisitStore from "./Pages/VisitStore";

import Profile from "./Pages/Profile";
import EditProfile from "./Pages/EditProfile";
import SearchResults from "./Pages/SearchResults";
import Wishlist from "./Pages/Wishlist";

import RefundPolicy from "./Pages/RefundPolicy";
import CustomerService from "./Pages/CustomerService";
import ShippingPolicy from "./Pages/ShippingPolicy";

import ProtectedRoute from "./Components/ProtectedRoute";
import AdminRoute from "./Components/AdminRoute";

import AdminAddProduct from "./Pages/AdminAddProduct";
import AdminProducts from "./Pages/AdminProducts";
import AdminEditProduct from "./Pages/AdminEditProduct";
import AdminOrders from "./Pages/AdminOrders";

export default function App() {
  return (
    <>
      <Navbar />

      {/* Main Content Area */}
      <main id="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:id" element={<Product />} />

          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/holidays" element={<HolidaysPage />} />
          <Route path="/interests" element={<InterestsPage />} />
          <Route path="/occasions" element={<OccasionsPage />} />
          <Route path="/visit-store" element={<VisitStore />} />

          <Route path="/search" element={<SearchResults />} />

          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/customer-service" element={<CustomerService />} />
          <Route path="/delivery" element={<ShippingPolicy />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected User Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit-profile"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/place-order"
            element={
              <ProtectedRoute>
                <PlaceOrder />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products/new"
            element={
              <AdminRoute>
                <AdminAddProduct />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products/edit/:id"
            element={
              <AdminRoute>
                <AdminEditProduct />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}