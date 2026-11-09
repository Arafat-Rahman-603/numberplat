"use client";

import { useState } from "react";
import { ArrowDown, Check, RefreshCw } from "lucide-react";
import PlateGraphic from "./PlateGraphic";
import { CustomPlateDetails, PlateType } from "@/types";

interface PlateCustomizerProps {
  customDetails: CustomPlateDetails;
  onChange: (details: CustomPlateDetails) => void;
  onProceedToOrder: () => void;
}

const METRO_CITIES = [
  "ঢাকা মেট্রো",
  "চট্টগ্রাম মেট্রো",
  "সিলেট মেট্রো",
  "রাজশাহী মেট্রো",
  "খুলনা মেট্রো",
  "বরিশাল মেট্রো",
  "রংপুর মেট্রো",
  "ময়মনসিংহ মেট্রো",
  "গাজীপুর",
  "নারায়ণগঞ্জ",
  "কুমিল্লা",
  "যশোর",
  "বগুড়া",
  "পাবনা",
  "টাঙ্গাইল",
  "ফরিদপুর",
  "কুষ্টিয়া",
  "নোয়াখালী",
  "দিনাজপুর",
  "কক্সবাজার",
];

const VEHICLE_CLASSES = [
  "হ",
  "ল",
  "ক",
  "খ",
  "গ",
  "ঘ",
  "চ",
  "ছ",
  "জ",
  "ঝ",
  "ট",
  "ঠ",
  "ড",
  "ঢ",
  "ত",
  "থ",
  "দ",
  "ধ",
  "ন",
  "প",
  "ফ",
  "ব",
  "ভ",
  "ম",
  "য",
  "র",
  "শ",
  "স",
];

const POPULAR_SERIES = Array.from({ length: 45 }, (_, i) => String(i + 11));

export default function PlateCustomizer({
  customDetails,
  onChange,
  onProceedToOrder,
}: PlateCustomizerProps) {
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleUpdate = (field: keyof CustomPlateDetails, value: any) => {
    const updated = {
      ...customDetails,
      [field]: value,
    };
    updated.fullPlateText = `${updated.metroCity}-${updated.vehicleClass}-${updated.seriesNumber}-${updated.plateNumber}`;
    onChange(updated);
  };

  const handleQuickPreset = (preset: {
    city: string;
    letter: string;
    series: string;
    num: string;
  }) => {
    handleUpdate("metroCity", preset.city);
    handleUpdate("vehicleClass", preset.letter);
    handleUpdate("seriesNumber", preset.series);
    handleUpdate("plateNumber", preset.num);
  };

  return (
    <section id="customizer" className="py-16 bg-[#F5F2EA] border-b border-neutral-300/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-200/60 px-3 py-1 rounded-full">
            লাইভ প্লেট বিল্ডার
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 mt-2">
            আপনার বাইকের নম্বরে প্লেট তৈরি করুন
          </h2>
          <p className="text-neutral-600 text-sm mt-1">
            নিচে আপনার মেট্রো, অক্ষর ও নম্বর দিন — সাথে সাথে লাইভ প্রিভিউ দেখতে পাবেন
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm space-y-6">
            {/* Plate Type Selection (Front, Back, Both) */}
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-2">
                ১. প্লেটের ধরন নির্বাচন করুন
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdate("plateType", "front")}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition text-center ${
                    customDetails.plateType === "front"
                      ? "border-amber-500 bg-amber-50 text-neutral-900 shadow-xs"
                      : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  সামনের প্লেট
                  <span className="block text-[10px] text-neutral-500 font-normal">৳৩৫০</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdate("plateType", "back")}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition text-center ${
                    customDetails.plateType === "back"
                      ? "border-amber-500 bg-amber-50 text-neutral-900 shadow-xs"
                      : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  পেছনের প্লেট
                  <span className="block text-[10px] text-neutral-500 font-normal">৳৪০০</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdate("plateType", "both")}
                  className={`py-3 px-2 rounded-xl text-xs font-bold border transition text-center relative ${
                    customDetails.plateType === "both"
                      ? "border-amber-500 bg-amber-50 text-neutral-900 shadow-xs ring-1 ring-amber-400"
                      : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  <span className="absolute -top-2 right-2 bg-emerald-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">
                    সেরা অফার
                  </span>
                  উভয় প্লেট (কম্বো)
                  <span className="block text-[10px] text-neutral-500 font-normal">৳৬৫০</span>
                </button>
              </div>
            </div>

            {/* Inputs: City, Letter Class, Series, Plate Number */}
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-2">
                ২. বাইকের নম্বর প্লেট তথ্য দিন
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                {/* Metro City */}
                <div>
                  <label className="text-xs text-neutral-600 block mb-1">মেট্রো / জেলা</label>
                  <select
                    value={customDetails.metroCity}
                    onChange={(e) => handleUpdate("metroCity", e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-semibold text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  >
                    {METRO_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Vehicle Class Letter */}
                <div>
                  <label className="text-xs text-neutral-600 block mb-1">অক্ষর (ভেহিক্যাল ক্লাস)</label>
                  <select
                    value={customDetails.vehicleClass}
                    onChange={(e) => handleUpdate("vehicleClass", e.target.value)}
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-semibold text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  >
                    {VEHICLE_CLASSES.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Series Number */}
                <div>
                  <label className="text-xs text-neutral-600 block mb-1">সিরিজ নম্বর</label>
                  <input
                    type="text"
                    value={customDetails.seriesNumber}
                    onChange={(e) => handleUpdate("seriesNumber", e.target.value)}
                    placeholder="১২ বা ১৭"
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-mono font-semibold text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                {/* 4 Digit Plate Number */}
                <div>
                  <label className="text-xs text-neutral-600 block mb-1">৪ ডিজিটের নম্বর</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={customDetails.plateNumber}
                    onChange={(e) => handleUpdate("plateNumber", e.target.value)}
                    placeholder="৩৪৫৬"
                    className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-mono font-semibold text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Reflective Color Scheme */}
            <div>
              <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block mb-2">
                ৩. প্লেট ডিজাইন ও কালার পছন্দ করুন
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdate("plateColor", "black_acrylic")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                    customDetails.plateColor === "black_acrylic" || !customDetails.plateColor
                      ? "border-neutral-900 bg-neutral-950 text-white shadow-sm ring-1 ring-neutral-700"
                      : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-black border border-white" />
                  <span>ব্ল্যাক অ্যাক্রিলিক (সাদা লেখা)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdate("plateColor", "white_reflective")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                    customDetails.plateColor === "white_reflective"
                      ? "border-neutral-900 bg-neutral-950 text-white shadow-sm ring-1 ring-neutral-700"
                      : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-white border border-neutral-400" />
                  <span>সাদা রিফ্লেক্টিভ</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdate("plateColor", "yellow_reflective")}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition ${
                    customDetails.plateColor === "yellow_reflective"
                      ? "border-neutral-900 bg-neutral-950 text-white shadow-sm ring-1 ring-neutral-700"
                      : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-amber-400 border border-neutral-600" />
                  <span>হলুদ রিফ্লেক্টিভ</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Graphic Canvas & Order Trigger */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  লাইভ প্রিভিউ ফলাফল
                </h3>
                <span className="text-[11px] font-mono bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded">
                  ১০০% প্রিভিউ অ্যাকুরেট
                </span>
              </div>

              {/* Graphic Display Box */}
              <div className="bg-neutral-950 p-6 sm:p-10 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden shadow-inner my-2">
                <div className="absolute top-2 left-3 text-[10px] text-neutral-500 font-mono">
                  SCALE: 1:1 RATIO
                </div>
                <PlateGraphic
                  metroCity={customDetails.metroCity}
                  vehicleClass={customDetails.vehicleClass}
                  seriesNumber={customDetails.seriesNumber}
                  plateNumber={customDetails.plateNumber}
                  plateType={customDetails.plateType}
                  color={customDetails.plateColor}
                  size="lg"
                />
              </div>

              <div className="mt-4 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-600 flex items-center justify-between">
                <span>প্লেটের সম্পূর্ণ লেখা:</span>
                <span className="font-mono font-bold text-neutral-900">
                  {customDetails.fullPlateText}
                </span>
              </div>
            </div>

            {/* Big Action button to scroll & pre-fill checkout */}
            <div className="mt-6 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={onProceedToOrder}
                className="w-full bg-amber-400 hover:bg-amber-300 text-neutral-950 font-extrabold py-4 px-6 rounded-2xl transition shadow-md hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-base"
              >
                <span>এই প্লেটটি নিয়ে অর্ডার করুন</span>
                <ArrowDown className="w-4 h-4" />
              </button>
              <p className="text-center text-[11px] text-neutral-500 mt-2">
                নিচে চেকআউট ফর্মে আপনার নাম ও ঠিকানা দিয়ে কনফার্ম করুন
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

