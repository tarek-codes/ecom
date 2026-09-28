import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/context/CartContext";
import { STORE_CONFIG } from "@/lib/constants/config";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${STORE_CONFIG.name} | Handmade Resin & Paper Crafts`,
    template: `%s | ${STORE_CONFIG.name}`,
  },
  description: STORE_CONFIG.description,
  keywords: [
    "resin craft",
    "paper craft",
    "handmade gifts",
    "resin keychains",
    "pressed flowers",
    "origami art",
    "resin coasters",
    "handcrafted decor",
  ],
  authors: [{ name: STORE_CONFIG.name }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: `${STORE_CONFIG.name} | Handmade Crafts`,
    description: STORE_CONFIG.description,
    type: "website",
    locale: "en_US",
    siteName: STORE_CONFIG.name,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#2D231E]">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
