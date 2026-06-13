"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getFranchisesByCategory } from "@/data/categories";
import { getStickersByCategory } from "@/lib/stickers";
import StickerCard from "@/components/sticker-card";
import { motion } from "framer-motion";
import { Sparkles, Gamepad2, Film, Terminal, Zap, Gauge, Package, Layers } from "lucide-react";
import { useCart } from "@/context/cart-context";

const categoryIconMap: Record<string, React.ComponentType<any>> = {
  anime: Sparkles,
  gaming: Gamepad2,
  shows: Film,
  coding: Terminal,
  memes: Zap,
  cars: Gauge,
};

const BUNDLES = [
  {
    id: "bundle-3-pack",
    name: "3 Sticker Pack",
    price: 49,
    category: "bundle",
    franchise: "bundle",
    originalPrice: 57,
    savings: "14%",
    badge: "MOST POPULAR"
  },
  {
    id: "bundle-5-pack",
    name: "5 Sticker Pack",
    price: 79,
    category: "bundle",
    franchise: "bundle",
    originalPrice: 95,
    savings: "17%",
    badge: "BEST VALUE"
  },
  {
    id: "bundle-10-pack",
    name: "10 Sticker Pack",
    price: 149,
    category: "bundle",
    franchise: "bundle",
    originalPrice: 190,
    savings: "22%",
    badge: "COLLECTOR PACK"
  }
];

export default function CategoryPage() {
  const params = useParams();
  const slug = params.category as string;
  const { addItem, setIsOpen } = useCart();

  const category = getCategoryBySlug(slug);
  if (!category) return notFound();

  const stickers = getStickersByCategory(slug);
  const franchiseList = getFranchisesByCategory(slug);

  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-[#8E8E93] mb-8">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-white transition-colors">Collections</Link>
          <span>/</span>
          <span className="text-white">{category.label}</span>
        </nav>

        {/* Category Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12"
        >
          <div className="w-20 h-20 rounded-2xl bg-[#141414] border border-[#222] flex items-center justify-center shadow-lg" style={{ backgroundColor: category.vibeColor }}>
            <img
              src={stickers[0]?.image || "/stickers/sticker_gojo.png"}
              alt={category.label}
              className="w-14 h-14 object-contain"
            />
          </div>
          <div className="flex flex-col justify-center gap-2">
            <div className="flex items-center gap-3">
              {(() => {
                const IconComponent = categoryIconMap[category.slug];
                return IconComponent ? (
                  <IconComponent className="w-8 h-8 text-white opacity-40 stroke-[1.5]" />
                ) : null;
              })()}
              <h1 className="font-outfit text-4xl md:text-5xl font-black tracking-tight uppercase">
                {category.label}
              </h1>
            </div>
            <p className="text-[#8E8E93] text-lg">{category.description}</p>
          </div>
        </motion.div>

        {/* Franchise Filter Chips */}
        {franchiseList.length > 1 && (
          <div className="flex flex-wrap gap-3 mb-10">
            {franchiseList.map((fr) => (
              <Link
                key={fr.slug}
                href={`/franchise/${fr.slug}`}
                className="border border-[#222] text-[#8E8E93] rounded-full px-5 py-2.5 text-sm font-outfit font-bold transition-all hover:text-white hover:border-[#333] hover:bg-white/[0.02]"
              >
                {fr.label}
              </Link>
            ))}
          </div>
        )}

        {/* Sticker Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5"
        >
          {stickers.map((sticker, i) => (
            <motion.div
              key={sticker.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <StickerCard sticker={sticker} />
            </motion.div>
          ))}
        </motion.div>

        {stickers.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#8E8E93] text-lg mb-4">No stickers found in this category yet.</p>
            <Link href="/categories" className="text-[#FF6A00] font-outfit font-bold hover:underline">
              Browse other collections →
            </Link>
          </div>
        )}

        {/* Build Your Sticker Pack CTA Section */}
        <section className="mt-24 border-t border-[#222] pt-16">
          <div className="text-center mb-12">
            <span className="font-outfit text-xs font-black tracking-[2px] text-[#FF6A00] mb-3 uppercase block">
              Bundle & Save
            </span>
            <h2 className="font-outfit text-3xl font-black tracking-tight text-white uppercase">
              Build Your Sticker Pack
            </h2>
            <p className="text-[#8E8E93] text-sm mt-2 max-w-md mx-auto">
              Save up to 49% compared to individual sticker purchases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BUNDLES.map((bundle) => (
              <div
                key={bundle.id}
                className="bg-[#141414] border border-[#222] p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group hover:border-[#FF6A00]/30 transition-all duration-300 hover:shadow-lg"
              >
                {/* Badge overlay */}
                <div className="absolute top-4 right-4 bg-[#FF6A00]/10 border border-[#FF6A00]/25 text-[#FF6A00] font-outfit text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full select-none">
                  {bundle.badge}
                </div>

                <div className="flex flex-col gap-4">
                  {/* Icon Representation */}
                  <div className="h-24 w-full bg-[#0D0D0D] border border-[#222]/50 rounded-2xl flex items-center justify-center text-[#8E8E93] group-hover:text-[#FF6A00] group-hover:border-[#FF6A00]/20 transition-all duration-300">
                    {bundle.id === "bundle-3-pack" ? (
                      <Package size={36} />
                    ) : bundle.id === "bundle-5-pack" ? (
                      <Layers size={36} />
                    ) : (
                      <Sparkles size={36} />
                    )}
                  </div>

                  <div>
                    <h3 className="font-outfit text-lg font-black text-white uppercase tracking-wide">
                      {bundle.name}
                    </h3>
                    <p className="text-[#8E8E93] text-xs mt-1 leading-relaxed">
                      Curate any {bundle.id === "bundle-3-pack" ? "3" : bundle.id === "bundle-5-pack" ? "5" : "10"} stickers from our collections.
                    </p>
                  </div>

                  {/* Pricing Psychology Display */}
                  <div className="flex flex-col mt-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[#8E8E93] text-sm font-bold line-through font-outfit">₹{bundle.originalPrice}</span>
                      <span className="text-white text-2xl font-black font-outfit">₹{bundle.price}</span>
                      <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-outfit text-[10px] font-black uppercase tracking-wide px-2.5 py-0.5 rounded select-none">
                        Save {bundle.savings}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    addItem({
                      id: bundle.id,
                      name: bundle.name,
                      price: bundle.price,
                      category: bundle.category,
                      franchise: bundle.franchise,
                      image: stickers[0]?.image || "/stickers/sticker_gojo.png" // Fallback to first sticker image in collection
                    });
                    setIsOpen(true); // open cart drawer
                  }}
                  className="w-full mt-6 bg-[#FF6A00] hover:bg-[#E05D00] text-white font-outfit text-xs font-black uppercase py-4 rounded-xl transition-all duration-300 hover:shadow-md cursor-pointer active:scale-98"
                >
                  Add Pack To Cart
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
