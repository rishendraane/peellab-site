import { Category, Franchise } from "@/types/sticker";
import catalogData from "./catalog.json";

// Standard category metadata
const CATEGORY_META: Record<string, { label: string; icon: string; description: string; vibeColor: string }> = {
  anime: {
    label: "Anime",
    icon: "",
    description: "Premium die-cut stickers from your favorite anime series",
    vibeColor: "rgba(255, 60, 60, 0.05)"
  },
  gaming: {
    label: "Gaming",
    icon: "",
    description: "Level up your gear with gaming stickers",
    vibeColor: "rgba(60, 60, 255, 0.05)"
  },
  shows: {
    label: "Shows & Movies",
    icon: "",
    description: "Iconic moments from the best shows and movies",
    vibeColor: "rgba(60, 255, 60, 0.05)"
  },
  coding: {
    label: "Coding",
    icon: "",
    description: "For developers who speak in code",
    vibeColor: "rgba(255, 255, 255, 0.03)"
  },
  memes: {
    label: "Memes",
    icon: "",
    description: "Internet culture in sticker form",
    vibeColor: "rgba(255, 200, 0, 0.05)"
  },
  cars: {
    label: "Cars",
    icon: "",
    description: "Vibrant automotive and racing culture stickers",
    vibeColor: "rgba(255, 106, 0, 0.05)"
  },
  other: {
    label: "Other",
    icon: "",
    description: "Miscellaneous premium stickers",
    vibeColor: "rgba(255, 255, 255, 0.03)"
  },
  uncategorized: {
    label: "Uncategorized",
    icon: "",
    description: "Uncategorized stickers",
    vibeColor: "rgba(255, 255, 255, 0.03)"
  }
};

// Standard franchise metadata descriptions
const FRANCHISE_DESCRIPTIONS: Record<string, string> = {
  "jujutsu-kaisen": "Cursed energy awaits",
  "attack-on-titan": "Dedicate your heart",
  "demon-slayer": "Breathe and slay",
  "naruto": "Believe it!",
  "one-piece": "Set sail for adventure",
  "breaking-bad": "Say my name",
  "fight-club": "First rule...",
  "marvel": "Assemble",
  "gta": "Welcome to the streets",
  "minecraft": "Mine and craft",
  "god-of-war": "BOY!"
};

// Map raw values to clean labels/titles
function cleanLabel(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Dynamically generate categories and franchises from catalog.json
export const categories: Category[] = (() => {
  const uniqueSlugs = new Set<string>();
  (catalogData as any[]).forEach((item: any) => {
    if (item.category && item.category !== "mystery") {
      uniqueSlugs.add(item.category);
    }
  });

  return Array.from(uniqueSlugs).map((slug) => {
    const meta = CATEGORY_META[slug] || {
      label: cleanLabel(slug),
      icon: "✨",
      description: `Premium stickers from our ${cleanLabel(slug)} collection`,
      vibeColor: "rgba(255, 255, 255, 0.03)"
    };
    return {
      slug,
      label: meta.label,
      icon: meta.icon,
      description: meta.description,
      count: `${(catalogData as any[]).filter((i: any) => i.category === slug).length}+`,
      vibeColor: meta.vibeColor
    };
  });
})();

export const franchises: Franchise[] = (() => {
  const uniqueKeys = new Map<string, { categorySlug: string; franchiseLabel: string }>();
  (catalogData as any[]).forEach((item: any) => {
    if (item.category && item.franchise && item.category !== "mystery") {
      const key = `${item.category}:${item.franchise}`;
      // Find a display name by checking display name format [Franchise] Sticker #...
      let label = cleanLabel(item.franchise);
      if (item.name && item.name.includes(" Sticker #")) {
        label = item.name.split(" Sticker #")[0];
      }
      uniqueKeys.set(key, { categorySlug: item.category, franchiseLabel: label });
    }
  });

  return Array.from(uniqueKeys.entries()).map(([key, info]) => {
    const [_, franchiseSlug] = key.split(":");
    return {
      slug: franchiseSlug,
      label: info.franchiseLabel,
      category: info.categorySlug,
      description: FRANCHISE_DESCRIPTIONS[franchiseSlug] || `Premium ${info.franchiseLabel} stickers`
    };
  });
})();

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getFranchiseBySlug(slug: string): Franchise | undefined {
  return franchises.find((f) => f.slug === slug);
}

export function getFranchisesByCategory(categorySlug: string): Franchise[] {
  return franchises.filter((f) => f.category === categorySlug);
}
