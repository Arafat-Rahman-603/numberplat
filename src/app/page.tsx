import { getSettings } from "@/lib/db";
import HomeClient from "./HomeClient";

export const metadata = {
  title: "আপনার বাইকের নম্বরে বাংলা ফ্রন্ট নম্বর প্লেট - বাইকপ্লেট বিডি",
  description:
    "উন্নত মানের রিফ্লেক্টিভ ও ওয়াটারপ্রুফ অ্যাক্রিলিক বাংলা নম্বর প্লেট। ১০০ টাকা অগ্রিম পেমেন্টে ৩০% নিশ্চিত ছাড় ও সারাদেশে ক্যাশ অন ডেলিভারি।",
  openGraph: {
    title: "বাংলা ফ্রন্ট নম্বর প্লেট - বাইকপ্লেট বিডি",
    description: "আপনার বাইকের নম্বরে প্রিমিয়াম রিফ্লেক্টিভ বাংলা নম্বর প্লেট",
    type: "website",
  },
};

export default function HomePage() {
  const settings = getSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "আপনার বাইকের নম্বরে বাংলা ফ্রন্ট নম্বর প্লেট",
    image: "https://bikeplatebd.com/og-image.jpg",
    description:
      "উন্নত মানের রিফ্লেক্টিভ ও ওয়াটারপ্রুফ অ্যাক্রিলিক বাংলা নম্বর প্লেট। ১০০ টাকা অগ্রিম পেমেন্টে ৩০% নিশ্চিত ছাড় ও সারাদেশে ক্যাশ অন ডেলিভারি।",
    brand: {
      "@type": "Brand",
      name: "BikePlate BD",
    },
    offers: {
      "@type": "Offer",
      url: "https://bikeplatebd.com",
      priceCurrency: "BDT",
      price: settings.frontPlatePrice,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "428",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient initialSettings={settings} />
    </>
  );
}
