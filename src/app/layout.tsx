import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import CartDrawer from "@/components/cart-drawer";
import FloatingCart from "@/components/floating-cart";

export const metadata: Metadata = {
  metadataBase: new URL('https://peellab.in'),
  title: "PeelLab | Premium Stickers for Every Vibe",
  description: "Get water-resistant, premium die-cut stickers for anime, gaming, coding, memes, and shows. Order directly via Instagram DM.",
  openGraph: {
    title: "PeelLab | Premium Stickers for Every Vibe",
    description: "Get water-resistant, premium die-cut stickers for anime, gaming, coding, memes, and shows. Order directly via Instagram DM.",
    url: "https://peellab.in",
    siteName: "PeelLab",
    images: [
      {
        url: "/stickers/hero_collage.png",
        width: 1200,
        height: 630,
        alt: "PeelLab Premium Stickers Collection",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PeelLab | Premium Stickers for Every Vibe",
    description: "Get water-resistant, premium die-cut stickers for anime, gaming, coding, memes, and shows. Order directly via Instagram DM.",
    images: ["/stickers/hero_collage.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <div className="site-peel" aria-hidden="true" />
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <FloatingCart />
        </CartProvider>
      </body>
    </html>
  );
}

