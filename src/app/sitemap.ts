import { MetadataRoute } from "next";
import { getAllStickers } from "@/lib/stickers";
import { categories, franchises } from "@/data/categories";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://peellab-in.netlify.app";

  // 1. Static core routes
  const staticRoutes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/custom-stickers`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mystery-pack`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];

  // 2. Category routes (both under /category/slug and /[category] routes)
  const categoryRoutes = categories.flatMap((cat) => [
    {
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ]);

  // 3. Franchise routes (e.g. /[category]/[franchise])
  const franchiseRoutes = franchises.map((fran) => ({
    url: `${baseUrl}/${fran.category}/${fran.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // 4. Individual sticker routes (e.g. /sticker/[id])
  const stickers = getAllStickers();
  const stickerRoutes = stickers.map((sticker) => ({
    url: `${baseUrl}/sticker/${sticker.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...franchiseRoutes,
    ...stickerRoutes,
  ];
}
