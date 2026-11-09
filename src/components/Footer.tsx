import Link from "next/link";
import { Phone, Mail, MapPin, ShieldCheck, Heart, ExternalLink } from "lucide-react";

export default function Footer({
  hotlinePhone = "01700-000000",
  whatsappNumber = "+8801700000000",
}: {
  hotlinePhone?: string;
  whatsappNumber?: string;
}) {
  return (
    <footer className="bg-neutral-950 text-neutral-400 text-xs border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-neutral-950 font-black flex items-center justify-center text-lg">
                ব
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                বাইকপ্লেট <span className="text-amber-400">বিডি</span>
              </span>
            </div>
            <p className="text-neutral-400 max-w-sm leading-relaxed text-xs">
              বাংলাদেশের সেরা এবং প্রিমিয়াম কোয়ালিটি বাংলা ফন্ট বাইক নম্বর প্লেট নির্মাতা। ১০০% ওয়াটারপ্রুফ, ৩এম রিফ্লেক্টিভ ও টেকসই এক্রিলিক দিয়ে প্রস্তুতকৃত।
            </p>
            <div className="flex items-center gap-2 pt-1 text-emerald-400 text-[11px] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>সারাদেশে দ্রুততম হোম ডেলিভারি ও ক্যাশ অন ডেলিভারি</span>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-sm text-white mb-3">যোগাযোগ</h4>
            <div className="space-y-2 text-neutral-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <a href={`tel:${hotlinePhone}`} className="hover:text-white font-mono">
                  {hotlinePhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">WA:</span>
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white font-mono"
                >
                  {whatsappNumber}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>support@bikeplatebd.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm text-white mb-3">গুরুত্বপূর্ণ লিংক</h4>
            <div className="space-y-2">
              <div>
                <Link href="/track-order" className="hover:text-amber-400 transition">
                  অর্ডার ট্র্যাকিং
                </Link>
              </div>
              <div>
                <a href="#customizer" className="hover:text-amber-400 transition">
                  প্লেট কাস্টমাইজার
                </a>
              </div>
              <div>
                <a href="#faq" className="hover:text-amber-400 transition">
                  সাধারণ প্রশ্নোত্তর
                </a>
              </div>
              <div>
                <Link href="/admin" className="hover:text-amber-400 transition">
                  অ্যাডমিন ড্যাশবোর্ড
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© 2026 BikePlate BD. All rights reserved.</p>
          <p className="flex items-center gap-1 text-neutral-400">
            বাইকারদের নিরাপত্তার জন্য প্রিমিয়াম রিফ্লেক্টিভ স্ট্যান্ডার্ড
          </p>
        </div>
      </div>
    </footer>
  );
}

