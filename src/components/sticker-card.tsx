"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Sticker } from "@/types/sticker";
import { useCart } from "@/context/cart-context";
import { getCategoryBySlug } from "@/data/categories";

interface StickerCardProps {
  sticker: Sticker;
}

export default function StickerCard({ sticker }: StickerCardProps) {
  const { addItem } = useCart();
  const categoryLabel = getCategoryBySlug(sticker.category)?.label || sticker.category;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(sticker);
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
                Save 34%
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex items-center gap-1.5 rounded-md border border-[#222222] bg-transparent px-3 py-2 font-outfit text-xs font-black uppercase text-white transition-all duration-200 hover:bg-[#FF6A00] hover:border-[#FF6A00] active:scale-95 cursor-pointer"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              ADD
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
