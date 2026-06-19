import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import CartDrawer from "@/components/cart-drawer";
import FloatingCart from "@/components/floating-cart";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://peellab-in.netlify.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "PeelLab | Premium Anime, Gaming & Custom Stickers",
  description: "Premium stickers for anime, gaming, coding, cars, memes and custom designs. Build your own sticker pack or create custom stickers with PeelLab.",
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "googlede6c4c38bee5a2b2",
  },
  openGraph: {
    title: "PeelLab | Premium Anime, Gaming & Custom Stickers",
    description: "Premium stickers for anime, gaming, coding, cars, memes and custom designs. Build your own sticker pack or create custom stickers with PeelLab.",
    url: siteUrl,
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
    title: "PeelLab | Premium Anime, Gaming & Custom Stickers",
    description: "Premium stickers for anime, gaming, coding, cars, memes and custom designs. Build your own sticker pack or create custom stickers with PeelLab.",
    images: ["/stickers/hero_collage.png"],
  },
};

export const viewport = {
  themeColor: "#FF6A00",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "PeelLab",
              "url": siteUrl,
              "logo": `${siteUrl}/logo.png`,
              "description": "Premium stickers and custom sticker packs.",
            }),
          }}
        />
      </head>
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

