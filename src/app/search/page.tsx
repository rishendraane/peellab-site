"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search as SearchIcon, ArrowRight } from "lucide-react";
import { searchStickers } from "@/lib/stickers";
import StickerCard from "@/components/sticker-card";

const SUGGESTIONS = ["gojo", "levi", "breaking bad", "gta", "minecraft", "naruto", "doge"];

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);

  // Keep query local state synced with URL parameter change
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const results = searchStickers(query);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    // Update URL query parameter without resetting history
    const params = new URLSearchParams(window.location.search);
    if (newQuery) {
      params.set("q", newQuery);
    } else {
      params.delete("q");
    }
    router.replace(`/search?${params.toString()}`);
  };

  const handleSuggestionClick = (tag: string) => {
    const newQuery = query === tag ? "" : tag;
    setQuery(newQuery);
    const params = new URLSearchParams(window.location.search);
    if (newQuery) {
      params.set("q", newQuery);
    } else {
      params.delete("q");
    }
    router.replace(`/search?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-[#8E8E93] mb-8">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <span className="text-white">Search</span>
      </nav>

      <div className="mb-12 text-center md:text-left">
        <h1 className="font-outfit text-4xl md:text-5xl font-black tracking-tight mb-4">
          SEARCH <span className="text-[#FF6A00]">STICKERS</span>
        </h1>
        <p className="text-[#8E8E93] text-lg max-w-xl">
          Search over 500+ premium water-resistant stickers to style your tech.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="max-w-3xl mx-auto md:mx-0 mb-10">
        <div className="relative mb-6">
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-[#8E8E93] w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search 500+ stickers..."
            className="w-full pl-14 pr-6 py-4 bg-[#141414] border border-[#222222] rounded-xl text-white font-sans text-base outline-none transition-all duration-300 focus:border-[#FF6A00] focus:ring-4 focus:ring-[#FF6A00]/10 focus:bg-[#1A1A1A]"
            autoFocus
          />
        </div>

        {/* Suggestion tags */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {SUGGESTIONS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleSuggestionClick(tag)}
              className={`font-sans text-xs px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
                query === tag
                  ? "bg-[#FF6A00] border-[#FF6A00] text-white"
                  : "border-[#222222] text-[#8E8E93] hover:text-white hover:border-[#333333] hover:bg-white/[0.02]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="mb-8 border-b border-[#222222]/30 pb-4">
        <h2 className="font-outfit text-xl font-bold text-white uppercase tracking-wider">
          {query.trim()
            ? `Found ${results.length} ${results.length === 1 ? "Result" : "Results"} for "${query}"`
            : "All Stickers"}
        </h2>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {results.map((sticker) => (
          <StickerCard key={sticker.id} sticker={sticker} />
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-20 bg-[#141414]/20 border border-[#222222]/50 rounded-2xl p-8 max-w-xl mx-auto mt-10">
          <p className="text-[#8E8E93] text-lg mb-6">No stickers match your search query.</p>
          <button
            onClick={() => {
              setQuery("");
              const params = new URLSearchParams(window.location.search);
              params.delete("q");
              router.replace(`/search?${params.toString()}`);
            }}
            className="bg-[#FF6A00] hover:bg-[#E05D00] text-white font-outfit text-sm font-extrabold px-6 py-3 rounded-lg transition-colors"
          >
            Clear Search Filter
          </button>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="min-h-screen pt-28 pb-20">
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <p className="text-[#8E8E93] text-lg font-outfit animate-pulse">Loading search engine...</p>
        </div>
      }>
        <SearchResultsContent />
      </Suspense>
    </main>
  );
}
