import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface CartItemOption {
  type: string; // e.g., "color", "size"
  value: string;
}

export interface CartItem {
  id: string;
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  seller?: string;
  options?: CartItemOption[];
}

interface CartContextType {
  items: CartItem[];
  savedItems: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateItemOptions: (id: string, options: CartItemOption[]) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  promoCode: string;
  setPromoCode: (code: string) => void;
  promoDiscount: number;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  saveForLater: (id: string) => void;
  moveToCart: (id: string) => void;
  removeFromSaved: (id: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const PROMO_CODES: Record<string, number> = {
  TEST20: 20,
};

const CART_STORAGE_KEY = "shopping-cart";
const PROMO_STORAGE_KEY = "promo-code";
const SAVED_STORAGE_KEY = "saved-for-later";

const loadCartFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const loadSavedFromStorage = (): CartItem[] => {
  try {
    const stored = localStorage.getItem(SAVED_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const loadPromoFromStorage = (): { code: string; discount: number } => {
  try {
    const stored = localStorage.getItem(PROMO_STORAGE_KEY);
    return stored ? JSON.parse(stored) : { code: "", discount: 0 };
  } catch {
    return { code: "", discount: 0 };
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(loadCartFromStorage);
  const [savedItems, setSavedItems] = useState<CartItem[]>(loadSavedFromStorage);
  const [promoCode, setPromoCode] = useState(() => loadPromoFromStorage().code);
  const [promoDiscount, setPromoDiscount] = useState(() => loadPromoFromStorage().discount);

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Persist saved items to localStorage
  useEffect(() => {
    localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedItems));
  }, [savedItems]);

  // Persist promo code to localStorage
  useEffect(() => {
    localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify({ code: promoCode, discount: promoDiscount }));
  }, [promoCode, promoDiscount]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const updateItemOptions = (id: string, options: CartItemOption[]) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, options } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setPromoCode("");
    setPromoDiscount(0);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(PROMO_STORAGE_KEY);
  };

  const removePromoCode = () => {
    setPromoCode("");
    setPromoDiscount(0);
  };

  const getCartTotal = () => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return subtotal - (subtotal * promoDiscount) / 100;
  };

  const getCartCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const applyPromoCode = (code: string) => {
    const discount = PROMO_CODES[code.toUpperCase()];
    if (discount) {
      setPromoCode(code.toUpperCase());
      setPromoDiscount(discount);
      return true;
    }
    return false;
  };

  const saveForLater = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (item) {
      setSavedItems((prev) => [...prev, item]);
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const moveToCart = (id: string) => {
    const item = savedItems.find((i) => i.id === id);
    if (item) {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === id);
        if (existing) {
          return prev.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + item.quantity } : i
          );
        }
        return [...prev, item];
      });
      setSavedItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const removeFromSaved = (id: string) => {
    setSavedItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <CartContext.Provider
      value={{
        items,
        savedItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemOptions,
        clearCart,
        getCartTotal,
        getCartCount,
        promoCode,
        setPromoCode,
        promoDiscount,
        applyPromoCode,
        removePromoCode,
        saveForLater,
        moveToCart,
        removeFromSaved,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
