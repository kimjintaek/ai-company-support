import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/auth/",
        "/documents",
        "/result",
        "/reset-password",
        "/forgot-password",
      ],
    },
    sitemap: "https://ai-company-support.vercel.app/sitemap.xml",
  };
}
