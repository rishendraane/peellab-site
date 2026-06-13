"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getStickerById, getRelatedStickers } from "@/lib/stickers";
import { getCategoryBySlug, getFranchiseBySlug } from "@/data/categories";
import StickerCard from "@/components/sticker-card";
import { useCart } from "@/context/cart-context";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Droplet,
  Shield,
  Layers,
  Sparkles,
  Laptop,
  Smartphone,
  Monitor,
  BookOpen,
  Car,
  CheckCircle2
} from "lucide-react";

export default function StickerDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { addItem } = useCart();

  const sticker = getStickerById(id);
  if (!sticker) return notFound();

  const category = getCategoryBySlug(sticker.category);
  const franchise = getFranchiseBySlug(sticker.franchise);
  const related = getRelatedStickers(sticker, 6);

  const handleAddToCart = () => {
    addItem(sticker);
  };

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const gallery = [
    { type: 'sticker', src: sticker.image, alt: sticker.name },
    { type: 'collage', src: '/gallery/features-collage.jpg', alt: `${sticker.name} Features Collage` }
  ];

  const activeImage = gallery[selectedImageIndex];

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-[#8E8E93] mb-10 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          {category && (
            <>
              <Link href={`/category/${sticker.category}`} className="hover:text-white transition-colors">{category.label}</Link>
              <span>/</span>
            </>
          )}
          {franchise && franchise.slug !== sticker.category && (
            <>
              <Link href={`/franchise/${sticker.franchise}`} className="hover:text-white transition-colors">{franchise.label}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-white">{sticker.name}</span>
        </nav>

        {/* Product Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-20">
          {/* Image Gallery */}
          <div className="flex flex-col">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative bg-[#141414] border border-[#222] rounded-2xl flex items-center justify-center aspect-square md:aspect-[4/3] w-full overflow-hidden group/gallery"
            >
              {/* Blur glow (only for sticker type) */}
              {activeImage.type === 'sticker' && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-40 h-40 bg-[#FF6A00]/5 rounded-full blur-3xl animate-pulse" />
                </div>
              )}

              {/* Main Image Display */}
              <div className={`relative w-full h-full transition-all duration-300 ${activeImage.type === 'sticker' ? 'p-12 md:p-16' : 'p-0'}`}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-full relative"
                  >
                    <Image
                      src={activeImage.src}
                      alt={activeImage.alt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className={`relative z-10 select-none ${
                        activeImage.type === 'sticker'
                          ? 'object-contain drop-shadow-[4px_8px_16px_rgba(0,0,0,0.6)]'
                          : activeImage.type === 'mockup'
                            ? 'object-cover'
                            : 'object-contain'
                      }`}
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Arrow navigation overlay */}
              <button
                onClick={prevImage}
                className="absolute left-4 z-25 p-2.5 rounded-full bg-black/60 border border-white/10 opacity-0 group-hover/gallery:opacity-100 hover:bg-black/95 hover:scale-105 transition-all text-white cursor-pointer"
                aria-label="Previous image"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 z-25 p-2.5 rounded-full bg-black/60 border border-white/10 opacity-0 group-hover/gallery:opacity-100 hover:bg-black/95 hover:scale-105 transition-all text-white cursor-pointer"
                aria-label="Next image"
              >
                <ChevronRight size={22} />
              </button>

              {/* Dots indicator overlay */}
              <div className="absolute bottom-4 flex justify-center gap-1.5 z-25">
                {gallery.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      selectedImageIndex === idx ? 'bg-[#FF6A00] w-3.5' : 'bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Thumbnail Strip */}
            <div className="flex gap-3 mt-4">
              {gallery.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden bg-[#141414] border transition-all duration-200 cursor-pointer shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-[#FF6A00] ring-2 ring-[#FF6A00]/20 scale-95'
                      : 'border-[#222] hover:border-[#444] hover:scale-102'
                  }`}
                >
                  <div className={`relative w-full h-full ${item.type === 'sticker' ? 'p-2' : 'p-0'}`}>
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="80px"
                      className={`select-none ${
                        item.type === 'sticker'
                          ? 'object-contain drop-shadow-sm'
                          : 'object-cover'
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col justify-center"
          >
            {/* Badges */}
            <div className="flex items-center gap-3 mb-5">
              {category && (
                <Link
                  href={`/category/${sticker.category}`}
                  className="bg-[#FF6A00]/10 text-[#FF6A00] font-outfit text-xs font-extrabold uppercase px-3 py-1.5 rounded tracking-wide hover:bg-[#FF6A00]/20 transition-colors"
                >
                  {category.label}
                </Link>
              )}
              {franchise && franchise.slug !== sticker.category && (
                <Link
                  href={`/franchise/${sticker.franchise}`}
                  className="bg-white/5 text-[#8E8E93] font-outfit text-xs font-bold uppercase px-3 py-1.5 rounded tracking-wide hover:text-white transition-colors"
                >
                  {franchise.label}
                </Link>
              )}
            </div>

            <h1 className="font-outfit text-3xl md:text-4xl font-black tracking-tight mb-4">
              {sticker.name}
            </h1>

            <p className="text-[#8E8E93] text-base mb-8 leading-relaxed">
              Premium die-cut sticker. Water-resistant, durable, and easy to peel. 
              Perfect for laptops, water bottles, phone cases, and more.
            </p>

            <div className="flex flex-col gap-3.5 mb-8">
              <div className="flex items-baseline gap-3">
                <span className="font-outfit text-4xl font-black text-white">₹{sticker.price}</span>
              </div>

              {/* Checkmarks under price */}
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-[#8E8E93] text-[11px] font-black uppercase tracking-wide font-outfit">
                <span className="flex items-center gap-1 select-none">
                  <span className="text-[#FF6A00] font-black">✓</span> Waterproof
                </span>
                <span className="flex items-center gap-1 select-none">
                  <span className="text-[#FF6A00] font-black">✓</span> Scratch Resistant
                </span>
                <span className="flex items-center gap-1 select-none">
                  <span className="text-[#FF6A00] font-black">✓</span> Premium Sticker
                </span>
                <span className="flex items-center gap-1 select-none">
                  <span className="text-[#FF6A00] font-black">✓</span> Residue Free
                </span>
              </div>
            </div>

            {/* Mix & Match Bundle Offers */}
            <div className="border border-[#222222] bg-[#141414]/30 rounded-2xl p-5 mb-8">
              <h3 className="font-outfit text-xs font-black uppercase tracking-wider text-[#FF6A00] mb-3 select-none">
                Mix & Match Bundle Offers
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 3 Stickers */}
                <div className="flex flex-col justify-between p-4 rounded-xl border border-[#222222] bg-[#0D0D0D]">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className="font-outfit text-xs font-bold text-white">3 stickers</span>
                    </div>
                    <span className="bg-[#FF6A00]/10 border border-[#FF6A00]/25 text-[#FF6A00] font-outfit text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded select-none inline-block mb-2">
                      MOST POPULAR
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-xs text-[#8E8E93] line-through font-outfit">₹57</span>
                    <span className="text-lg font-black text-white font-outfit">₹49</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold mt-1 block">Save ₹8</span>
                </div>

                {/* 5 Stickers */}
                <div className="flex flex-col justify-between p-4 rounded-xl border border-[#222222] bg-[#0D0D0D]">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className="font-outfit text-xs font-bold text-white">5 stickers</span>
                    </div>
                    <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-outfit text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded select-none inline-block mb-2">
                      BEST VALUE
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-xs text-[#8E8E93] line-through font-outfit">₹95</span>
                    <span className="text-lg font-black text-white font-outfit">₹79</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold mt-1 block">Save ₹16</span>
                </div>

                {/* 10 Stickers */}
                <div className="flex flex-col justify-between p-4 rounded-xl border border-[#222222] bg-[#0D0D0D]">
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap mb-1">
                      <span className="font-outfit text-xs font-bold text-white">10 stickers</span>
                    </div>
                    <span className="bg-blue-500/10 border border-blue-500/25 text-blue-400 font-outfit text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded select-none inline-block mb-2">
                      COLLECTOR PACK
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-xs text-[#8E8E93] line-through font-outfit">₹190</span>
                    <span className="text-lg font-black text-white font-outfit">₹149</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold mt-1 block">Save ₹41</span>
                </div>
              </div>
              <p className="text-[10px] text-[#8E8E93] font-medium mt-3 text-center">
                * Mix and match any stickers! Discount applies automatically in your cart.
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-3 bg-[#FF6A00] hover:bg-[#E05D00] text-white font-outfit text-base font-extrabold py-4 px-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#FF6A00]/30 w-full md:w-auto cursor-pointer"
            >
              <ShoppingCart size={20} />
              ADD TO CART
            </button>

            {/* Premium Feature Badges */}
            <div className="grid grid-cols-2 gap-3 mt-8 pt-8 border-t border-[#222]">
              {[
                { name: "Waterproof", icon: Droplet, color: "from-[#FF6A00]/10 to-[#FF6A00]/5 text-[#FF6A00] border-[#FF6A00]/20" },
                { name: "Scratch Resistant", icon: Shield, color: "from-blue-500/10 to-blue-500/5 text-blue-400 border-blue-500/15" },
                { name: "Premium Sticker", icon: Layers, color: "from-amber-500/10 to-amber-500/5 text-amber-400 border-amber-500/15" },
                { name: "Residue Free", icon: Sparkles, color: "from-emerald-500/10 to-emerald-500/5 text-emerald-400 border-emerald-500/15" }
              ].map((badge, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2.5 bg-gradient-to-br ${badge.color} border px-3.5 py-3 rounded-xl font-outfit text-xs font-extrabold uppercase tracking-wider transition-all duration-300 hover:translate-x-0.5 select-none`}
                >
                  <span className="text-sm">✓</span>
                  <badge.icon size={14} className="shrink-0" />
                  <span>{badge.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Premium Details Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-[#141414] to-[#0A0A0A] border border-[#222] rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Background decorative glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#FF6A00]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Quality details */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-1 w-8 bg-[#FF6A00] rounded-full" />
                  <span className="text-xs font-black uppercase tracking-widest text-[#FF6A00] font-outfit">Quality Craftsmanship</span>
                </div>
                <h2 className="font-outfit text-3xl md:text-4xl font-black tracking-tight mb-6 text-white leading-tight">
                  Premium PeelLab Stickers
                </h2>
                <p className="text-[#8E8E93] text-lg mb-8 leading-relaxed max-w-xl">
                  Made from high-quality materials with strong adhesive, vibrant colors, and long-lasting durability. 
                  Every sticker is precision die-cut and engineered to resist fading, weather, and wear, giving your gear a premium custom look that lasts.
                </p>
                
                {/* Additional selling points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 select-none">
                    <CheckCircle2 size={18} className="text-[#FF6A00]" />
                    <span className="text-sm font-semibold text-white/95">Vibrant Full-Color Print</span>
                  </div>
                  <div className="flex items-center gap-3 select-none">
                    <CheckCircle2 size={18} className="text-[#FF6A00]" />
                    <span className="text-sm font-semibold text-white/95">Extra-Durable Laminate</span>
                  </div>
                  <div className="flex items-center gap-3 select-none">
                    <CheckCircle2 size={18} className="text-[#FF6A00]" />
                    <span className="text-sm font-semibold text-white/95">100% Weather Resistant</span>
                  </div>
                  <div className="flex items-center gap-3 select-none">
                    <CheckCircle2 size={18} className="text-[#FF6A00]" />
                    <span className="text-sm font-semibold text-white/95">Thick Protective Border</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Perfect For grid */}
              <div className="lg:col-span-5 bg-white/5 border border-white/5 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                <h3 className="font-outfit text-xl font-bold mb-6 text-white tracking-tight">
                  Perfect For:
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "Laptops", icon: Laptop },
                    { name: "Phones", icon: Smartphone },
                    { name: "Bottles", icon: Droplet },
                    { name: "Desktops", icon: Monitor },
                    { name: "Notebooks", icon: BookOpen },
                    { name: "Cars", icon: Car }
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-3 bg-black/40 border border-white/5 p-4 rounded-xl hover:border-[#FF6A00]/30 transition-all duration-300 group hover:-translate-y-0.5"
                    >
                      <item.icon size={18} className="text-[#8E8E93] group-hover:text-[#FF6A00] transition-colors" />
                      <span className="text-sm font-bold text-white/90 font-outfit">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Stickers */}
        {related.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-outfit text-2xl font-black tracking-tight">
                YOU MIGHT ALSO LIKE
              </h2>
              {category && (
                <Link
                  href={`/category/${sticker.category}`}
                  className="text-[#FF6A00] font-outfit font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
                >
                  View all <ArrowRight size={14} />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
              {related.map((s, i) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <StickerCard sticker={s} />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
