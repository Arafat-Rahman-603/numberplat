"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Order } from "@/types";
import PlateGraphic from "@/components/PlateGraphic";
import {
  CheckCircle,
  PackageCheck,
  AlertTriangle,
  Printer,
  Home,
  Clock,
  MapPin,
  Phone,
  CreditCard,
  ShieldCheck,
  Truck,
} from "lucide-react";

export default function OrderSuccessClient({
  order,
  initialStatus,
  initialTrxId,
}: {
  order: Order;
  initialStatus?: string;
  initialTrxId?: string;
}) {
  useEffect(() => {
    // Confetti effect on load if confirmed or paid
    if (order.orderStatus === "Confirmed" || order.paymentStatus === "Advance Paid" || order.paymentStatus === "Fully Paid") {
      import("canvas-confetti").then((confetti) => {
        confetti.default({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#F59E0B", "#10B981", "#3B82F6", "#E2136E"],
        });
      });
    }
  }, [order.orderStatus, order.paymentStatus]);

  const item = order.items[0];
  const isAdvancePaid = order.paymentStatus === "Advance Paid";
  const isFullyPaid = order.paymentStatus === "Fully Paid";
  const isFailed = initialStatus === "failed" || order.paymentStatus === "Failed";
  const isCancelled = initialStatus === "cancelled" || order.orderStatus === "Cancelled";

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Status Card */}
        <div className="bg-neutral-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-neutral-700 shadow-xl text-center">
          {isFailed ? (
            <div className="inline-flex p-4 bg-rose-500/10 text-rose-400 rounded-full mb-4 border border-rose-500/20">
              <AlertTriangle className="w-12 h-12" />
            </div>
          ) : isCancelled ? (
            <div className="inline-flex p-4 bg-amber-500/10 text-amber-400 rounded-full mb-4 border border-amber-500/20">
              <Clock className="w-12 h-12" />
            </div>
          ) : (
            <div className="inline-flex p-4 bg-emerald-500/10 text-emerald-400 rounded-full mb-4 border border-emerald-500/20 animate-pulse">
              <CheckCircle className="w-12 h-12" />
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-black mb-2">
            {isFailed
              ? "পেমেন্ট সম্পন্ন হতে ব্যর্থ হয়েছে"
              : isCancelled
              ? "পেমেন্ট বাতিল করা হয়েছে"
              : "আপনার অর্ডারটি সফলভাবে গৃহীত হয়েছে!"}
          </h1>

          <p className="text-neutral-400 text-sm max-w-md mx-auto mb-4">
            {isFailed
              ? "আপনার বিকাশ পেমেন্টটি ব্যর্থ হয়েছে। আপনি চাইলে ক্যাশ অন ডেলিভারিতে অর্ডারটি কনফার্ম করতে আমাদের সাথে যোগাযোগ করতে পারেন।"
              : "আমাদের প্রতিনিধি দ্রুততম সময়ে আপনার সাথে যোগাযোগ করে অর্ডারটি প্রস্তুত ও ডেলিভারি করবেন।"}
          </p>

          <div className="inline-flex items-center gap-3 bg-neutral-900/80 px-4 py-2 rounded-xl border border-neutral-700 text-sm">
            <span className="text-neutral-400">অর্ডার নম্বর:</span>
            <span className="font-mono font-bold text-amber-400 text-base">{order.orderNumber}</span>
          </div>

          {/* bKash TrxID notice if available */}
          {(order.bkashTrxId || initialTrxId) && (
            <div className="mt-3 inline-flex items-center gap-2 bg-pink-950/50 text-pink-300 px-3 py-1.5 rounded-lg border border-pink-800/40 text-xs font-mono">
              <CreditCard className="w-3.5 h-3.5 text-[#E2136E]" />
              <span>বিকাশ TrxID: {order.bkashTrxId || initialTrxId}</span>
            </div>
          )}
        </div>

        {/* Plate Preview Display */}
        {item && item.customDetails && (
          <div className="bg-neutral-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-neutral-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                আপনার কাস্টমাইজড নম্বর প্লেট
              </h2>
              <span className="text-xs bg-amber-400/10 text-amber-400 px-2.5 py-1 rounded-full border border-amber-400/20 font-medium">
                {item.plateType === "both" ? "সামনে + পেছনে" : item.plateType === "back" ? "পেছনের প্লেট" : "সামনের প্লেট"}
              </span>
            </div>

            <div className="bg-black/90 p-3 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-neutral-700 flex flex-col items-center justify-center text-center shadow-inner overflow-hidden">
              <PlateGraphic
                metroCity={item.customDetails.metroCity}
                vehicleClass={item.customDetails.vehicleClass}
                seriesNumber={item.customDetails.seriesNumber}
                plateNumber={item.customDetails.plateNumber}
                plateType={item.plateType}
                color={item.customDetails.plateColor || "black_acrylic"}
                size="md"
              />
            </div>
          </div>
        )}

        {/* Pricing Summary Card */}
        <div className="bg-neutral-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-neutral-700 shadow-xl">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-amber-400" />
            পেমেন্ট ও টাকার হিসাব
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-neutral-300">
              <span>প্রোডাক্টের নিয়মিত মূল্য</span>
              <span className="font-mono">৳ {order.originalSubtotal}</span>
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400 font-medium">
                <span>৩০% অগ্রিম স্পেশাল ছাড়</span>
                <span className="font-mono">- ৳ {order.discountAmount}</span>
              </div>
            )}

            <div className="flex justify-between text-neutral-300">
              <span>ডেলিভারি চার্জ ({order.deliveryZone === "inside_dhaka" ? "ঢাকার ভিতরে" : "ঢাকার বাইরে"})</span>
              <span className="font-mono">৳ {order.shippingCharge}</span>
            </div>

            <div className="pt-3 border-t border-neutral-700 flex justify-between font-bold text-base text-white">
              <span>সর্বমোট প্রদেয়</span>
              <span className="font-mono text-amber-400">৳ {order.totalPayable}</span>
            </div>

            {/* Advance payment */}
            <div className="flex justify-between text-pink-400 font-semibold bg-pink-950/20 p-2.5 rounded-xl border border-pink-900/30">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#E2136E]" />
                বিকাশে অগ্রিম পরিশোধিত
              </span>
              <span className="font-mono">৳ {order.advanceAmount}</span>
            </div>

            {/* Remaining Cash on delivery balance */}
            <div className="flex justify-between text-amber-300 font-bold bg-amber-500/10 p-3 rounded-xl border border-amber-500/30 text-base">
              <span className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-400" />
                ডেলিভারির সময় প্রদেয় (COD বাকি)
              </span>
              <span className="font-mono text-xl text-amber-400">৳ {order.remainingCodAmount}</span>
            </div>
          </div>

          {order.remainingCodAmount > 0 && (
            <p className="mt-3 text-xs text-neutral-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              পণ্য হাতে পেয়ে চেক করে বাকি ৳{order.remainingCodAmount} টাকা ডেলিভারিম্যানকে পরিশোধ করবেন।
            </p>
          )}
        </div>

        {/* Customer & Delivery Details */}
        <div className="bg-neutral-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-neutral-700 shadow-xl">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-400" />
            ডেলিভারি তথ্য
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-neutral-300">
            <div>
              <p className="text-xs text-neutral-400">গ্রাহকের নাম</p>
              <p className="font-medium text-white">{order.customerName}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400">মোবাইল নম্বর</p>
              <p className="font-medium text-white font-mono">{order.customerPhone}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs text-neutral-400">সম্পূর্ণ ঠিকানা</p>
              <p className="font-medium text-white">{order.deliveryAddress}, {order.district}</p>
            </div>
            {order.notes && (
              <div className="sm:col-span-2">
                <p className="text-xs text-neutral-400">বিশেষ নির্দেশনা</p>
                <p className="font-medium text-amber-200">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation & Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-3 px-4 rounded-2xl transition flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            ইনভয়েস প্রিন্ট / ডাউনলোড
          </button>

          <Link
            href={`/track-order?query=${encodeURIComponent(order.orderNumber)}`}
            className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 px-4 rounded-2xl transition flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4" />
            অর্ডার ট্র্যাক করুন
          </Link>

          <Link
            href="/"
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium py-3 px-4 rounded-2xl transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            হোমপেজ
          </Link>
        </div>
      </div>
    </div>
  );
}

