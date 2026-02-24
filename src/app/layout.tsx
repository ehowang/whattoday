import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "What To Eat Today? | Slot Machine Food Picker",
  description: "Spin the slot machine to decide what to eat! Add your favorite foods and let fate choose.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Abril+Fatface&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} bg-casino-darker text-white min-h-screen`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
