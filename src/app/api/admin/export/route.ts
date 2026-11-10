import { NextRequest, NextResponse } from "next/server";
import { getAllOrders } from "@/lib/db";
import * as XLSX from "xlsx";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "xlsx";
  const orders = getAllOrders();

  const data = orders.map((o) => {
    const item = o.items[0];
    const plateText = item?.customDetails?.fullPlateText || "";
    const plateType =
      item?.plateType === "both"
        ? "সামনে + পেছনে"
        : item?.plateType === "back"
        ? "পেছনে"
        : "সামনে";

    return {
      "অর্ডার নম্বর": o.orderNumber,
      "তারিখ": new Date(o.createdAt).toLocaleDateString("bn-BD"),
      "গ্রাহকের নাম": o.customerName || "",
      "মোবাইল নম্বর": o.customerPhone || "",
      "ঠিকানা": o.deliveryAddress || "",
      "জেলা": o.district || "",
      "প্লেটের লেখা": plateText,
      "প্লেটের ধরন": plateType,
      "মূল প্রোডাক্ট মূল্য (৳)": o.originalSubtotal,
      "৩০% ছাড় (৳)": o.discountAmount,
      "ডেলিভারি চার্জ (৳)": o.shippingCharge,
      "সর্বমোট বিল (৳)": o.totalPayable,
      "বিকাশ অগ্রিম আদায় (৳)": o.advanceAmount,
      "বাকি COD (৳)": o.remainingCodAmount,
      "পেমেন্ট মাধ্যম": o.paymentMethod,
      "পেমেন্ট স্ট্যাটাস": o.paymentStatus,
      "অর্ডার স্ট্যাটাস": o.orderStatus,
      "bKash TrxID": o.bkashTrxId || "",
      "অর্ডারের নোট": o.notes || "",
    };
  });

  const dateStr = new Date().toISOString().slice(0, 10);

  if (format === "csv") {
    // Generate CSV with UTF-8 BOM
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csvContent = "\uFEFF" + XLSX.utils.sheet_to_csv(worksheet);
    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="bikeplate-orders-${dateStr}.csv"`,
      },
    });
  }

  // Generate standard Excel .xlsx workbook
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Column width settings for neat Excel display
  worksheet["!cols"] = [
    { wch: 15 }, // অর্ডার নম্বর
    { wch: 14 }, // তারিখ
    { wch: 22 }, // গ্রাহকের নাম
    { wch: 16 }, // মোবাইল নম্বর
    { wch: 32 }, // ঠিকানা
    { wch: 14 }, // জেলা
    { wch: 26 }, // প্লেটের লেখা
    { wch: 16 }, // প্লেটের ধরন
    { wch: 18 }, // মূল মূল্য
    { wch: 14 }, // ছাড়
    { wch: 18 }, // ডেলিভারি
    { wch: 16 }, // সর্বমোট বিল
    { wch: 18 }, // বিকাশ অগ্রিম
    { wch: 14 }, // বাকি COD
    { wch: 16 }, // পেমেন্ট মাধ্যম
    { wch: 16 }, // পেমেন্ট স্ট্যাটাস
    { wch: 16 }, // অর্ডার স্ট্যাটাস
    { wch: 20 }, // bKash TrxID
    { wch: 25 }, // নোট
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "BikePlate Orders");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="bikeplate-orders-${dateStr}.xlsx"`,
    },
  });
}
