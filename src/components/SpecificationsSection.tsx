import { ShieldCheck, Eye, Layers, SunMedium, CheckCircle2 } from "lucide-react";

export default function SpecificationsSection() {
  const specs = [
    { label: "উপাদান (Material)", value: "প্রিমিয়াম অ্যাক্রিলিক শিট + ৩এম রিফ্লেক্টিভ ভিনাইল" },
    { label: "সাইজ (Dimensions)", value: "১০ ইঞ্চি x ২.২ ইঞ্চি (বাইক স্ট্যান্ডার্ড)" },
    { label: "কালার ভ্যারিয়েন্ট", value: "সাদা রিফ্লেক্টিভ / হলুদ রিফ্লেক্টিভ (ব্ল্যাক ফ্রেম)" },
    { label: "স্থায়িত্ব (Durability)", value: "৩ থেকে ৫ বছর অবিচল স্থায়িত্ব" },
    { label: "ওয়াটার রেজিস্ট্যান্স", value: "১০০% ওয়াটারপ্রুফ এবং প্রেশার ওয়াশ প্রুফ" },
    { label: "উপযোগী বাইক", value: "Yamaha, Honda, Suzuki, Bajaj, TVS সহ সকল বাইক" },
  ];

  const highlights = [
    {
      title: "প্রিমিয়াম লুক ও ফিনিশিং",
      desc: "কম্পিউটারাইজড লেজার কাটিংয়ে তৈরি প্রতিটি অক্ষর স্পষ্ট ও মসৃণ ফিনিশযুক্ত।",
      icon: Layers,
    },
    {
      title: "দূর থেকে দৃশ্যমান রিফ্লেকশন",
      desc: "রাতের অন্ধকারে দূর থেকে হেডলাইটের আলো পড়লে তীব্র রিফ্লেকশন দেয় যা নিরাপত্তা বাড়ায়।",
      icon: Eye,
    },
    {
      title: "ট্রাফিক নিয়মের সাথে সামঞ্জস্যপূর্ণ",
      desc: "বিআরটিএ স্ট্যান্ডার্ড বাংলা ফন্ট ও লেটার ফরম্যাট মেনে ডিজাইন করা হয়েছে।",
      icon: ShieldCheck,
    },
    {
      title: "স্ক্র্যাচ ও কালার ফেইড প্রতিরোধক",
      desc: "অতিরিক্ত ইউভি রেজিন কোটিং রোদে রঙ জ্বলে যাওয়া এবং ঘষা লাগা থেকে রক্ষা করে।",
      icon: SunMedium,
    },
  ];

  return (
    <section id="specs" className="py-16 bg-[#F5F2EB] border-b border-neutral-300/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-200/60 px-3 py-1 rounded-full">
            টেকনিক্যাল বিবরণ
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 mt-3">
            বোর্ড স্পেসিফিকেশন এবং সুবিধা
          </h2>
          <p className="text-neutral-600 text-sm mt-2">
            সর্বাধুনিক প্রযুক্তিতে তৈরি এবং প্রতিটি উপাদানে প্রিমিয়াম কোয়ালিটি নিশ্চিত
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Table: Specifications */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm">
            <h3 className="font-bold text-lg text-neutral-900 mb-6 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              টেকনিক্যাল স্পেসিফিকেশন
            </h3>

            <div className="divide-y divide-neutral-100">
              {specs.map((spec, i) => (
                <div key={i} className="py-3.5 flex flex-col sm:flex-row sm:justify-between text-sm gap-1">
                  <span className="font-semibold text-neutral-700 sm:w-5/12">{spec.label}</span>
                  <span className="text-neutral-600 font-medium sm:w-7/12 sm:text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Cards: Product Features / Advantages */}
          <div className="lg:col-span-6 space-y-4">
            {highlights.map((h, i) => {
              const Icon = h.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-sm flex items-start gap-4 hover:border-amber-400 transition"
                >
                  <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 text-base mb-1">{h.title}</h4>
                    <p className="text-neutral-600 text-xs sm:text-sm leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

