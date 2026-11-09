"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { ShieldCheck, AlertCircle, ArrowLeft, CheckCircle2, Lock } from "lucide-react";

function BkashSandboxContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paymentID = searchParams.get("paymentID") || "MOCK_PAYMENT";
  const orderNumber = searchParams.get("orderNumber") || "BP-DEMO";
  const amount = searchParams.get("amount") || "100";

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [wallet, setWallet] = useState("01712345678");
  const [otp, setOtp] = useState("1234");
  const [pin, setPin] = useState("12345");
  const [loading, setLoading] = useState(false);

  const handleSimulate = (status: "success" | "cancel" | "failure") => {
    setLoading(true);
    setTimeout(() => {
      router.push(`/api/orders/bkash/callback?paymentID=${paymentID}&status=${status}`);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">
        {/* bKash Header */}
        <div className="bg-[#E2136E] text-white p-5 text-center relative">
          <div className="inline-flex items-center gap-2 font-black text-2xl tracking-tight">
            <span>bKash</span>
            <span className="text-xs font-semibold bg-white text-[#E2136E] px-2 py-0.5 rounded-full">
              Sandbox Gateway
            </span>
          </div>
          <p className="text-xs text-pink-100 mt-1">সুরক্ষিত মার্চেন্ট পেমেন্ট গেটওয়ে</p>

          <div className="mt-4 bg-white/15 backdrop-blur-xs rounded-xl p-3 text-left flex justify-between items-center text-sm">
            <div>
              <p className="text-xs text-pink-100">মার্চেন্ট: BikePlate BD</p>
              <p className="font-semibold text-white">ইনভয়েস: {orderNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-pink-100">প্রদেয় টাকা</p>
              <p className="text-xl font-extrabold text-white">৳ {amount}</p>
            </div>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6">
          <div className="mb-5 bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>বিকাশ স্যান্ডবক্স মোড:</strong> এটি অফিসিয়াল এপিআই রেসপন্স ফরম্যাটে টেস্ট করার জন্য তৈরি। নিচে সরাসরি বাটনে ক্লিক করে পেমেন্ট যাচাই করতে পারেন।
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  আপনার বিকাশ একাউন্ট নম্বর দিন
                </label>
                <input
                  type="text"
                  value={wallet}
                  onChange={(e) => setWallet(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-base font-mono focus:ring-2 focus:ring-[#E2136E] focus:outline-none"
                />
              </div>

              <div className="flex items-center text-xs text-gray-500 gap-1.5">
                <Lock className="w-3.5 h-3.5 text-green-600" />
                <span>আপনার তথ্য সম্পূর্ণ এনক্রিপ্টেড এবং নিরাপদ</span>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-[#E2136E] hover:bg-[#c90f61] text-white font-bold py-3 rounded-xl transition shadow-md"
                >
                  কনফার্ম করুন
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ভেরিফিকেশন কোড (OTP) দিন
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="1234"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-base font-mono text-center tracking-widest focus:ring-2 focus:ring-[#E2136E] focus:outline-none"
                />
                <p className="text-[11px] text-gray-500 mt-1 text-center">টেস্ট ওটিপি: 1234</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-xl transition text-xs"
                >
                  ফিরে যান
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-2/3 bg-[#E2136E] hover:bg-[#c90f61] text-white font-bold py-2.5 rounded-xl transition"
                >
                  পরবর্তী ধাপ
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  বিকাশ পিন (PIN) দিন
                </label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="•••••"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-base font-mono text-center tracking-widest focus:ring-2 focus:ring-[#E2136E] focus:outline-none"
                />
                <p className="text-[11px] text-gray-500 mt-1 text-center">টেস্ট পিন: ১২৩৪৫</p>
              </div>

              <button
                disabled={loading}
                onClick={() => handleSimulate("success")}
                className="w-full bg-[#E2136E] hover:bg-[#c90f61] text-white font-bold py-3 rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                {loading ? "পেমেন্ট যাচাই হচ্ছে..." : "পেমেন্ট নিশ্চিত করুন (৳" + amount + ")"}
              </button>
            </div>
          )}

          {/* Quick Simulation Options for QA Testing */}
          <div className="mt-6 pt-5 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider text-center">
              টেস্টিং এবং কিউএ একশন
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                disabled={loading}
                onClick={() => handleSimulate("success")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-1 rounded-lg transition text-center flex flex-col items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                সফল পেমেন্ট
              </button>
              <button
                disabled={loading}
                onClick={() => handleSimulate("cancel")}
                className="bg-neutral-600 hover:bg-neutral-700 text-white text-xs font-bold py-2 px-1 rounded-lg transition text-center flex flex-col items-center justify-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                বাতিল করুন
              </button>
              <button
                disabled={loading}
                onClick={() => handleSimulate("failure")}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 px-1 rounded-lg transition text-center flex flex-col items-center justify-center gap-1"
              >
                <AlertCircle className="w-4 h-4" />
                ব্যর্থ পেমেন্ট
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-3 text-center border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs text-gray-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>অফিসিয়াল bKash PGW v1.2.0-beta API টেস্ট মোড</span>
        </div>
      </div>
    </div>
  );
}

export default function BkashSandboxPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">লোড হচ্ছে...</div>}>
      <BkashSandboxContent />
    </Suspense>
  );
}

