import { describe, it, expect } from "vitest";
import { calculateOrderPricing, DEFAULT_SETTINGS } from "../calculator";

describe("Pricing and Discount Calculator Engine", () => {
  it("calculates normal Cash on Delivery order with 0% discount", () => {
    const result = calculateOrderPricing({
      subtotal: 1000,
      deliveryZone: "inside_dhaka",
      paymentMethod: "cod",
    });

    expect(result.originalSubtotal).toBe(1000);
    expect(result.discountEligible).toBe(false);
    expect(result.discountAmount).toBe(0);
    expect(result.discountedSubtotal).toBe(1000);
    expect(result.shippingCharge).toBe(70);
    expect(result.totalPayable).toBe(1070);
    expect(result.advanceAmount).toBe(0);
    expect(result.remainingCodAmount).toBe(1070);
  });

  it("applies 30% discount on ৳100 advance payment as per prompt requirement", () => {
    const result = calculateOrderPricing({
      subtotal: 1000,
      deliveryZone: "inside_dhaka",
      paymentMethod: "bkash_advance",
      customAdvanceAmount: 100,
    });

    // Original product price: ৳1,000
    // 30% discount: ৳300
    // Discounted product price: ৳700
    // Shipping: ৳70
    // Advance payment: ৳100
    // Remaining COD payment: ৳670
    expect(result.originalSubtotal).toBe(1000);
    expect(result.discountEligible).toBe(true);
    expect(result.discountPercentage).toBe(30);
    expect(result.discountAmount).toBe(300);
    expect(result.discountedSubtotal).toBe(700);
    expect(result.shippingCharge).toBe(70);
    expect(result.totalPayable).toBe(770);
    expect(result.advanceAmount).toBe(100);
    expect(result.remainingCodAmount).toBe(670);
  });

  it("handles advance payment greater than ৳100 properly", () => {
    const result = calculateOrderPricing({
      subtotal: 1000,
      deliveryZone: "outside_dhaka",
      paymentMethod: "bkash_advance",
      customAdvanceAmount: 250,
    });

    expect(result.discountAmount).toBe(300);
    expect(result.discountedSubtotal).toBe(700);
    expect(result.shippingCharge).toBe(130);
    expect(result.totalPayable).toBe(830);
    expect(result.advanceAmount).toBe(250);
    expect(result.remainingCodAmount).toBe(580);
  });

  it("handles Full bKash Payment with 30% discount", () => {
    const result = calculateOrderPricing({
      subtotal: 650, // Combo package
      deliveryZone: "inside_dhaka",
      paymentMethod: "bkash_full",
    });

    // 650 * 0.3 = 195 discount
    // 650 - 195 = 455 discounted subtotal
    // 455 + 70 shipping = 525 total payable
    // Advance = 525, remaining = 0
    expect(result.discountAmount).toBe(195);
    expect(result.discountedSubtotal).toBe(455);
    expect(result.shippingCharge).toBe(70);
    expect(result.totalPayable).toBe(525);
    expect(result.advanceAmount).toBe(525);
    expect(result.remainingCodAmount).toBe(0);
  });

  it("respects admin settings when discount is disabled", () => {
    const customSettings = {
      ...DEFAULT_SETTINGS,
      discountOfferEnabled: false,
    };

    const result = calculateOrderPricing({
      subtotal: 1000,
      deliveryZone: "inside_dhaka",
      paymentMethod: "bkash_advance",
      customAdvanceAmount: 100,
      settings: customSettings,
    });

    expect(result.discountEligible).toBe(false);
    expect(result.discountAmount).toBe(0);
    expect(result.discountedSubtotal).toBe(1000);
    expect(result.totalPayable).toBe(1070);
  });

  it("prevents negative remaining balance if advance exceeds total", () => {
    const result = calculateOrderPricing({
      subtotal: 350,
      deliveryZone: "inside_dhaka",
      paymentMethod: "bkash_advance",
      customAdvanceAmount: 9999,
    });

    expect(result.remainingCodAmount).toBe(0);
    expect(result.advanceAmount).toBe(result.totalPayable);
  });
});

