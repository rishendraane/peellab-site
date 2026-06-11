"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { X, Search, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { categories } from "@/data/categories";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const getNavLinks = () => [
  { label: "HOME", href: "/" },
  ...categories.map((c) => ({
    label: c.slug === "shows" ? "SHOWS & MOVIES" : c.label.toUpperCase(),
    href: `/${c.slug}`,
  })),
  { label: "MYSTERY PACKS", href: "/mystery-pack" },
  { label: "CUSTOM STICKERS", href: "/custom-stickers" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { getItemCount, setIsOpen: setCartOpen } = useCart();
  const itemCount = getItemCount();

  const handleNavClick = () => {
    onClose();
  };

  const handleCartClick = () => {
    onClose();
    setCartOpen(true);
  };

  const handleSearchClick = () => {
    onClose();
    router.push("/search");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="mobile-nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.nav
            key="mobile-nav-drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed top-0 left-0 bottom-0 z-[70] w-80 max-w-full bg-[#0D0D0D] border-r border-[#222222] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 h-20 border-b border-[#222222]">
              <Link href="/" onClick={handleNavClick} className="select-none">
                <span className="font-outfit text-2xl tracking-tight">
                  <span className="italic font-bold text-[#FF6A00]">PEEL</span>
                  <span className="italic font-light text-white">LAB</span>
                </span>
              </Link>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="p-2 rounded-lg text-[#8E8E93] hover:text-white hover:bg-white/5 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Links */}
            <div className="flex-1 overflow-y-auto px-2 py-4">
              {getNavLinks().map(({ label, href }) => {
                const active = isActive(pathname, href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={handleNavClick}
                    className={`flex items-center px-4 py-3 rounded-lg border-b border-[#222222]/50 transition-colors duration-200 ${
                      active
                        ? "border-l-2 border-l-[#FF6A00] bg-[#FF6A00]/5"
                        : "border-l-2 border-l-transparent hover:bg-white/5"
                    }`}
                  >
                    <span
                      className={`font-outfit text-lg font-medium ${
                        active ? "text-white" : "text-white/80"
                      }`}
                    >
                      {label}
                    </span>
                  </Link>
                );
              })}

              {/* Cart Link */}
              <button
                onClick={handleCartClick}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg border-b border-[#222222]/50 border-l-2 border-l-transparent hover:bg-white/5 transition-colors duration-200"
              >
                <ShoppingCart className="w-5 h-5 text-[#8E8E93]" />
                <span className="font-outfit text-lg font-medium text-white/80">
                  CART
                </span>
                {itemCount > 0 && (
                  <span className="ml-auto flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-[#FF6A00] text-white text-[11px] font-black leading-none">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </button>

              {/* Search Link */}
              <button
                onClick={handleSearchClick}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg border-b border-[#222222]/50 border-l-2 border-l-transparent hover:bg-white/5 transition-colors duration-200"
              >
                <Search className="w-5 h-5 text-[#8E8E93]" />
                <span className="font-outfit text-lg font-medium text-white/80">
                  SEARCH
                </span>
              </button>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
