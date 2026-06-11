"use client";

import { Search } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  SearchInput                                                        */
/* ------------------------------------------------------------------ */

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search stickers…",
  autoFocus = false,
}: SearchInputProps) {
  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-peel-grey"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full rounded-xl border border-[#222] bg-[#141414] py-4 pl-14 pr-5 font-sans text-base text-white placeholder:text-peel-grey transition-all duration-200 focus:border-[#FF6A00] focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/15"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SuggestionTags                                                     */
/* ------------------------------------------------------------------ */

const SUGGESTION_TAGS = [
  "gojo",
  "levi",
  "breaking bad",
  "gta",
  "minecraft",
  "naruto",
  "doge",
] as const;

interface SuggestionTagsProps {
  activeTag: string | null;
  onTagClick: (tag: string) => void;
}

export function SuggestionTags({ activeTag, onTagClick }: SuggestionTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {SUGGESTION_TAGS.map((tag) => {
        const isActive = activeTag === tag;
        return (
          <button
            key={tag}
            onClick={() => onTagClick(tag)}
            className={`rounded-full px-4 py-2 text-sm capitalize transition-all duration-200 ${
              isActive
                ? "border border-[#FF6A00] bg-[#FF6A00] text-white"
                : "border border-[#222] text-peel-grey hover:border-[#333] hover:text-white"
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
}
