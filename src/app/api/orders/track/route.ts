import { NextRequest, NextResponse } from "next/server";
import { getAllOrders } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.trim() || "";

  if (!query) {
    return NextResponse.json(
      { success: false, error: "মোবাইল নম্বর অথবা অর্ডার নম্বর দিন" },
      { status: 400 }
    );
  }

  const cleanQuery = query.replace(/\D/g, "");
  const orders = getAllOrders();

  const matchedOrders = orders.filter((o) => {
    const phoneClean = o.customerPhone.replace(/\D/g, "");
    const matchesPhone = cleanQuery.length >= 8 && phoneClean.includes(cleanQuery);
    const matchesOrderNo = o.orderNumber.toLowerCase() === query.toLowerCase();
    const matchesId = o.id.toLowerCase() === query.toLowerCase();
    return matchesPhone || matchesOrderNo || matchesId;
  });

  return NextResponse.json({
    success: true,
    orders: matchedOrders,
  });
}

