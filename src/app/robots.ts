import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://bikeplatebd.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/admin/", "/checkout/bkash-sandbox"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

