"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function CustomStickersPage() {
  const { addItem, setIsOpen } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const messageTemplate = `Hi PeelLab 👋

I'd like a custom sticker made.

Photo Type:
[Bike / Car / Pet / Person / Other]

Quantity:
[ ]

Size Preference:
[ ]

I'll send my photo next.`;

  const handleCustomOrder = async () => {
    try {
      await navigator.clipboard.writeText(messageTemplate);
      setShowToast(true);
      
      setTimeout(() => {
        setShowToast(false);
      }, 5000);

      window.open("https://instagram.com/peellab.in", "_blank");
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handlePointerMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    handlePointerMove(e.clientX);
  };

  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      handlePointerMove(e.clientX);
    };

    const handleGlobalPointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("pointermove", handleGlobalPointerMove);
      window.addEventListener("pointerup", handleGlobalPointerUp);
    }

    return () => {
      window.removeEventListener("pointermove", handleGlobalPointerMove);
      window.removeEventListener("pointerup", handleGlobalPointerUp);
    };
  }, [isDragging]);

  const features = [
    "Custom Photo Stickers",
    "Bike & Car Stickers",
    "Pet Stickers",
    "Anime Style Conversions",
    "Waterproof Finish",
    "Fade Resistant"
  ];

  return (
    <main className="min-h-screen pt-28 pb-20 relative">
      {/* Background glow effects - minimal */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-[#FF6A00]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
            >
              <div className="bg-[#141414] border border-[#FF6A00]/30 rounded-xl p-5 shadow-[0_15px_40px_rgba(0,0,0,0.8)] flex items-start gap-4 backdrop-blur-xl">
                <div className="w-8 h-8 rounded-full bg-[#FF6A00]/10 border border-[#FF6A00]/25 flex items-center justify-center text-[#FF6A00] shrink-0 text-sm font-bold">
                  ✓
                </div>
                <div className="flex-1">
                  <h4 className="font-outfit text-xs font-black text-white uppercase tracking-wider mb-1">
                    Request copied successfully
                  </h4>
                  <p className="text-[#8E8E93] text-[11px] leading-relaxed">
                    Paste the message into your Instagram DM to start your custom order.
                  </p>
                </div>
                <button
                  onClick={() => setShowToast(false)}
                  className="p-1 rounded-lg hover:bg-white/5 text-[#8E8E93] hover:text-white transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Section Title & Pricing Psychology Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          {/* Badge */}
          <span className="bg-[#FF6A00]/10 border border-[#FF6A00]/25 text-[#FF6A00] font-outfit text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4 select-none">
            Most Personalized
          </span>

          <h1 className="font-outfit text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white uppercase leading-none mb-4">
            TURN YOUR PHOTOS
            <br />
            INTO <span className="text-[#FF6A00]">CUSTOM STICKERS</span>
          </h1>
          
          <p className="text-[#8E8E93] text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-6">
            Turn your bike, car, pet, logo or photo into a custom sticker. Send us your photo and we&apos;ll transform it into a premium custom sticker made just for you.
          </p>

          {/* Pricing Psychology Box */}
          <div className="bg-[#141414] border border-[#222] px-6 py-4 rounded-2xl flex flex-col items-center select-none mb-6">
            <span className="text-[#8E8E93] font-outfit text-xs font-black uppercase tracking-wider mb-1">
              Custom Stickers Starting From
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-[#8E8E93] font-outfit text-sm font-bold line-through">₹39</span>
              <span className="text-white font-outfit text-2xl font-black">₹25</span>
              <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-outfit text-[10px] font-black uppercase tracking-wide px-2.5 py-0.5 rounded select-none ml-1">
                Save 36%
              </span>
            </div>
            <p className="text-[#8E8E93] text-[10px] font-medium mt-1">
              Custom made from your photos, artwork, logos and ideas.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-3 pt-3 border-t border-[#222222]/60 text-xs text-[#8E8E93] font-medium select-none w-full justify-center">
              <div className="flex items-center gap-1.5">
                <span>📦</span>
                <span>Flat ₹39 Shipping Across India</span>
              </div>
              <span className="hidden sm:inline text-[#333]">|</span>
              <div className="flex items-center gap-1.5">
                <span>🚚</span>
                <span>Free Shipping Above ₹199</span>
              </div>
            </div>
          </div>
        </div>

        {/* Draggable Before / After Slider Card */}
        <div className="mb-16 bg-[#141414] border border-[#222] p-4 rounded-3xl shadow-2xl relative overflow-hidden group hover:border-[#FF6A00]/20 transition-all duration-300">
          {/* Background texture matching PeelLab */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03] bg-repeat"
            style={{ backgroundImage: "url('/bg_texture.png')" }}
          />
          
          <div 
            ref={containerRef}
            onPointerDown={handlePointerDown}
            className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden cursor-ew-resize select-none touch-none z-10"
          >
            {/* LEFT Image: Original Bike Photo (Before) */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="/gallery/custom-original-bike.jpg"
                alt="Original Royal Enfield bike photo"
                fill
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-cover pointer-events-none select-none"
                priority
              />
              <div className="absolute bottom-4 left-4 bg-black/75 border border-white/10 text-white font-outfit text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg backdrop-blur-sm z-20">
                BEFORE
              </div>
            </div>

            {/* RIGHT Image: Finished Sticker (After) */}
            <div 
              className="absolute inset-0 w-full h-full overflow-hidden z-10"
              style={{ clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` }}
            >
              <Image
                src="/gallery/custom-sticker-bike-v3.jpg"
                alt="Finished Custom Sticker"
                fill
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-cover pointer-events-none select-none"
                priority
              />
              <div className="absolute bottom-4 right-4 bg-[#FF6A00]/95 border border-[#FF6A00]/20 text-white font-outfit text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg z-20">
                AFTER
              </div>
            </div>

            {/* Draggable Vertical Handle */}
            <div 
              className="absolute top-0 bottom-0 w-[2px] bg-white z-20 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            />

            {/* Slider Circle Controller */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 border-[#FF6A00] flex items-center justify-center shadow-2xl z-30 pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <span className="font-outfit text-xs font-black text-black select-none tracking-tighter">◀▶</span>
            </div>
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {features.map((feat, idx) => (
            <div 
              key={idx}
              className="bg-[#141414] border border-[#222] p-4 rounded-xl flex flex-col items-center text-center justify-center min-h-[90px] select-none hover:border-[#FF6A00]/20 transition-all duration-300 hover:scale-102"
            >
              <span className="text-[#FF6A00] font-black text-sm mb-2">✓</span>
              <span className="font-outfit text-[10px] font-black uppercase tracking-widest text-white leading-tight">
                {feat}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Area */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center w-full">
            <button
              onClick={() => {
                addItem({
                  id: "custom-sticker",
                  name: "Custom Sticker (Your Photo)",
                  price: 25,
                  category: "custom",
                  franchise: "custom",
                  image: "/logo.png"
                });
                setIsOpen(true);
              }}
              className="flex items-center justify-center gap-3 bg-[#FF6A00] hover:bg-[#E05D00] text-white font-outfit text-sm font-extrabold uppercase tracking-wider py-4 px-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#FF6A00]/25 w-full sm:w-auto cursor-pointer"
            >
              <ShoppingCart size={16} />
              ADD TO CART (₹25)
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
