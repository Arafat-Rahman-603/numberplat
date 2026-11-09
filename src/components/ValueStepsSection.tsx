import { Award, Shield, Wrench } from "lucide-react";

export default function ValueStepsSection() {
  const steps = [
    {
      num: "১",
      title: "আকর্ষণীয় ডিজাইন",
      description:
        "ইউনিক স্ট্যান্ডার্ড বাংলা ফন্টে নিখুঁত ফিনিশিংয়ে তৈরি যা দূর থেকেও স্পষ্ট বোঝা যায় এবং আপনার বাইককে দেয় রাজকীয় লুক।",
      icon: Award,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      num: "২",
      title: "টেকসই ও ওয়াটারপ্রুফ",
      description:
        "তীব্র রোদে কালার ফেইড হবে না এবং ভারী বৃষ্টি বা প্রেশার ওয়াশেও আঠা নষ্ট হবে না। দীর্ঘ ৩-৫ বছরের স্থায়িত্ব গ্যারান্টি।",
      icon: Shield,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      num: "৩",
      title: "সহজে লাগানো যায়",
      description:
        "কোনো বাড়তি ড্রিলিং বা মেকানিকের ঝামেলা ছাড়াই কয়েক মিনিটে প্রিমিয়াম সেলফ-অ্যাডেসিভ দিয়ে সরাসরি বাইকে লাগাতে পারবেন।",
      icon: Wrench,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
  ];

  return (
    <section id="features" className="py-16 bg-[#FDFBF7] border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-100/60 px-3 py-1 rounded-full">
            কেন এটি আপনার বাইকে লাগাবেন?
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 mt-3">
            তিনটি বিশেষ কারণে এটি সবার সেরা
          </h2>
          <p className="text-neutral-600 text-sm mt-2">
            সাধারণ স্টিকারের চেয়ে দীর্ঘস্থায়ী এবং প্রিমিয়াম মেটেরিয়ালের নিশ্চয়তা
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg transition group relative"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-2xl font-black font-mono text-neutral-300 group-hover:text-amber-500 transition">
                    ০{step.num}
                  </span>
                  <div className={`p-3 rounded-2xl ${step.bg} ${step.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-neutral-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

