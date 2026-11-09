"use client";

import { ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import PlateGraphic from "./PlateGraphic";

export default function HeroSection({
  frontPlatePrice = 350,
  onOrderClick,
}: {
  frontPlatePrice?: number;
  onOrderClick: () => void;
}) {
  return (
    <section className="relative bg-neutral-950 text-white overflow-hidden pt-8 pb-16 lg:py-20 border-b border-dashed border-amber-500/40">
      {/* Subtle ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-neutral-800/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3.5 py-1.5 rounded-full text-xs font-semibold text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>বাইকারদের প্রথম পছন্দ • ১০০% রিফ্লেক্টিভ</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              আপনার বাইকের নম্বরে{" "}
              <span className="text-amber-400 underline decoration-amber-500/40 decoration-wavy decoration-2">
                বাংলা ফ্রন্ট নম্বর প্লেট
              </span>
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl">
              উন্নত মানের রিফ্লেক্টিভ ও ওয়াটারপ্রুফ ম্যাটেরিয়াল দিয়ে তৈরি। যা আপনার বাইককে দেবে প্রিমিয়াম, স্মার্ট ও আকর্ষণীয় লুক। দূর থেকেও থাকবে স্পষ্ট দৃশ্যমান।
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 bg-neutral-900/90 border border-neutral-800 text-xs px-3 py-1.5 rounded-lg text-neutral-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ওয়াটারপ্রুফ ও টেকসই
              </span>
              <span className="inline-flex items-center gap-1.5 bg-neutral-900/90 border border-neutral-800 text-xs px-3 py-1.5 rounded-lg text-neutral-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                প্রিমিয়াম ৩এম রিফ্লেক্টিভ স্টিকার
              </span>
              <span className="inline-flex items-center gap-1.5 bg-neutral-900/90 border border-neutral-800 text-xs px-3 py-1.5 rounded-lg text-neutral-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                সহজে ইনস্টলযোগ্য
              </span>
            </div>

            {/* Price and CTA Button */}
            <div className="pt-4 flex flex-wrap items-center gap-5">
              <button
                onClick={onOrderClick}
                className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-neutral-950 font-extrabold text-base sm:text-lg px-8 py-4 rounded-2xl transition shadow-[0_10px_25px_rgba(245,158,11,0.3)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
              >
                <span>অর্ডার করতে চাই</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-400">
                    ৳{frontPlatePrice}
                  </span>
                  <span className="text-base font-mono text-neutral-500 line-through">
                    ৳৫০০
                  </span>
                </div>
                <span className="text-[11px] text-neutral-400">
                  ১০০ টাকা অগ্রিমে ৩০% নিশ্চিত ছাড়!
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4 pt-2 text-xs text-neutral-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                সারাদেশে ক্যাশ অন ডেলিভারি
              </span>
              <span className="hidden sm:inline">•</span>
              <span>দ্রুততম কুরিয়ার হোম ডেলিভারি</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Product Display */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-lg bg-neutral-900/90 border border-neutral-800 rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 shadow-2xl relative overflow-hidden">
              {/* Product Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  বাস্তব প্লেট প্রিভিউ
                </span>
                <span className="text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-semibold">
                  ৩এম রিফ্লেক্টিভ অ্যাক্রিলিক
                </span>
              </div>

              {/* Realistic Plate Graphic */}
              <div className="py-2 w-full flex justify-center">
                <PlateGraphic
                  metroCity="ঢাকা মেট্রো"
                  vehicleClass="ল"
                  seriesNumber="১২"
                  plateNumber="৩৪৫৬"
                  plateType="front"
                  color="white_reflective"
                  size="md"
                />
              </div>

              {/* Feature highlight strip */}
              <div className="mt-5 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                  <span className="text-neutral-400 block text-[10px]">উপাদান</span>
                  <span className="font-semibold text-neutral-200">অ্যাক্রিলিক + ৩এম</span>
                </div>
                <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-800">
                  <span className="text-neutral-400 block text-[10px]">ফিটিং</span>
                  <span className="font-semibold text-neutral-200">সব বাইকে উপযোগী</span>
                </div>
              </div>

              <div className="mt-4 text-center">
                <button
                  onClick={onOrderClick}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-4"
                >
                  নিজের বাইকের নম্বর দিয়ে বানিয়ে নিন →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

