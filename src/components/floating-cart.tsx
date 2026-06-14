"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { usePathname } from "next/navigation";

export default function FloatingCart() {
  const { getItemCount, getTotal, setIsOpen, isOpen } = useCart();
  const pathname = usePathname();

  const itemCount = getItemCount();
  const total = getTotal();

  const isCartPage = pathname === "/cart";
  const shouldShow = itemCount > 0 && !isOpen && !isCartPage;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          whileHover={{ y: -3, scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 md:bottom-6 right-6 z-[100] flex items-center gap-3 rounded-full bg-[#FF6A00] px-5 py-3 shadow-[0_4px_20px_rgba(255,106,0,0.35)] transition-all duration-200 hover:bg-[#E05D00] hover:shadow-[0_8px_32px_rgba(255,106,0,0.5)]"
        >
          <ShoppingCart className="h-5 w-5 text-white" />

          <span className="font-outfit text-sm font-extrabold text-white">
            {itemCount} {itemCount === 1 ? "Item" : "Items"}
          </span>

          <span className="h-5 w-px bg-white/25" />

          <span className="font-outfit text-sm font-extrabold text-white">
            ₹{total}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
