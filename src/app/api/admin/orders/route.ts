import { NextRequest, NextResponse } from "next/server";
import { getAllOrders } from "@/lib/db";
import { OrderStatus, PaymentStatus } from "@/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase() || "";
  const status = searchParams.get("status") as OrderStatus | "all" | null;
  const paymentStatus = searchParams.get("paymentStatus") as PaymentStatus | "all" | null;

  let orders = getAllOrders();

  if (search) {
    orders = orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(search) ||
        o.customerName.toLowerCase().includes(search) ||
        o.customerPhone.includes(search) ||
        o.district.toLowerCase().includes(search) ||
        o.items.some((i) => i.customDetails.fullPlateText.toLowerCase().includes(search))
    );
  }

  if (status && status !== "all") {
    orders = orders.filter((o) => o.orderStatus === status);
  }

  if (paymentStatus && paymentStatus !== "all") {
    orders = orders.filter((o) => o.paymentStatus === paymentStatus);
  }

  // Summary statistics
  const allOrders = getAllOrders();
  const totalOrders = allOrders.length;
  const totalRevenue = allOrders
    .filter((o) => o.orderStatus !== "Cancelled")
    .reduce((sum, o) => sum + o.totalPayable, 0);
  const totalAdvanceCollected = allOrders
    .filter((o) => o.paymentStatus === "Advance Paid" || o.paymentStatus === "Fully Paid")
    .reduce((sum, o) => sum + o.advanceAmount, 0);
  const totalCodPending = allOrders
    .filter((o) => o.orderStatus !== "Cancelled" && o.orderStatus !== "Delivered")
    .reduce((sum, o) => sum + o.remainingCodAmount, 0);

  const statusCounts: Record<string, number> = {};
  allOrders.forEach((o) => {
    statusCounts[o.orderStatus] = (statusCounts[o.orderStatus] || 0) + 1;
  });

  return NextResponse.json({
    success: true,
    orders,
    stats: {
      totalOrders,
      totalRevenue,
      totalAdvanceCollected,
      totalCodPending,
      statusCounts,
    },
  });
}

