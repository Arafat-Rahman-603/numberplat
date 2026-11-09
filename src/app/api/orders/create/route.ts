import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createOrder, getSettings } from "@/lib/db";
import { calculateOrderPricing, getProductPrice } from "@/lib/pricing/calculator";
import { bkashService } from "@/lib/bkash/service";
import { Order, OrderStatus, PaymentStatus } from "@/types";

const orderInputSchema = z.object({
  customerName: z.string().min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে"),
  customerPhone: z
    .string()
    .regex(/^(?:\+88|88)?01[3-9]\d{8}$/, "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন"),
  customerEmail: z.string().email("সঠিক ইমেইল এড্রেস দিন").optional().or(z.literal("")),
  deliveryAddress: z.string().min(5, "সম্পূর্ণ ঠিকানা লিখুন"),
  deliveryZone: z.enum(["inside_dhaka", "outside_dhaka"]),
  district: z.string().min(2, "জেলা নির্বাচন বা লিখুন"),
  notes: z.string().optional(),
  plateType: z.enum(["front", "back", "both"]),
  customDetails: z.object({
    plateType: z.enum(["front", "back", "both"]),
    vehicleType: z.enum(["motorcycle", "scooter"]).optional(),
    metroCity: z.string().min(1),
    vehicleClass: z.string().min(1),
    seriesNumber: z.string().min(1),
    plateNumber: z.string().min(1),
    fullPlateText: z.string().min(1),
    plateColor: z.enum(["black_acrylic", "white_reflective", "yellow_reflective"]).optional(),
  }),
  paymentMethod: z.enum(["cod", "bkash_advance", "bkash_full"]),
  customAdvanceAmount: z.number().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = orderInputSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: "ভুল ইনপুট তথ্য দেওয়া হয়েছে",
          details: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validated.data;
    const settings = getSettings();

    // Calculate product price server-side (prevent frontend price manipulation)
    const unitPrice = getProductPrice(data.plateType, settings);
    const quantity = 1;
    const originalSubtotal = unitPrice * quantity;

    // Calculate validated pricing, discount, and remaining COD amount
    const pricing = calculateOrderPricing({
      subtotal: originalSubtotal,
      deliveryZone: data.deliveryZone,
      paymentMethod: data.paymentMethod,
      customAdvanceAmount: data.customAdvanceAmount,
      settings,
    });

    const now = new Date();
    const dateStr = now.toISOString().slice(2, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `BP-${dateStr}-${randomSuffix}`;
    const orderId = `ord_${Date.now()}_${randomSuffix}`;

    let initialOrderStatus: OrderStatus = "Confirmed";
    let initialPaymentStatus: PaymentStatus = "Unpaid";

    if (data.paymentMethod === "bkash_advance" || data.paymentMethod === "bkash_full") {
      initialOrderStatus = "Awaiting Payment";
    }

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || undefined,
      deliveryAddress: data.deliveryAddress,
      deliveryZone: data.deliveryZone,
      district: data.district,
      notes: data.notes || undefined,
      items: [
        {
          id: `item_${Date.now()}`,
          name:
            data.plateType === "both"
              ? "সামনে + পেছনের প্লেট কম্বো"
              : data.plateType === "back"
              ? "প্রিমিয়াম ব্যাক নম্বর প্লেট"
              : "প্রিমিয়াম ফ্রন্ট নম্বর প্লেট",
          plateType: data.plateType,
          customDetails: data.customDetails,
          unitPrice,
          quantity,
        },
      ],
      originalSubtotal: pricing.originalSubtotal,
      discountPercentage: pricing.discountPercentage,
      discountAmount: pricing.discountAmount,
      discountedSubtotal: pricing.discountedSubtotal,
      shippingCharge: pricing.shippingCharge,
      totalPayable: pricing.totalPayable,
      advanceAmount: pricing.advanceAmount,
      remainingCodAmount: pricing.remainingCodAmount,
      paymentMethod: data.paymentMethod,
      paymentStatus: initialPaymentStatus,
      orderStatus: initialOrderStatus,
    };

    // If payment method is bKash, initialize bKash transaction
    if (data.paymentMethod === "bkash_advance" || data.paymentMethod === "bkash_full") {
      const advanceToPay = pricing.advanceAmount;

      try {
        const bkashResponse = await bkashService.createPayment({
          amount: advanceToPay,
          orderNumber,
          customerPhone: data.customerPhone,
        });

        newOrder.bkashPaymentId = bkashResponse.paymentID;
        createOrder(newOrder);

        return NextResponse.json({
          success: true,
          orderId: newOrder.id,
          orderNumber: newOrder.orderNumber,
          bkashUrl: bkashResponse.bkashURL,
          paymentID: bkashResponse.paymentID,
          requiresRedirect: true,
          isSandboxMock: bkashResponse.isSandboxMock || false,
        });
      } catch (bkashErr: unknown) {
        const errMsg = bkashErr instanceof Error ? bkashErr.message : String(bkashErr);
        console.error("Failed to initialize bKash payment:", errMsg);
        return NextResponse.json(
          {
            success: false,
            error: `বিকাশ পেমেন্ট শুরু করতে ব্যর্থ হয়েছে: ${errMsg}`,
          },
          { status: 500 }
        );
      }
    }

    // Cash on delivery: Save order and return success
    createOrder(newOrder);

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      requiresRedirect: false,
      redirectUrl: `/order-success/${newOrder.id}`,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Order creation error:", msg);
    return NextResponse.json(
      {
        success: false,
        error: "অর্ডারটি সম্পন্ন করা সম্ভব হয়নি। পুনরায় চেষ্টা করুন।",
      },
      { status: 500 }
    );
  }
}

