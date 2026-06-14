"use client";

const TRUST_ITEMS = [
  {
    emoji: "💎",
    title: "Premium Quality Stickers",
    subtitle: "Vibrant colors that last",
  },
  {
    emoji: "💧",
    title: "Water Resistant & Durable",
    subtitle: "Built to withstand the elements",
  },
  {
    emoji: "🧼",
    title: "Easy to Peel & Stick",
    subtitle: "Residue-free application",
  },
  {
    emoji: "📦",
    title: "Fast & Safe Packaging",
    subtitle: "Delivered in perfect condition",
  },
  {
    emoji: "❤️",
    title: "Made with ❤️ in India",
    subtitle: "Crafted with passion",
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-[#222222]">
      {/* Trust Bar */}
      <div className="bg-[#141414]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center text-center gap-2"
              >
                <span className="text-2xl" role="img" aria-label={item.title}>
                  {item.emoji}
                </span>
                <h4 className="font-outfit font-bold text-white text-[14px] leading-tight">
                  {item.title}
                </h4>
                <p className="font-sans text-[#8E8E93] text-[11px] leading-snug">
                  {item.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="py-6 pb-24 md:pb-6 text-center">
        <p className="text-[#8E8E93] text-xs font-sans">
          © 2026 PEEL LAB. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
