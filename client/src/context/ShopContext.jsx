import {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";

export const ShopContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;
const CURRENCY = "$";
const DELIVERY_FEE = 20;

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

const keyFor = (productId, size = "default") =>
  `${String(productId)}_${String(size)}`;

const getToken = () => localStorage.getItem("token");

const RV_KEY = "recentlyViewed";
const RV_MAX = 10;

const normalizeRecently = (arr) => {
  const seen = new Set();
  const out = [];

  for (let i = arr.length - 1; i >= 0 && out.length < RV_MAX; i--) {
    const value = String(arr[i] ?? "");
    if (value && !seen.has(value)) {
      seen.add(value);
      out.push(value);
    }
  }

  return out;
};

const cartArrayToObject = (cartArray = []) => {
  const next = {};

  cartArray.forEach((item) => {
    const product = item.product;
    const productId = String(product?._id || product || "");
    const size = item.size || "default";
    const quantity = Number(item.quantity) || 0;

    if (productId && quantity > 0) {
      next[keyFor(productId, size)] = quantity;
    }
  });

  return next;
};

const wishlistArrayToIds = (wishlistArray = []) => {
  return wishlistArray
    .map((item) => String(item.product?._id || item.product || ""))
    .filter(Boolean);
};

const ShopContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [wishlist, setWishlist] = useState(() => {
    const ids = readJSON("wishlist", []);
    return Array.isArray(ids) ? ids.map(String) : [];
  });

  const [cartItems, setCartItems] = useState(() => {
    const obj = readJSON("cart", {});
    return obj && typeof obj === "object" ? obj : {};
  });

  const [user, setUser] = useState(() => readJSON("user", null));

  const prevCartCountRef = useRef(0);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setCartItems({});
    setWishlist([]);

    writeJSON("cart", {});
    writeJSON("wishlist", []);

    dispatchEvent(new CustomEvent("user:logout"));
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/products`);
      const data = await response.json();

      if (data.success) {
        const normalizedProducts = data.products.map((product) => ({
          ...product,
          image: product.images || product.image || [],
        }));

        setProducts(normalizedProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCart = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const cartObject = cartArrayToObject(data.cart);
        setCartItems(cartObject);
        writeJSON("cart", cartObject);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  }, []);

  const fetchWishlist = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/api/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const ids = wishlistArrayToIds(data.wishlist);
        setWishlist(ids);
        writeJSON("wishlist", ids);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const response = await fetch(`${API_URL}/api/users/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const userObj = {
          ...data.user,
          token,
        };

        setUser(userObj);
        writeJSON("user", userObj);

        await fetchCart();
        await fetchWishlist();
      } else {
        logout();
      }
    } catch {
      logout();
    }
  }, [logout, fetchCart, fetchWishlist]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    writeJSON("wishlist", wishlist);
  }, [wishlist]);

  useEffect(() => {
    writeJSON("cart", cartItems);
  }, [cartItems]);

  const addToWishlist = useCallback(async (productId) => {
    const token = getToken();
    const id = String(productId);

    if (!token) {
      setWishlist((prev) => (prev.includes(id) ? prev : [...prev, id]));
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/wishlist/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const ids = wishlistArrayToIds(data.wishlist);
        setWishlist(ids);
        writeJSON("wishlist", ids);
      }
    } catch (error) {
      console.error("Failed to add wishlist:", error);
    }
  }, []);

  const removeFromWishlist = useCallback(async (productId) => {
    const token = getToken();
    const id = String(productId);

    if (!token) {
      setWishlist((prev) => prev.filter((item) => item !== id));
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/wishlist/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const ids = wishlistArrayToIds(data.wishlist);
        setWishlist(ids);
        writeJSON("wishlist", ids);
      }
    } catch (error) {
      console.error("Failed to remove wishlist:", error);
    }
  }, []);

  const toggleWishlist = useCallback(
    async (productId) => {
      const id = String(productId);

      if (wishlist.includes(id)) {
        await removeFromWishlist(id);
      } else {
        await addToWishlist(id);
      }
    },
    [wishlist, addToWishlist, removeFromWishlist]
  );

  const addToCart = useCallback(async (productId, size = "default", qty = 1) => {
    const token = getToken();
    const quantity = Math.max(1, Number(qty) || 1);

    if (!token) {
      const key = keyFor(productId, size);

      setCartItems((prev) => ({
        ...prev,
        [key]: (Number(prev[key]) || 0) + quantity,
      }));

      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          size,
          quantity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const cartObject = cartArrayToObject(data.cart);
        setCartItems(cartObject);
        writeJSON("cart", cartObject);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  }, []);

  const removeFromCart = useCallback(async (productId, size = "default") => {
    const token = getToken();

    if (!token) {
      const key = keyFor(productId, size);

      setCartItems((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });

      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/cart/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          size,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const cartObject = cartArrayToObject(data.cart);
        setCartItems(cartObject);
        writeJSON("cart", cartObject);
      }
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  }, []);

  const setItemQuantity = useCallback(
    async (productId, size = "default", qty = 0) => {
      const token = getToken();
      const quantity = Math.floor(Number(qty) || 0);

      if (!token) {
        const key = keyFor(productId, size);

        setCartItems((prev) => {
          const next = { ...prev };

          if (quantity <= 0) {
            delete next[key];
          } else {
            next[key] = quantity;
          }

          return next;
        });

        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/cart/update`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId,
            size,
            quantity,
          }),
        });

        const data = await response.json();

        if (data.success) {
          const cartObject = cartArrayToObject(data.cart);
          setCartItems(cartObject);
          writeJSON("cart", cartObject);
        }
      } catch (error) {
        console.error("Failed to update cart:", error);
      }
    },
    []
  );

  const removeLine = useCallback(
    async (productId, size = "default") => {
      await removeFromCart(productId, size);
    },
    [removeFromCart]
  );

  const clearCart = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setCartItems({});
      writeJSON("cart", {});
      return;
    }

    try {
      await fetch(`${API_URL}/api/cart/clear`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }

    setCartItems({});
    writeJSON("cart", {});
  }, []);

  const updateUser = useCallback((updatedInfo) => {
    setUser((prev) => {
      const merged = { ...(prev || {}), ...(updatedInfo || {}) };
      writeJSON("user", merged);
      return merged;
    });
  }, []);

  const trackRecentlyViewed = useCallback((productId) => {
    const id = String(productId || "");
    if (!id) return;

    const current = readJSON(RV_KEY, []);
    const next = normalizeRecently([...current, id]);

    writeJSON(RV_KEY, next);
  }, []);

  const cartCount = useMemo(
    () =>
      Object.values(cartItems).reduce(
        (total, quantity) => total + (Number(quantity) || 0),
        0
      ),
    [cartItems]
  );

  const priceOf = useCallback(
    (productId) => {
      const id = String(productId);

      const product = products.find(
        (item) => String(item._id ?? item.id) === id
      );

      return Number(product?.price || 0);
    },
    [products]
  );

  const cartSubtotal = useMemo(() => {
    let total = 0;

    for (const [key, quantity] of Object.entries(cartItems)) {
      const [productId] = key.split("_");
      total += priceOf(productId) * (Number(quantity) || 0);
    }

    return total;
  }, [cartItems, priceOf]);

  const cartTotal = useMemo(
    () => cartSubtotal + (cartCount > 0 ? DELIVERY_FEE : 0),
    [cartSubtotal, cartCount]
  );

  useEffect(() => {
    const prev = prevCartCountRef.current;

    if (cartCount > prev) {
      document.body.classList.add("cart-bump");

      const timer = setTimeout(() => {
        document.body.classList.remove("cart-bump");
      }, 450);

      prevCartCountRef.current = cartCount;
      return () => clearTimeout(timer);
    }

    prevCartCountRef.current = cartCount;
  }, [cartCount]);

  const value = useMemo(
    () => ({
      products,
      loading,
      fetchProducts,

      currency: CURRENCY,
      delivery_fee: DELIVERY_FEE,

      wishlist,
      fetchWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,

      cartItems,
      fetchCart,
      addToCart,
      removeFromCart,
      setItemQuantity,
      removeLine,
      clearCart,
      cartCount,
      cartSubtotal,
      cartTotal,

      user,
      setUser,
      logout,
      updateUser,
      fetchUserProfile,

      trackRecentlyViewed,
    }),
    [
      products,
      loading,
      fetchProducts,
      wishlist,
      fetchWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      cartItems,
      fetchCart,
      addToCart,
      removeFromCart,
      setItemQuantity,
      removeLine,
      clearCart,
      cartCount,
      cartSubtotal,
      cartTotal,
      user,
      logout,
      updateUser,
      fetchUserProfile,
      trackRecentlyViewed,
    ]
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;