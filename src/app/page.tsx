"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingCart, Sparkles, Gamepad2, Film, Terminal, Zap, Gauge, Camera, Heart, Car, Palette, ShieldCheck } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { categories, getFranchisesByCategory } from "@/data/categories";
import { getAllStickers, searchStickers, getMysteryPack, getStickersByCategory, getFeaturedStickers } from "@/lib/stickers";
import StickerCard from "@/components/sticker-card";

const SUGGESTIONS = ["gojo", "levi", "breaking bad", "gta", "minecraft", "naruto", "doge"];

const COLLAGE_POSITIONS = [
  { top: "20%", left: "33%", rotate: -8, scale: 1.15, zIndex: 30, hoverX: 0, hoverY: -10, hoverRotate: -12, hoverScale: 1.25 },
  { top: "6%", left: "6%", rotate: -15, scale: 0.85, zIndex: 10, hoverX: -22, hoverY: -16, hoverRotate: -25, hoverScale: 0.9 },
  { top: "8%", left: "62%", rotate: 12, scale: 0.85, zIndex: 15, hoverX: 22, hoverY: -16, hoverRotate: 24, hoverScale: 0.9 },
  { top: "50%", left: "4%", rotate: -25, scale: 0.8, zIndex: 20, hoverX: -18, hoverY: 16, hoverRotate: -35, hoverScale: 0.85 },
  { top: "48%", left: "64%", rotate: 18, scale: 0.8, zIndex: 22, hoverX: 18, hoverY: 16, hoverRotate: 30, hoverScale: 0.85 },
  { top: "-6%", left: "36%", rotate: 5, scale: 0.75, zIndex: 5, hoverX: 0, hoverY: -22, hoverRotate: 8, hoverScale: 0.8 },
  { top: "30%", left: "16%", rotate: 15, scale: 0.85, zIndex: 25, hoverX: -14, hoverY: 0, hoverRotate: 8, hoverScale: 0.9 },
  { top: "28%", left: "50%", rotate: -12, scale: 0.9, zIndex: 28, hoverX: 14, hoverY: 0, hoverRotate: -8, hoverScale: 0.95 },
];

const categoryIconMap: Record<string, React.ComponentType<any>> = {
  anime: Sparkles,
  gaming: Gamepad2,
  shows: Film,
  coding: Terminal,
  memes: Zap,
  cars: Gauge,
};

const COLLAGE_STICKERS = [
  // --- TOP ZONE: ANIME STICKERS ---
  {
    id: "anime-1",
    src: "/stickers/processed/gojo_8e0c09314545.png",
    alt: "Gojo",
    top: "1%",
    left: "2%",
    width: "125px",
    rotate: -12,
    zIndex: 10,
    category: "anime"
  },
  {
    id: "anime-2",
    src: "/stickers/processed/this_contains_an_image_of_todo_aoi_sticker_todo_57.png",
    alt: "Todo Aoi",
    top: "0%",
    left: "35%",
    width: "120px",
    rotate: 8,
    zIndex: 15,
    category: "anime"
  },
  {
    id: "anime-3",
    src: "/stickers/processed/anime_stickers_attack_on_titan_1_mikasa_sticker_ad.png",
    alt: "Mikasa AOT",
    top: "6%",
    left: "18%",
    width: "135px",
    rotate: -5,
    zIndex: 12,
    category: "anime"
  },
  {
    id: "anime-4",
    src: "/stickers/processed/sticker_d0059d9475e7.png",
    alt: "Anime Sticker D005",
    top: "3%",
    left: "65%",
    width: "130px",
    rotate: 15,
    zIndex: 8,
    category: "anime"
  },
  {
    id: "anime-5",
    src: "/stickers/processed/sticker_40e476f59cb8_.png",
    alt: "Anime Sticker 40e4",
    top: "12%",
    left: "-4%",
    width: "120px",
    rotate: -18,
    zIndex: 14,
    category: "anime"
  },
  {
    id: "anime-6",
    src: "/stickers/processed/sticker_a37c532adcc9.png",
    alt: "Anime Sticker A37c",
    top: "11%",
    left: "46%",
    width: "115px",
    rotate: 6,
    zIndex: 16,
    category: "anime"
  },

  // --- MIDDLE ZONE: SHOWS, MOVIES & CODING STICKERS ---
  {
    id: "shows-1",
    src: "/stickers/processed/ben_10_printable_sticker_cb78b4405dbd.png",
    alt: "Ben 10",
    top: "20%",
    left: "14%",
    width: "140px",
    rotate: -6,
    zIndex: 22,
    category: "shows"
  },
  {
    id: "shows-2",
    src: "/stickers/processed/the_codefather_sticker.png",
    alt: "The Codefather",
    top: "22%",
    left: "38%",
    width: "130px",
    rotate: 12,
    zIndex: 24,
    category: "shows"
  },
  {
    id: "coding-1",
    src: "/stickers/processed/funny_computer_programmer_t_shirt_i_need_a_break_c.png",
    alt: "I Need A Break Coding",
    top: "16%",
    left: "64%",
    width: "135px",
    rotate: -10,
    zIndex: 20,
    category: "coding"
  },
  {
    id: "coding-2",
    src: "/stickers/processed/get_my_art_printed_on_awesome_products_support_me.png",
    alt: "Hello World Coding",
    top: "28%",
    left: "-6%",
    width: "125px",
    rotate: 14,
    zIndex: 18,
    category: "coding"
  },
  {
    id: "shows-3",
    src: "/stickers/processed/skyline_r34_brian_o_conner_sticker_bd000dba4b3c.png",
    alt: "Skyline R34 Brian",
    top: "30%",
    left: "22%",
    width: "155px",
    rotate: -3,
    zIndex: 26,
    category: "shows"
  },
  {
    id: "shows-4",
    src: "/stickers/processed/muscle_car_sticker_432c714b6b40.png",
    alt: "Muscle Car",
    top: "32%",
    left: "58%",
    width: "145px",
    rotate: 8,
    zIndex: 21,
    category: "shows"
  },
  {
    id: "other-1",
    src: "/stickers/processed/sticker_0509429cdae1.png",
    alt: "Retro Sticker",
    top: "38%",
    left: "8%",
    width: "125px",
    rotate: -12,
    zIndex: 25,
    category: "other"
  },
  {
    id: "other-2",
    src: "/stickers/processed/sticker_8a3138589dd6.png",
    alt: "Pop Sticker 8a31",
    top: "40%",
    left: "35%",
    width: "115px",
    rotate: 15,
    zIndex: 23,
    category: "other"
  },

  // --- BOTTOM ZONE: GAMING STICKERS ---
  {
    id: "gaming-1",
    src: "/stickers/processed/kratos_god_of_war_1f7fc0da8cde.png",
    alt: "Kratos God of War",
    top: "48%",
    left: "-4%",
    width: "140px",
    rotate: 10,
    zIndex: 30,
    category: "gaming"
  },
  {
    id: "gaming-2",
    src: "/stickers/processed/crash_bandicoot_sticker_crash_bandicoot_925f140fd5.png",
    alt: "Crash Bandicoot",
    top: "54%",
    left: "25%",
    width: "150px",
    rotate: -8,
    zIndex: 32,
    category: "gaming"
  },
  {
    id: "gaming-3",
    src: "/stickers/processed/rdr2_merch_magnet_3770aae059bd.png",
    alt: "Red Dead Redemption 2",
    top: "45%",
    left: "52%",
    width: "125px",
    rotate: 5,
    zIndex: 28,
    category: "gaming"
  },
  {
    id: "other-3",
    src: "/stickers/processed/imagem_4befef19e703.png",
    alt: "Cool Image Sticker",
    top: "55%",
    left: "48%",
    width: "135px",
    rotate: -14,
    zIndex: 31,
    category: "other"
  },
  {
    id: "other-4",
    src: "/stickers/processed/ozl_0d902119194c.png",
    alt: "Sticker Ozl",
    top: "62%",
    left: "12%",
    width: "130px",
    rotate: 16,
    zIndex: 29,
    category: "other"
  },
  {
    id: "other-5",
    src: "/stickers/processed/sticker_1d775999a140.png",
    alt: "Small Sticker 1d77",
    top: "42%",
    left: "75%",
    width: "105px",
    rotate: -5,
    zIndex: 27,
    category: "other"
  },
  {
    id: "other-6",
    src: "/stickers/processed/sticker_67be636b3b34.png",
    alt: "Small Sticker 67be",
    top: "55%",
    left: "-8%",
    width: "105px",
    rotate: 12,
    zIndex: 33,
    category: "other"
  },
  {
    id: "other-7",
    src: "/stickers/processed/sticker_a21f02125e2e_.png",
    alt: "Sticker a21f",
    top: "64%",
    left: "36%",
    width: "115px",
    rotate: -4,
    zIndex: 34,
    category: "other"
  },
  {
    id: "other-8",
    src: "/stickers/processed/sticker_a7ef3daa9bda.png",
    alt: "Sticker a7ef",
    top: "70%",
    left: "24%",
    width: "120px",
    rotate: 8,
    zIndex: 35,
    category: "other"
  },
  {
    id: "other-9",
    src: "/stickers/processed/sticker_b5bc6bbd222a.png",
    alt: "Sticker b5bc",
    top: "70%",
    left: "52%",
    width: "125px",
    rotate: -10,
    zIndex: 36,
    category: "other"
  }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const { addItem } = useCart();
  const searchRef = useRef<HTMLDivElement>(null);
  const shopRef = useRef<HTMLDivElement>(null);
  const collageContainerRef = useRef<HTMLDivElement>(null);

  const mysteryPack = getMysteryPack();

  // Find products matching query
  const displayedStickers = searchQuery.trim()
    ? searchStickers(searchQuery)
    : getFeaturedStickers();

  const handleSuggestionClick = (tag: string) => {
    if (activeTag === tag) {
      setActiveTag("");
      setSearchQuery("");
    } else {
      setActiveTag(tag);
      setSearchQuery(tag);
      // Smooth scroll to search/shop section
      searchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setActiveTag("");
  };

  const scrollToSearch = (e: React.MouseEvent) => {
    e.preventDefault();
    searchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-center">
          {/* Hero Content */}
          <div className="md:col-span-7 flex flex-col items-start z-10 text-left">
            <span className="font-outfit text-xs font-black tracking-[2px] text-[#FF6A00] mb-4 uppercase">
              PREMIUM QUALITY
            </span>
            <h1 className="font-outfit text-[42px] sm:text-[60px] lg:text-[76px] font-black leading-[0.95] tracking-tight text-white mb-6 uppercase">
              STICKERS
              <br />
              FOR EVERY
              <br />
              <span className="text-[#FF6A00]">VIBE.</span>
            </h1>
            <p className="font-sans text-base sm:text-lg text-[#8E8E93] leading-relaxed mb-8">
              Anime &bull; Gaming &bull; Coding
              <br />
              Memes &bull; Shows &bull; Custom
            </p>
            <a
              href="#search-section"
              onClick={scrollToSearch}
              className="group flex items-center justify-center gap-3 bg-[#FF6A00] hover:bg-[#E05D00] text-white font-outfit text-sm font-extrabold px-8 py-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#FF6A00]/25"
            >
              BROWSE STICKERS
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>

          {/* Hero Collage */}
          <div className="md:col-span-5 relative w-full flex items-center justify-center z-10">
            <div 
              ref={collageContainerRef}
              className="relative w-full h-[550px] md:h-[650px] overflow-visible select-none"
            >
              {/* Sticker Wall */}
              {COLLAGE_STICKERS.map((sticker) => (
                <motion.div
                  key={sticker.id}
                  drag
                  dragConstraints={collageContainerRef}
                  dragElastic={0.15}
                  dragMomentum={false}
                  whileDrag={{ scale: 1.15, zIndex: 100 }}
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: sticker.rotate + (Math.random() > 0.5 ? 5 : -5),
                    zIndex: 90,
                    filter: "drop-shadow(8px 16px 20px rgba(0,0,0,0.7))"
                  }}
                  initial={{ opacity: 0, scale: 0.5, rotate: sticker.rotate }}
                  animate={{ opacity: 1, scale: 1, rotate: sticker.rotate }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                  }}
                  style={{
                    position: "absolute",
                    top: sticker.top,
                    left: sticker.left,
                    width: sticker.width,
                    zIndex: sticker.zIndex,
                    cursor: "grab"
                  }}
                  className="active:cursor-grabbing select-none"
                >
                  <img
                    src={sticker.src}
                    alt={sticker.alt}
                    draggable={false}
                    className="w-full h-auto object-contain drop-shadow-[4px_8px_16px_rgba(0,0,0,0.65)] select-none"
                  />
                </motion.div>
              ))}
            </div>
          </div>

        </div>

        {/* Scroll Down */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
          <a
            href="#search-section"
            onClick={scrollToSearch}
            className="text-[#8E8E93] hover:text-white transition-colors duration-200 animate-bounce"
            aria-label="Scroll down"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </section>

      {/* Search Section */}
      <section
        ref={searchRef}
        id="search-section"
        className="py-12 border-t border-[#141414]"
      >
        <div className="max-w-3xl mx-auto px-6">
          <div className="relative mb-6">
            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8E8E93] w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search 500+ stickers..."
              className="w-full pl-14 pr-6 py-4 bg-[#141414] border border-[#222222] rounded-xl text-white font-sans text-base outline-none transition-all duration-300 focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/10 focus:bg-[#1A1A1A]"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((tag) => (
              <button
                key={tag}
                onClick={() => handleSuggestionClick(tag)}
                className={`font-sans text-xs px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
                  activeTag === tag
                    ? "bg-[#FF6A00] border-[#FF6A00] text-white"
                    : "border-[#222222] text-[#8E8E93] hover:text-white hover:border-[#333333] hover:bg-white/[0.02]"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-outfit text-xl sm:text-2xl font-black tracking-wide text-white">
              EXPLORE COLLECTIONS
            </h2>
            <Link
              href="/categories"
              className="group flex items-center gap-1.5 text-[#FF6A00] hover:text-[#E05D00] font-outfit text-sm font-bold transition-all"
            >
              View all
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const catStickers = getStickersByCategory(cat.slug).slice(0, 8);
              const catStickersCount = getStickersByCategory(cat.slug).length;
              const franCount = getFranchisesByCategory(cat.slug).length;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="group relative h-[320px] bg-[#141414] border border-[#222222] rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:border-[#FF6A00]/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.65)]"
                >
                  {/* Subtle category gradient glow */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at top, ${cat.vibeColor.replace("0.05", "0.25").replace("0.03", "0.2")} 0%, transparent 70%)`
                    }}
                  />

                  {/* Peel corner effect */}
                  <div className="collection-peel-corner group-hover:w-10 group-hover:h-10" />

                  {/* Wrapper to control hover state animations across all children */}
                  <motion.div
                    whileHover="hover"
                    initial="initial"
                    className="relative z-10 w-full h-full p-6 flex flex-col justify-between"
                  >
                    {/* Top: Collage Container (65% height) */}
                    <div className="relative w-full h-[180px] flex items-center justify-center overflow-visible">
                      {catStickers.map((sticker, idx) => {
                        const pos = COLLAGE_POSITIONS[idx] || COLLAGE_POSITIONS[0];
                        return (
                          <motion.div
                            key={sticker.id}
                            variants={{
                              initial: {
                                x: 0,
                                y: 0,
                                rotate: pos.rotate,
                                scale: pos.scale,
                                zIndex: pos.zIndex,
                              },
                              hover: {
                                x: pos.hoverX,
                                y: pos.hoverY,
                                rotate: pos.hoverRotate,
                                scale: pos.hoverScale,
                                zIndex: pos.zIndex,
                                filter: "drop-shadow(0px 10px 15px rgba(0,0,0,0.65))"
                              }
                            }}
                            transition={{ type: "spring", stiffness: 220, damping: 22 }}
                            style={{
                              position: "absolute",
                              top: pos.top,
                              left: pos.left,
                              width: "72px",
                              height: "72px",
                            }}
                            className="flex items-center justify-center pointer-events-none"
                          >
                            <img
                              src={sticker.image}
                              alt={sticker.name}
                              className="max-w-full max-h-full object-contain drop-shadow-[2px_4px_8px_rgba(0,0,0,0.55)] group-hover:drop-shadow-[4px_8px_16px_rgba(0,0,0,0.7)] transition-all duration-300"
                            />
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Bottom: Info Section */}
                    <div className="flex items-end justify-between mt-auto">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          {(() => {
                            const IconComponent = categoryIconMap[cat.slug];
                            return IconComponent ? (
                              <IconComponent className="w-4 h-4 text-white opacity-40 stroke-[1.8]" />
                            ) : null;
                          })()}
                          <h3 className="font-outfit text-[13px] font-black text-white tracking-widest uppercase">
                            {cat.label}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 font-sans text-xs text-[#8E8E93]">
                          <span>{catStickersCount}+ Stickers</span>
                          <span className="w-1 h-1 rounded-full bg-[#333]" />
                          <span>{franCount} {franCount === 1 ? 'Franchise' : 'Franchises'}</span>
                        </div>
                      </div>

                      {/* Interactive browse arrow */}
                      <div className="w-10 h-10 rounded-full bg-[#1c1c1e] border border-[#2c2c2e] text-[#8E8E93] flex items-center justify-center transition-all duration-300 group-hover:bg-[#FF6A00] group-hover:border-[#FF6A00] group-hover:text-white group-hover:scale-110">
                        <ArrowRight className="w-4 h-4 stroke-[3.5]" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Custom Stickers Showcase */}
      <section className="py-20 border-t border-[#141414] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-2xl mx-auto mb-16 select-none">
            <span className="font-outfit text-xs font-black tracking-[3px] text-[#FF6A00] mb-3 uppercase block">
              Custom Prints
            </span>
            <h2 className="font-outfit text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 uppercase">
              Turn Anything Into A Sticker
            </h2>
            <p className="font-sans text-[#8E8E93] text-sm sm:text-base">
              Photos, Pets, Vehicles, Artwork & More
            </p>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-[#8E8E93] font-medium select-none">
              <span>📦 Flat ₹39 Shipping Across India</span>
              <span className="text-[#333]">|</span>
              <span>🚚 Free Shipping Above ₹199</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 text-left select-none">
            {[
              { icon: Camera, title: "Photos", desc: "Convert memories into custom stickers." },
              { icon: Heart, title: "Pets", desc: "Turn your pets into premium stickers." },
              { icon: Car, title: "Vehicles", desc: "Cars, bikes and custom rides." },
              { icon: Palette, title: "Artwork", desc: "Your designs and illustrations." }
            ].map((card, idx) => {
              const IconComponent = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#141414] border border-[#222222] rounded-3xl p-8 transition-colors duration-300 hover:border-[#FF6A00]/40 hover:bg-[#1A1A1A] group flex flex-col items-start"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#FF6A00]/10 border border-[#FF6A00]/20 text-[#FF6A00] flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110">
                    <IconComponent className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <h3 className="font-outfit text-lg font-bold text-white mb-2 uppercase tracking-wide">
                    {card.title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#8E8E93] leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <Link
            href="/custom-stickers"
            className="inline-flex items-center gap-2 border border-[#FF6A00] text-[#FF6A00] hover:bg-[#FF6A00] hover:text-white font-outfit text-sm font-bold px-8 py-4 rounded-xl transition-all duration-300 active:scale-95 uppercase hover:shadow-lg hover:shadow-[#FF6A00]/10"
          >
            Create Custom Stickers →
          </Link>
        </div>
      </section>

      {/* Mystery Pack Showcase */}
      {mysteryPack && (
        <section className="py-20 border-t border-[#141414] relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="relative bg-[#141414] border border-[#222222] rounded-3xl p-8 md:p-12 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {/* Corner accent */}
              <div className="absolute top-0 left-0 w-0 h-0 border-t-[40px] border-l-[40px] border-t-[#0D0D0D] border-l-[#0D0D0D] border-r-transparent border-b-transparent z-10" />

              <div className="flex flex-col items-start text-left z-10 max-w-xl">
                <span className="bg-[#FF6A00]/10 border border-[#FF6A00]/25 text-[#FF6A00] font-outfit text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
                  🎁 Surprise Inside
                </span>
                <h2 className="font-outfit text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 uppercase">
                  Mystery Sticker Packs
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#8E8E93] leading-relaxed mb-6">
                  Every pack contains a surprise collection of original PeelLab stickers.
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8 select-none">
                  {["Anime", "Gaming", "Coding", "Memes", "Surprise Extras"].map((tag) => (
                    <span
                      key={tag}
                      className="bg-[#0D0D0D] border border-[#222222] text-white font-sans text-[11px] px-3.5 py-1.5 rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-1.5 mb-8">
                  <span className="font-outfit text-4xl font-black text-white">₹99</span>
                  <div className="flex flex-col gap-1 text-xs text-[#8E8E93] font-medium mt-1 select-none">
                    <span>📦 Flat ₹39 Shipping Across India</span>
                    <span>🚚 Free Shipping Above ₹199</span>
                  </div>
                </div>

                <Link
                  href="/mystery-pack"
                  className="inline-flex items-center gap-2 bg-[#FF6A00] hover:bg-[#E05D00] text-white font-outfit text-sm font-extrabold px-8 py-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5 active:scale-95 uppercase shadow-lg shadow-[#FF6A00]/25"
                >
                  Explore Mystery Packs →
                </Link>
              </div>

              {/* Mockup Image */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center z-10">
                <img
                  src={mysteryPack.image}
                  alt="Mystery Pack"
                  className="max-w-full max-h-full object-contain drop-shadow-[4px_8px_16px_rgba(0,0,0,0.6)] hover:scale-105 transition-transform duration-500 ease-out select-none"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured/Results Section */}
      <section ref={shopRef} id="shop" className="py-20 border-t border-[#141414]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-outfit text-xl sm:text-2xl font-black tracking-wide text-white uppercase">
              {searchQuery.trim()
                ? `SEARCH RESULTS FOR "${searchQuery}"`
                : "FEATURED STICKERS"}
            </h2>
            {searchQuery.trim() && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveTag("");
                }}
                className="group flex items-center gap-1.5 text-[#FF6A00] hover:text-[#E05D00] font-outfit text-sm font-bold transition-all"
              >
                Clear Filters
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {displayedStickers.map((sticker) => (
              <StickerCard key={sticker.id} sticker={sticker} />
            ))}
          </div>

          {displayedStickers.length === 0 && (
            <div className="text-center py-16 bg-[#141414]/30 border border-[#222222] rounded-2xl p-8">
              <p className="text-[#8E8E93] text-lg mb-4">No stickers match your query.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveTag("");
                }}
                className="bg-[#FF6A00] hover:bg-[#E05D00] text-white font-outfit text-sm font-extrabold px-6 py-3 rounded-lg transition-colors"
              >
                View Featured Stickers
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Returns & Replacements Section */}
      <section className="py-20 border-t border-[#141414] bg-[#0D0D0D] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[#141414] border border-[#222222] rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Subtle background glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FF6A00]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-12 relative z-10">
              {/* Left Side: Policy Copy */}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#FF6A00]/10 border border-[#FF6A00]/25 text-[#FF6A00] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <span className="font-outfit text-xs font-black tracking-[2px] text-[#FF6A00] uppercase block">
                      Shop with confidence
                    </span>
                    <h2 className="font-outfit text-2xl sm:text-3xl font-black text-white uppercase tracking-wide">
                      Returns & Replacements
                    </h2>
                  </div>
                </div>
                
                <p className="font-sans text-[#8E8E93] text-sm leading-relaxed mb-4">
                  Due to the nature of stickers and custom-made products, we do not accept returns or exchanges once shipped.
                </p>
                <p className="font-sans text-xs text-[#8E8E93]/80 leading-relaxed">
                  However, if your order arrives damaged, defective, or incorrect, please contact us within 48 hours of delivery with clear photos. We&apos;ll review the problem and provide a replacement if necessary.
                </p>
              </div>

              {/* Right Side: Trust Feature Badges */}
              <div className="flex-1 w-full grid grid-cols-2 gap-3.5 select-none">
                {[
                  { title: "Wrong item received", desc: "Correct items sent free of cost." },
                  { title: "Damaged during delivery", desc: "Replaced immediately." },
                  { title: "Printing defects", desc: "Flawless prints guaranteed." },
                  { title: "Missing items", desc: "Sent out via express courier." }
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className="bg-[#0D0D0D] border border-[#222222] p-4 rounded-2xl flex flex-col justify-between min-h-[90px] hover:border-[#FF6A00]/20 transition-colors duration-300"
                  >
                    <span className="text-[#FF6A00] text-xs font-bold font-outfit tracking-wide flex items-center gap-1.5 uppercase">
                      ✓ {item.title}
                    </span>
                    <span className="text-[10px] text-[#8E8E93] leading-normal mt-1.5 font-medium">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-[#0D0D0D]/90 backdrop-blur-md border-t border-[#222222] md:hidden">
        <button
          onClick={() => {
            searchRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          className="w-full bg-[#FF6A00] hover:bg-[#E05D00] text-white font-outfit text-sm font-black tracking-wider py-3.5 px-6 rounded-xl active:scale-95 transition-all duration-300 uppercase flex items-center justify-center gap-2"
        >
          <span>Build Your Pack</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>
      </div>
    </div>
  );
}

