import { AdminSettings, DeliveryZone, PaymentMethod, PricingBreakdown } from "@/types";

export const DEFAULT_SETTINGS: AdminSettings = {
  discountOfferEnabled: true,
  discountPercentage: 30,
  minAdvanceAmount: 100,
  shippingInsideDhaka: 70,
  shippingOutsideDhaka: 130,
  frontPlatePrice: 350,
  backPlatePrice: 400,
  comboPlatePrice: 650,
  hotlinePhone: "01700-000000",
  whatsappNumber: "+8801700000000",
  announcementText: "সারাদেশে ক্যাশ অন ডেলিভারি সুবিধা | ১০০ টাকা অগ্রিম পেমেন্টে নিশ্চিত ৩০% ছাড়!",
};

export function getProductPrice(
  plateType: "front" | "back" | "both",
  settings: AdminSettings = DEFAULT_SETTINGS
): number {
  switch (plateType) {
    case "front":
      return settings.frontPlatePrice;
    case "back":
      return settings.backPlatePrice;
    case "both":
      return settings.comboPlatePrice;
    default:
      return settings.frontPlatePrice;
  }
}

export function calculateOrderPricing({
  subtotal,
  deliveryZone,
  paymentMethod,
  customAdvanceAmount,
  settings = DEFAULT_SETTINGS,
}: {
  subtotal: number;
  deliveryZone: DeliveryZone;
  paymentMethod: PaymentMethod;
  customAdvanceAmount?: number;
  settings?: AdminSettings;
}): PricingBreakdown {
  const shippingCharge =
    deliveryZone === "inside_dhaka"
      ? settings.shippingInsideDhaka
      : settings.shippingOutsideDhaka;

  let discountEligible = false;
  let discountPercentage = 0;
  let discountAmount = 0;
  let advanceAmount = 0;

  if (settings.discountOfferEnabled) {
    if (paymentMethod === "bkash_advance") {
      const requestedAdvance = Math.max(
        settings.minAdvanceAmount,
        Number(customAdvanceAmount) || settings.minAdvanceAmount
      );

      if (requestedAdvance >= settings.minAdvanceAmount) {
        discountEligible = true;
        discountPercentage = settings.discountPercentage;
        discountAmount = Math.round(subtotal * (discountPercentage / 100));
        advanceAmount = requestedAdvance;
      }
    } else if (paymentMethod === "bkash_full") {
      discountEligible = true;
      discountPercentage = settings.discountPercentage;
      discountAmount = Math.round(subtotal * (discountPercentage / 100));
      const discountedSub = Math.max(0, subtotal - discountAmount);
      advanceAmount = discountedSub + shippingCharge;
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const totalPayable = discountedSubtotal + shippingCharge;

  // Cap advance amount if it exceeds total payable
  const finalAdvance = Math.min(advanceAmount, totalPayable);
  const remainingCodAmount = Math.max(0, totalPayable - finalAdvance);

  return {
    originalSubtotal: subtotal,
    discountEligible,
    discountPercentage,
    discountAmount,
    discountedSubtotal,
    shippingCharge,
    totalPayable,
    advanceAmount: finalAdvance,
    remainingCodAmount,
  };
}

