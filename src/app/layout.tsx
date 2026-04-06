import type { Metadata } from "next";
import { Cormorant_Garamond, Klee_One } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const kleeOne = Klee_One({
  variable: "--font-klee",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "伊藤陽介 通夜・告別式のご案内",
  description:
    "故・伊藤陽介（1988.11.17 - 2026.04.03）の通夜・告別式のご案内、ご記帳ページです。",
  openGraph: {
    title: "伊藤陽介 通夜・告別式のご案内",
    description:
      "故・伊藤陽介（1988.11.17 - 2026.04.03）の通夜・告別式のご案内、ご記帳ページです。",
    type: "website",
    locale: "ja_JP",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${cormorant.variable} ${kleeOne.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
