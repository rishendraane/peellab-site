"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, Copy, ExternalLink, Check } from "lucide-react";
import { useCart } from "@/context/cart-context";

function generateOrderId(): string {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `PL-${digits}`;
}

export default function CartDrawer() {
  const { isOpen, setIsOpen, items, updateQuantity, removeItem, getTotal, getOriginalTotal, getSavings, getItemCount } =
    useCart();

  const [checkoutData, setCheckoutData] = useState<{
    orderId: string;
    itemsList: { name: string; quantity: number }[];
    total: number;
    message: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  const handleCheckout = useCallback(() => {
    const orderId = generateOrderId();
    const itemDetails = items.map((item) => ({
      name: item.sticker.name,
      quantity: item.quantity,
    }));
    const itemLines = itemDetails
      .map((item) => `• ${item.name} × ${item.quantity}`)
      .join("\n");
    const total = getTotal();

    const hasCustom = items.some((item) => item.sticker.id === "custom-sticker");
    let message = `Order ID: ${orderId}\n\nItems:\n${itemLines}\n\nTotal: ₹${total}`;
    if (hasCustom) {
      message += `\n\n📸 Custom Stickers detected! Please send the photos/designs you want printed directly in this DM thread.`;
    }

    setCheckoutData({
      orderId,
      itemsList: itemDetails,
      total,
      message,
    });
    setCopied(false);
  }, [items, getTotal]);

  const handleCopy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      // Fallback: create a temporary textarea
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
    }
  }, []);

  const itemCount = getItemCount();
  const total = getTotal();
  const originalTotal = getOriginalTotal();
  const savings = getSavings();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Desktop drawer — slides from right */}
            <motion.div
              className="fixed inset-y-0 right-0 z-50 hidden w-[420px] flex-col border-l border-peel-border bg-peel-bg md:flex"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <DrawerContent
                items={items}
                itemCount={itemCount}
                total={total}
                originalTotal={originalTotal}
                savings={savings}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
                onClose={() => setIsOpen(false)}
                onCheckout={handleCheckout}
              />
            </motion.div>

            {/* Mobile drawer — slides from bottom */}
            <motion.div
              className="fixed inset-x-0 bottom-0 z-50 flex h-[90vh] flex-col rounded-t-2xl border-t border-peel-border bg-peel-bg md:hidden"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              {/* Drag handle for mobile */}
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1 w-10 rounded-full bg-[#333]" />
              </div>
              <DrawerContent
                items={items}
                itemCount={itemCount}
                total={total}
                originalTotal={originalTotal}
                savings={savings}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
                onClose={() => setIsOpen(false)}
                onCheckout={handleCheckout}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {checkoutData && (
          <>
            {/* Modal Overlay */}
            <motion.div
              className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setCheckoutData(null);
                setCopied(false);
              }}
            />

            {/* Modal Box */}
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-2xl border border-[#222222] bg-[#141414] p-6 shadow-2xl shadow-black/80"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
              >
                {/* Close Button */}
                <button
                  onClick={() => {
                    setCheckoutData(null);
                    setCopied(false);
                  }}
                  className="absolute right-4 top-4 text-[#8E8E93] hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5 cursor-pointer"
                  aria-label="Close summary"
                >
                  <X size={18} />
                </button>

                <div className="flex flex-col gap-5">
                  <div>
                    <span className="font-outfit text-xs font-black tracking-wider text-[#FF6A00] uppercase block mb-1">
                      Instagram Checkout
                    </span>
                    <h3 className="font-outfit text-2xl font-black text-white uppercase tracking-tight">
                      Review Your Order
                    </h3>
                  </div>

                  {/* Order ID & Total */}
                  <div className="flex items-center justify-between bg-[#0D0D0D] border border-[#222222] rounded-xl p-4">
                    <div>
                      <span className="text-[10px] text-[#8E8E93] uppercase tracking-wider block font-medium">Order ID</span>
                      <span className="font-mono text-sm font-bold text-[#FF6A00]">{checkoutData.orderId}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#8E8E93] uppercase tracking-wider block font-medium">Total Price</span>
                      <span className="font-outfit text-lg font-black text-white">₹{checkoutData.total}</span>
                    </div>
                  </div>

                  {/* Items Box */}
                  <div className="bg-[#0D0D0D] border border-[#222222] rounded-xl p-4 max-h-40 overflow-y-auto">
                    <span className="text-[10px] text-[#8E8E93] uppercase tracking-wider block font-medium mb-2">Items</span>
                    <ul className="flex flex-col gap-2">
                      {checkoutData.itemsList.map((item, idx) => (
                        <li key={idx} className="flex justify-between items-center text-xs">
                          <span className="text-white font-medium">
                            • {item.name}
                          </span>
                          <span className="text-[#8E8E93]">
                            Qty: <strong className="text-white">{item.quantity}</strong>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Success State Confirmation */}
                  {copied ? (
                    <motion.div
                      className="border border-green-500/20 bg-green-500/5 rounded-xl p-4 flex flex-col gap-1 text-center"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="text-xs font-bold text-green-400 flex items-center justify-center gap-1.5">
                        <Check size={14} className="stroke-[3]" />
                        Order copied successfully!
                      </span>
                      <span className="text-[10px] text-[#8E8E93] leading-relaxed">
                        Paste this message into your Instagram DM to @peellab.in to complete your order.
                      </span>
                    </motion.div>
                  ) : (
                    <div className="border border-[#222222] bg-white/[0.01] rounded-xl p-4 text-center">
                      <span className="text-[10px] text-[#8E8E93] leading-relaxed block">
                        Copy the order details, then paste it in our Instagram DMs to complete your checkout.
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2.5 mt-2">
                    <button
                      onClick={() => handleCopy(checkoutData.message)}
                      className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-white/5 border border-[#222222] text-white font-outfit text-sm font-extrabold hover:bg-white/10 hover:border-[#333333] transition-all cursor-pointer active:scale-98"
                    >
                      <Copy size={16} />
                      COPY ORDER
                    </button>

                    <button
                      onClick={() => window.open("https://instagram.com/peellab.in", "_blank")}
                      className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-white/5 border border-[#222222] text-white font-outfit text-sm font-extrabold hover:bg-white/10 hover:border-[#333333] transition-all cursor-pointer active:scale-98"
                    >
                      <ExternalLink size={16} />
                      OPEN INSTAGRAM
                    </button>

                    <button
                      onClick={() => {
                        handleCopy(checkoutData.message);
                        setTimeout(() => {
                          window.open("https://instagram.com/peellab.in", "_blank");
                        }, 300);
                      }}
                      className="flex items-center justify-center gap-2 w-full py-4 px-4 rounded-xl bg-[#FF6A00] text-white font-outfit text-sm font-black hover:bg-[#E05D00] transition-all cursor-pointer active:scale-98 shadow-lg shadow-[#FF6A00]/25"
                    >
                      <Copy size={16} />
                      COPY + OPEN INSTAGRAM
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Inner content — shared between desktop and mobile shells           */
/* ------------------------------------------------------------------ */

interface DrawerContentProps {
  items: ReturnType<typeof useCart>["items"];
  itemCount: number;
  total: number;
  originalTotal: number;
  savings: number;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  onClose: () => void;
  onCheckout: () => void;
}

function DrawerContent({
  items,
  itemCount,
  total,
  originalTotal,
  savings,
  updateQuantity,
  removeItem,
  onClose,
  onCheckout,
}: DrawerContentProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-peel-border px-6 py-5">
        <h2 className="font-outfit text-xl font-extrabold text-white">
          Your Cart
          {itemCount > 0 && (
            <span className="ml-2 text-sm font-medium text-peel-grey">({itemCount})</span>
          )}
        </h2>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-peel-grey transition-colors hover:bg-[#1A1A1A] hover:text-white"
          aria-label="Close cart"
        >
          <X size={20} />
        </button>
      </div>

      {/* Items list */}
      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#141414]">
            <ShoppingBag size={32} className="text-peel-grey" />
          </div>
          <div className="text-center">
            <p className="font-outfit text-lg font-semibold text-white">Your cart is empty.</p>
            <p className="mt-1 text-sm text-peel-grey">Add some stickers to get started.</p>
          </div>
          <Link
            href="/"
            onClick={onClose}
            className="rounded-xl bg-peel-orange px-8 py-3 font-outfit text-sm font-bold text-white transition-colors hover:bg-[#E05D00]"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-5">
            {items.map((item) => (
              <CartItemRow
                key={item.sticker.id}
                item={item}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      {items.length > 0 && (() => {
        const individualStickersCount = items
          .filter((item) => item.sticker.id !== "mystery-pack" && !item.sticker.id.startsWith("bundle-") && item.sticker.id !== "custom-sticker")
          .reduce((sum, item) => sum + item.quantity, 0);

        const hasBundle3 = items.some((item) => item.sticker.id === "bundle-3-pack");
        const hasBundle5 = items.some((item) => item.sticker.id === "bundle-5-pack");
        const hasBundle10 = items.some((item) => item.sticker.id === "bundle-10-pack");

        const badges: { text: string; styles: string }[] = [];
        if (individualStickersCount === 3 || hasBundle3) {
          badges.push({ text: "🔥 Most Popular", styles: "bg-[#FF6A00]/10 border-[#FF6A00]/25 text-[#FF6A00]" });
        } else if (individualStickersCount === 5 || hasBundle5) {
          badges.push({ text: "⚡ Best Value", styles: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" });
        } else if (individualStickersCount === 10 || hasBundle10) {
          badges.push({ text: "🚀 Ultimate Deal", styles: "bg-blue-500/10 border-blue-500/25 text-blue-400" });
        }

        const hasMystery = items.some((item) => item.sticker.id === "mystery-pack");
        if (hasMystery) {
          badges.push({ text: "🎁 Surprise Inside", styles: "bg-purple-500/10 border-purple-500/25 text-purple-400" });
        }

        return (
          <div className="border-t border-peel-border p-6 flex flex-col gap-3.5">
            {badges.length > 0 && (
              <div className="flex flex-col gap-2 border-b border-[#222]/40 pb-3 mb-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#8E8E93] select-none">Active Deals</span>
                <div className="flex flex-wrap gap-1.5">
                  {badges.map((badge, idx) => (
                    <span key={idx} className={`px-2.5 py-1 rounded border text-[9px] font-black uppercase tracking-wider ${badge.styles}`}>
                      {badge.text}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {savings > 0 && (
              <>
                <div className="flex items-center justify-between text-xs text-[#8E8E93] select-none">
                  <span>Original Subtotal</span>
                  <span className="line-through">₹{originalTotal}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400 select-none">
                  <span>You Save</span>
                  <span>₹{savings}</span>
                </div>
              </>
            )}
            
            <div className="flex items-center justify-between pb-4 border-b border-[#222]/60">
              <span className="text-sm font-bold text-white">Today&apos;s Total</span>
              <span className="font-outfit text-xl font-black text-[#FF6A00]">₹{total}</span>
            </div>
            
            <button
              onClick={onCheckout}
              className="w-full rounded-xl bg-peel-orange py-4 font-outfit text-sm font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-[#E05D00] cursor-pointer"
            >
              Order via Instagram
            </button>
          </div>
        );
      })()}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Individual cart item row                                           */
/* ------------------------------------------------------------------ */

interface CartItemRowProps {
  item: { sticker: { id: string; name: string; image: string; price: number }; quantity: number };
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
}

function CartItemRow({ item, updateQuantity, removeItem }: CartItemRowProps) {
  const { sticker, quantity } = item;

  return (
    <div className="flex items-center gap-4">
      {/* Image */}
      <div className="relative h-[60px] w-[60px] flex-shrink-0 overflow-hidden rounded-lg bg-[#141414]">
        <Image
          src={sticker.image}
          alt={sticker.name}
          fill
          sizes="60px"
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-tight text-white">{sticker.name}</p>
          <button
            onClick={() => removeItem(sticker.id)}
            className="flex-shrink-0 text-peel-grey transition-colors hover:text-red-500"
            aria-label={`Remove ${sticker.name} from cart`}
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          {/* Quantity controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateQuantity(sticker.id, quantity - 1)}
              className="flex h-6 w-6 items-center justify-center rounded border border-[#222] text-peel-grey transition-colors hover:bg-[#222] hover:text-white"
              aria-label="Decrease quantity"
            >
              <Minus size={12} />
            </button>
            <span className="flex h-6 w-8 items-center justify-center text-xs font-medium text-white">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(sticker.id, quantity + 1)}
              className="flex h-6 w-6 items-center justify-center rounded border border-[#222] text-peel-grey transition-colors hover:bg-[#222] hover:text-white"
              aria-label="Increase quantity"
            >
              <Plus size={12} />
            </button>
          </div>

          {/* Price */}
          <span className="font-outfit text-sm font-bold text-white">
            ₹{sticker.price * quantity}
          </span>
        </div>
      </div>
    </div>
  );
}
