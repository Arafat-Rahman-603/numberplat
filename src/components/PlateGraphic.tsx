"use client";

import React from "react";
import { convertToBengaliDigits, parseQuickPlateString } from "@/lib/plate-parser";

interface PlateGraphicProps {
  metroCity?: string;
  vehicleClass?: string;
  seriesNumber?: string;
  plateNumber?: string;
  fullPlateText?: string;
  rawInput?: string;
  plateType?: "front" | "back" | "both";
  vehicleType?: "motorcycle" | "scooter";
  hasBorder?: boolean;
  color?: "white_reflective" | "black_acrylic" | "yellow_reflective";
  size?: "sm" | "md" | "lg";
}

export default function PlateGraphic({
  metroCity = "ঢাকা মেট্রো",
  vehicleClass = "ল",
  seriesNumber = "১২",
  plateNumber = "৩৪৫৬",
  fullPlateText,
  rawInput,
  vehicleType = "motorcycle",
  hasBorder = true,
  color = "white_reflective",
  size = "lg",
}: PlateGraphicProps) {
  const isScooter = vehicleType === "scooter";
  const isBlackAcrylic = color === "black_acrylic";
  const isYellow = color === "yellow_reflective";

  // Compute text segments reactively
  let city = metroCity?.trim() || "";
  let vClass = vehicleClass?.trim() || "";
  let series = seriesNumber?.trim() || "";
  let pNum = plateNumber?.trim() || "";

  // If rawInput or fullPlateText is provided and field values are empty, parse it
  const incoming = (rawInput?.trim() || fullPlateText?.trim() || "");
  if (incoming && (!city || !vClass || !series || !pNum)) {
    const parsed = parseQuickPlateString(incoming);
    if (!city && parsed.metroCity) city = parsed.metroCity;
    if (!vClass && parsed.vehicleClass) vClass = parsed.vehicleClass;
    if (!series && parsed.seriesNumber) series = parsed.seriesNumber;
    if (!pNum && parsed.plateNumber) pNum = parsed.plateNumber;
  }

  // Fallbacks for display preview if still empty (as stated in reference: "নম্বর পূরণ না হওয়া পর্যন্ত নমুনা দেখাচ্ছে")
  const displayCity = city || "ঢাকা মেট্রো";
  const displayClass = vClass || "ল";
  const displaySeries = convertToBengaliDigits(series || "১২");
  const displayNumber = convertToBengaliDigits(pNum || "৩৪৫৬");

  // Official BRTA Circular Dimensions:
  // Motorcycle: 285 × 50 mm (Aspect ratio: 285 / 50 = 5.7 : 1)
  // Scooter: 200 × 100 mm (Aspect ratio: 200 / 100 = 2 : 1)
  const containerSizes = isScooter
    ? {
        sm: "w-full max-w-[190px] aspect-[200/100]",
        md: "w-full max-w-[240px] aspect-[200/100]",
        lg: "w-full max-w-[280px] sm:max-w-[300px] aspect-[200/100]",
      }[size]
    : {
        sm: "w-full max-w-[320px] aspect-[285/50]",
        md: "w-full max-w-[440px] aspect-[285/50]",
        lg: "w-full max-w-[480px] sm:max-w-[520px] aspect-[285/50]",
      }[size];

  const fontSizes = isScooter
    ? {
        sm: "text-xs sm:text-sm font-extrabold leading-tight",
        md: "text-base sm:text-lg md:text-xl font-extrabold leading-tight",
        lg: "text-lg sm:text-2xl md:text-3xl font-extrabold leading-tight",
      }[size]
    : {
        sm: "text-[11px] min-[360px]:text-xs sm:text-sm md:text-base font-extrabold tracking-tight",
        md: "text-xs min-[360px]:text-sm sm:text-base md:text-lg font-extrabold tracking-tight",
        lg: "text-xs min-[360px]:text-sm sm:text-lg md:text-xl lg:text-2xl font-extrabold tracking-tight",
      }[size];

  const singleLineText = `${displayCity}-${displayClass}-${displaySeries}-${displayNumber}`;

  return (
    <div className="w-full flex items-center justify-center select-none py-1">
      {/* Plate Outer Body (Clean White, Rounded Corners) */}
      <div
        className={`${containerSizes} rounded-md sm:rounded-lg relative flex items-center justify-center transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.35)] p-1 sm:p-1.5 ${
          isBlackAcrylic
            ? "bg-[#0a0a0a]"
            : isYellow
            ? "bg-[#ffb703]"
            : "bg-white"
        }`}
      >
        {/* Inner Border Frame (if hasBorder is true) */}
        <div
          className={`w-full h-full rounded-xs sm:rounded flex items-center justify-center px-2 sm:px-3 text-center overflow-hidden transition-all ${
            hasBorder
              ? isBlackAcrylic
                ? "border-[2px] sm:border-[2.5px] border-white"
                : isYellow
                ? "border-[2px] sm:border-[2.5px] border-neutral-950"
                : "border-[2px] sm:border-[2.5px] border-neutral-950"
              : "border-0"
          }`}
        >
          {isScooter ? (
            /* Scooter 2-Line Layout (200 × 100 mm) */
            <div className="flex flex-col items-center justify-center text-center leading-tight">
              <span
                className={`${fontSizes} ${
                  isBlackAcrylic ? "text-white" : "text-neutral-950"
                } whitespace-nowrap`}
              >
                {displayCity}-{displayClass}
              </span>
              <span
                className={`${fontSizes} font-mono ${
                  isBlackAcrylic ? "text-white" : "text-neutral-950"
                } whitespace-nowrap mt-0.5 sm:mt-1`}
              >
                {displaySeries}-{displayNumber}
              </span>
            </div>
          ) : (
            /* Motorcycle 1-Line Layout (285 × 50 mm) */
            <div className="flex items-center justify-center text-center whitespace-nowrap">
              <span
                className={`${fontSizes} ${
                  isBlackAcrylic ? "text-white" : "text-neutral-950"
                } whitespace-nowrap font-sans font-extrabold`}
              >
                {singleLineText}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
