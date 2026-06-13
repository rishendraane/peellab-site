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
    const individualStickersCount = items
      .filter((item) => item.sticker.id !== "mystery-pack" && !item.sticker.id.startsWith("bundle-") && item.sticker.id !== "custom-sticker")
      .reduce((sum, item) => sum + item.quantity, 0);

    const mysteryPackCount = items
      .filter((item) => item.sticker.id === "mystery-pack")
      .reduce((sum, item) => sum + item.quantity, 0);

    const customStickersCount = items
      .filter((item) => item.sticker.id === "custom-sticker")
      .reduce((sum, item) => sum + item.quantity, 0);

    const bundlePacksTotal = items
      .filter((item) => item.sticker.id.startsWith("bundle-"))
      .reduce((sum, item) => sum + item.sticker.price * item.quantity, 0);

    let regularPrice = 0;
    if (individualStickersCount === 1) {
      regularPrice = 19;
    } else if (individualStickersCount === 3) {
      regularPrice = 49;
    } else if (individualStickersCount === 5) {
      regularPrice = 79;
    } else if (individualStickersCount === 10) {
      regularPrice = 149;
    } else {
      regularPrice = individualStickersCount * 19;
    }

    return regularPrice + mysteryPackCount * 99 + customStickersCount * 25 + bundlePacksTotal;
  }, [items]);

  const getOriginalTotal = useCallback(() => {
    const individualStickersCount = items
      .filter((item) => item.sticker.id !== "mystery-pack" && !item.sticker.id.startsWith("bundle-") && item.sticker.id !== "custom-sticker")
      .reduce((sum, item) => sum + item.quantity, 0);

    const mysteryPackCount = items
      .filter((item) => item.sticker.id === "mystery-pack")
      .reduce((sum, item) => sum + item.quantity, 0);

    const customStickersCount = items
      .filter((item) => item.sticker.id === "custom-sticker")
      .reduce((sum, item) => sum + item.quantity, 0);

    const bundlePacksOriginalTotal = items
      .filter((item) => item.sticker.id.startsWith("bundle-"))
      .reduce((sum, item) => {
        let orig = 0;
        if (item.sticker.id === "bundle-3-pack") orig = 87;
        else if (item.sticker.id === "bundle-5-pack") orig = 145;
        else if (item.sticker.id === "bundle-10-pack") orig = 290;
        return sum + orig * item.quantity;
      }, 0);

    const regularOriginal = individualStickersCount * 29;
    const customOriginal = customStickersCount * 39;
    return regularOriginal + mysteryPackCount * 110 + customOriginal + bundlePacksOriginalTotal;
  }, [items]);

  const getSavings = useCallback(() => {
    return getOriginalTotal() - getTotal();
  }, [getOriginalTotal, getTotal]);

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
