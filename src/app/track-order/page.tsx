import { Suspense } from "react";
import TrackOrderClient from "./TrackOrderClient";

export const metadata = {
  title: "অর্ডার ট্র্যাকিং - আপনার বাইকের প্লেট অর্ডার ট্র্যাক করুন",
  description: "মোবাইল নম্বর বা অর্ডার নম্বর দিয়ে সরাসরি আপনার অর্ডারের অগ্রগতি জানুন",
};

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">লোড হচ্ছে...</div>}>
      <TrackOrderClient />
    </Suspense>
  );
}

