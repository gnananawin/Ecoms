import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);


  const [cartItems, setCartItems] = useState(() => {
    const localCart = localStorage.getItem("cartItems");
    return localCart ? JSON.parse(localCart) : {};
  });

  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    if (!user) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

 
  useEffect(() => {
    const updateCart = async () => {
      try {
        if (user) {
          const { data } = await axios.post("/api/cart/update", {
            cartItems,
            userId: user._id,
          });
          if (!data.success) {
            toast.error("Failed to sync cart with server");
          }
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Cart update failed");
      }
    };
    updateCart();
  }, [cartItems, user]);

 
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) {
        setUser(data.user);
        if (data.user.cartItems && Object.keys(data.user.cartItems).length > 0) {
          setCartItems(data.user.cartItems);
        }
      }
    } catch (error) {
      setUser(null);
    }
  };

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth");
      setIsSeller(data.success);
    } catch {
      setIsSeller(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) setProducts(data.products);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };
  const addToCart = (itemId) => {
    const updated = { ...cartItems, [itemId]: (cartItems[itemId] || 0) + 1 };
    setCartItems(updated);
    toast.success("Added to Cart");
  };

  const updateCartItem = (itemId, quantity) => {
    const updated = { ...cartItems, [itemId]: quantity };
    setCartItems(updated);
    toast.success("Cart Updated");
  };

  const removeFromCart = (itemId) => {
    const updated = { ...cartItems };
    if (updated[itemId]) {
      updated[itemId] -= 1;
      if (updated[itemId] <= 0) delete updated[itemId];
      setCartItems(updated);
      toast.success("Removed from Cart");
    }
  };

  const getCartCount = () => {
    return Object.values(cartItems).reduce((a, b) => a + b, 0);
  };

  const getCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [id, qty]) => {
      const product = products.find((p) => p._id === id);
      return product ? total + product.offerPrice * qty : total;
    }, 0);
  };

  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);

  const value = {
    axios,
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    getCartAmount,
    getCartCount,
    searchQuery,
    setSearchQuery,
    fetchProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
