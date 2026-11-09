"use client";

import { useState } from "react";
import { Camera, Check, ExternalLink } from "lucide-react";
import PlateGraphic from "./PlateGraphic";

interface GallerySectionProps {
  onSelectSamplePlate: (sample: {
    metroCity: string;
    vehicleClass: string;
    seriesNumber: string;
    plateNumber: string;
    plateType: "front" | "back" | "both";
  }) => void;
}

export default function GallerySection({ onSelectSamplePlate }: GallerySectionProps) {
  const [filter, setFilter] = useState<"all" | "front" | "both">("all");

  const samples = [
    {
      metroCity: "ঢাকা মেট্রো",
      vehicleClass: "হ",
      seriesNumber: "১২",
      plateNumber: "৩৪৫৬",
      plateType: "front" as const,
      customerCity: "মিরপুর, ঢাকা",
      color: "black_acrylic" as const,
    },
    {
      metroCity: "খুলনা মেট্রো",
      vehicleClass: "ল",
      seriesNumber: "১১",
      plateNumber: "০৭৮৩",
      plateType: "both" as const,
      customerCity: "দৌলতপুর, খুলনা",
      color: "black_acrylic" as const,
    },
    {
      metroCity: "যশোর",
      vehicleClass: "ল",
      seriesNumber: "১১",
      plateNumber: "০৭৮৩",
      plateType: "front" as const,
      customerCity: "যশোর সদর",
      color: "black_acrylic" as const,
    },
    {
      metroCity: "পাবনা",
      vehicleClass: "হ",
      seriesNumber: "০২",
      plateNumber: "০১৭১",
      plateType: "front" as const,
      customerCity: "পাবনা",
      color: "white_reflective" as const,
    },
    {
      metroCity: "চট্টগ্রাম মেট্রো",
      vehicleClass: "ল",
      seriesNumber: "১৫",
      plateNumber: "৮৯০২",
      plateType: "both" as const,
      customerCity: "জিইসি, চট্টগ্রাম",
      color: "yellow_reflective" as const,
    },
    {
      metroCity: "সিলেট মেট্রো",
      vehicleClass: "হ",
      seriesNumber: "১৭",
      plateNumber: "৯৫১২",
      plateType: "front" as const,
      customerCity: "উপশহর, সিলেট",
      color: "black_acrylic" as const,
    },
  ];

  const filteredSamples = samples.filter((s) => {
    if (filter === "all") return true;
    return s.plateType === filter;
  });

  return (
    <section id="gallery" className="py-16 bg-[#FAF7F2] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-200/60 px-3 py-1 rounded-full">
              কাস্টমার গ্যালারি
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 mt-2">
              বাস্তব কিছু তৈরি করা প্লেটের ছবি
            </h2>
            <p className="text-neutral-600 text-sm mt-1">
              সারা দেশের শত শত সন্তুষ্ট বাইকারদের বাইকের জন্য তৈরি করা বাস্তব প্লেট
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filter === "all"
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              সকল প্লেট
            </button>
            <button
              onClick={() => setFilter("front")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filter === "front"
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              শুধু ফ্রন্ট প্লেট
            </button>
            <button
              onClick={() => setFilter("both")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                filter === "both"
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-100"
              }`}
            >
              কম্বো সেট
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSamples.map((sample, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 border border-neutral-200 shadow-sm hover:shadow-md transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-amber-500" />
                    {sample.customerCity}
                  </span>
                  <span className="text-[11px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full font-medium">
                    {sample.plateType === "both" ? "সামনে + পেছনে" : "ফ্রন্ট মাডগার্ড"}
                  </span>
                </div>

                <div className="py-2 bg-neutral-950/5 rounded-2xl p-4 flex items-center justify-center">
                  <PlateGraphic
                    metroCity={sample.metroCity}
                    vehicleClass={sample.vehicleClass}
                    seriesNumber={sample.seriesNumber}
                    plateNumber={sample.plateNumber}
                    plateType={sample.plateType}
                    color={sample.color}
                    size="sm"
                  />
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-neutral-800">
                  {sample.metroCity}-{sample.vehicleClass}-{sample.seriesNumber}-{sample.plateNumber}
                </span>

                <button
                  onClick={() => onSelectSamplePlate(sample)}
                  className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition"
                >
                  <span>কাস্টমাইজ করুন</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

