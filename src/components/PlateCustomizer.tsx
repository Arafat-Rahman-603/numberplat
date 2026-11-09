"use client";

import { useState } from "react";
import { ArrowDown, CheckCircle2 } from "lucide-react";
import PlateGraphic from "./PlateGraphic";
import { CustomPlateDetails } from "@/types";
import { parseQuickPlateString } from "@/lib/plate-parser";

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
  "ল",
  "হ",
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

export default function PlateCustomizer({
  customDetails,
  onChange,
  onProceedToOrder,
}: PlateCustomizerProps) {
  const [quickInput, setQuickInput] = useState("");
  const [quickFeedback, setQuickFeedback] = useState("");

  const vehicleType = customDetails.vehicleType || "motorcycle";

  const handleUpdate = (field: keyof CustomPlateDetails, value: any) => {
    const updated = {
      ...customDetails,
      [field]: value,
    };
    updated.fullPlateText = `${updated.metroCity}-${updated.vehicleClass}-${updated.seriesNumber}-${updated.plateNumber}`;
    onChange(updated);
  };

  const handleQuickParse = () => {
    if (!quickInput.trim()) return;
    const parsed = parseQuickPlateString(quickInput);

    const updated = {
      ...customDetails,
      ...(parsed.metroCity && { metroCity: parsed.metroCity }),
      ...(parsed.vehicleClass && { vehicleClass: parsed.vehicleClass }),
      ...(parsed.seriesNumber && { seriesNumber: parsed.seriesNumber }),
      ...(parsed.plateNumber && { plateNumber: parsed.plateNumber }),
    };

    updated.fullPlateText = `${updated.metroCity}-${updated.vehicleClass}-${updated.seriesNumber}-${updated.plateNumber}`;
    onChange(updated);

    setQuickFeedback("নম্বর সফলভাবে বসানো হয়েছে!");
    setTimeout(() => setQuickFeedback(""), 3000);
  };

  return (
    <section id="customizer" className="py-14 bg-[#F8F6F0] border-b border-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* =========================================
              LEFT COLUMN: ১ প্লেটের তথ্য
             ========================================= */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-4 sm:p-6 md:p-7 border border-neutral-200 shadow-sm space-y-5 sm:space-y-6">
            {/* Step Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
              <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-sm flex items-center justify-center font-mono">
                ১
              </span>
              <h3 className="font-extrabold text-xl text-neutral-900">প্লেটের তথ্য</h3>
            </div>

            {/* Vehicle Type Cards (Motorcycle vs Scooter) */}
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-2.5">
                প্লেটের ধরন
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* Option 1: Motorcycle (285 x 50 mm) */}
                <div
                  onClick={() => handleUpdate("vehicleType", "motorcycle")}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition relative flex flex-col items-center justify-between text-center min-h-[145px] ${
                    vehicleType === "motorcycle"
                      ? "bg-[#FFFDF7] border-neutral-900 shadow-sm"
                      : "bg-white border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  {/* Top Right Radio Indicator */}
                  <div className="absolute top-2.5 right-2.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        vehicleType === "motorcycle"
                          ? "border-neutral-900 bg-neutral-900"
                          : "border-neutral-400 bg-white"
                      }`}
                    >
                      {vehicleType === "motorcycle" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>

                  {/* Mini Preview Graphic */}
                  <div className="w-full max-w-[140px] h-6 bg-white border border-neutral-800 rounded px-1.5 flex items-center justify-center text-[9px] font-bold text-neutral-900 whitespace-nowrap mt-1">
                    ঢাকা-ল-১২-৩৪৫৬
                  </div>

                  {/* Title & Specs */}
                  <div className="mt-3">
                    <span className="font-extrabold text-sm text-neutral-900 block">
                      মোটরসাইকেল
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      285 × 50 mm
                    </span>
                  </div>
                </div>

                {/* Option 2: Scooter (200 x 100 mm) */}
                <div
                  onClick={() => handleUpdate("vehicleType", "scooter")}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition relative flex flex-col items-center justify-between text-center min-h-[145px] ${
                    vehicleType === "scooter"
                      ? "bg-[#FFFDF7] border-neutral-900 shadow-sm"
                      : "bg-white border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  {/* Top Right Radio Indicator */}
                  <div className="absolute top-2.5 right-2.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        vehicleType === "scooter"
                          ? "border-neutral-900 bg-neutral-900"
                          : "border-neutral-400 bg-white"
                      }`}
                    >
                      {vehicleType === "scooter" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                  </div>

                  {/* Mini Preview Graphic for Scooter (Squarish 2 lines) */}
                  <div className="w-12 h-9 bg-white border border-neutral-800 rounded px-1 flex flex-col items-center justify-center text-[7px] font-bold text-neutral-900 leading-tight mt-1">
                    <span>ঢাকা-ল</span>
                    <span>১২-৩৪৫৬</span>
                  </div>

                  {/* Title & Specs */}
                  <div className="mt-2">
                    <span className="font-extrabold text-sm text-neutral-900 block">
                      স্কুটার
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      200 × 100 mm
                    </span>
                    <span className="inline-block text-[9px] font-bold bg-neutral-900 text-white px-2 py-0.5 rounded-full mt-1">
                      +৳৫০
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick One-Line Input Parser Feature */}
            <div className="pt-1">
              <label className="text-xs font-bold text-neutral-800 block mb-1.5">
                পুরো নম্বর একবারে লিখুন <span className="text-neutral-500 font-normal">চাইলে</span>
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={quickInput}
                  onChange={(e) => setQuickInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleQuickParse()}
                  placeholder="Dhaka Metro LA 12 3456"
                  className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-2.5 bg-neutral-50 border border-neutral-300 rounded-lg text-xs sm:text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-amber-500 focus:bg-white font-mono"
                />
                <button
                  type="button"
                  onClick={handleQuickParse}
                  className="bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm transition shadow-xs whitespace-nowrap shrink-0"
                >
                  বসিয়ে দিন
                </button>
              </div>

              {quickFeedback && (
                <p className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {quickFeedback}
                </p>
              )}
            </div>

            {/* Individual Dropdown and Number Fields */}
            <div className="pt-2 border-t border-neutral-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                {/* Metro City Dropdown */}
                <div>
                  <label className="text-xs text-neutral-600 block mb-1 font-semibold">
                    মেট্রো / জেলা
                  </label>
                  <select
                    value={customDetails.metroCity}
                    onChange={(e) => handleUpdate("metroCity", e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm font-semibold text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  >
                    {METRO_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Letter Class */}
                <div>
                  <label className="text-xs text-neutral-600 block mb-1 font-semibold">
                    অক্ষর (ভেহিক্যাল ক্লাস)
                  </label>
                  <select
                    value={customDetails.vehicleClass}
                    onChange={(e) => handleUpdate("vehicleClass", e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm font-semibold text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white"
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
                  <label className="text-xs text-neutral-600 block mb-1 font-semibold">
                    সিরিজ নম্বর
                  </label>
                  <input
                    type="text"
                    value={customDetails.seriesNumber}
                    onChange={(e) => handleUpdate("seriesNumber", e.target.value)}
                    placeholder="১২"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm font-mono font-semibold text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                {/* 4 Digit Plate Number */}
                <div>
                  <label className="text-xs text-neutral-600 block mb-1 font-semibold">
                    ৪ ডিজিটের নম্বর
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={customDetails.plateNumber}
                    onChange={(e) => handleUpdate("plateNumber", e.target.value)}
                    placeholder="৩৪৫৬"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-sm font-mono font-semibold text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Color Scheme Picker */}
            <div className="pt-2 border-t border-neutral-100">
              <label className="text-xs font-bold text-neutral-800 block mb-2">
                প্লেটের কালার
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdate("plateColor", "white_reflective")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition ${
                    customDetails.plateColor === "white_reflective" || !customDetails.plateColor
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-white border border-neutral-400" />
                  সাদা রিফ্লেক্টিভ (BRTA মান)
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdate("plateColor", "black_acrylic")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition ${
                    customDetails.plateColor === "black_acrylic"
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-black border border-white" />
                  ব্ল্যাক অ্যাক্রিলিক
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdate("plateColor", "yellow_reflective")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition ${
                    customDetails.plateColor === "yellow_reflective"
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-neutral-600" />
                  হলুদ রিফ্লেক্টিভ
                </button>
              </div>
            </div>
          </div>

          {/* =========================================
              RIGHT COLUMN: ২ আপনার প্লেট দেখতে এমন হবে
             ========================================= */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-4 sm:p-6 md:p-7 border border-neutral-200 shadow-sm flex flex-col justify-between">
            <div>
              {/* Step Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-neutral-100 mb-4">
                <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-sm flex items-center justify-center font-mono">
                  ২
                </span>
                <h3 className="font-extrabold text-xl text-neutral-900">
                  আপনার প্লেট দেখতে এমন হবে
                </h3>
              </div>

              {/* Dark Grid Canvas Box (Matching Reference) */}
              <div
                style={{
                  backgroundColor: "#111622",
                  backgroundImage: `
                    linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)
                  `,
                  backgroundSize: "22px 22px",
                }}
                className="w-full rounded-2xl p-3 sm:p-8 md:p-12 flex flex-col items-center justify-center relative min-h-[170px] sm:min-h-[220px] shadow-inner border border-neutral-800"
              >
                <PlateGraphic
                  metroCity={customDetails.metroCity}
                  vehicleClass={customDetails.vehicleClass}
                  seriesNumber={customDetails.seriesNumber}
                  plateNumber={customDetails.plateNumber}
                  plateType={customDetails.plateType}
                  vehicleType={vehicleType}
                  color={customDetails.plateColor || "white_reflective"}
                  size="lg"
                />
              </div>

              {/* Specification Notice under Canvas */}
              <div className="mt-4 text-center space-y-1">
                <p className="text-xs font-semibold text-neutral-700">
                  {vehicleType === "scooter"
                    ? "200 × 100 mm • দুই লাইন (স্কুটার মাপ)"
                    : "285 × 50 mm • এক লাইন (BRTA মাপ)"}
                </p>
                <p className="text-[11px] text-neutral-500">
                  নম্বর পূরণ না হওয়া পর্যন্ত নমুনা দেখাচ্ছে। রেজিস্ট্রেশন কাগজের সাথে মিলিয়ে নিন।
                </p>
              </div>
            </div>

            {/* Action Button to Checkout */}
            <div className="mt-6 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={onProceedToOrder}
                className="w-full bg-amber-400 hover:bg-amber-300 text-neutral-950 font-extrabold py-3.5 px-6 rounded-xl transition shadow-md hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-base"
              >
                <span>এই প্লেটটি নিয়ে অর্ডার করুন</span>
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
