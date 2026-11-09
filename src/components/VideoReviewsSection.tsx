"use client";

import { useState } from "react";
import { Play, Star, CheckCircle, X, ShieldCheck } from "lucide-react";

export default function VideoReviewsSection() {
  const [activeVideo, setActiveVideo] = useState<{
    title: string;
    description: string;
    videoUrl?: string;
  } | null>(null);

  const reels = [
    {
      id: "v1",
      title: "হাতে নিয়ে দেখুন ফিনিশিং",
      subtitle: "অ্যাক্রিলিক ও ৩এম কোটিংয়ের বাস্তব ভিডিও",
      reviewer: "আরিফুল ইসলাম, ঢাকা",
      bike: "Yamaha R15 V3",
      rating: 5,
      duration: "0:45",
      tag: "ফিনিশিং টেস্ট",
    },
    {
      id: "v2",
      title: "রিফ্লেক্টিভ লাইট টেস্ট",
      subtitle: "রাতের আলোতে দূর থেকে তীব্র রিফ্লেকশন",
      reviewer: "মাহমুদ হাসান, চট্টগ্রাম",
      bike: "Suzuki Gixxer SF",
      rating: 5,
      duration: "0:38",
      tag: "নাইট রিফ্লেকশন",
    },
    {
      id: "v3",
      title: "সহজে ফিটিং করার পুরো গাইড",
      subtitle: "মাত্র ৩ মিনিটে কোনো স্ক্র্যাচ ছাড়াই ইন্সটল",
      reviewer: "ফাহিম হোসেন, সিলেট",
      bike: "Honda CB Hornet",
      rating: 5,
      duration: "1:15",
      tag: "ইন্সটলেশন গাইড",
    },
  ];

  return (
    <section id="videos" className="py-16 bg-[#FDFBF7] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-200/60 px-3 py-1 rounded-full">
            ভিডিও কোয়ালিটি টেস্ট
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 mt-3">
            ভিডিও দেখে কোয়ালিটি দেখে নিন
          </h2>
          <p className="text-neutral-600 text-sm mt-2">
            বাস্তবে প্লেটের ফিনিশিং, রিফ্লেকশন ও সহজে ফিটিং করার দৃশ্য দেখুন
          </p>
        </div>

        {/* 3 Reel Style Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-sm sm:max-w-none mx-auto">
          {reels.map((reel) => (
            <div
              key={reel.id}
              className="bg-white rounded-3xl overflow-hidden border border-neutral-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl transition group flex flex-col justify-between"
            >
              {/* Video Mock Screen */}
              <div
                onClick={() =>
                  setActiveVideo({
                    title: reel.title,
                    description: reel.subtitle,
                  })
                }
                className="relative aspect-[9/14] bg-neutral-950 flex flex-col items-center justify-center p-6 text-center cursor-pointer overflow-hidden"
              >
                {/* Background decorative plate styling */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 z-10" />

                {/* Animated plate silhouette in video background */}
                <div className="absolute w-full px-8 transform -rotate-12 group-hover:scale-105 transition duration-500">
                  <div className="w-full h-16 bg-neutral-800 rounded-lg border-2 border-neutral-600 shadow-xl flex items-center justify-center">
                    <span className="text-white font-mono font-bold text-sm tracking-widest">
                      ঢাকা মেট্রো-হ-১২-৩৪৫৬
                    </span>
                  </div>
                </div>

                {/* Play Button Overlay */}
                <div className="relative z-20 w-16 h-16 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
                  <Play className="w-7 h-7 fill-neutral-950 ml-1" />
                </div>

                {/* Video Badges */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="text-[10px] bg-neutral-900/80 text-amber-400 border border-neutral-700 px-2.5 py-1 rounded-full font-bold">
                    {reel.tag}
                  </span>
                </div>

                <div className="absolute top-4 right-4 z-20">
                  <span className="text-[10px] bg-black/60 text-neutral-300 px-2 py-0.5 rounded font-mono">
                    {reel.duration}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-20 text-left">
                  <p className="text-white font-bold text-sm line-clamp-1">{reel.title}</p>
                  <p className="text-neutral-400 text-xs mt-0.5 line-clamp-1">{reel.subtitle}</p>
                </div>
              </div>

              {/* Reviewer Details */}
              <div className="p-5 bg-white border-t border-neutral-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(reel.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    ভেরিফায়েড কাস্টমার
                  </span>
                </div>

                <p className="text-xs font-bold text-neutral-900">{reel.reviewer}</p>
                <p className="text-[11px] text-neutral-500">{reel.bike}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 text-white relative">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-bold text-lg mb-1">{activeVideo.title}</h3>
            <p className="text-xs text-neutral-400 mb-4">{activeVideo.description}</p>

            <div className="aspect-[9/16] max-h-[480px] bg-neutral-950 rounded-2xl flex flex-col items-center justify-center p-6 text-center border border-neutral-800 relative overflow-hidden">
              <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mb-4">
                <Play className="w-8 h-8 fill-amber-400" />
              </div>
              <p className="text-sm font-semibold text-white">কোয়ালিটি টেস্ট ডেমো প্লেয়ার</p>
              <p className="text-xs text-neutral-400 max-w-xs mt-1">
                প্রিমিয়াম ৩এম অ্যাক্রিলিক মেটেরিয়াল এবং নাইট রিফ্লেক্টিভ লেজার ফিনিশের বাস্তব প্রিভিউ।
              </p>
              <div className="mt-4 px-4 py-2 bg-neutral-900 rounded-xl border border-neutral-800 text-xs font-mono text-amber-400">
                ঢাকা মেট্রো-হ-১২-৩৪৫৬
              </div>
            </div>

            <button
              onClick={() => setActiveVideo(null)}
              className="mt-4 w-full bg-amber-400 text-neutral-950 font-bold py-2.5 rounded-xl transition hover:bg-amber-300"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

