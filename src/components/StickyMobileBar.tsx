"use client";

import { ShoppingCart } from "lucide-react";

export default function StickyMobileBar({
  price = 350,
  onOrderClick,
}: {
  price?: number;
  onOrderClick: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800 p-3 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold font-mono text-amber-400">৳{price}</span>
            <span className="text-xs font-mono text-neutral-500 line-through">৳৫০০</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            ১০০৳ অগ্রিমে ৩০% নিশ্চিত ছাড়
          </span>
        </div>

        <button
          onClick={onOrderClick}
          className="bg-amber-400 active:bg-amber-500 text-neutral-950 font-black py-2.5 px-6 rounded-xl text-sm transition shadow-md flex items-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>অর্ডার করুন</span>
        </button>
      </div>
    </div>
  );
}

