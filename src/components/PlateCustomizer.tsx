"use client";

import { useState, useEffect } from "react";
import { ArrowDown, CheckCircle2, ChevronDown } from "lucide-react";
import PlateGraphic from "./PlateGraphic";
import { CustomPlateDetails } from "@/types";
import {
  convertToBengaliDigits,
  convertToBengaliLetter,
  parsePlateNumberInput,
  parseQuickPlateString,
} from "@/lib/plate-parser";

interface PlateCustomizerProps {
  customDetails: CustomPlateDetails;
  onChange: (details: CustomPlateDetails) => void;
  onProceedToOrder: () => void;
}

const DISTRICT_OPTIONS = [
  { label: "ঢাকা মেট্রো", value: "ঢাকা মেট্রো" },
  { label: "চট্টগ্রাম মেট্রো", value: "চট্টগ্রাম মেট্রো" },
  { label: "সিলেট মেট্রো", value: "সিলেট মেট্রো" },
  { label: "রাজশাহী মেট্রো", value: "রাজশাহী মেট্রো" },
  { label: "খুলনা মেট্রো", value: "খুলনা মেট্রো" },
  { label: "বরিশাল মেট্রো", value: "বরিশাল মেট্রো" },
  { label: "রংপুর মেট্রো", value: "রংপুর মেট্রো" },
  { label: "ময়মনসিংহ মেট্রো", value: "ময়মনসিংহ মেট্রো" },
  { label: "ঢাকা", value: "ঢাকা" },
  { label: "গাজীপুর", value: "গাজীপুর" },
  { label: "নারায়ণগঞ্জ", value: "নারায়ণগঞ্জ" },
  { label: "কুমিল্লা", value: "কুমিল্লা" },
  { label: "চট্টগ্রাম", value: "চট্টগ্রাম" },
  { label: "সিলেট", value: "সিলেট" },
  { label: "রাজশাহী", value: "রাজশাহী" },
  { label: "খুলনা", value: "খুলনা" },
  { label: "বরিশাল", value: "বরিশাল" },
  { label: "রংপুর", value: "রংপুর" },
  { label: "ময়মনসিংহ", value: "ময়মনসিংহ" },
  { label: "বগুড়া", value: "বগুড়া" },
  { label: "যশোর", value: "যশোর" },
  { label: "পাবনা", value: "পাবনা" },
  { label: "টাঙ্গাইল", value: "টাঙ্গাইল" },
  { label: "ফরিদপুর", value: "ফরিদপুর" },
  { label: "কুষ্টিয়া", value: "কুষ্টিয়া" },
  { label: "দিনাজপুর", value: "দিনাজপুর" },
  { label: "নোয়াখালী", value: "নোয়াখালী" },
  { label: "কক্সবাজার", value: "কক্সবাজার" },
  { label: "ব্রাহ্মণবাড়িয়া", value: "ব্রাহ্মণবাড়িয়া" },
  { label: "চাঁদপুর", value: "চাঁদপুর" },
  { label: "ফেনী", value: "ফেনী" },
  { label: "লক্ষ্মীপুর", value: "লক্ষ্মীপুর" },
  { label: "জামালপুর", value: "জামালপুর" },
  { label: "নেত্রকোণা", value: "নেত্রকোণা" },
  { label: "শেরপুর", value: "শেরপুর" },
  { label: "কিশোরগঞ্জ", value: "কিশোরগঞ্জ" },
  { label: "মানিকগঞ্জ", value: "মানিকগঞ্জ" },
  { label: "মুন্সীগঞ্জ", value: "মুন্সীগঞ্জ" },
  { label: "নরসিংদী", value: "নরসিংদী" },
  { label: "সিরাজগঞ্জ", value: "সিরাজগঞ্জ" },
  { label: "নাটোর", value: "নাটোর" },
  { label: "নওগাঁ", value: "নওগাঁ" },
  { label: "চাঁপাইনবাবগঞ্জ", value: "চাঁপাইনবাবগঞ্জ" },
  { label: "জয়পুরহাট", value: "জয়পুরহাট" },
  { label: "বাগেরহাট", value: "বাগেরহাট" },
  { label: "সাতক্ষীরা", value: "সাতক্ষীরা" },
  { label: "ঝিনাইদহ", value: "ঝিনাইদহ" },
  { label: "মাগুরা", value: "মাগুরা" },
  { label: "মেহেরপুর", value: "মেহেরপুর" },
  { label: "নড়াইল", value: "নড়াইল" },
  { label: "চুয়াডাঙ্গা", value: "চুয়াডাঙ্গা" },
  { label: "পটুয়াখালী", value: "পটুয়াখালী" },
  { label: "ভোলা", value: "ভোলা" },
  { label: "ঝালকাঠি", value: "ঝালকাঠি" },
  { label: "পিরোজপুর", value: "পিরোজপুর" },
  { label: "বরগুনা", value: "বরগুনা" },
  { label: "হবিগঞ্জ", value: "হবিগঞ্জ" },
  { label: "মৌলভীবাজার", value: "মৌলভীবাজার" },
  { label: "সুনামগঞ্জ", value: "সুনামগঞ্জ" },
  { label: "কুড়িগ্রাম", value: "কুড়িগ্রাম" },
  { label: "গাইবান্ধা", value: "গাইবান্ধা" },
  { label: "লালমনিরহাট", value: "লালমনিরহাট" },
  { label: "নীলফামারী", value: "নীলফামারী" },
  { label: "পঞ্চগড়", value: "পঞ্চগড়" },
  { label: "ঠাকুরগাঁও", value: "ঠাকুরগাঁও" },
  { label: "বান্দরবান", value: "বান্দরবান" },
  { label: "খাগড়াছড়ি", value: "খাগড়াছড়ি" },
  { label: "রাঙ্গামাটি", value: "রাঙ্গামাটি" },
];

export default function PlateCustomizer({
  customDetails,
  onChange,
  onProceedToOrder,
}: PlateCustomizerProps) {
  const [quickInput, setQuickInput] = useState("");
  const [quickFeedback, setQuickFeedback] = useState("");

  // Single unified number input state (e.g. "১৩-১২৩৪" or "১২৩৪")
  const [numberInput, setNumberInput] = useState(() => {
    const s = customDetails.seriesNumber?.trim();
    const p = customDetails.plateNumber?.trim();
    if (s && p) return `${s}-${p}`;
    return p || s || "";
  });

  const vehicleType = customDetails.vehicleType || "motorcycle";
  const hasBorder = customDetails.hasBorder !== false;
  const quantity = Math.max(1, customDetails.quantity || 1);

  // Keep numberInput synced if parent updates customDetails (e.g. from gallery or sample click)
  useEffect(() => {
    const s = customDetails.seriesNumber?.trim();
    const p = customDetails.plateNumber?.trim();
    if (s && p) {
      setNumberInput(`${s}-${p}`);
    } else if (p) {
      setNumberInput(p);
    } else if (s) {
      setNumberInput(s);
    } else {
      setNumberInput("");
    }
  }, [customDetails.seriesNumber, customDetails.plateNumber]);

  // Helper to sync changes and recompute fullPlateText
  const updateCustomDetails = (updates: Partial<CustomPlateDetails>) => {
    const updated = {
      ...customDetails,
      ...updates,
    };

    const parts = [
      updated.metroCity?.trim(),
      updated.vehicleClass?.trim(),
      updated.seriesNumber?.trim(),
      updated.plateNumber?.trim(),
    ].filter(Boolean);

    updated.fullPlateText = parts.length > 0 ? parts.join("-") : "";
    onChange(updated);
  };

  // When user types in the Quick Input box ("পুরো নম্বর একবারে লিখুন চাইলে")
  const handleQuickInputChange = (val: string) => {
    setQuickInput(val);
    if (!val.trim()) {
      setNumberInput("");
      updateCustomDetails({
        metroCity: "",
        vehicleClass: "",
        seriesNumber: "",
        plateNumber: "",
      });
      return;
    }

    const parsed = parseQuickPlateString(val);
    const s = parsed.seriesNumber || "";
    const p = parsed.plateNumber || "";
    const num = s && p ? `${s}-${p}` : p || s || "";

    setNumberInput(num);

    // Completely replace with what was parsed from quick input (no ghost values from previous input!)
    updateCustomDetails({
      metroCity: parsed.metroCity || "",
      vehicleClass: parsed.vehicleClass || "",
      seriesNumber: s,
      plateNumber: p,
    });
  };

  // When clicking "বসিয়ে দিন" button
  const handleQuickParse = () => {
    if (!quickInput.trim()) return;
    const parsed = parseQuickPlateString(quickInput);

    const s = parsed.seriesNumber || "";
    const p = parsed.plateNumber || "";
    const num = s && p ? `${s}-${p}` : p || s || "";

    setNumberInput(num);

    updateCustomDetails({
      metroCity: parsed.metroCity || "ঢাকা মেট্রো",
      vehicleClass: parsed.vehicleClass || "",
      seriesNumber: s,
      plateNumber: p,
    });

    setQuickFeedback("নম্বর সফলভাবে প্লেটে বসানো হয়েছে!");
    setTimeout(() => setQuickFeedback(""), 3000);
  };

  // Unified Number Input Handler: accepts full number together ("একসাথে দিলে হবে")
  const handleCombinedNumberChange = (rawVal: string) => {
    const converted = convertToBengaliDigits(rawVal);
    setNumberInput(converted);

    const parsed = parsePlateNumberInput(converted);
    updateCustomDetails({
      seriesNumber: parsed.seriesNumber,
      plateNumber: parsed.plateNumber,
    });
  };

  // Manual Field Handlers
  const handleMetroCityChange = (val: string) => {
    updateCustomDetails({ metroCity: val });
  };

  const handleVehicleClassChange = (val: string) => {
    const converted = convertToBengaliLetter(val);
    updateCustomDetails({ vehicleClass: converted });
  };

  const handleVehicleTypeChange = (type: "motorcycle" | "scooter") => {
    updateCustomDetails({ vehicleType: type });
  };

  const handleBorderToggle = () => {
    updateCustomDetails({ hasBorder: !hasBorder });
  };

  const handleQuantityChange = (delta: number) => {
    const nextQty = Math.max(1, quantity + delta);
    updateCustomDetails({ quantity: nextQty });
  };

  return (
    <section id="customizer" className="py-12 bg-[#F8F6F0] border-b border-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* =========================================
              LEFT COLUMN: ১ প্লেটের তথ্য
             ========================================= */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-7 border border-neutral-200 shadow-xs space-y-5">
            {/* Step Header */}
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-[#FEF3C7] text-[#92400E] font-bold text-xs flex items-center justify-center font-mono">
                ১
              </span>
              <h3 className="font-extrabold text-lg sm:text-xl text-neutral-900">
                প্লেটের তথ্য
              </h3>
            </div>

            {/* Vehicle Type Cards */}
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-2">
                প্লেটের ধরন
              </label>

              <div className="grid grid-cols-2 gap-3">
                {/* Option 1: Motorcycle (285 x 50 mm) */}
                <div
                  onClick={() => handleVehicleTypeChange("motorcycle")}
                  className={`rounded-xl p-3 sm:p-3.5 relative flex flex-col items-center justify-between text-center min-h-[145px] cursor-pointer transition ${
                    vehicleType === "motorcycle"
                      ? "bg-[#FFFDF7] border-2 border-neutral-900 shadow-xs"
                      : "bg-white border border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  {/* Top Right Radio Indicator */}
                  <div className="absolute top-2.5 right-2.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        vehicleType === "motorcycle"
                          ? "border-neutral-900 bg-white"
                          : "border-neutral-300 bg-white"
                      }`}
                    >
                      {vehicleType === "motorcycle" && (
                        <div className="w-2 h-2 rounded-full bg-neutral-900" />
                      )}
                    </div>
                  </div>

                  {/* Mini Preview Graphic */}
                  <div className="w-full max-w-[120px] h-6 bg-white border border-neutral-800 rounded px-1.5 flex items-center justify-center text-[9px] font-bold text-neutral-900 whitespace-nowrap mt-1">
                    ঢাকা-ল-৮২-৩৪৫৬
                  </div>

                  {/* Title & Specs */}
                  <div className="mt-2">
                    <span className="font-extrabold text-sm text-neutral-900 block">
                      মোটরসাইকেল
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono block mt-0.5">
                      285 × 50 mm
                    </span>
                  </div>
                </div>

                {/* Option 2: Scooter (200 x 100 mm) */}
                <div
                  onClick={() => handleVehicleTypeChange("scooter")}
                  className={`rounded-xl p-3 sm:p-3.5 relative flex flex-col items-center justify-between text-center min-h-[145px] cursor-pointer transition ${
                    vehicleType === "scooter"
                      ? "bg-[#FFFDF7] border-2 border-neutral-900 shadow-xs"
                      : "bg-white border border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  {/* Top Right Radio Indicator */}
                  <div className="absolute top-2.5 right-2.5">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        vehicleType === "scooter"
                          ? "border-neutral-900 bg-white"
                          : "border-neutral-300 bg-white"
                      }`}
                    >
                      {vehicleType === "scooter" && (
                        <div className="w-2 h-2 rounded-full bg-neutral-900" />
                      )}
                    </div>
                  </div>

                  {/* Mini Preview Graphic for Scooter (2 Lines) */}
                  <div className="w-11 h-8 bg-white border border-neutral-800 rounded px-1 flex flex-col items-center justify-center text-[7px] font-bold text-neutral-900 leading-tight mt-1">
                    <span>ঢাকা-ল</span>
                    <span>৮২-৩৪৫৬</span>
                  </div>

                  {/* Title & Specs */}
                  <div className="mt-2">
                    <span className="font-extrabold text-sm text-neutral-900 block">
                      স্কুটার
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono block mt-0.5">
                      200 × 100 mm
                    </span>
                    <span className="inline-block bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5">
                      +৳৫০
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick One-Line Input Parser Feature */}
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1.5">
                পুরো নম্বর একবারে লিখুন <span className="text-neutral-400 font-normal">চাইলে</span>
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={quickInput}
                  onChange={(e) => handleQuickInputChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleQuickParse()}
                  placeholder="Dhaka Metro LA 12 3456"
                  className="flex-1 min-w-0 px-3.5 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 placeholder:text-neutral-400 placeholder:font-mono focus:outline-none focus:border-amber-500 font-sans"
                />
                <button
                  type="button"
                  onClick={handleQuickParse}
                  className="bg-amber-400 hover:bg-amber-500 text-neutral-950 font-bold px-5 py-2.5 rounded-lg text-sm transition shrink-0 shadow-xs cursor-pointer"
                >
                  বসিয়ে দিন
                </button>
              </div>

              <p className="text-[11px] text-neutral-500 mt-1.5">
                ইংরেজি বা বাংলা দুটোই চলবে, স্পেস বা হাইফেন দিয়ে। L/LA = ল, H/HA = হ।
              </p>

              {quickFeedback && (
                <p className="text-xs text-emerald-600 font-semibold mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {quickFeedback}
                </p>
              )}
            </div>

            {/* Dashed Separator */}
            <div className="border-t border-dashed border-neutral-200" />

            {/* Form Field 1: নিবন্ধন এলাকা * */}
            <div>
              <label className="text-xs font-bold text-neutral-800 block mb-1.5">
                নিবন্ধন এলাকা <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={customDetails.metroCity || ""}
                  onChange={(e) => handleMetroCityChange(e.target.value)}
                  className="w-full appearance-none px-3.5 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:border-amber-500 cursor-pointer pr-10"
                >
                  <option value="">এলাকা বেছে নিন</option>
                  {DISTRICT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Form Row: সিরিজ * and নম্বর * (একসাথে পুরো নম্বর লেখার সহজ ফিল্ড) */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4">
                <label className="text-xs font-bold text-neutral-800 block mb-1.5">
                  সিরিজ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={customDetails.vehicleClass || ""}
                  onChange={(e) => handleVehicleClassChange(e.target.value)}
                  placeholder="ম বা ল"
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:border-amber-500 font-sans"
                />
              </div>

              <div className="sm:col-span-8">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-neutral-800 block">
                    নম্বর <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-neutral-400">
                    একসাথে লিখুন (যেমন: ১৩-১২৩৪)
                  </span>
                </div>
                <input
                  type="text"
                  value={numberInput}
                  onChange={(e) => handleCombinedNumberChange(e.target.value)}
                  placeholder="১৩-১২৩৪ বা ৩৪৫৬"
                  className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-lg text-sm text-neutral-900 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            {/* Dashed Separator */}
            <div className="border-t border-dashed border-neutral-200" />

            {/* Border Toggle Switch */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleBorderToggle}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  hasBorder ? "bg-neutral-900" : "bg-neutral-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-xs transform transition-transform ${
                    hasBorder ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
              <div>
                <span className="font-bold text-xs sm:text-sm text-neutral-900 block">
                  বর্ডার
                </span>
                <span className="text-[11px] text-neutral-500 block">
                  প্লেটের চারপাশে কালো বর্ডার, বাড়তি টাকা নেই
                </span>
              </div>
            </div>
          </div>

          {/* =========================================
              RIGHT COLUMN: ২ আপনার প্লেট দেখতে এমন হবে
             ========================================= */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 md:p-7 border border-neutral-200 shadow-xs flex flex-col justify-between">
            <div>
              {/* Step Header */}
              <div className="flex items-center gap-2.5 mb-4">
                <span className="w-6 h-6 rounded-full bg-[#FEF3C7] text-[#92400E] font-bold text-xs flex items-center justify-center font-mono">
                  ২
                </span>
                <h3 className="font-extrabold text-lg sm:text-xl text-neutral-900">
                  আপনার প্লেট দেখতে এমন হবে
                </h3>
              </div>

              {/* Dark Grid Canvas Box (Exact Blueprint Look) */}
              <div
                style={{
                  backgroundColor: "#111622",
                  backgroundImage: `
                    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: "20px 20px",
                }}
                className="w-full rounded-2xl p-5 sm:p-8 md:p-12 flex flex-col items-center justify-center min-h-[170px] sm:min-h-[210px] shadow-inner border border-neutral-800 overflow-hidden"
              >
                <PlateGraphic
                  metroCity={customDetails.metroCity}
                  vehicleClass={customDetails.vehicleClass}
                  seriesNumber={customDetails.seriesNumber}
                  plateNumber={customDetails.plateNumber}
                  fullPlateText={customDetails.fullPlateText}
                  rawInput={quickInput}
                  vehicleType={vehicleType}
                  hasBorder={hasBorder}
                  color={customDetails.plateColor || "white_reflective"}
                  size="lg"
                />
              </div>

              {/* Captions under Canvas */}
              <div className="text-center mt-3 space-y-1">
                <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                  {vehicleType === "scooter"
                    ? "200 × 100 mm · দ্বি-সারি (BRTA মাপ)"
                    : "285 × 50 mm · এক লাইন (BRTA মাপ)"}
                </p>
                <p className="text-[11px] sm:text-xs text-neutral-400">
                  নম্বর পূরণ না হওয়া পর্যন্ত নমুনা দেখাচ্ছে। রেজিস্ট্রেশন কাগজের সাথে মিলিয়ে নিন।
                </p>
              </div>

              {/* Quantity Selector Card */}
              <div className="bg-white border border-neutral-200 rounded-xl p-3.5 sm:p-4 mt-4">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-neutral-900">
                    কয়টি প্লেট লাগবে?
                  </span>
                  <div className="flex items-center border border-neutral-300 rounded-full px-2.5 py-0.5 space-x-3 bg-white">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-neutral-950 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-base cursor-pointer select-none"
                    >
                      −
                    </button>
                    <span className="font-bold text-sm text-neutral-900 min-w-[16px] text-center font-mono select-none">
                      {convertToBengaliDigits(String(quantity))}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(1)}
                      className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-neutral-950 font-bold text-base cursor-pointer select-none"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-400 mt-2">
                  একাধিক বাইক? প্রতিটির নম্বর আলাদা দিন। স্কুটার প্লেট +৳৫০।
                </p>
              </div>
            </div>

            {/* Action Button to Checkout */}
            <div className="mt-5 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={onProceedToOrder}
                className="w-full bg-amber-400 hover:bg-amber-300 text-neutral-950 font-extrabold py-3.5 px-6 rounded-xl transition shadow-xs hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
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
