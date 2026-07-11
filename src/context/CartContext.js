"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

const GUEST_KEY = "guest_cart";
const userCartKey = (userId) => `cart_${userId}`;

export function CartProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  // Load correct cart on mount / whenever auth state resolves or changes
  useEffect(() => {
    if (authLoading) return;

    if (user) {
      const key = userCartKey(user.id);
      const guestRaw = localStorage.getItem(GUEST_KEY);
      const userRaw = localStorage.getItem(key);

      let userCart = userRaw ? JSON.parse(userRaw) : [];
      const guestCart = guestRaw ? JSON.parse(guestRaw) : [];

      // Merge whatever was added before login into the user's saved cart
      if (guestCart.length) {
        guestCart.forEach((gItem) => {
          const existing = userCart.find((i) => i.id === gItem.id);
          if (existing) {
            existing.qty += gItem.qty;
          } else {
            userCart.push(gItem);
          }
        });
        localStorage.setItem(key, JSON.stringify(userCart));
        localStorage.removeItem(GUEST_KEY);
      }

      setItems(userCart);
    } else {
      const guestRaw = localStorage.getItem(GUEST_KEY);
      setItems(guestRaw ? JSON.parse(guestRaw) : []);
    }
    setReady(true);
  }, [user, authLoading]);

  const activeKey = useCallback(
    () => (user ? userCartKey(user.id) : GUEST_KEY),
    [user],
  );

  const addToCart = useCallback(
    (product, qty = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === product.id);
        const next = existing
          ? prev.map((i) =>
              i.id === product.id ? { ...i, qty: i.qty + qty } : i,
            )
          : [...prev, { ...product, qty }];
        localStorage.setItem(activeKey(), JSON.stringify(next));
        return next;
      });
    },
    [activeKey],
  );

  const updateQty = useCallback(
    (id, qty) => {
      setItems((prev) => {
        const next = prev
          .map((i) => (i.id === id ? { ...i, qty } : i))
          .filter((i) => i.qty > 0);
        localStorage.setItem(activeKey(), JSON.stringify(next));
        return next;
      });
    },
    [activeKey],
  );

  const removeFromCart = useCallback(
    (id) => {
      setItems((prev) => {
        const next = prev.filter((i) => i.id !== id);
        localStorage.setItem(activeKey(), JSON.stringify(next));
        return next;
      });
    },
    [activeKey],
  );

  const clearCart = useCallback(() => {
    localStorage.removeItem(activeKey());
    setItems([]);
  }, [activeKey]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        ready,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        subtotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
