import { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/data/categories";
import { getStickersByCategory } from "@/lib/stickers";
import { Sparkles, Gamepad2, Film, Terminal, Zap, Gauge } from "lucide-react";

const categoryIconMap: Record<string, React.ComponentType<any>> = {
  anime: Sparkles,
  gaming: Gamepad2,
  shows: Film,
  coding: Terminal,
  memes: Zap,
  cars: Gauge,
};

export const metadata: Metadata = {
  title: "All Collections | PeelLab",
  description: "Browse all sticker collections — Anime, Gaming, Shows, Coding, Memes, and more.",
};

export default function CategoriesPage() {
  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="font-outfit text-4xl md:text-5xl font-black tracking-tight mb-4">
            ALL <span className="text-[#FF6A00]">COLLECTIONS</span>
          </h1>
          <p className="text-[#8E8E93] text-lg max-w-xl">
            Browse premium die-cut stickers across all categories. Every sticker is water-resistant, durable, and easy to peel.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const catStickers = getStickersByCategory(cat.slug);
            const count = catStickers.length;
            const previewImage = catStickers[0]?.image || "/stickers/sticker_gojo.png";
            return (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="group relative bg-[#141414] border border-[#222] rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[#333] hover:shadow-2xl hover:shadow-black/50"
              >
                {/* Peel corner */}
                <div className="absolute top-0 left-0 w-0 h-0 transition-all duration-300 group-hover:w-8 group-hover:h-8" style={{ background: "linear-gradient(135deg, #0D0D0D 30%, #2a2a2a 45%, #fff 49%, #888 51%, transparent 55%)" }} />

                {/* Vibe background */}
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundColor: cat.vibeColor }} />

                {/* Image */}
                <div className="relative w-24 h-24 mx-auto mb-8 transition-transform duration-400 group-hover:-translate-y-2 group-hover:rotate-[-8deg] group-hover:scale-110">
                  <img
                    src={previewImage}
                    alt={cat.label}
                    className="w-full h-full object-contain drop-shadow-[2px_4px_6px_rgba(0,0,0,0.5)]"
                  />
                </div>

                <div className="relative z-10">
                  <div className="mb-3">
                    {(() => {
                      const IconComponent = categoryIconMap[cat.slug];
                      return IconComponent ? (
                        <IconComponent className="w-6 h-6 text-white opacity-40 stroke-[1.5]" />
                      ) : null;
                    })()}
                  </div>
                  <h2 className="font-outfit text-2xl font-black tracking-tight mb-2">{cat.label.toUpperCase()}</h2>
                  <p className="text-[#8E8E93] text-sm mb-3">{cat.description}</p>
                  <span className="text-[#FF6A00] font-outfit font-bold text-sm">{count}+ Stickers →</span>
                </div>
              </Link>
            );
          })}

          {/* Mystery Packs Card */}
          <Link
            href="/mystery-pack"
            className="group relative bg-[#141414] border border-[#222] rounded-2xl p-8 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-[#333] hover:shadow-2xl hover:shadow-black/50"
            style={{ background: "linear-gradient(135deg, #141414 0%, rgba(255,106,0,0.05) 100%)" }}
          >
            <div className="relative w-24 h-24 mx-auto mb-8 transition-transform duration-400 group-hover:-translate-y-2 group-hover:rotate-[4deg] group-hover:scale-110">
              <img
                src="/stickers/mystery_pack.png"
                alt="Mystery Pack"
                className="w-full h-full object-contain drop-shadow-[2px_4px_6px_rgba(0,0,0,0.5)]"
              />
            </div>
            <div className="relative z-10">
              <span className="text-2xl mb-2 block">🎁</span>
              <h2 className="font-outfit text-2xl font-black tracking-tight mb-2">MYSTERY PACKS</h2>
              <p className="text-[#8E8E93] text-sm mb-3">8–10 curated random stickers in every pack</p>
              <span className="text-[#FF6A00] font-outfit font-bold text-sm">₹99 each →</span>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
