// src/Pages/Login.jsx
import React, { useState, useContext, useRef, useEffect, memo } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ShopContext } from "../context/ShopContext";
import Title from "../Components/Title";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const { setUser } = useContext(ShopContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const emailInputRef = useRef(null);
  const errorRef = useRef(null);

  const reduce = useReducedMotion();

  const rawRedirect = searchParams.get("redirect") || "/";
  const redirectTo =
    rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
      ? rawRedirect
      : "/";

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (error) {
      errorRef.current?.focus();
    }
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Email is required.");
      return;
    }

    if (!EMAIL_RE.test(normalizedEmail)) {
      setError("Please enter a valid email.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Login failed.");
        return;
      }

      const userObj = {
        ...data.user,
        token: data.token,
      };

      localStorage.setItem("user", JSON.stringify(userObj));
      localStorage.setItem("token", data.token);

      setUser(userObj);

      navigate(redirectTo, { replace: true });
    } catch (error) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const card = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 16, scale: 0.99 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: { duration: 0.45, ease: "easeOut" },
        },
      };

  const row = reduce
    ? {}
    : {
        hidden: { opacity: 0, y: 8 },
        show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
      };

  return (
    <motion.main
      className="max-w-md mx-auto px-6 py-16 text-gray-800"
      initial="hidden"
      animate="show"
      variants={card}
      aria-labelledby="login-heading"
    >
      <Title
        as="h1"
        id="login-heading"
        eyebrow="ACCOUNT"
        text1="Welcome"
        text2="Back"
        align="center"
        subtitle="Sign in with your email and password to continue."
        className="mb-6"
      />

      <motion.form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 auth-card"
        variants={row}
      >
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email Address
          </label>

          <input
            id="email"
            type="email"
            ref={emailInputRef}
            placeholder="you@example.com"
            className={`w-full border px-3 py-2 rounded auth-input focus:outline-none focus:ring-2 focus:ring-black/15 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            autoComplete="email"
            disabled={loading}
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className={`w-full border px-3 py-2 rounded auth-input focus:outline-none focus:ring-2 focus:ring-black/15 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            autoComplete="current-password"
            disabled={loading}
            required
          />
        </div>

        <motion.p
          id="login-error"
          role="alert"
          tabIndex={-1}
          ref={errorRef}
          className={`text-sm mb-4 ${error ? "text-red-600" : "sr-only"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error || "No errors"}
        </motion.p>

        <motion.button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded text-white transition relative overflow-hidden auth-submit focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20 ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-black hover:bg-gray-800"
          }`}
          whileTap={reduce ? {} : { scale: 0.98 }}
        >
          {loading ? "Logging in…" : "Login"}
          <span aria-hidden="true" className="auth-shine" />
        </motion.button>
      </motion.form>

      <motion.div className="text-xs text-gray-500 mt-6 text-center" variants={row}>
        By logging in, you agree to our{" "}
        <Link className="underline" to="/terms">
          Terms
        </Link>{" "}
        and{" "}
        <Link className="underline" to="/privacy">
          Privacy Policy
        </Link>
        .
      </motion.div>

          <motion.div className="mt-4 text-center" variants={row}>
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Create Account
          </Link>
        </p>

        <div className="mt-3">
          <Link
            to="/"
            className="text-sm text-blue-600 underline hover:text-blue-800"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </motion.main>
  );
};

export default memo(Login);

