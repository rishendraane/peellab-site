"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Plus, Minus, Trash2, Check } from "lucide-react";
import { Sticker } from "@/types/sticker";
import { useCart } from "@/context/cart-context";
import { getCategoryBySlug } from "@/data/categories";

interface StickerCardProps {
  sticker: Sticker;
}

export default function StickerCard({ sticker }: StickerCardProps) {
  const { addItem, removeItem, updateQuantity, items } = useCart();
  const categoryLabel = getCategoryBySlug(sticker.category)?.label || sticker.category;

  const cartItem = items.find((item) => item.sticker.id === sticker.id);
  const quantityInCart = cartItem?.quantity || 0;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(sticker);
  };

  const handleIncrement = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(sticker);
  };

  const handleDecrement = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantityInCart <= 1) {
      removeItem(sticker.id);
    } else {
      updateQuantity(sticker.id, quantityInCart - 1);
    }
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    removeItem(sticker.id);
  };

  return (
    <Link href={`/sticker/${sticker.id}`} className="block">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative rounded-2xl border border-[#222222] bg-[#141414] p-4 transition-all duration-300 hover:border-[#333333] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
      >
        {/* Category Badge */}
        <span className="absolute left-4 top-4 z-10 rounded-full bg-[#FF6A00]/10 px-3 py-1 font-outfit text-xs font-medium tracking-wide text-[#FF6A00] uppercase">
          {categoryLabel}
        </span>

        {/* In Cart Badge */}
        <AnimatePresence>
          {quantityInCart > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 font-outfit text-[10px] font-black tracking-wide text-emerald-400 uppercase"
            >
              <Check className="h-3 w-3" />
              In Cart
            </motion.span>
          )}
        </AnimatePresence>

        {/* Image Container */}
        <div className="relative flex items-center justify-center overflow-hidden rounded-xl bg-[#0D0D0D] py-8">
          {/* Subtle orange glow */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="h-28 w-28 rounded-full bg-[#FF6A00]/8 blur-3xl transition-all duration-500 group-hover:h-36 group-hover:w-36 group-hover:bg-[#FF6A00]/12" />
          </div>

          <Image
            src={sticker.image}
            alt={sticker.name}
            width={220}
            height={220}
            className="relative z-[1] object-contain transition-transform duration-500 ease-out group-hover:scale-[1.08] group-hover:rotate-3"
          />
        </div>

        {/* Info */}
        <div className="mt-4 flex flex-col gap-3">
          <h3 className="truncate font-outfit text-base font-bold text-white">
            {sticker.name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <span className="font-outfit text-xs font-bold text-[#8E8E93] line-through">
                  ₹29
                </span>
                <span className="font-outfit text-lg font-extrabold text-white">
                  ₹{sticker.price}
                </span>
              </div>
              <span className="text-emerald-400 font-outfit text-[10px] font-black uppercase tracking-wider select-none">
                Save ₹10
              </span>
            </div>

            <AnimatePresence mode="wait">
              {quantityInCart > 0 ? (
                <motion.div
                  key="cart-controls"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1"
                >
                  {/* Remove from cart */}
                  <button
                    onClick={handleRemove}
                    className="flex items-center justify-center rounded-md border border-red-500/30 bg-red-500/10 p-1.5 text-red-400 transition-all duration-200 hover:bg-red-500/25 hover:border-red-500/50 active:scale-90 cursor-pointer"
                    title="Remove from cart"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  {/* Quantity controls */}
                  <div className="flex items-center rounded-md border border-[#FF6A00]/40 bg-[#FF6A00]/10 overflow-hidden">
                    <button
                      onClick={handleDecrement}
                      className="flex items-center justify-center px-1.5 py-1.5 text-[#FF6A00] transition-colors duration-150 hover:bg-[#FF6A00]/20 active:scale-90 cursor-pointer"
                    >
                      <Minus className="h-3 w-3 stroke-[3]" />
                    </button>
                    <span className="font-outfit text-xs font-black text-white min-w-[20px] text-center select-none">
                      {quantityInCart}
                    </span>
                    <button
                      onClick={handleIncrement}
                      className="flex items-center justify-center px-1.5 py-1.5 text-[#FF6A00] transition-colors duration-150 hover:bg-[#FF6A00]/20 active:scale-90 cursor-pointer"
                    >
                      <Plus className="h-3 w-3 stroke-[3]" />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  key="add-button"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  onClick={handleAddToCart}
                  className="flex items-center gap-1.5 rounded-md border border-[#222222] bg-transparent px-3 py-2 font-outfit text-xs font-black uppercase text-white transition-all duration-200 hover:bg-[#FF6A00] hover:border-[#FF6A00] active:scale-95 cursor-pointer"
                >
                  <ShoppingCart className="h-3.5 w-3.5" />
                  ADD
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
