import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, updateOrder } from "@/lib/db";
import { bkashService } from "@/lib/bkash/service";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const paymentID = searchParams.get("paymentID");
  const status = searchParams.get("status");

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;

  if (!paymentID) {
    return NextResponse.redirect(`${baseUrl}/?error=invalid_payment_callback`);
  }

  // Find the order matching this paymentID
  const orders = getAllOrders();
  const order = orders.find((o) => o.bkashPaymentId === paymentID);

  if (!order) {
    return NextResponse.redirect(`${baseUrl}/?error=order_not_found`);
  }

  // Check if order was already executed (Idempotency protection against duplicate callbacks)
  if (order.bkashTrxId && (order.paymentStatus === "Advance Paid" || order.paymentStatus === "Fully Paid")) {
    return NextResponse.redirect(`${baseUrl}/order-success/${order.id}?status=paid&duplicate=1`);
  }

  if (status === "cancel") {
    updateOrder(order.id, {
      paymentStatus: "Failed",
      orderStatus: "Cancelled",
    });
    return NextResponse.redirect(`${baseUrl}/order-success/${order.id}?status=cancelled`);
  }

  if (status === "failure") {
    updateOrder(order.id, {
      paymentStatus: "Failed",
      orderStatus: "Awaiting Payment",
    });
    return NextResponse.redirect(`${baseUrl}/order-success/${order.id}?status=failed`);
  }

  if (status === "success") {
    try {
      const execution = await bkashService.executePayment(paymentID);

      if (execution.transactionStatus === "Completed" && execution.trxID) {
        const isFullPayment =
          order.paymentMethod === "bkash_full" ||
          order.advanceAmount >= order.totalPayable;

        const updated = updateOrder(order.id, {
          paymentStatus: isFullPayment ? "Fully Paid" : "Advance Paid",
          orderStatus: "Confirmed",
          bkashTrxId: execution.trxID,
          bkashPaymentDate: execution.paymentExecuteTime || new Date().toISOString(),
        });

        return NextResponse.redirect(
          `${baseUrl}/order-success/${order.id}?status=paid&trxId=${execution.trxID}`
        );
      } else {
        updateOrder(order.id, {
          paymentStatus: "Failed",
          orderStatus: "Awaiting Payment",
        });
        return NextResponse.redirect(
          `${baseUrl}/order-success/${order.id}?status=failed&reason=incomplete_transaction`
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[bKash Callback] Verification failed:", msg);
      updateOrder(order.id, {
        paymentStatus: "Failed",
      });
      return NextResponse.redirect(
        `${baseUrl}/order-success/${order.id}?status=failed&error=${encodeURIComponent(msg)}`
      );
    }
  }

  return NextResponse.redirect(`${baseUrl}/order-success/${order.id}?status=unknown`);
}

export async function POST(req: NextRequest) {
  return GET(req);
}

