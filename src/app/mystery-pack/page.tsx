"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, CheckCircle, HelpCircle, Package, Shield, Sparkles } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { getMysteryPack } from "@/lib/stickers";

const FAQS = [
  {
    question: "What is in the Mystery Pack?",
    answer: "Each Mystery Pack contains 8 to 10 randomly selected stickers from our main collections: Anime stickers, Gaming stickers, Shows & Movies stickers, Coding stickers, and Meme stickers.",
  },
  {
    question: "How do I place an order?",
    answer: "Add items to your cart on this website and click 'ORDER VIA INSTAGRAM'. This copies your order summary to your clipboard and opens our Instagram profile. Paste the summary into our DMs to complete your order.",
  },
  {
    question: "Can I choose the specific stickers in my pack?",
    answer: "Mystery Packs are curated with a random selection of stickers from our collections. If you want specific designs, you can select and order individual stickers from our catalog instead.",
  },
  {
    question: "What are your shipping rates and delivery times?",
    answer: "We charge a flat ₹39 shipping fee across India for all orders below ₹199. Orders of ₹199 or above qualify for FREE shipping! Shipping is applied once per order, never per sticker.",
  },
  {
    question: "Are the stickers durable?",
    answer: "Yes, our stickers are water-resistant and easy to peel off without leaving sticky residue, making them suitable for laptops, water bottles, and notebooks.",
  },
  {
    question: "Can I return my stickers?",
    answer: "Since stickers are custom and made-to-order products, returns and exchanges are not accepted. If your order arrives damaged, defective, or incorrect, contact us within 48 hours and we'll help resolve the issue.",
  },
];

export default function MysteryPackPage() {
  const { addItem } = useCart();
  const mysteryPack = getMysteryPack();

  if (!mysteryPack) {
    return (
      <main className="min-h-screen pt-28 pb-20 flex items-center justify-center">
        <p className="text-[#8E8E93] text-lg">Mystery Pack data not found.</p>
      </main>
    );
  }

  const handleAddToCart = () => {
    addItem(mysteryPack);
  };

  return (
    <main className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-[#8E8E93] mb-10">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">Mystery Pack</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center mb-20">
          {/* Visual Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative bg-[#141414] border border-[#222222] rounded-3xl p-6 md:p-8 flex items-center justify-center min-h-[450px] md:min-h-[520px] overflow-hidden"
            style={{ background: "linear-gradient(135deg, #141414 0%, rgba(255,106,0,0.03) 100%)" }}
          >
            {/* Background glows */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#FF6A00]/5 rounded-full blur-3xl" />
            </div>

            {/* Corner peel accent */}
            <div className="absolute top-0 left-0 w-0 h-0 border-t-[40px] border-l-[40px] border-t-[#0D0D0D] border-l-[#0D0D0D] border-r-transparent border-b-transparent" />

            <Image
              src={mysteryPack.image}
              alt="PeelLab Mystery Pack Bag"
              width={480}
              height={480}
              className="relative z-10 object-contain scale-110 md:scale-120 hover:scale-125 hover:rotate-2 transition-transform duration-500 drop-shadow-[6px_12px_24px_rgba(0,0,0,0.6)]"
              priority
            />
          </motion.div>

          {/* Info Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col text-left"
          >
            <span className="bg-[#FF6A00]/10 border border-[#FF6A00]/25 text-[#FF6A00] font-outfit text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4 select-none w-fit">
              🎁 Surprise Inside
            </span>

            <h1 className="font-outfit text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 text-white uppercase">
              MYSTERY <span className="text-[#FF6A00]">PACK</span>
            </h1>

            <p className="text-[#8E8E93] text-base mb-6 leading-relaxed">
              Curate the ultimate sticker bundle! Each PeelLab Mystery Pack contains 10 randomly chosen premium die-cut stickers from our catalog. Perfect for upgrading your laptop, phone, tablet, and desk setup. Save over 50% compared to buying stickers individually!
            </p>

            {/* Value Highlights */}
            <div className="flex flex-col gap-0.5 mb-6 select-none">
              <span className="text-[#FF6A00] font-outfit text-xs font-black uppercase tracking-wider">
                10 Curated Stickers
              </span>
              <span className="text-[#8E8E93] font-outfit text-sm font-bold">
                Worth ₹190+
              </span>
            </div>

            {/* Price section */}
            <div className="flex flex-col gap-2.5 mb-8">
              <div className="flex items-baseline gap-3">
                <span className="font-outfit text-xl font-bold text-[#8E8E93] line-through">₹110</span>
                <span className="font-outfit text-4xl font-black text-white">₹99</span>
                <span className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-outfit text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded select-none ml-2">
                  Save ₹11
                </span>
              </div>
              <div className="text-[#FF6A00] font-outfit text-xs font-black uppercase tracking-widest mt-1 select-none">
                Limited Drop • While Stocks Last
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-3 bg-[#FF6A00] hover:bg-[#E05D00] text-white font-outfit text-base font-extrabold py-4 px-8 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#FF6A00]/30 w-full md:w-auto active:scale-95"
            >
              <ShoppingCart size={20} />
              ADD TO CART
            </button>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-4 mt-10 pt-8 border-t border-[#222222]">
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-[#FF6A00]" />
                <span className="text-[#8E8E93] text-sm font-medium">8–10 Random Stickers</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-[#FF6A00]" />
                <span className="text-[#8E8E93] text-sm font-medium">Premium Matte Quality</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-[#FF6A00]" />
                <span className="text-[#8E8E93] text-sm font-medium">100% Water Resistant</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle size={18} className="text-[#FF6A00]" />
                <span className="text-[#8E8E93] text-sm font-medium">High Resolution Print</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Curation Value Grid */}
        <section className="py-12 border-t border-[#222222]/50 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#141414] border border-[#222222] rounded-2xl p-6 text-center flex flex-col items-center">
              <Package className="w-8 h-8 text-[#FF6A00] mb-4" />
              <h3 className="font-outfit font-bold text-white mb-2 text-base">Perfect Gift</h3>
              <p className="text-[#8E8E93] text-xs leading-relaxed max-w-[200px]">
                An amazing mystery box experience for friends, family, or developers!
              </p>
            </div>
            <div className="bg-[#141414] border border-[#222222] rounded-2xl p-6 text-center flex flex-col items-center">
              <Sparkles className="w-8 h-8 text-[#FF6A00] mb-4" />
              <h3 className="font-outfit font-bold text-white mb-2 text-base">Vibrant Selection</h3>
              <p className="text-[#8E8E93] text-xs leading-relaxed max-w-[200px]">
                Handpicked designs featuring high resolution prints and punchy hues.
              </p>
            </div>
            <div className="bg-[#141414] border border-[#222222] rounded-2xl p-6 text-center flex flex-col items-center">
              <Shield className="w-8 h-8 text-[#FF6A00] mb-4" />
              <h3 className="font-outfit font-bold text-white mb-2 text-base">Zero Sticky Mess</h3>
              <p className="text-[#8E8E93] text-xs leading-relaxed max-w-[200px]">
                Removes cleanly without leaving residues on laptop or phone surfaces.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="max-w-3xl mx-auto py-8">
          <div className="text-center mb-10">
            <HelpCircle className="w-10 h-10 text-[#FF6A00] mx-auto mb-3" />
            <h2 className="font-outfit text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#141414] border border-[#222222] rounded-2xl p-6 text-left"
              >
                <h4 className="font-outfit font-bold text-white text-base mb-2">
                  {faq.question}
                </h4>
                <p className="font-sans text-[#8E8E93] text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
