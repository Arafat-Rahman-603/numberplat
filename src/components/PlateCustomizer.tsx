"use client";

import { useState } from "react";
import { ArrowDown, CheckCircle2, ShieldCheck, FileText, X } from "lucide-react";
import PlateGraphic from "./PlateGraphic";
import { CustomPlateDetails } from "@/types";
import { parseQuickPlateString } from "@/lib/plate-parser";

interface PlateCustomizerProps {
  customDetails: CustomPlateDetails;
  onChange: (details: CustomPlateDetails) => void;
  onProceedToOrder: () => void;
}

export default function PlateCustomizer({
  customDetails,
  onChange,
  onProceedToOrder,
}: PlateCustomizerProps) {
  const [quickInput, setQuickInput] = useState("");
  const [quickFeedback, setQuickFeedback] = useState("");
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  const vehicleType = customDetails.vehicleType || "motorcycle";

  const handleUpdate = (field: keyof CustomPlateDetails, value: any) => {
    const updated = {
      ...customDetails,
      [field]: value,
    };
    const parts = [
      updated.metroCity?.trim(),
      updated.vehicleClass?.trim(),
      updated.seriesNumber?.trim(),
      updated.plateNumber?.trim(),
    ].filter(Boolean);
    updated.fullPlateText = parts.join("-");
    onChange(updated);
  };

  const handleInputChange = (val: string) => {
    setQuickInput(val);
    if (!val.trim()) return;

    const parsed = parseQuickPlateString(val);
    const updated = {
      ...customDetails,
      ...(parsed.metroCity && { metroCity: parsed.metroCity }),
      ...(parsed.vehicleClass && { vehicleClass: parsed.vehicleClass }),
      ...(parsed.seriesNumber && { seriesNumber: parsed.seriesNumber }),
      ...(parsed.plateNumber && { plateNumber: parsed.plateNumber }),
    };

    const parts = [
      updated.metroCity?.trim(),
      updated.vehicleClass?.trim(),
      updated.seriesNumber?.trim(),
      updated.plateNumber?.trim(),
    ].filter(Boolean);

    updated.fullPlateText = parts.length > 0 ? parts.join("-") : val.trim();
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

    const parts = [
      updated.metroCity?.trim(),
      updated.vehicleClass?.trim(),
      updated.seriesNumber?.trim(),
      updated.plateNumber?.trim(),
    ].filter(Boolean);

    updated.fullPlateText = parts.length > 0 ? parts.join("-") : quickInput.trim();
    onChange(updated);

    setQuickFeedback("নম্বর সফলভাবে প্লেটে বসানো হয়েছে!");
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

              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {/* Option 1: Motorcycle (285 x 50 mm) */}
                <div
                  onClick={() => handleUpdate("vehicleType", "motorcycle")}
                  className={`p-2.5 sm:p-4 rounded-xl border-2 cursor-pointer transition relative flex flex-col items-center justify-between text-center min-h-[135px] sm:min-h-[145px] ${
                    vehicleType === "motorcycle"
                      ? "bg-[#FFFDF7] border-neutral-900 shadow-sm"
                      : "bg-white border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  {/* Top Right Radio Indicator */}
                  <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5">
                    <div
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border flex items-center justify-center ${
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
                  <div className="w-full max-w-[130px] h-6 bg-white border border-neutral-800 rounded px-1 flex items-center justify-center text-[8px] min-[380px]:text-[9px] font-bold text-neutral-900 whitespace-nowrap mt-1">
                    ঢাকা-ল-১১-১২৩৪
                  </div>

                  {/* Title & Specs */}
                  <div className="mt-2.5 sm:mt-3">
                    <span className="font-extrabold text-xs sm:text-sm text-neutral-900 block">
                      মোটরসাইকেল
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-neutral-600 font-mono font-semibold block">
                      ২৮৫ × ৫০ মি.মি.
                    </span>
                    <span className="text-[9px] text-emerald-700 font-semibold block">
                      একক আনুভূমিক সারি (BRTA)
                    </span>
                  </div>
                </div>

                {/* Option 2: Scooter (200 x 100 mm) */}
                <div
                  onClick={() => handleUpdate("vehicleType", "scooter")}
                  className={`p-2.5 sm:p-4 rounded-xl border-2 cursor-pointer transition relative flex flex-col items-center justify-between text-center min-h-[135px] sm:min-h-[145px] ${
                    vehicleType === "scooter"
                      ? "bg-[#FFFDF7] border-neutral-900 shadow-sm"
                      : "bg-white border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  {/* Top Right Radio Indicator */}
                  <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5">
                    <div
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border flex items-center justify-center ${
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
                  <div className="w-11 sm:w-12 h-8 sm:h-9 bg-white border border-neutral-800 rounded px-1 flex flex-col items-center justify-center text-[6.5px] sm:text-[7px] font-bold text-neutral-900 leading-tight mt-1">
                    <span>ঢাকা-ল</span>
                    <span>১১-১২৩৪</span>
                  </div>

                  {/* Title & Specs */}
                  <div className="mt-2">
                    <span className="font-extrabold text-xs sm:text-sm text-neutral-900 block">
                      স্কুটার / স্কুটি
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-neutral-600 font-mono font-semibold block">
                      ২০০ × ১০০ মি.মি.
                    </span>
                    <span className="inline-block text-[8px] sm:text-[9px] font-bold bg-neutral-900 text-white px-2 py-0.5 rounded-full mt-0.5 sm:mt-1">
                      দ্বি-সারি (+৳৫০)
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
                  onChange={(e) => handleInputChange(e.target.value)}
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
                className="w-full rounded-2xl p-2 sm:p-8 md:p-12 flex flex-col items-center justify-center relative min-h-[160px] sm:min-h-[220px] shadow-inner border border-neutral-800 overflow-hidden"
              >
                <PlateGraphic
                  metroCity={customDetails.metroCity}
                  vehicleClass={customDetails.vehicleClass}
                  seriesNumber={customDetails.seriesNumber}
                  plateNumber={customDetails.plateNumber}
                  fullPlateText={customDetails.fullPlateText}
                  plateType={customDetails.plateType}
                  vehicleType={vehicleType}
                  color={customDetails.plateColor || "white_reflective"}
                  size="lg"
                />
              </div>

              {/* Official BRTA Compliance Verification Card under Canvas */}
              <div className="mt-4 p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl text-left space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
                  <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>বিআরটিএ সরকারি প্রজ্ঞাপন মান অনুযায়ী প্রিভিউ</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowNoticeModal(true)}
                    className="text-[11px] text-emerald-800 hover:text-emerald-950 font-bold underline flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-700" />
                    <span>সরকারি প্রজ্ঞাপন দেখুন</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1.5 border-t border-emerald-200/60 font-mono">
                  <div>
                    <span className="text-neutral-500 block text-[10px]">প্লেটের মাপ:</span>
                    <span className="font-bold text-neutral-900">
                      {vehicleType === "scooter"
                        ? "২০০ × ১০০ মি.মি. (দ্বি-সারি)"
                        : "২৮৫ × ৫০ মি.মি. (আনুভূমিক সারি)"}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px]">ফন্ট উচ্চতা ও কালার:</span>
                    <span className="font-bold text-neutral-900">
                      কমপক্ষে ২০ মি.মি. • সাদা ব্যাকগ্রাউন্ড
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-neutral-500 italic pt-0.5">
                  সড়ক পরিবহন আইন ২০১৮ ও বিধিমালা ২০২২ অনুযায়ী কোনো বাড়তি বিজ্ঞাপন বা অননুমোদিত নকশা ছাড়া নিখুঁতভাবে তৈরি।
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

      {/* Official BRTA Circular Requirements Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-7 shadow-2xl relative text-neutral-900 my-8 border border-neutral-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowNoticeModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="border-b border-neutral-100 pb-3 mb-4">
              <span className="text-[10px] sm:text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                বিআরটিএ সরকারি প্রজ্ঞাপন নির্দেশিকা
              </span>
              <h4 className="text-base sm:text-xl font-black text-neutral-900">
                মোটরসাইকেলের সম্মুখভাগে প্রদর্শনযোগ্য লাইসেন্স প্লেট সংক্রান্ত সরকারি শর্তাবলী
              </h4>
              <p className="text-neutral-500 text-xs mt-1">
                সড়ক পরিবহন আইন, ২০১৮ ও সড়ক পরিবহন বিধিমালা, ২০২২ অনুযায়ী সকল শর্ত মেনেই আমাদের প্লেট তৈরি করা হয়:
              </p>
            </div>

            {/* Official Table */}
            <div className="overflow-x-auto border border-neutral-200 rounded-xl mb-4 text-xs">
              <table className="w-full text-left divide-y divide-neutral-200">
                <thead className="bg-neutral-100 text-neutral-800 font-bold">
                  <tr>
                    <th className="p-2.5 sm:p-3">ক্রম</th>
                    <th className="p-2.5 sm:p-3">যানবাহনের ধরন</th>
                    <th className="p-2.5 sm:p-3">দৈর্ঘ্য ও প্রস্থ</th>
                    <th className="p-2.5 sm:p-3">ফন্ট সাইজ</th>
                    <th className="p-2.5 sm:p-3">সরকারি নিয়মাবলী</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr className="bg-white">
                    <td className="p-2.5 sm:p-3 font-mono font-bold">১</td>
                    <td className="p-2.5 sm:p-3 font-semibold">স্কুটার / স্কুটি</td>
                    <td className="p-2.5 sm:p-3 font-mono font-semibold text-neutral-900">
                      ২০০ × ১০০ মি.মি.
                    </td>
                    <td className="p-2.5 sm:p-3 font-mono">কমপক্ষে ২০ মি.মি.</td>
                    <td className="p-2.5 sm:p-3 text-neutral-600">
                      সাদা পটভূমিতে কালো রঙের বাংলা অক্ষর ও সংখ্যা। দ্বি-সারি মাপ। কোনো অতিরিক্ত বিজ্ঞাপন দেওয়া যাবে না।
                    </td>
                  </tr>
                  <tr className="bg-amber-50/40">
                    <td className="p-2.5 sm:p-3 font-mono font-bold">২</td>
                    <td className="p-2.5 sm:p-3 font-semibold">সাধারণ মোটরসাইকেল</td>
                    <td className="p-2.5 sm:p-3 font-mono font-bold text-amber-900">
                      ২৮৫ × ৫০ মি.মি.
                    </td>
                    <td className="p-2.5 sm:p-3 font-mono">কমপক্ষে ২০ মি.মি.</td>
                    <td className="p-2.5 sm:p-3 text-neutral-600">
                      একটি আনুভূমিক সারিতে প্রদর্শন (যেমন: ঢাকা মেট্রো-ল-১১-১২৩৪)। সাদা পটভূমিতে কালো অক্ষর।
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Guarantee Notice */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 sm:p-4 text-xs text-emerald-950 space-y-1 mb-4">
              <p className="font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>বাইকপ্লেট বিডি-র শতভাগ আইনগত নিশ্চয়তা:</span>
              </p>
              <p className="text-neutral-700 leading-relaxed text-[11px] sm:text-xs">
                আমাদের প্রতিটি নম্বর প্লেট এই সরকারি গেজেট ও বিআরটিএ-র মিলিমিটার মাপ, সঠিক ফন্ট উচ্চতা (২০ মি.মি.) এবং সাদা ব্যাকগ্রাউন্ডে কালো অক্ষরের নির্দেশনা অক্ষরে অক্ষরে মেনে তৈরি। রাস্তায় ট্রাফিক পুলিশ বা বিআরটিএ চেকিংয়ে কোনো সমস্যা হবে না।
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowNoticeModal(false)}
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-2.5 rounded-xl text-sm transition"
            >
              বুঝেছি, প্রিভিউতে ফিরে যান
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
