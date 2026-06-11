"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getFranchiseBySlug, getFranchisesByCategory } from "@/data/categories";
import { getStickersByFranchise } from "@/lib/stickers";
import StickerCard from "@/components/sticker-card";
import { motion } from "framer-motion";

export default function FranchisePage() {
  const params = useParams();
  const franchiseSlug = params.franchise as string;

  const franchise = getFranchiseBySlug(franchiseSlug);
  if (!franchise) return notFound();

  const categorySlug = franchise.category;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return notFound();

  const stickers = getStickersByFranchise(franchiseSlug);
  const relatedFranchises = getFranchisesByCategory(categorySlug).filter(
    (f) => f.slug !== franchiseSlug
  );

  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-[#8E8E93] mb-8 flex-wrap">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/category/${categorySlug}`} className="hover:text-white transition-colors">{category.label}</Link>
          <span>/</span>
          <span className="text-white">{franchise.label}</span>
        </nav>

        {/* Franchise Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="font-outfit text-4xl md:text-5xl font-black tracking-tight mb-3">
            {franchise.label.toUpperCase()}
          </h1>
          <p className="text-[#8E8E93] text-lg mb-1">{franchise.description}</p>
          <p className="text-[#8E8E93] text-sm">{stickers.length} stickers available</p>
        </motion.div>

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
            <p className="text-[#8E8E93] text-lg mb-4">No stickers found for this franchise yet.</p>
            <Link href={`/category/${categorySlug}`} className="text-[#FF6A00] font-outfit font-bold hover:underline">
              Back to {category.label} →
            </Link>
          </div>
        )}

        {/* Related Franchises */}
        {relatedFranchises.length > 0 && (
          <div className="mt-20">
            <h2 className="font-outfit text-2xl font-black tracking-tight mb-6">
              MORE IN {category.label.toUpperCase()}
            </h2>
            <div className="flex flex-wrap gap-3">
              {relatedFranchises.map((fr) => (
                <Link
                  key={fr.slug}
                  href={`/franchise/${fr.slug}`}
                  className="bg-[#141414] border border-[#222] rounded-xl px-6 py-4 transition-all hover:-translate-y-1 hover:border-[#333] hover:shadow-lg hover:shadow-black/30"
                >
                  <h3 className="font-outfit font-bold text-white mb-1">{fr.label}</h3>
                  <p className="text-[#8E8E93] text-xs">{fr.description}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
