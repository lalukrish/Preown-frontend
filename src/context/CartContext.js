"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useAuth } from "@/context/AuthContext";

const CartContext = createContext();
const GUEST_CART_KEY = "guest_cart";
const API_BASE = "https://backapp.preown.store/api/site-user-carts";

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const isLoggedIn = !!token;

  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  // ---------- guest cart (localStorage) helpers ----------
  const getGuestCart = () => {
    try {
      return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
    } catch {
      return [];
    }
  };

  const saveGuestCart = (list) => {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(list));
    setItems(list);
  };

  // ---------- shape adapter ----------
  // ⚠️ TEMP: run once, check console for the real shape of myCart's response,
  // then fix the field names below (productId vs product._id, price vs product.price, etc.)
  const normalizeCartItem = (raw) => {
    const product = raw.new_product || {};
    return {
      id: product.id,
      documentCartId: raw.documentId,
      documentId: product.documentId,
      cartItemId: raw.id, // needed for remove/update calls
      name: product.ProductName,
      price: Number(
        product.TotalPriceWithGST ?? product.ProductPriceWIthoutGST ?? 0,
      ),
      mrp: Number(product.MRP ?? 0),
      image: product.image?.url || product.images?.[0]?.url || null, // confirm field name from backend, not in sample payload
      qty: raw.quantity ?? 1,
      brand: product.Brand,
      category: product.ProductCategory,
      condition: product.ProductCondition,
      soldOut: product.SoldOutStatus,
    };
  };

  const normalizeCartResponse = (data) => {
    console.log("RAW cart response:", data); // remove once confirmed stable
    const rawItems = Array.isArray(data)
      ? data
      : data.cart?.items || data.items || data.data?.items || [];
    return rawItems.map(normalizeCartItem);
  };
  // const normalizeCartResponse = (data) => {
  //   console.log("RAW cart response:", data); // remove once shape confirmed
  //   const rawItems = data.cart?.items || data.items || data.data?.items || [];
  //   return rawItems.map(normalizeCartItem);
  // };

  // ---------- server cart ----------
  const fetchServerCart = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/myCart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setItems(normalizeCartResponse(data));
    } catch (err) {
      console.error("fetchServerCart error:", err);
    }
  }, [token]);

  const mergeGuestCartIntoServer = useCallback(async () => {
    const guestItems = getGuestCart();
    if (guestItems.length === 0) {
      await fetchServerCart();
      return;
    }
    try {
      // No dedicated /merge endpoint confirmed yet — loop /add calls.
      // Swap this for a bulk endpoint later if backend adds one.
      await Promise.all(
        guestItems.map((item) =>
          fetch(`${API_BASE}/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              productId: item.id,
              quantity: item.qty || 1,
            }),
          }),
        ),
      );
      localStorage.removeItem(GUEST_CART_KEY);
    } catch (err) {
      console.error("merge cart error:", err);
    } finally {
      await fetchServerCart();
    }
  }, [token, fetchServerCart]);

  // ---------- init on auth change ----------
  useEffect(() => {
    const init = async () => {
      setReady(false);
      if (isLoggedIn) {
        await mergeGuestCartIntoServer();
      } else {
        setItems(getGuestCart());
      }
      setReady(true);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  // ---------- actions ----------
  const addToCart = async (item) => {
    if (isLoggedIn) {
      try {
        const res = await fetch(`${API_BASE}/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: item.id,
            quantity: item.qty || 1,
          }),
        });
        if (!res.ok) throw new Error("Add to cart failed");
        // If /add returns only the added item (not full cart), refetch instead:
        const data = await res.json();
        if (data.cart?.items || data.items) {
          setItems(normalizeCartResponse(data));
        } else {
          await fetchServerCart();
        }
      } catch (err) {
        console.error("addToCart error:", err);
      }
    } else {
      const guestItems = getGuestCart();
      const existing = guestItems.find((i) => i.id === item.id);
      const updated = existing
        ? guestItems.map((i) =>
            i.id === item.id ? { ...i, qty: (i.qty || 1) + 1 } : i,
          )
        : [...guestItems, { ...item, qty: 1 }];
      saveGuestCart(updated);
    }
  };

  const removeFromCart = async (id) => {
    if (isLoggedIn) {
      console.log("id", id);
      try {
        const res = await fetch(
          `https://backapp.preown.store/api/site-user-carts/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          },
        );
        console.log("delete status:", res.status); // ADD THIS

        if (!res.ok) throw new Error("Remove failed");
        await fetchServerCart();
      } catch (err) {
        console.error("removeFromCart error:", err);
      }
    } else {
      saveGuestCart(getGuestCart().filter((i) => i.documentId !== id));
    }
  };

  const updateQty = async (id, qty) => {
    if (qty < 1) return removeFromCart(id);

    if (isLoggedIn) {
      try {
        const res = await fetch(`${API_BASE}/update/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: qty }),
        });
        if (!res.ok) throw new Error("Update qty failed");
        await fetchServerCart();
      } catch (err) {
        console.error("updateQty error:", err);
      }
    } else {
      saveGuestCart(
        getGuestCart().map((i) => (i.id === id ? { ...i, qty } : i)),
      );
    }
  };

  // ---------- derived values ----------
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items],
  );
  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{
        items,
        ready,
        isLoggedIn,
        addToCart,
        removeFromCart,
        updateQty,
        subtotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
