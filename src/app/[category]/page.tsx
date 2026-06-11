"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getFranchisesByCategory } from "@/data/categories";
import { getStickersByCategory } from "@/lib/stickers";
import StickerCard from "@/components/sticker-card";
import { motion } from "framer-motion";
import { Sparkles, Gamepad2, Film, Terminal, Zap, Gauge } from "lucide-react";

const categoryIconMap: Record<string, React.ComponentType<any>> = {
  anime: Sparkles,
  gaming: Gamepad2,
  shows: Film,
  coding: Terminal,
  memes: Zap,
  cars: Gauge,
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.category as string;

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
          <div className="w-20 h-20 rounded-2xl bg-[#141414] border border-[#222] flex items-center justify-center" style={{ backgroundColor: category.vibeColor }}>
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
      </div>
    </main>
  );
}
