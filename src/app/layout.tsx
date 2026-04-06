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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yosuke-kiddy.com";

export const metadata: Metadata = {
  title: "伊藤陽介 通夜・告別式のご案内",
  description:
    "伊藤陽介（1988-2026）の通夜・告別式のご案内ページです。ご参列・メッセージの受付を行っています。",
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "伊藤陽介 通夜・告別式のご案内",
    description:
      "伊藤陽介（1988-2026）の通夜・告別式のご案内ページです。ご参列・メッセージの受付を行っています。",
    type: "website",
    locale: "ja_JP",
    url: siteUrl,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "伊藤陽介 通夜・告別式のご案内",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "伊藤陽介 通夜・告別式のご案内",
    description:
      "伊藤陽介（1988-2026）の通夜・告別式のご案内ページです。ご参列・メッセージの受付を行っています。",
    images: ["/og-image.png"],
  },
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/favicon.ico",
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
