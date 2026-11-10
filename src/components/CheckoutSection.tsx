"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  Lock,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Gift,
} from "lucide-react";
import { CustomPlateDetails, DeliveryZone, PaymentMethod, PlateType } from "@/types";
import { calculateOrderPricing, getProductPrice } from "@/lib/pricing/calculator";

interface CheckoutSectionProps {
  customDetails: CustomPlateDetails;
  onUpdateCustomDetails: (details: CustomPlateDetails) => void;
  frontPlatePrice?: number;
  backPlatePrice?: number;
  comboPlatePrice?: number;
  shippingInsideDhaka?: number;
  shippingOutsideDhaka?: number;
  minAdvanceAmount?: number;
  discountPercentage?: number;
}

const BANGLADESH_DISTRICTS = [
  "ঢাকা",
  "চট্টগ্রাম",
  "গাজীপুর",
  "নারায়ণগঞ্জ",
  "সিলেট",
  "রাজশাহী",
  "খুলনা",
  "বরিশাল",
  "রংপুর",
  "ময়মনসিংহ",
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
  "ব্রাহ্মণবাড়িয়া",
  "কিশোরগঞ্জ",
  "মানিকগঞ্জ",
  "মুন্সীগঞ্জ",
  "নরসিংদী",
  "জামালপুর",
  "নেত্রকোণা",
  "শেরপুর",
  "হবিগঞ্জ",
  "মৌলভীবাজার",
  "সুনামগঞ্জ",
  "বাগেরহাট",
  "চুয়াডাঙ্গা",
  "ঝিনাইদহ",
  "মাগুরা",
  "মেহেরপুর",
  "নড়াইল",
  "সাতক্ষীরা",
  "চাঁপাইনবাবগঞ্জ",
  "জয়পুরহাট",
  "নওগাঁ",
  "নাটোর",
  "সিরাজগঞ্জ",
  "গাইবান্ধা",
  "কুড়িগ্রাম",
  "লালমনিরহাট",
  "নীলফামারী",
  "পঞ্চগড়",
  "ঠাকুরগাঁও",
  "বরগুনা",
  "ভোলা",
  "ঝালকাঠি",
  "পটুয়াখালী",
  "পিরোজপুর",
  "বান্দরবান",
  "চাঁদপুর",
  "ফেনী",
  "খাগড়াছড়ি",
  "লক্ষ্মীপুর",
  "রাঙ্গামাটি",
];

export default function CheckoutSection({
  customDetails,
  onUpdateCustomDetails,
  frontPlatePrice = 350,
  backPlatePrice = 400,
  comboPlatePrice = 650,
  shippingInsideDhaka = 70,
  shippingOutsideDhaka = 130,
  minAdvanceAmount = 100,
  discountPercentage = 30,
}: CheckoutSectionProps) {
  const router = useRouter();

  // Form State
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [district, setDistrict] = useState("ঢাকা");
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>("inside_dhaka");
  const [notes, setNotes] = useState("");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bkash_advance");
  const [customAdvance, setCustomAdvance] = useState<number>(minAdvanceAmount);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Determine subtotal based on selected plate type, vehicle type, and quantity
  const basePrice =
    customDetails.plateType === "both"
      ? comboPlatePrice
      : customDetails.plateType === "back"
      ? backPlatePrice
      : frontPlatePrice;
  const scooterExtra = customDetails.vehicleType === "scooter" ? 50 : 0;
  const quantity = Math.max(1, customDetails.quantity || 1);
  const currentSubtotal = (basePrice + scooterExtra) * quantity;

  // Real-time calculation
  const pricing = calculateOrderPricing({
    subtotal: currentSubtotal,
    deliveryZone,
    paymentMethod,
    customAdvanceAmount: customAdvance,
    settings: {
      discountOfferEnabled: true,
      discountPercentage,
      minAdvanceAmount,
      shippingInsideDhaka,
      shippingOutsideDhaka,
      frontPlatePrice,
      backPlatePrice,
      comboPlatePrice,
      hotlinePhone: "",
      whatsappNumber: "",
      announcementText: "",
    },
  });

  const handleZoneChange = (zone: DeliveryZone) => {
    setDeliveryZone(zone);
    if (zone === "inside_dhaka") {
      setDistrict("ঢাকা");
    } else if (district === "ঢাকা") {
      setDistrict("চট্টগ্রাম");
    }
  };

  const handlePackageChange = (type: PlateType) => {
    onUpdateCustomDetails({
      ...customDetails,
      plateType: type,
    });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!customerName.trim() || customerName.trim().length < 2) {
      setErrorMsg("অনুগ্রহ করে আপনার পুরো নাম লিখুন");
      return;
    }

    const phoneRegex = /^(?:\+88|88)?01[3-9]\d{8}$/;
    if (!phoneRegex.test(customerPhone.trim())) {
      setErrorMsg("অনুগ্রহ করে সঠিক ১১ ডিজিটের বাংলাদেশী মোবাইল নম্বর দিন (যেমন: 01712345678)");
      return;
    }

    if (!deliveryAddress.trim() || deliveryAddress.trim().length < 5) {
      setErrorMsg("অনুগ্রহ করে আপনার সম্পূর্ণ ডেলিভারি ঠিকানা দিন (বাড়ি, রাস্তা, এলাকা)");
      return;
    }

    const effectivePlateText =
      customDetails.fullPlateText?.trim() ||
      [
        customDetails.metroCity?.trim(),
        customDetails.vehicleClass?.trim(),
        customDetails.seriesNumber?.trim(),
        customDetails.plateNumber?.trim(),
      ]
        .filter(Boolean)
        .join("-") ||
      "ঢাকা মেট্রো-ল-১২-৩৪৫৬";

    const payloadCustomDetails = {
      ...customDetails,
      fullPlateText: effectivePlateText,
      metroCity: customDetails.metroCity || "ঢাকা মেট্রো",
      vehicleClass: customDetails.vehicleClass || "ল",
      seriesNumber: customDetails.seriesNumber || "১২",
      plateNumber: customDetails.plateNumber || "৩৪৫৬",
      quantity: Math.max(1, customDetails.quantity || 1),
    };

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          deliveryAddress: deliveryAddress.trim(),
          deliveryZone,
          district,
          notes: notes.trim(),
          plateType: customDetails.plateType,
          customDetails: payloadCustomDetails,
          paymentMethod,
          customAdvanceAmount: customAdvance,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.requiresRedirect && data.bkashUrl) {
          // Redirect customer to official bKash merchant gateway / sandbox
          window.location.href = data.bkashUrl;
        } else if (data.redirectUrl) {
          // Direct COD success
          router.push(data.redirectUrl);
        } else {
          router.push(`/order-success/${data.orderId}`);
        }
      } else {
        setErrorMsg(data.error || "অর্ডারটি প্রক্রিয়াকরণ করা সম্ভব হয়নি। আবার চেষ্টা করুন।");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("সার্ভারে সমস্যা দেখা দিয়েছে। ইন্টারনেট সংযোগ চেক করুন।");
      setIsSubmitting(false);
    }
  };

  return (
    <section id="checkout" className="py-16 bg-[#FDFBF7] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-200/60 px-3 py-1 rounded-full">
            সহজ ও দ্রুত চেকআউট
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 mt-2">
            আপনার নাম ঠিকানা দিয়ে অর্ডার করুন
          </h2>
          <p className="text-neutral-600 text-sm mt-1">
            ১০০ টাকা অগ্রিম পেমেন্টে ৩০% নিশ্চিত ছাড় অথবা ফুল ক্যাশ অন ডেলিভারিতে অর্ডার করুন
          </p>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
          {/* Left Column: Customer details, Package & Payment Methods */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Package Selection */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-neutral-200 shadow-sm">
              <h3 className="font-bold text-base text-neutral-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center font-mono">
                  ১
                </span>
                প্যাকেজ
              </h3>

              <div className="space-y-2.5">
                {/* Single Option: Front Plate */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-amber-500 bg-amber-50/60 ring-1 ring-amber-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border border-amber-600 bg-amber-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                    <div>
                      <span className="font-bold text-sm text-neutral-900 block">
                        শুধু সামনের প্লেট (Front Plate)
                      </span>
                      <span className="text-xs text-neutral-500">
                        {customDetails.vehicleType === "scooter"
                          ? "স্কুটার ২০০ × ১০০ মি.মি. সাইজ (+৳৫০)"
                          : "বাইকের ফ্রন্ট মাডগার্ডের জন্য স্ট্যান্ডার্ড সাইজ"}
                      </span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-neutral-900">
                    ৳{frontPlatePrice + (customDetails.vehicleType === "scooter" ? 50 : 0)}
                  </span>
                </div>
              </div>

              {/* Selected plate text confirmation */}
              <div className="mt-4 p-3 bg-neutral-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="text-neutral-600">প্লেটের খোদাইকৃত নম্বর:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-neutral-900 bg-white px-2.5 py-1 rounded border border-neutral-200 break-all text-center sm:text-right">
                    {customDetails.fullPlateText || "ঢাকা মেট্রো-ল-১২-৩৪৫৬"}
                  </span>
                  <a
                    href="#customizer"
                    className="text-amber-600 hover:text-amber-700 font-semibold underline text-[11px] shrink-0"
                  >
                    পরিবর্তন
                  </a>
                </div>
              </div>
            </div>

            {/* Step 2: Customer Information */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-neutral-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-neutral-900 mb-1 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center font-mono">
                  ২
                </span>
                ডেলিভারি ঠিকানা ও যোগাযোগের তথ্য
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    আপনার নাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="যেমন: মোঃ সাব্বির আহমেদ"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    মোবাইল নম্বর (১১ ডিজিট) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-mono text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Delivery Zone Selection */}
              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1.5">
                  ডেলিভারি এলাকা নির্বাচন করুন <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => handleZoneChange("inside_dhaka")}
                    className={`py-3 px-3.5 rounded-xl text-xs font-bold border transition flex justify-between items-center ${
                      deliveryZone === "inside_dhaka"
                        ? "border-amber-500 bg-amber-50 text-neutral-900 ring-1 ring-amber-500"
                        : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    <span>ঢাকার ভিতরে</span>
                    <span className="font-mono">৳{shippingInsideDhaka}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleZoneChange("outside_dhaka")}
                    className={`py-3 px-3.5 rounded-xl text-xs font-bold border transition flex justify-between items-center ${
                      deliveryZone === "outside_dhaka"
                        ? "border-amber-500 bg-amber-50 text-neutral-900 ring-1 ring-amber-500"
                        : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    <span>ঢাকার বাইরে (সমগ্র বাংলাদেশ)</span>
                    <span className="font-mono">৳{shippingOutsideDhaka}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    জেলা <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-semibold text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  >
                    {BANGLADESH_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 block mb-1">
                    সম্পূর্ণ ঠিকানা (বাসা/রাস্তা/এলাকা/থানা) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="বাড়ি নং, রোড নং, থানা..."
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-700 block mb-1">
                  বিশেষ কোনো নির্দেশনা (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="যেমন: মাডগার্ডের স্ক্রু সাইজ ইত্যাদি"
                  className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-neutral-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-neutral-900 mb-1 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs flex items-center justify-center font-mono">
                  ৩
                </span>
                পেমেন্ট পদ্ধতি পছন্দ করুন
              </h3>

              {/* Offer Banner */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/20 to-amber-500/10 border border-amber-400/40 rounded-2xl p-4 flex items-center gap-3">
                <Gift className="w-8 h-8 text-amber-600 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-neutral-900 text-sm">
                    ধামাকা অফার: মাত্র ১০০ টাকা অগ্রিম পেমেন্টে ৩০% নিশ্চিত ছাড়!
                  </p>
                  <p className="text-neutral-700 mt-0.5">
                    বিকাশে ১০০ টাকা অগ্রিম পরিশোধ করলে প্রোডাক্ট মূল্যের ওপর ৩০% ডিসকাউন্ট পাবেন। বাকি টাকা ক্যাশ অন ডেলিভারিতে দিতে পারবেন।
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                {/* Option 1: bKash Advance (Featured) */}
                <label
                  onClick={() => setPaymentMethod("bkash_advance")}
                  className={`flex flex-col p-4 rounded-2xl border cursor-pointer transition relative ${
                    paymentMethod === "bkash_advance"
                      ? "border-pink-500 bg-pink-50/40 ring-2 ring-pink-400/50"
                      : "border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  <span className="absolute -top-2.5 right-4 bg-[#E2136E] text-white text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    ৩০% ছাড় অফার
                  </span>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "bkash_advance"}
                        onChange={() => setPaymentMethod("bkash_advance")}
                        className="w-4 h-4 accent-[#E2136E]"
                      />
                      <div>
                        <span className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                          <span>বিকাশে অগ্রিম ১০০ টাকা পরিশোধ</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                            ৩০% ছাড় কার্যকর
                          </span>
                        </span>
                        <span className="text-xs text-neutral-500 mt-0.5 block">
                          এখন বিকাশে ১০০ টাকা পে করবেন, বাকি টাকা প্রোডাক্ট রিসিভের সময় দেবেন।
                        </span>
                      </div>
                    </div>
                  </div>

                  {paymentMethod === "bkash_advance" && (
                    <div className="mt-3 pt-3 border-t border-pink-200/60 flex items-center justify-between text-xs">
                      <span className="text-neutral-700 font-medium">অগ্রিম প্রদেয় পরিমাণ:</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCustomAdvance(100);
                          }}
                          className={`px-2.5 py-1 rounded-lg font-mono font-semibold text-xs border ${
                            customAdvance === 100
                              ? "bg-[#E2136E] text-white border-[#E2136E]"
                              : "bg-white text-neutral-700 border-neutral-300"
                          }`}
                        >
                          ৳১০০
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCustomAdvance(200);
                          }}
                          className={`px-2.5 py-1 rounded-lg font-mono font-semibold text-xs border ${
                            customAdvance === 200
                              ? "bg-[#E2136E] text-white border-[#E2136E]"
                              : "bg-white text-neutral-700 border-neutral-300"
                          }`}
                        >
                          ৳২০০
                        </button>
                      </div>
                    </div>
                  )}
                </label>

                {/* Option 2: Pure Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod("cod")}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === "cod"
                      ? "border-amber-500 bg-amber-50/40 ring-2 ring-amber-400/50"
                      : "border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="w-4 h-4 accent-amber-500"
                    />
                    <div>
                      <span className="font-bold text-sm text-neutral-900 block">
                        ফুল ক্যাশ অন ডেলিভারি (COD)
                      </span>
                      <span className="text-xs text-neutral-500">
                        কোনো অগ্রিম পেমেন্ট নেই। সম্পূর্ণ টাকা প্রোডাক্ট হাতে পেয়ে পরিশোধ করবেন (নিয়মিত মূল্য প্রযোজ্য)।
                      </span>
                    </div>
                  </div>
                  <Truck className="w-5 h-5 text-neutral-500 shrink-0" />
                </label>

                {/* Option 3: Full Payment via bKash */}
                <label
                  onClick={() => setPaymentMethod("bkash_full")}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                    paymentMethod === "bkash_full"
                      ? "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-400/50"
                      : "border-neutral-200 hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "bkash_full"}
                      onChange={() => setPaymentMethod("bkash_full")}
                      className="w-4 h-4 accent-emerald-500"
                    />
                    <div>
                      <span className="font-bold text-sm text-neutral-900 block">
                        বিকাশে সম্পূর্ণ মূল্য পরিশোধ (Full bKash Payment)
                      </span>
                      <span className="text-xs text-neutral-500">
                        ৩০% ছাড় সহ সম্পূর্ণ টাকা একবারে পে করুন, ডেলিভারির সময় কোনো টাকা দিতে হবে না।
                      </span>
                    </div>
                  </div>
                  <CreditCard className="w-5 h-5 text-[#E2136E] shrink-0" />
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Price Breakdown Card & Order Submit */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 self-start z-10">
            <div className="bg-neutral-900 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 border border-neutral-800 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  অর্ডারের টাকার হিসাব (Order Summary)
                </h3>
                <span className="text-[10px] bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded font-mono">
                  VERIFIED
                </span>
              </div>

              {/* Breakdown Items */}
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex justify-between text-neutral-300">
                  <span>প্রোডাক্ট নিয়মিত মূল্য</span>
                  <span className="font-mono text-white">৳ {pricing.originalSubtotal}</span>
                </div>

                {pricing.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold bg-emerald-950/30 p-2 rounded-lg border border-emerald-800/40">
                    <span>৩০% নিশ্চিত স্পেশাল ছাড়</span>
                    <span className="font-mono">- ৳ {pricing.discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-300">
                  <span>
                    ডেলিভারি চার্জ ({deliveryZone === "inside_dhaka" ? "ঢাকার ভিতরে" : "ঢাকার বাইরে"})
                  </span>
                  <span className="font-mono text-white">৳ {pricing.shippingCharge}</span>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex justify-between font-bold text-base text-white">
                  <span>সর্বমোট বিল (Total Payable)</span>
                  <span className="font-mono text-amber-400">৳ {pricing.totalPayable}</span>
                </div>

                {/* Advance Amount Row */}
                {pricing.advanceAmount > 0 && (
                  <div className="flex justify-between text-pink-400 font-semibold bg-pink-950/40 p-2.5 rounded-xl border border-pink-900/40">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-[#E2136E]" />
                      বিকাশে অগ্রিম প্রদেয়
                    </span>
                    <span className="font-mono">৳ {pricing.advanceAmount}</span>
                  </div>
                )}

                {/* Remaining COD Balance */}
                <div className="flex justify-between text-amber-300 font-extrabold bg-amber-500/10 p-3.5 rounded-2xl border border-amber-500/30 text-base">
                  <span className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-amber-400" />
                    ডেলিভারির সময় প্রদেয় (COD)
                  </span>
                  <span className="font-mono text-2xl text-amber-400">
                    ৳ {pricing.remainingCodAmount}
                  </span>
                </div>
              </div>

              {/* Error Alert */}
              {errorMsg && (
                <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Order Confirmation Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-400 hover:bg-amber-300 text-neutral-950 font-black py-4 px-6 rounded-2xl transition shadow-[0_8px_20px_rgba(245,158,11,0.3)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-base sm:text-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>অর্ডার প্রসেস হচ্ছে...</span>
                ) : paymentMethod === "bkash_advance" ? (
                  <>
                    <span>বিকাশে ৳{pricing.advanceAmount} দিয়ে ৩০% ছাড় নিন</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                ) : paymentMethod === "bkash_full" ? (
                  <>
                    <span>বিকাশে ৳{pricing.totalPayable} পে করে অর্ডার করুন</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <span>ক্যাশ অন ডেলিভারিতে অর্ডার নিশ্চিত করুন</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Direct WhatsApp Order Alternative */}
              <a
                href={`https://wa.me/8801700000000?text=${encodeURIComponent(
                  `আসসালামু আলাইকুম! আমি বাইকের বাংলা প্লেট অর্ডার করতে চাই:\n\n` +
                  `• প্লেটের লেখা: ${customDetails.fullPlateText}\n` +
                  `• প্যাকেজ: ${customDetails.plateType === "both" ? "সামনে+পেছনে কম্বো" : customDetails.plateType === "back" ? "পেছনের প্লেট" : "সামনের প্লেট"}\n` +
                  `• নাম: ${customerName || "নাম উল্লেখ করা হয়নি"}\n` +
                  `• ফোন: ${customerPhone || "ফোন উল্লেখ করা হয়নি"}\n` +
                  `• ঠিকানা: ${deliveryAddress || "ঠিকানা উল্লেখ করা হয়নি"}, ${district}\n` +
                  `• মোট বিল: ৳${pricing.totalPayable}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 border border-emerald-600/50"
              >
                <span>হোয়াটসঅ্যাপে সরাসরি অর্ডার পাঠান</span>
              </a>

              <div className="pt-2 text-center text-[11px] text-neutral-400 space-y-1">
                <p className="flex items-center justify-center gap-1.5 text-neutral-300">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>অফিসিয়াল bKash Merchant API দ্বারা সুরক্ষিত</span>
                </p>
                <p>পণ্য চেক করে বাকি টাকা ডেলিভারি ম্যানের হাতে দেবেন</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}

