import { Sticker } from "@/types/sticker";
import stickersData from "@/data/catalog.json";

const stickers: Sticker[] = stickersData as Sticker[];

export function getAllStickers(): Sticker[] {
  return stickers.filter((s) => s.category !== "mystery");
}

export function getStickerById(id: string): Sticker | undefined {
  return stickers.find((s) => s.id === id);
}

export function getStickersByCategory(category: string): Sticker[] {
  return stickers.filter((s) => s.category === category);
}

export function getStickersByFranchise(franchise: string): Sticker[] {
  return stickers.filter((s) => s.franchise === franchise);
}

export function getFeaturedStickers(): Sticker[] {
  return stickers.filter((s) => s.featured && s.category !== "mystery");
}

export function searchStickers(query: string): Sticker[] {
  const q = query.toLowerCase().trim();
  if (!q) return getAllStickers();
  return stickers.filter(
    (s) =>
      s.category !== "mystery" &&
      (s.name.toLowerCase().includes(q) ||
        s.franchise.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q))
  );
}

export function getRelatedStickers(sticker: Sticker, limit = 6): Sticker[] {
  const sameFranchise = stickers.filter(
    (s) => s.franchise === sticker.franchise && s.id !== sticker.id && s.category !== "mystery"
  );
  if (sameFranchise.length >= limit) return sameFranchise.slice(0, limit);

  const sameCategory = stickers.filter(
    (s) =>
      s.category === sticker.category &&
      s.id !== sticker.id &&
      s.category !== "mystery" &&
      !sameFranchise.find((sf) => sf.id === s.id)
  );
  return [...sameFranchise, ...sameCategory].slice(0, limit);
}

export function getMysteryPack(): Sticker {
  return stickers.find((s) => s.id === "mystery-pack")!;
}
