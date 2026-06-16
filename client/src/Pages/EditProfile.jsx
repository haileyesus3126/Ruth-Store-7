import React, { useContext, useEffect, useMemo, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import Title from "../Components/Title";

const API_URL = import.meta.env.VITE_API_URL;

const emailOk = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());

const EditProfile = () => {
  const { user, setUser } = useContext(ShopContext);

  const navigate = useNavigate();
  const reduce = useReducedMotion();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);
  const [fail, setFail] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/edit-profile");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]);

  const validate = useMemo(
    () => (formData) => {
      const next = {};

      if (
        !String(formData.name || "").trim() ||
        String(formData.name).trim().length < 2
      ) {
        next.name = "Please enter your full name.";
      }

      if (!String(formData.email || "").trim()) {
        next.email = "Email is required.";
      } else if (!emailOk(formData.email)) {
        next.email = "Enter a valid email.";
      }

      return next;
    },
    []
  );

  const onChange = (e) => {
    const { id, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));

    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: undefined,
      }));
    }

    setFail("");
    setOk(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validate(form);
    setErrors(nextErrors);
    setFail("");
    setOk(false);

    if (Object.keys(nextErrors).length) return;

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setFail("You must be logged in.");
        return;
      }

      const response = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setFail(data.message || "Failed to update profile.");
        return;
      }

      const updatedUser = {
        ...data.user,
        token,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setOk(true);

      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch {
      setFail("Something went wrong while saving.");
    } finally {
      setSaving(false);
    }
  };

  const card = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 14 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: "easeOut" },
        },
      };

  const row = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 8 },
        show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
      };

  if (!user) return null;

  return (
    <motion.main
      className="max-w-2xl mx-auto px-6 py-12 text-gray-800"
      initial="hidden"
      animate="show"
      variants={card}
      aria-labelledby="edit-profile-heading"
    >
      <Title
        as="h1"
        id="edit-profile-heading"
        eyebrow="ACCOUNT"
        text1="Edit"
        text2="Profile"
        align="left"
        subtitle="Update your personal information below."
        className="mb-6"
      />

      {ok && (
        <motion.div
          className="bg-green-100 text-green-800 px-4 py-2 rounded text-sm mb-4"
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          ✅ Profile updated successfully! Redirecting…
        </motion.div>
      )}

      {fail && (
        <motion.div
          className="bg-red-100 text-red-800 px-4 py-2 rounded text-sm mb-4"
          role="alert"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {fail}
        </motion.div>
      )}

      <motion.form
        onSubmit={onSubmit}
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-5"
        aria-busy={saving || undefined}
      >
        <motion.div variants={row}>
          <label htmlFor="name" className="block text-sm font-medium">
            Name <span className="text-red-600">*</span>
          </label>

          <input
            id="name"
            type="text"
            className={`mt-1 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20 ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            value={form.name}
            onChange={onChange}
            placeholder="Your full name"
            autoComplete="name"
          />

          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name}</p>
          )}
        </motion.div>

        <motion.div variants={row}>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>

          <input
            id="email"
            type="email"
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            value={form.email}
            disabled
          />

          <p className="mt-1 text-xs text-gray-500">
            Email cannot be changed from this page.
          </p>
        </motion.div>

        <motion.div variants={row}>
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone
          </label>

          <input
            id="phone"
            type="text"
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
            value={form.phone}
            onChange={onChange}
            placeholder="Phone number"
            autoComplete="tel"
          />
        </motion.div>

        <motion.div variants={row}>
          <label htmlFor="address" className="block text-sm font-medium">
            Address
          </label>

          <textarea
            id="address"
            rows={4}
            className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
            value={form.address}
            onChange={onChange}
            placeholder="Street, City, State, ZIP"
            autoComplete="street-address"
          />
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <motion.button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition relative overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
            whileTap={reduce ? {} : { scale: 0.98 }}
          >
            {saving ? "Saving…" : "Save Changes"}
          </motion.button>

          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="w-full sm:w-auto border border-gray-300 px-6 py-3 rounded hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </motion.form>
    </motion.main>
  );
};

export default memo(EditProfile);