import { getOrderById } from "@/lib/db";
import { notFound } from "next/navigation";
import OrderSuccessClient from "./OrderSuccessClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = getOrderById(id);
  return {
    title: order ? `অর্ডার নিশ্চিতকরণ - ${order.orderNumber}` : "অর্ডার সফল",
    description: "আপনার বাইকের নাম্বার প্লেট অর্ডারের বিবরণ ও ট্র্যাকিং তথ্য",
  };
}

export default async function OrderSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ status?: string; trxId?: string }>;
}) {
  const { id } = await params;
  const { status, trxId } = await searchParams;
  const order = getOrderById(id);

  if (!order) {
    notFound();
  }

  return <OrderSuccessClient order={order} initialStatus={status} initialTrxId={trxId} />;
}

