import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Crave - Premium Food Delivery",
  description: "Order the best artisan food delivered to your door.",
};

import { Header } from "@/components/Header";
import { FloatingCartButton } from "@/components/FloatingCartButton";
import { CheckoutModal } from "@/components/CheckoutModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="min-h-screen pt-4 pb-24 md:pb-4">
          {children}
        </main>
        <FloatingCartButton />
        <CheckoutModal />
      </body>
    </html>
  );
}
