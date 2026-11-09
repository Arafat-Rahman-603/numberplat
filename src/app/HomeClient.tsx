"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ValueStepsSection from "@/components/ValueStepsSection";
import SpecificationsSection from "@/components/SpecificationsSection";
import GallerySection from "@/components/GallerySection";
import DarkQuoteBanner from "@/components/DarkQuoteBanner";
import VideoReviewsSection from "@/components/VideoReviewsSection";
import PlateCustomizer from "@/components/PlateCustomizer";
import CheckoutSection from "@/components/CheckoutSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";
import StickyMobileBar from "@/components/StickyMobileBar";
import { AdminSettings, CustomPlateDetails } from "@/types";

export default function HomeClient({
  initialSettings,
}: {
  initialSettings: AdminSettings;
}) {
  const [customDetails, setCustomDetails] = useState<CustomPlateDetails>({
    plateType: "front",
    vehicleType: "motorcycle",
    metroCity: "",
    vehicleClass: "",
    seriesNumber: "",
    plateNumber: "",
    fullPlateText: "",
    plateColor: "white_reflective",
    hasBorder: true,
    quantity: 1,
  });

  const scrollToCheckout = () => {
    const el = document.getElementById("checkout");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToCustomizer = () => {
    const el = document.getElementById("customizer");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectSample = (sample: {
    metroCity: string;
    vehicleClass: string;
    seriesNumber: string;
    plateNumber: string;
    plateType: "front" | "back" | "both";
  }) => {
    setCustomDetails({
      ...customDetails,
      ...sample,
      fullPlateText: `${sample.metroCity}-${sample.vehicleClass}-${sample.seriesNumber}-${sample.plateNumber}`,
    });
    scrollToCustomizer();
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col font-sans selection:bg-amber-400 selection:text-neutral-950">
      {/* Navbar with Announcement */}
      <Navbar
        hotlinePhone={initialSettings.hotlinePhone}
        whatsappNumber={initialSettings.whatsappNumber}
        announcementText={initialSettings.announcementText}
      />

      {/* Hero Section */}
      <HeroSection
        frontPlatePrice={initialSettings.frontPlatePrice}
        onOrderClick={scrollToCheckout}
      />

      {/* 3 Step Value Proposition */}
      <ValueStepsSection />

      {/* Specifications & Feature Table */}
      <SpecificationsSection />

      {/* Customer Plate Gallery */}
      <GallerySection onSelectSamplePlate={handleSelectSample} />

      {/* Dark Quote & Pricing Summary Callout */}
      <DarkQuoteBanner
        frontPlatePrice={initialSettings.frontPlatePrice}
        onOrderClick={scrollToCheckout}
      />

      {/* Video Reels Quality Testing */}
      <VideoReviewsSection />

      {/* Interactive Plate Customizer */}
      <PlateCustomizer
        customDetails={customDetails}
        onChange={setCustomDetails}
        onProceedToOrder={scrollToCheckout}
      />

      {/* Checkout and Payment System */}
      <CheckoutSection
        customDetails={customDetails}
        onUpdateCustomDetails={setCustomDetails}
        frontPlatePrice={initialSettings.frontPlatePrice}
        backPlatePrice={initialSettings.backPlatePrice}
        comboPlatePrice={initialSettings.comboPlatePrice}
        shippingInsideDhaka={initialSettings.shippingInsideDhaka}
        shippingOutsideDhaka={initialSettings.shippingOutsideDhaka}
        minAdvanceAmount={initialSettings.minAdvanceAmount}
        discountPercentage={initialSettings.discountPercentage}
      />

      {/* FAQ Accordion */}
      <FaqSection />

      {/* Footer */}
      <Footer
        hotlinePhone={initialSettings.hotlinePhone}
        whatsappNumber={initialSettings.whatsappNumber}
      />

      {/* Sticky Mobile Bar */}
      <StickyMobileBar
        price={
          customDetails.plateType === "both"
            ? initialSettings.comboPlatePrice
            : customDetails.plateType === "back"
            ? initialSettings.backPlatePrice
            : initialSettings.frontPlatePrice
        }
        onOrderClick={scrollToCheckout}
      />
    </div>
  );
}

