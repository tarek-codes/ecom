"use client";

import React, { createContext, useContext, useState, useMemo, useSyncExternalStore } from "react";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => { success: boolean; message?: string };
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => { success: boolean; message?: string };
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "rpc_cart_v1";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("cart_store_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("cart_store_change", callback);
  };
}

function getSnapshot(): string {
  try {
    return localStorage.getItem(CART_STORAGE_KEY) || "[]";
  } catch {
    return "[]";
  }
}

function getServerSnapshot(): string {
  return "[]";
}

function notifyCartChange(newItems: CartItem[]) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
    window.dispatchEvent(new Event("cart_store_change"));
  } catch (e) {
    console.error("Failed to persist cart:", e);
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const rawCart = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const items: CartItem[] = useMemo(() => {
    try {
      return JSON.parse(rawCart);
    } catch {
      return [];
    }
  }, [rawCart]);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const addItem = (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
    const existing = items.find((i) => i.id === item.id);
    const currentQty = existing ? existing.quantity : 0;
    const newQty = currentQty + quantity;

    if (newQty > item.stock) {
      return {
        success: false,
        message: `Only ${item.stock} units are currently available.`,
      };
    }

    let updatedItems: CartItem[];
    if (existing) {
      updatedItems = items.map((i) =>
        i.id === item.id ? { ...i, quantity: newQty, stock: item.stock } : i
      );
    } else {
      updatedItems = [...items, { ...item, quantity }];
    }

    notifyCartChange(updatedItems);
    setIsDrawerOpen(true);
    return { success: true };
  };

  const removeItem = (id: string) => {
    const updatedItems = items.filter((i) => i.id !== id);
    notifyCartChange(updatedItems);
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return { success: true };
    }

    const existing = items.find((i) => i.id === id);
    if (!existing) return { success: false, message: "Item not found" };

    if (quantity > existing.stock) {
      return {
        success: false,
        message: `Only ${existing.stock} units are currently available.`,
      };
    }

    const updatedItems = items.map((i) =>
      i.id === id ? { ...i, quantity } : i
    );
    notifyCartChange(updatedItems);
    return { success: true };
  };

  const clearCart = () => {
    notifyCartChange([]);
  };

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        isDrawerOpen,
        setIsDrawerOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
