"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Order, OrderStatus } from "@/types";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Home,
  ShieldCheck,
  CreditCard,
  ChevronRight,
} from "lucide-react";

const ORDER_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: "Pending", label: "অর্ডার গ্রহণ", desc: "আপনার অর্ডারটি সিস্টেমে যুক্ত হয়েছে" },
  { key: "Confirmed", label: "কনফার্মড", desc: "অর্ডারটি যাচাই করে কনফার্ম করা হয়েছে" },
  { key: "Processing", label: "তৈরি হচ্ছে", desc: "কারিগরি প্লেট কাটিং ও ফিনিশিং চলছে" },
  { key: "Shipped", label: "শিপড", desc: "কুরিয়ারে ডেলিভারির জন্য হস্তান্তর করা হয়েছে" },
  { key: "Delivered", label: "ডেলিভার্ড", desc: "পণ্য আপনার ঠিকানায় সফলভাবে পৌঁছেছে" },
];

export default function TrackOrderClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (searchVal: string) => {
    if (!searchVal.trim()) return;
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const res = await fetch(`/api/orders/track?query=${encodeURIComponent(searchVal.trim())}`);
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        if (data.orders.length === 0) {
          setError("কোনো অর্ডার পাওয়া যায়নি। অনুগ্রহ করে সঠিক তথ্য দিন।");
        }
      } else {
        setError(data.error || "অর্ডার ট্র্যাকিং ব্যর্থ হয়েছে");
      }
    } catch (e) {
      setError("সার্ভারের সাথে সংযোগ স্থাপন করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleTrack(initialQuery);
    }
  }, [initialQuery]);

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
      case "Awaiting Payment":
        return 0;
      case "Confirmed":
        return 1;
      case "Processing":
        return 2;
      case "Shipped":
        return 3;
      case "Delivered":
        return 4;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-amber-400 transition"
          >
            <Home className="w-4 h-4" />
            <span>হোমে ফিরে যান</span>
          </Link>
          <span className="text-xs text-neutral-500 font-mono">BikePlate BD Logistics Tracking</span>
        </div>

        {/* Search header card */}
        <div className="bg-neutral-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-neutral-700 shadow-xl mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 text-white">
            অর্ডার ট্র্যাকিং সিস্টেম
          </h1>
          <p className="text-neutral-400 text-sm mb-6">
            অর্ডার করার সময় ব্যবহৃত আপনার ১১ ডিজিটের মোবাইল নম্বর অথবা ইনভয়েস / অর্ডার নম্বর দিন:
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack(query);
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="যেমন: 01712345678 বা BP-261101"
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-900 border border-neutral-700 rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-base font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-3.5 rounded-2xl transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>অনুসন্ধান হচ্ছে...</span>
              ) : (
                <>
                  <span>ট্র্যাক করুন</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Results */}
        {orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => {
              const currentStep = getStepIndex(order.orderStatus);
              const isCancelled = order.orderStatus === "Cancelled";

              return (
                <div
                  key={order.id}
                  className="bg-neutral-800 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-neutral-700 shadow-xl"
                >
                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-neutral-700">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lg font-bold text-amber-400">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded-md">
                          {new Date(order.createdAt).toLocaleDateString("bn-BD")}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1">
                        গ্রাহক: {order.customerName} | মোবাইল: {order.customerPhone}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-semibold ${
                          order.paymentStatus === "Fully Paid"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : order.paymentStatus === "Advance Paid"
                            ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            : "bg-neutral-700 text-neutral-300"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                      <span className="text-xs px-3 py-1 rounded-full font-bold bg-amber-500 text-black">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Progress Timeline */}
                  {!isCancelled ? (
                    <div className="py-6">
                      <div className="grid grid-cols-5 gap-1 sm:gap-2 text-center">
                        {ORDER_STEPS.map((step, idx) => {
                          const isDone = idx <= currentStep;
                          const isCurrent = idx === currentStep;

                          return (
                            <div key={step.key} className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition ${
                                  isDone
                                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/20"
                                    : "bg-neutral-700 text-neutral-400"
                                } ${isCurrent ? "ring-4 ring-amber-500/20 animate-pulse" : ""}`}
                              >
                                {isDone ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : idx + 1}
                              </div>
                              <span
                                className={`text-[11px] sm:text-xs font-semibold mt-2 line-clamp-1 ${
                                  isDone ? "text-amber-400" : "text-neutral-500"
                                }`}
                              >
                                {step.label}
                              </span>
                              <span className="hidden sm:block text-[10px] text-neutral-400 mt-0.5">
                                {step.desc}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 my-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center text-rose-300 text-sm">
                      এই অর্ডারটি বাতিল করা হয়েছে। প্রয়োজনে আমাদের হেল্পলাইনে যোগাযোগ করুন।
                    </div>
                  )}

                  {/* Item and Payment Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-neutral-700 text-sm">
                    <div className="bg-neutral-900/60 p-4 rounded-2xl border border-neutral-700/60">
                      <p className="text-xs text-neutral-400 mb-1">কাস্টমাইজড প্লেট:</p>
                      <p className="text-base font-bold text-white font-mono">
                        {order.items[0]?.customDetails.fullPlateText}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">
                        ডেলিভারি ঠিকানা: {order.deliveryAddress}, {order.district}
                      </p>
                    </div>

                    <div className="bg-neutral-900/60 p-4 rounded-2xl border border-neutral-700/60 space-y-1 text-xs">
                      <div className="flex justify-between text-neutral-400">
                        <span>মোট বিল:</span>
                        <span className="font-mono text-white">৳ {order.totalPayable}</span>
                      </div>
                      <div className="flex justify-between text-pink-400">
                        <span>অগ্রিম পরিশোধ (বিকাশ):</span>
                        <span className="font-mono">৳ {order.advanceAmount}</span>
                      </div>
                      <div className="flex justify-between font-bold text-amber-400 pt-1 border-t border-neutral-700 text-sm">
                        <span>ডেলিভারির সময় প্রদেয় (COD):</span>
                        <span className="font-mono">৳ {order.remainingCodAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

