"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Sticker, CartItem } from "@/types/sticker";

interface CartContextType {
  items: CartItem[];
  addItem: (sticker: Sticker) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getOriginalTotal: () => number;
  getSavings: () => number;
  getItemCount: () => number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "peellab_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true);
  }, []);

  // Persist to localStorage on changes
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addItem = useCallback((sticker: Sticker) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.sticker.id === sticker.id);
      if (existing) {
        return prev.map((item) =>
          item.sticker.id === sticker.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { sticker, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.sticker.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.sticker.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.sticker.id === id ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotal = useCallback(() => {
    return items.reduce((sum, item) => sum + item.sticker.price * item.quantity, 0);
  }, [items]);

  const getOriginalTotal = useCallback(() => {
    return items.reduce((sum, item) => {
      let originalPrice = 29; // default for single stickers
      if (item.sticker.id === "mystery-pack") {
        originalPrice = 190;
      } else if (item.sticker.id === "bundle-3-pack") {
        originalPrice = 87;
      } else if (item.sticker.id === "bundle-5-pack") {
        originalPrice = 145;
      } else if (item.sticker.id === "bundle-10-pack") {
        originalPrice = 290;
      } else if (item.sticker.category === "custom") {
        originalPrice = 39;
      }
      return sum + originalPrice * item.quantity;
    }, 0);
  }, [items]);

  const getSavings = useCallback(() => {
    return getOriginalTotal() - getTotal();
  }, [items, getOriginalTotal, getTotal]);

  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getOriginalTotal,
        getSavings,
        getItemCount,
        isOpen,
        setIsOpen,
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
