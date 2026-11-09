"use client";

import React from "react";

interface PlateGraphicProps {
  metroCity: string;
  vehicleClass: string;
  seriesNumber: string;
  plateNumber: string;
  plateType?: "front" | "back" | "both";
  vehicleType?: "motorcycle" | "scooter";
  color?: "white_reflective" | "black_acrylic" | "yellow_reflective";
  size?: "sm" | "md" | "lg";
}

export default function PlateGraphic({
  metroCity = "ঢাকা মেট্রো",
  vehicleClass = "ল",
  seriesNumber = "১২",
  plateNumber = "৩৪৫৬",
  plateType = "front",
  vehicleType = "motorcycle",
  color = "white_reflective",
  size = "md",
}: PlateGraphicProps) {
  const isScooter = vehicleType === "scooter";
  const isBlackAcrylic = color === "black_acrylic";
  const isYellow = color === "yellow_reflective";

  // Motorcycle: 285 x 50 mm (single line)
  // Scooter: 200 x 100 mm (two lines)
  const containerSizes = isScooter
    ? {
        sm: "max-w-[200px] h-[100px] p-2",
        md: "max-w-[280px] h-[140px] p-3",
        lg: "max-w-[340px] h-[170px] p-3.5",
      }[size]
    : {
        sm: "max-w-[340px] h-[60px] px-2.5",
        md: "max-w-[500px] h-[82px] sm:h-[88px] px-4",
        lg: "max-w-[620px] h-[96px] sm:h-[106px] px-5 sm:px-6",
      }[size];

  const fontSizes = isScooter
    ? {
        sm: "text-xs sm:text-sm font-black",
        md: "text-sm sm:text-lg md:text-xl font-black",
        lg: "text-base sm:text-xl md:text-2xl font-black",
      }[size]
    : {
        sm: "text-[10px] min-[360px]:text-xs sm:text-sm font-black tracking-tight",
        md: "text-xs min-[360px]:text-sm sm:text-base md:text-lg lg:text-xl font-black tracking-tight sm:tracking-normal",
        lg: "text-xs min-[360px]:text-sm sm:text-lg md:text-xl lg:text-2xl font-black tracking-tight sm:tracking-normal",
      }[size];

  return (
    <div className="w-full flex flex-col items-center justify-center select-none py-1">
      {/* Real Plate Container */}
      <div
        className={`w-full ${containerSizes} rounded-xl relative flex items-center justify-center transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.4)] ${
          isBlackAcrylic
            ? "bg-[#0a0a0a] border-2 border-neutral-700"
            : isYellow
            ? "bg-[#ffb703] border-2 border-neutral-900"
            : "bg-white border-2 border-neutral-900"
        }`}
      >
        {/* Left Mounting Screw */}
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-neutral-300 border border-neutral-600 shadow-inner flex items-center justify-center z-20">
          <div className="w-1.5 h-0.5 bg-neutral-700 transform rotate-45" />
        </div>

        {/* Right Mounting Screw */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-neutral-300 border border-neutral-600 shadow-inner flex items-center justify-center z-20">
          <div className="w-1.5 h-0.5 bg-neutral-700 transform rotate-45" />
        </div>

        {/* Inner Double Border Rectangle Frame */}
        <div
          className={`w-full h-full rounded-lg border-2 flex items-center justify-center px-4 relative overflow-hidden ${
            isBlackAcrylic
              ? "border-white bg-[#050505]"
              : isYellow
              ? "border-neutral-950 bg-[#ffb703]"
              : "border-neutral-950 bg-white"
          }`}
        >
          {/* Subtle Reflective Sheen Highlight */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none transform -skew-x-12" />

          {/* Plate Text Rendering */}
          {isScooter ? (
            /* 2-Line Layout for Scooter (200 x 100 mm) */
            <div className="flex flex-col items-center justify-center text-center z-10 leading-tight">
              <div
                className={`${fontSizes} ${
                  isBlackAcrylic ? "text-white" : "text-neutral-950"
                } whitespace-nowrap`}
              >
                <span>{metroCity || "ঢাকা মেট্রো"}</span>
                <span className="mx-1 text-neutral-400">-</span>
                <span>{vehicleClass || "ল"}</span>
              </div>
              <div
                className={`${fontSizes} font-mono ${
                  isBlackAcrylic ? "text-white" : "text-neutral-950"
                } whitespace-nowrap mt-0.5`}
              >
                <span>{seriesNumber || "১২"}</span>
                <span className="mx-1 text-neutral-400">-</span>
                <span>{plateNumber || "৩৪৫৬"}</span>
              </div>
            </div>
          ) : (
            /* Single-Line Layout for Motorcycle (285 x 50 mm) */
            <div className="flex items-center justify-center whitespace-nowrap text-nowrap flex-nowrap z-10 gap-1 sm:gap-2 font-bold">
              <span
                className={`${fontSizes} ${
                  isBlackAcrylic ? "text-white" : "text-neutral-950"
                }`}
              >
                {metroCity || "ঢাকা মেট্রো"}
              </span>

              <span
                className={`font-bold ${
                  isBlackAcrylic ? "text-neutral-400" : "text-neutral-700"
                }`}
              >
                -
              </span>

              <span
                className={`${fontSizes} ${
                  isBlackAcrylic ? "text-white" : "text-neutral-950"
                }`}
              >
                {vehicleClass || "ল"}
              </span>

              <span
                className={`font-bold ${
                  isBlackAcrylic ? "text-neutral-400" : "text-neutral-700"
                }`}
              >
                -
              </span>

              <span
                className={`${fontSizes} font-mono ${
                  isBlackAcrylic ? "text-white" : "text-neutral-950"
                }`}
              >
                {seriesNumber || "১২"}
              </span>

              <span
                className={`font-bold ${
                  isBlackAcrylic ? "text-neutral-400" : "text-neutral-700"
                }`}
              >
                -
              </span>

              <span
                className={`${fontSizes} font-mono ${
                  isBlackAcrylic ? "text-white" : "text-neutral-950"
                }`}
              >
                {plateNumber || "৩৪৫৬"}
              </span>
            </div>
          )}

          {/* Micro BRTA Watermark */}
          <div
            className={`absolute right-2 bottom-0.5 text-[6px] sm:text-[7px] font-mono tracking-widest uppercase font-semibold pointer-events-none opacity-50 ${
              isBlackAcrylic ? "text-neutral-400" : "text-neutral-600"
            }`}
          >
            BRTA
          </div>
        </div>
      </div>
    </div>
  );
}
