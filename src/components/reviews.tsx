"use client";

import { Star, ShieldCheck } from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

// Prepare component structure only, do not display fake reviews.
// This component returns null when the reviews list is empty, keeping it hidden.
export default function Reviews() {
  const reviews: Review[] = [
    // Future reviews data:
    // {
    //   id: "1",
    //   name: "Rahul S.",
    //   rating: 5,
    //   comment: "Stickers are super high quality, waterproof and look amazing on my laptop!",
    //   date: "June 2026",
    //   verified: true
    // }
  ];

  if (reviews.length === 0) return null;

  return (
    <section className="py-20 border-t border-[#141414] bg-[#0A0A0A] select-none">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-outfit text-xs font-black tracking-[3px] text-[#FF6A00] mb-3 uppercase block">
            TESTIMONIALS
          </span>
          <h2 className="font-outfit text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 uppercase">
            Customer Reviews
          </h2>
          <p className="font-sans text-[#8E8E93] text-sm sm:text-base">
            What our community says about PeelLab stickers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#141414] border border-[#222222] rounded-3xl p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 mb-4 text-[#FF6A00]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 fill-current ${
                        i < review.rating ? "text-[#FF6A00]" : "text-[#333]"
                      }`}
                    />
                  ))}
                </div>
                <p className="font-sans text-sm text-[#8E8E93] leading-relaxed italic mb-6">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </div>
              
              <div className="flex items-center justify-between border-t border-[#222]/40 pt-4 mt-auto">
                <div>
                  <h4 className="font-outfit text-sm font-bold text-white uppercase tracking-wide">
                    {review.name}
                  </h4>
                  <span className="text-[10px] text-[#8E8E93] font-medium">{review.date}</span>
                </div>
                {review.verified && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
