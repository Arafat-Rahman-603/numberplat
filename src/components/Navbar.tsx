"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, ShieldCheck, Menu, X, ShoppingCart, Truck } from "lucide-react";

export default function Navbar({
  hotlinePhone = "01700-000000",
  whatsappNumber = "+8801700000000",
  announcementText = "সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা | ১০০ টাকা অগ্রিম পেমেন্টে নিশ্চিত ৩০% ছাড়!",
}: {
  hotlinePhone?: string;
  whatsappNumber?: string;
  announcementText?: string;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-md">
      {/* Top Announcement Bar */}
      <div className="bg-amber-400 text-neutral-950 px-4 py-2 text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2">
        <span>{announcementText}</span>
      </div>

      {/* Main Navbar */}
      <nav className="bg-neutral-950/95 backdrop-blur-md border-b border-neutral-800 text-white px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-neutral-950 font-black flex items-center justify-center shadow-lg group-hover:scale-105 transition">
              <span className="text-xl leading-none">ব</span>
            </div>
            <div>
              <div className="font-extrabold text-base sm:text-lg leading-tight tracking-tight flex items-center gap-1.5">
                <span>বাইকপ্লেট</span>
                <span className="text-amber-400">বিডি</span>
              </div>
              <p className="text-[10px] text-neutral-400 leading-none">প্রিমিয়াম বাইক নম্বর প্লেট</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-7 text-xs font-semibold text-neutral-300">
            <button
              onClick={() => scrollToSection("features")}
              className="hover:text-amber-400 transition"
            >
              সুবিধাসমূহ
            </button>
            <button
              onClick={() => scrollToSection("specs")}
              className="hover:text-amber-400 transition"
            >
              স্পেসিফিকেশন
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className="hover:text-amber-400 transition"
            >
              গ্যালারি
            </button>
            <button
              onClick={() => scrollToSection("customizer")}
              className="hover:text-amber-400 transition text-amber-400 font-bold"
            >
              প্লেট তৈরি করুন
            </button>
            <button
              onClick={() => scrollToSection("videos")}
              className="hover:text-amber-400 transition"
            >
              ভিডিও রিভিউ
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="hover:text-amber-400 transition"
            >
              প্রশ্নোত্তর
            </button>
            <Link
              href="/track-order"
              className="hover:text-amber-400 transition flex items-center gap-1 text-neutral-400"
            >
              <Truck className="w-3.5 h-3.5" />
              ট্র্যাকিং
            </Link>
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${hotlinePhone}`}
              className="text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-neutral-800 hover:border-neutral-700 transition"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono font-medium">{hotlinePhone}</span>
            </a>

            <button
              onClick={() => scrollToSection("checkout")}
              className="bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs sm:text-sm py-2 px-5 rounded-xl transition shadow-md flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>অর্ডার করুন</span>
            </button>
          </div>

          {/* Mobile menu hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => scrollToSection("checkout")}
              className="sm:hidden bg-amber-400 text-neutral-950 font-bold text-xs py-1.5 px-3 rounded-lg"
            >
              অর্ডার করুন
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-400 hover:text-white rounded-lg"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-neutral-800 pb-2 space-y-2 text-sm font-semibold text-neutral-200">
            <button
              onClick={() => scrollToSection("customizer")}
              className="w-full text-left py-2 px-3 rounded-lg bg-amber-500/10 text-amber-400 font-bold"
            >
              প্লেট তৈরি করুন (লাইভ কাস্টমাইজার)
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-800"
            >
              সুবিধাসমূহ
            </button>
            <button
              onClick={() => scrollToSection("specs")}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-800"
            >
              স্পেসিফিকেশন
            </button>
            <button
              onClick={() => scrollToSection("gallery")}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-800"
            >
              বাস্তব প্লেটের ছবি
            </button>
            <button
              onClick={() => scrollToSection("videos")}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-800"
            >
              ভিডিও কোয়ালিটি টেস্ট
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-800"
            >
              সাধারণ কিছু প্রশ্নের উত্তর
            </button>
            <Link
              href="/track-order"
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-800 flex items-center gap-2 text-neutral-400"
            >
              <Truck className="w-4 h-4" />
              অর্ডার ট্র্যাকিং
            </Link>
            <Link
              href="/admin"
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-800 flex items-center gap-2 text-neutral-400"
            >
              অ্যাডমিন পোর্টাল
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

