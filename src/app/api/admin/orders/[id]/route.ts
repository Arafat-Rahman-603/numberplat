import { NextRequest, NextResponse } from "next/server";
import { getOrderById, updateOrder } from "@/lib/db";
import { OrderStatus, PaymentStatus } from "@/types";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = getOrderById(id);

  if (!order) {
    return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, order });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const order = getOrderById(id);

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const updates: Partial<{
      orderStatus: OrderStatus;
      paymentStatus: PaymentStatus;
      notes: string;
      advanceAmount: number;
      remainingCodAmount: number;
    }> = {};

    if (body.orderStatus) updates.orderStatus = body.orderStatus;
    if (body.paymentStatus) updates.paymentStatus = body.paymentStatus;
    if (body.notes !== undefined) updates.notes = body.notes;
    if (body.advanceAmount !== undefined) {
      updates.advanceAmount = Number(body.advanceAmount);
      updates.remainingCodAmount = Math.max(0, order.totalPayable - updates.advanceAmount);
    }

    const updated = updateOrder(id, updates);

    return NextResponse.json({ success: true, order: updated });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: "Failed to update order" },
      { status: 500 }
    );
  }
}

