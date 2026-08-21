// "use client";

// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   useCallback,
//   useMemo,
// } from "react";
// import { useAuth } from "@/context/AuthContext";

// const CartContext = createContext();
// const GUEST_CART_KEY = "guest_cart";
// const API_BASE = "https://backapp.preown.store/api/site-user-carts";

// export const CartProvider = ({ children }) => {
//   const { user, token } = useAuth();
//   const isLoggedIn = !!token;

//   const [items, setItems] = useState([]);
//   const [ready, setReady] = useState(false);

//   // ---------- guest cart (localStorage) helpers ----------
//   const getGuestCart = () => {
//     try {
//       return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || [];
//     } catch {
//       return [];
//     }
//   };

//   const saveGuestCart = (list) => {
//     localStorage.setItem(GUEST_CART_KEY, JSON.stringify(list));
//     setItems(list);
//   };

//   // ---------- shape adapter ----------
//   // ⚠️ TEMP: run once, check console for the real shape of myCart's response,
//   // then fix the field names below (productId vs product._id, price vs product.price, etc.)
//   const normalizeCartItem = (raw) => {
//     const product = raw.new_product || {};
//     return {
//       id: product.id,
//       documentCartId: raw.documentId,
//       documentId: product.documentId,
//       cartItemId: raw.id, // needed for remove/update calls
//       name: product.ProductName,
//       price: Number(
//         product.TotalPriceWithGST ?? product.ProductPriceWIthoutGST ?? 0,
//       ),
//       mrp: Number(product.MRP ?? 0),
//       image: product.image?.url || product.images?.[0]?.url || null, // confirm field name from backend, not in sample payload
//       qty: raw.quantity ?? 1,
//       brand: product.Brand,
//       category: product.ProductCategory,
//       condition: product.ProductCondition,
//       soldOut: product.SoldOutStatus,
//     };
//   };

//   const normalizeCartResponse = (data) => {
//     console.log("RAW cart response:", data); // remove once confirmed stable
//     const rawItems = Array.isArray(data)
//       ? data
//       : data.cart?.items || data.items || data.data?.items || [];
//     return rawItems.map(normalizeCartItem);
//   };
//   // const normalizeCartResponse = (data) => {
//   //   console.log("RAW cart response:", data); // remove once shape confirmed
//   //   const rawItems = data.cart?.items || data.items || data.data?.items || [];
//   //   return rawItems.map(normalizeCartItem);
//   // };

//   // ---------- server cart ----------
//   const fetchServerCart = useCallback(async () => {
//     try {
//       const res = await fetch(`${API_BASE}/myCart`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!res.ok) throw new Error("Failed to fetch cart");
//       const data = await res.json();
//       setItems(normalizeCartResponse(data));
//     } catch (err) {
//       console.error("fetchServerCart error:", err);
//     }
//   }, [token]);

//   const mergeGuestCartIntoServer = useCallback(async () => {
//     const guestItems = getGuestCart();
//     if (guestItems.length === 0) {
//       await fetchServerCart();
//       return;
//     }
//     try {
//       // No dedicated /merge endpoint confirmed yet — loop /add calls.
//       // Swap this for a bulk endpoint later if backend adds one.
//       await Promise.all(
//         guestItems.map((item) =>
//           fetch(`${API_BASE}/add`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({
//               productId: item.id,
//               quantity: item.qty || 1,
//             }),
//           }),
//         ),
//       );
//       localStorage.removeItem(GUEST_CART_KEY);
//     } catch (err) {
//       console.error("merge cart error:", err);
//     } finally {
//       await fetchServerCart();
//     }
//   }, [token, fetchServerCart]);

//   // ---------- init on auth change ----------
//   useEffect(() => {
//     const init = async () => {
//       setReady(false);
//       if (isLoggedIn) {
//         await mergeGuestCartIntoServer();
//       } else {
//         setItems(getGuestCart());
//       }
//       setReady(true);
//     };
//     init();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [isLoggedIn]);

//   // ---------- actions ----------
//   const addToCart = async (item) => {
//     if (isLoggedIn) {
//       try {
//         const res = await fetch(`${API_BASE}/add`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             productId: item.id,
//             quantity: item.qty || 1,
//           }),
//         });
//         if (!res.ok) throw new Error("Add to cart failed");
//         // If /add returns only the added item (not full cart), refetch instead:
//         const data = await res.json();
//         if (data.cart?.items || data.items) {
//           setItems(normalizeCartResponse(data));
//         } else {
//           await fetchServerCart();
//         }
//       } catch (err) {
//         console.error("addToCart error:", err);
//       }
//     } else {
//       const guestItems = getGuestCart();
//       const existing = guestItems.find((i) => i.id === item.id);
//       //   const updated = existing
//       //     ? guestItems.map((i) =>
//       //         i.id === item.id ? { ...i, qty: (i.qty || 1) + 1 } : i,
//       //       )
//       //     : [...guestItems, { ...item, qty: 1 }];
//       //   saveGuestCart(updated);
//       // }
//       if (existing) {
//         console.log("Item already in cart");
//         return; // block dup add
//       }
//       const updated = [...guestItems, { ...item, qty: 1 }];
//       saveGuestCart(updated);
//     }
//   };

//   const removeFromCart = async (id) => {
//     if (isLoggedIn) {
//       console.log("id", id);
//       try {
//         const res = await fetch(
//           `https://backapp.preown.store/api/site-user-carts/${id}`,
//           {
//             method: "DELETE",
//             headers: { Authorization: `Bearer ${token}` },
//             cache: "no-store",
//           },
//         );
//         console.log("delete status:", res.status); // ADD THIS

//         if (!res.ok) throw new Error("Remove failed");
//         await fetchServerCart();
//       } catch (err) {
//         console.error("removeFromCart error:", err);
//       }
//     } else {
//       saveGuestCart(getGuestCart().filter((i) => i.documentId !== id));
//     }
//   };

//   const updateQty = async (id, qty) => {
//     if (qty < 1) return removeFromCart(id);

//     if (isLoggedIn) {
//       try {
//         const res = await fetch(`${API_BASE}/update/${id}`, {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ quantity: qty }),
//         });
//         if (!res.ok) throw new Error("Update qty failed");
//         await fetchServerCart();
//       } catch (err) {
//         console.error("updateQty error:", err);
//       }
//     } else {
//       saveGuestCart(
//         getGuestCart().map((i) => (i.id === id ? { ...i, qty } : i)),
//       );
//     }
//   };

//   // ---------- derived values ----------
//   const subtotal = useMemo(
//     () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
//     [items],
//   );
//   const itemCount = useMemo(
//     () => items.reduce((sum, i) => sum + i.qty, 0),
//     [items],
//   );

//   return (
//     <CartContext.Provider
//       value={{
//         items,
//         ready,
//         isLoggedIn,
//         addToCart,
//         removeFromCart,
//         updateQty,
//         subtotal,
//         itemCount,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export const useCart = () => useContext(CartContext);

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

export const SOUTH_INDIA_STATES = [
  "Tamil Nadu",
  "Karnataka",
  "Andhra Pradesh",
  "Telangana",
  "Puducherry",
];
const MUMBAI_CITY = "Mumbai";

// works out region label, cod %, cod availability for given address + settings
export function getRegionInfo(address, codSettings) {
  if (!codSettings || !address) return null;
  const state = address.State?.trim();
  const city = address.City?.trim();

  if (state === "Kerala") {
    return {
      label: "Kerala",
      percent: codSettings.COD_Kerala_Amount,
      codAvailable: !!codSettings.COD_Kerala,
    };
  }
  if (city === MUMBAI_CITY) {
    // no dedicated Mumbai field in cod-settings — falls back to ROI flag/%
    return {
      label: "Mumbai",
      percent: codSettings.COD_ROI_Amount,
      codAvailable: !!codSettings.COD_ROI,
    };
  }
  if (SOUTH_INDIA_STATES.includes(state)) {
    return {
      label: "South India",
      percent: codSettings.COD_South_India_Amount,
      codAvailable: !!codSettings.COD_Sount_India,
    };
  }
  return {
    label: "Rest of India",
    percent: codSettings.COD_ROI_Amount,
    codAvailable: !!codSettings.COD_ROI,
  };
}

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const isLoggedIn = !!token;

  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);

  // ---------- checkout-shared state (used by cart page + place-order page) ----------
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null); // "online" | "cod"
  const [codSettings, setCodSettings] = useState(null);

  useEffect(() => {
    const fetchCodSettings = async () => {
      try {
        const res = await fetch(
          "https://backapp.preown.store/api/cod-settings",
        );
        const json = await res.json();
        setCodSettings(json.data?.[0] || null);
      } catch (err) {
        console.error("failed to load cod settings:", err);
      }
    };
    fetchCodSettings();
  }, []);

  const fetchAddresses = useCallback(async () => {
    if (!token) {
      setLoadingAddresses(false);
      return;
    }
    try {
      setLoadingAddresses(true);
      const res = await fetch("https://backapp.preown.store/api/addresses/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const valid = Array.isArray(data)
        ? data.filter((a) => a.AddressLine1)
        : [];
      setAddresses(valid);
      setSelectedAddressId((prev) =>
        prev && valid.some((a) => a.id === prev)
          ? prev
          : (valid[0]?.id ?? null),
      );
    } catch (err) {
      console.error("failed to load addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  }, [token]);

  useEffect(() => {
    if (isLoggedIn) fetchAddresses();
    else {
      setAddresses([]);
      setLoadingAddresses(false);
    }
  }, [isLoggedIn, fetchAddresses]);

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

  const normalizeCartItem = (raw) => {
    const product = raw.new_product || {};
    return {
      id: product.id,
      documentCartId: raw.documentId,
      documentId: product.documentId,
      cartItemId: raw.id,
      name: product.ProductName,
      price: Number(
        product.TotalPriceWithGST ?? product.ProductPriceWIthoutGST ?? 0,
      ),
      mrp: Number(product.MRP ?? 0),
      image: product.image?.url || product.images?.[0]?.url || null,
      qty: raw.quantity ?? 1,
      brand: product.Brand,
      category: product.ProductCategory,
      condition: product.ProductCondition,
      soldOut: product.SoldOutStatus,
    };
  };

  const normalizeCartResponse = (data) => {
    const rawItems = Array.isArray(data)
      ? data
      : data.cart?.items || data.items || data.data?.items || [];
    return rawItems.map(normalizeCartItem);
  };

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
      await Promise.all(
        guestItems.map((item) =>
          fetch(`${API_BASE}/add`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId: item.id, quantity: 1 }),
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
    const already = items.some((i) => i.id === item.id);
    if (already) {
      console.log("Item already in cart");
      return;
    }

    if (isLoggedIn) {
      try {
        const res = await fetch(`${API_BASE}/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: item.id, quantity: 1 }),
        });
        if (!res.ok) throw new Error("Add to cart failed");
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
      if (existing) {
        console.log("Item already in cart");
        return;
      }
      const updated = [...guestItems, { ...item, qty: 1 }];
      saveGuestCart(updated);
    }
  };

  const removeFromCart = async (id) => {
    if (isLoggedIn) {
      try {
        const res = await fetch(
          `https://backapp.preown.store/api/site-user-carts/${id}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          },
        );
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

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items],
  );
  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items],
  );

  const selectedAddress = useMemo(
    () => addresses.find((a) => a.id === selectedAddressId) || null,
    [addresses, selectedAddressId],
  );

  const regionInfo = useMemo(
    () => getRegionInfo(selectedAddress, codSettings),
    [selectedAddress, codSettings],
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
        // checkout-shared
        addresses,
        loadingAddresses,
        fetchAddresses,
        selectedAddressId,
        setSelectedAddressId,
        selectedAddress,
        paymentMethod,
        setPaymentMethod,
        codSettings,
        regionInfo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
