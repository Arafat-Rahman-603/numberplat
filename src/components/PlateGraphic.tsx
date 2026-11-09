"use client";

import React from "react";

interface PlateGraphicProps {
  metroCity: string;
  vehicleClass: string;
  seriesNumber: string;
  plateNumber: string;
  plateType?: "front" | "back" | "both";
  color?: "black_acrylic" | "white_reflective" | "yellow_reflective";
  size?: "sm" | "md" | "lg";
}

export default function PlateGraphic({
  metroCity = "ঢাকা মেট্রো",
  vehicleClass = "হ",
  seriesNumber = "১২",
  plateNumber = "৩৪৫৬",
  plateType = "front",
  color = "black_acrylic",
  size = "md",
}: PlateGraphicProps) {
  // Styles based on color selection
  const isBlackAcrylic = color === "black_acrylic";
  const isYellow = color === "yellow_reflective";

  // Size configurations maintaining exact motorcycle plate ratio without wrapping
  const containerSizes = {
    sm: "max-w-[300px] h-[56px] px-3",
    md: "max-w-[440px] h-[74px] sm:h-[84px] px-4",
    lg: "max-w-[560px] h-[84px] sm:h-[96px] px-5 sm:px-6",
  }[size];

  const fontSizes = {
    sm: "text-xs sm:text-sm font-black tracking-tight",
    md: "text-sm sm:text-base md:text-lg font-black tracking-normal",
    lg: "text-base sm:text-xl md:text-2xl font-black tracking-wide",
  }[size];

  return (
    <div className="w-full flex flex-col items-center justify-center select-none py-2">
      {/* 3D Acrylic Mudguard Number Plate */}
      <div
        className={`w-full ${containerSizes} rounded-2xl relative flex items-center justify-center transition-all duration-300 shadow-[0_12px_35px_rgba(0,0,0,0.85),0_2px_4px_rgba(255,255,255,0.1)_inset] ${
          isBlackAcrylic
            ? "bg-gradient-to-b from-[#181818] via-[#0d0d0d] to-[#050505] border-[3px] border-neutral-700"
            : isYellow
            ? "bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 border-[3px] border-neutral-900"
            : "bg-gradient-to-b from-neutral-100 via-neutral-200 to-white border-[3px] border-neutral-800"
        }`}
      >
        {/* Left Mounting Screw */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-br from-neutral-400 via-neutral-600 to-neutral-800 border border-neutral-500 shadow-inner flex items-center justify-center z-20">
          <div className="w-2 h-0.5 bg-neutral-900 transform rotate-45" />
        </div>

        {/* Right Mounting Screw */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-br from-neutral-400 via-neutral-600 to-neutral-800 border border-neutral-500 shadow-inner flex items-center justify-center z-20">
          <div className="w-2 h-0.5 bg-neutral-900 transform rotate-45" />
        </div>

        {/* Inner Border / Reflective Strip */}
        <div
          className={`w-full h-[84%] rounded-xl flex items-center justify-center px-4 relative overflow-hidden ${
            isBlackAcrylic
              ? "border-2 border-white/90 bg-black/60 shadow-[inset_0_0_12px_rgba(255,255,255,0.15)]"
              : isYellow
              ? "border-2 border-neutral-950 bg-amber-400/80 shadow-[inset_0_0_10px_rgba(0,0,0,0.15)]"
              : "border-2 border-neutral-950 bg-white/90 shadow-[inset_0_0_10px_rgba(0,0,0,0.1)]"
          }`}
        >
          {/* Light Reflection Glare Sheen */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none transform -skew-x-12" />

          {/* Exact One-Line Bengali Plate Text (Strictly No Wrap) */}
          <div className="flex items-center justify-center whitespace-nowrap text-nowrap flex-nowrap z-10 gap-1.5 sm:gap-2.5 font-bold">
            <span
              className={`${fontSizes} font-black ${
                isBlackAcrylic
                  ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                  : "text-neutral-950"
              }`}
            >
              {metroCity || "ঢাকা মেট্রো"}
            </span>

            <span
              className={`font-bold ${
                isBlackAcrylic ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              -
            </span>

            <span
              className={`${fontSizes} font-black ${
                isBlackAcrylic
                  ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                  : "text-neutral-950"
              }`}
            >
              {vehicleClass || "হ"}
            </span>

            <span
              className={`font-bold ${
                isBlackAcrylic ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              -
            </span>

            <span
              className={`${fontSizes} font-black font-mono ${
                isBlackAcrylic
                  ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                  : "text-neutral-950"
              }`}
            >
              {seriesNumber || "১২"}
            </span>

            <span
              className={`font-bold ${
                isBlackAcrylic ? "text-neutral-400" : "text-neutral-600"
              }`}
            >
              -
            </span>

            <span
              className={`${fontSizes} font-black font-mono tracking-wider ${
                isBlackAcrylic
                  ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                  : "text-neutral-950"
              }`}
            >
              {plateNumber || "৩৪৫৬"}
            </span>
          </div>

          {/* Micro BRTA Watermark */}
          <div
            className={`absolute right-2.5 bottom-1 text-[7px] sm:text-[8px] font-mono tracking-widest uppercase font-semibold pointer-events-none opacity-60 ${
              isBlackAcrylic ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            BRTA STANDARD
          </div>
        </div>
      </div>

      {/* Label under plate */}
      <div className="text-center mt-3">
        <span className="text-xs font-bold text-neutral-400 tracking-wider">
          {plateType === "both"
            ? "সামনে ও পেছনের প্লেট সেট (১০ x ২.২ ইঞ্চি)"
            : plateType === "back"
            ? "বাইকের পেছনের ব্যাকপ্লেট"
            : "বাইকের সামনের মাডগার্ড প্লেট (১০ x ২.২ ইঞ্চি)"}
        </span>
      </div>
    </div>
  );
}
