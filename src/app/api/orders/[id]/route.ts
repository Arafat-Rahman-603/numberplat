import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = getOrderById(id);

  if (!order) {
    return NextResponse.json(
      { success: false, error: "অর্ডারটি পাওয়া যায়নি" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, order });
}

