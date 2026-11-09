import type { Metadata } from "next";
import { Hind_Siliguri, Geist_Mono } from "next/font/google";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "আপনার বাইকের নম্বরে বাংলা ফ্রন্ট নম্বর প্লেট - বাইকপ্লেট বিডি",
  description:
    "উন্নত মানের রিফ্লেক্টিভ ও ওয়াটারপ্রুফ অ্যাক্রিলিক বাংলা নম্বর প্লেট। ১০০ টাকা অগ্রিম পেমেন্টে ৩০% নিশ্চিত ছাড় ও সারাদেশে ক্যাশ অন ডেলিভারি।",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="bn"
      className={`${hindSiliguri.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-neutral-950 text-neutral-100">
        {children}
      </body>
    </html>
  );
}
