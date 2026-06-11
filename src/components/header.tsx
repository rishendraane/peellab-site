"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Search, ShoppingCart, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { MobileNav } from "@/components/mobile-nav";
import { categories } from "@/data/categories";

const getNavLinks = () => [
  { label: "HOME", href: "/" },
  ...categories.map((c) => ({
    label: c.slug === "shows" ? "SHOWS" : c.label.toUpperCase(),
    href: `/${c.slug}`,
  })),
  { label: "MYSTERY PACKS", href: "/mystery-pack" },
  { label: "CUSTOM STICKERS", href: "/custom-stickers" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { getItemCount, setIsOpen } = useCart();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const itemCount = getItemCount();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-[#0D0D0D]/80 backdrop-blur-xl border-b border-[#222222]">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left — Logo */}
          <Link href="/" className="flex-shrink-0 select-none">
            <span className="font-outfit text-2xl tracking-tight">
              <span className="italic font-bold text-[#FF6A00]">PEEL</span>
              <span className="italic font-light text-white">LAB</span>
            </span>
          </Link>

          {/* Center — Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {getNavLinks().map(({ label, href }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative group"
                >
                  <span
                    className={`font-outfit text-[13px] font-bold tracking-wide transition-colors duration-200 ${
                      active ? "text-white" : "text-[#8E8E93] hover:text-white"
                    }`}
                  >
                    {label}
                  </span>

                  {/* Active underline */}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#FF6A00] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right — Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => router.push("/search")}
              aria-label="Search"
              className="relative p-2 rounded-lg text-[#8E8E93] hover:text-white hover:bg-white/5 transition-colors duration-200"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsOpen(true)}
              aria-label="Open cart"
              className="relative p-2 rounded-lg text-[#8E8E93] hover:text-white hover:bg-white/5 transition-colors duration-200"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-[#FF6A00] text-white text-[10px] font-black leading-none">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
              className="md:hidden relative p-2 rounded-lg text-[#8E8E93] hover:text-white hover:bg-white/5 transition-colors duration-200"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer to push content below fixed header */}
      <div className="h-20" />

      {/* Mobile Navigation */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </>
  );
}
