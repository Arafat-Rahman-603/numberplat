"use client";

import { ArrowRight, ShieldCheck, CreditCard } from "lucide-react";

export default function DarkQuoteBanner({
  frontPlatePrice = 350,
  onOrderClick,
}: {
  frontPlatePrice?: number;
  onOrderClick: () => void;
}) {
  const regularPrice = 500;
  const discountAmount = Math.round(frontPlatePrice * 0.3); // 30% discount = 105
  const advanceAmount = 100;
  const remainingCod = frontPlatePrice - discountAmount + 70 - advanceAmount; // With ৳70 inside dhaka: 245 + 70 = 315; or without delivery: 245

  return (
    <section className="bg-neutral-950 text-white py-16 px-4 sm:px-8 border-y border-neutral-800 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Quote and Value Pitch */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-amber-400 font-mono text-3xl sm:text-4xl leading-none">“</span>
            <h2 className="text-2xl sm:text-4xl font-black leading-tight text-white">
              দেরী হয়ে যাওয়ার আগেই আপনার বাইককে দিন এক প্রিমিয়াম ও ইউনিক লুক
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xl">
              রাস্তায় আপনার বাইক থাকবে সবার চেয়ে আলাদা ও দৃষ্টিনন্দন। টেকসই রিফ্লেক্টিভ ম্যাটেরিয়াল নাইট রাইডকে করবে নিরাপদ ও আকর্ষণীয়।
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs text-neutral-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ১০০% স্যাটিসফ্যাকশন গ্যারান্টি
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-amber-400" />
                ক্যাশ অন ডেলিভারি সুবিধা
              </span>
            </div>
          </div>

          {/* Right: Transparent Price Breakdown Card */}
          <div className="lg:col-span-5">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 shadow-2xl relative">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  অগ্রিম অফার ক্যালকুলেশন
                </span>
                <span className="text-xs font-bold bg-amber-400 text-neutral-950 px-2 py-0.5 rounded-full">
                  ৩০% ছাড়
                </span>
              </div>

              <div className="space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between text-neutral-400">
                  <span>নিয়মিত বাজার মূল্য</span>
                  <span className="font-mono line-through">৳ {regularPrice}</span>
                </div>

                <div className="flex justify-between text-neutral-200">
                  <span>অফার মূল্য (সামনের প্লেট)</span>
                  <span className="font-mono">৳ {frontPlatePrice}</span>
                </div>

                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>৩০% স্পেশাল ছাড় (অগ্রিম পেমেন্টে)</span>
                  <span className="font-mono">- ৳ {discountAmount}</span>
                </div>

                <div className="flex justify-between text-pink-400 font-medium">
                  <span>বিকাশে অগ্রিম পরিশোধ</span>
                  <span className="font-mono">৳ {advanceAmount}</span>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex justify-between font-bold text-base text-amber-400">
                  <span>ডেলিভারির সময় বাকি COD</span>
                  <span className="font-mono text-xl">৳ {frontPlatePrice - discountAmount - advanceAmount}*</span>
                </div>
              </div>

              <p className="text-[11px] text-neutral-500 mt-2">
                *ডেলিভারি চার্জ যুক্ত হবে (ঢাকার ভিতরে ৳৭০, বাইরে ৳১৩০)
              </p>

              <button
                onClick={onOrderClick}
                className="mt-5 w-full bg-amber-400 hover:bg-amber-300 text-neutral-950 font-extrabold py-3.5 px-4 rounded-xl transition shadow-lg flex items-center justify-center gap-2"
              >
                <span>এখনই প্রি-অর্ডার করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

