import { NextResponse } from "next/server";
import { getAllOrders } from "@/lib/db";

export async function GET() {
  const orders = getAllOrders();

  const headers = [
    "অর্ডার নম্বর",
    "তারিখ",
    "গ্রাহকের নাম",
    "মোবাইল",
    "ঠিকানা",
    "জেলা",
    "প্লেটের লেখা",
    "প্লেটের ধরন",
    "সাবটোটাল (৳)",
    "ডিসকাউন্ট (৳)",
    "ডেলিভারি (৳)",
    "মোট প্রদেয় (৳)",
    "অগ্রিম পরিশোধ (৳)",
    "বাকি COD (৳)",
    "পেমেন্ট মাধ্যম",
    "পেমেন্ট স্ট্যাটাস",
    "অর্ডার স্ট্যাটাস",
    "bKash TrxID",
  ];

  const rows = orders.map((o) => {
    const item = o.items[0];
    const plateText = item?.customDetails?.fullPlateText || "";
    const plateType =
      item?.plateType === "both"
        ? "সামনে + পেছনে"
        : item?.plateType === "back"
        ? "পেছনে"
        : "সামনে";

    return [
      `"${o.orderNumber}"`,
      `"${new Date(o.createdAt).toLocaleDateString("bn-BD")}"`,
      `"${(o.customerName || "").replace(/"/g, '""')}"`,
      `"${o.customerPhone}"`,
      `"${(o.deliveryAddress || "").replace(/"/g, '""')}"`,
      `"${o.district || ""}"`,
      `"${plateText.replace(/"/g, '""')}"`,
      `"${plateType}"`,
      o.originalSubtotal,
      o.discountAmount,
      o.shippingCharge,
      o.totalPayable,
      o.advanceAmount,
      o.remainingCodAmount,
      `"${o.paymentMethod}"`,
      `"${o.paymentStatus}"`,
      `"${o.orderStatus}"`,
      `"${o.bkashTrxId || ""}"`,
    ].join(",");
  });

  // UTF-8 BOM (\uFEFF) ensures Excel opens Bengali characters properly
  const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="bikeplate-orders-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}

