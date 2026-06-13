"use client";

import { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/cart-context";

function generateOrderId(): string {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `PL-${digits}`;
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotal, getOriginalTotal, getSavings, getItemCount } = useCart();

  const total = getTotal();
  const originalTotal = getOriginalTotal();
  const savings = getSavings();
  const itemCount = getItemCount();

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

  const handleCheckout = useCallback(async () => {
    if (items.length === 0) return;

    const orderId = generateOrderId();
    const itemLines = items
      .map((item) => `• ${item.sticker.name} × ${item.quantity}`)
      .join("\n");
    const totalAmount = getTotal();

    const message = `Order ID: ${orderId}\n\nItems:\n${itemLines}\n\nTotal: ₹${totalAmount}`;

    try {
      await navigator.clipboard.writeText(message);
    } catch {
      // Fallback: create a temporary textarea
      const textarea = document.createElement("textarea");
      textarea.value = message;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    // Show custom toast instruction element
    const toast = document.createElement("div");
    toast.textContent = "✅ Order copied to clipboard! Opening Instagram...";
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      background: #1A1A1A;
      color: #FFFFFF;
      border: 1px solid #333333;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      font-family: 'Inter', sans-serif;
      font-size: 0.875rem;
      z-index: 10000;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
    });

    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 2500);

    // Redirect to Instagram DM
    setTimeout(() => {
      window.open("https://instagram.com/peellab.in", "_blank");
    }, 1500);
  }, [items, getTotal]);

  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-[#8E8E93] mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">Shopping Cart</span>
        </nav>

        <h1 className="font-outfit text-4xl md:text-5xl font-black tracking-tight mb-12 uppercase">
          YOUR <span className="text-[#FF6A00]">CART</span>
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 py-20 bg-[#141414]/30 border border-[#222222] rounded-3xl p-8 max-w-xl mx-auto">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[#141414]">
              <ShoppingBag size={36} className="text-[#8E8E93]" />
            </div>
            <div className="text-center">
              <h2 className="font-outfit text-2xl font-bold text-white mb-2">Your cart is empty</h2>
              <p className="text-[#8E8E93] text-sm max-w-xs mx-auto">
                Looks like you haven&apos;t added any stickers to your cart yet.
              </p>
            </div>
            <Link
              href="/"
              className="group flex items-center justify-center gap-2 rounded-xl bg-[#FF6A00] hover:bg-[#E05D00] px-8 py-3.5 font-outfit text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-[#FF6A00]/25"
            >
              Start Shopping
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {items.map((item) => (
                <div
                  key={item.sticker.id}
                  className="flex flex-col sm:flex-row items-center gap-6 bg-[#141414] border border-[#222222] rounded-2xl p-6 relative"
                >
                  {/* Image */}
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-[#0d0d0d] flex items-center justify-center">
                    <Image
                      src={item.sticker.image}
                      alt={item.sticker.name}
                      width={80}
                      height={80}
                      className="object-contain drop-shadow-[2px_4px_6px_rgba(0,0,0,0.5)]"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col sm:flex-row justify-between w-full gap-4">
                    <div className="flex flex-col justify-center text-center sm:text-left">
                      <h3 className="font-outfit text-lg font-bold text-white mb-1.5 leading-tight">
                        {item.sticker.name}
                      </h3>
                      <p className="text-xs text-[#8E8E93] capitalize font-medium">
                        Collection: {item.sticker.category} &bull; {item.sticker.franchise.replace("-", " ")}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1.5 bg-[#0d0d0d] p-1.5 rounded-lg border border-[#222222]">
                        <button
                          onClick={() => updateQuantity(item.sticker.id, item.quantity - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded text-[#8E8E93] hover:bg-[#222222] hover:text-white transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="flex w-8 items-center justify-center text-sm font-extrabold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.sticker.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded text-[#8E8E93] hover:bg-[#222222] hover:text-white transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right flex flex-col justify-center min-w-[80px]">
                        <span className="font-outfit text-base font-extrabold text-white">
                          ₹{item.sticker.price * item.quantity}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-[#8E8E93]">
                            ₹{item.sticker.price} each
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.sticker.id)}
                    className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 flex-shrink-0 text-[#8E8E93] hover:text-red-500 p-2 hover:bg-white/5 rounded-lg transition-all"
                    aria-label={`Remove ${item.sticker.name}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary Card */}
            <div className="lg:col-span-4 bg-[#141414] border border-[#222222] rounded-2xl p-6 sm:p-8 flex flex-col gap-6 sticky top-28">
              <h2 className="font-outfit text-xl font-bold text-white uppercase tracking-wider pb-4 border-b border-[#222222]">
                ORDER SUMMARY
              </h2>

              <div className="flex flex-col gap-4 text-sm font-medium">
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
                <div className="flex items-center justify-between text-[#8E8E93]">
                  <span>Total Items</span>
                  <span className="text-white font-bold">{itemCount}</span>
                </div>
                {savings > 0 && (
                  <>
                    <div className="flex items-center justify-between text-[#8E8E93]">
                      <span>Original Subtotal</span>
                      <span className="line-through">₹{originalTotal}</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-400 font-bold">
                      <span>You Save</span>
                      <span>₹{savings}</span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between text-[#8E8E93]">
                  <span>Shipping</span>
                  <span className="text-green-500 font-bold uppercase text-xs bg-green-500/10 px-2 py-0.5 rounded">
                    FREE
                  </span>
                </div>
                <div className="h-px bg-[#222222] my-2" />
                <div className="flex items-baseline justify-between">
                  <span className="font-outfit text-base font-bold text-white">Today&apos;s Total</span>
                  <span className="font-outfit text-2xl font-black text-[#FF6A00]">₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-3 bg-[#FF6A00] hover:bg-[#E05D00] text-white font-outfit text-sm font-extrabold uppercase py-4 rounded-xl tracking-wider transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#FF6A00]/25 active:scale-95"
              >
                ORDER VIA INSTAGRAM
              </button>

              <div className="text-[11px] text-[#8E8E93] leading-relaxed text-center bg-[#0d0d0d] border border-[#222222]/50 p-4 rounded-xl mt-2">
                <p className="font-bold text-white mb-1">How Checkout Works:</p>
                1. Click the button to copy order details.<br />
                2. We will automatically redirect you to Instagram.<br />
                3. Paste the message in our DM to place your order!
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
