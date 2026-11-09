"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "এটি কি বিআরটিএ (BRTA) অনুমোদিত বা পুলিশ কি কোনো ঝামেলা করবে?",
      a: "এটি সম্পূর্ণ বিআরটিএ স্ট্যান্ডার্ড বাংলা ফন্ট ও পরিমাপে তৈরি যা বাইকের ফ্রন্ট মাডগার্ডে লাগানো হয়। এতে কোনো ট্রাফিক আইন ভঙ্গ হয় না এবং দেশের হাজার হাজার বাইকার নিরাপদে এটি ব্যবহার করছেন।",
    },
    {
      q: "বৃষ্টির পানিতে বা বাইক ওয়াশে কি লেখা নষ্ট হবে?",
      a: "একদমই না! এটি ১০০% ওয়াটারপ্রুফ এবং ৩এম প্রিমিয়াম রিফ্লেক্টিভ ভিনাইল ও শক্ত অ্যাক্রিলিক দ্বারা নির্মিত। তীব্র রোদে কালার ফেইড হয় না এবং প্রেশার ওয়াশেও আঠা নষ্ট হয় না। ৩-৫ বছর অনায়াসে ব্যবহার করা যায়।",
    },
    {
      q: "ডেলিভারি পেতে কতদিন সময় লাগবে?",
      a: "ঢাকার ভিতরে ২৪ থেকে ৪৮ ঘণ্টার মধ্যে এবং ঢাকার বাইরে যেকোনো জেলা বা থানায় ২ থেকে ৩ কার্যদিবসের মধ্যে কুরিয়ারের মাধ্যমে হোম ডেলিভারি পৌঁছে দেওয়া হয়।",
    },
    {
      q: "আমি কীভাবে এটি আমার বাইকে লাগাবো?",
      a: "প্লেটের পেছনে উচ্চমানের ওয়াটারপ্রুফ স্ট্রং অ্যাডেসিভ মাউন্টিং সিস্টেম দেওয়া থাকে। মাডগার্ডের জায়গাটি ভালো করে মুছে পেছনের কাভার তুলে চেপে বসিয়ে দিলেই শক্তভাবে লেগে যায়। কোনো ড্রিলিং বা মেকানিকের প্রয়োজন নেই।",
    },
    {
      q: "প্লেটের মাপ কি আমার বাইকের সাথে নিখুঁতভাবে মিলবে?",
      a: "হ্যাঁ, এটি ১০ x ২.২ ইঞ্চি ইউনিভার্সাল স্ট্যান্ডার্ড সাইজ। যা Yamaha (R15, FZ, MT), Suzuki (Gixxer), Honda (Hornet, XBlade), Bajaj (Pulsar), TVS (Apache) সহ বাংলাদেশের যেকোনো মোটরবাইক ও স্কুটারে পারফেক্টলি ফিট হয়।",
    },
  ];

  return (
    <section id="faq" className="py-16 bg-[#FAF7F2] border-b border-neutral-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-200/60 px-3 py-1 rounded-full">
            সাধারণ জিজ্ঞাসা
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 mt-2">
            সাধারণ কিছু প্রশ্নের উত্তর
          </h2>
          <p className="text-neutral-600 text-sm mt-1">
            বাইকের নম্বর প্লেট অর্ডার করার পূর্বে প্রয়োজনীয় কিছু তথ্যাবলী
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-neutral-900 hover:text-amber-600 transition"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs flex items-center justify-center font-mono shrink-0">
                      ০{idx + 1}
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "transform rotate-180 text-amber-500" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-neutral-600 text-xs sm:text-sm leading-relaxed border-t border-neutral-100 pt-3 pl-5 sm:pl-14">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

