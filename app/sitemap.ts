import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://ai-company-support.vercel.app";

  const pages = [
    "/",
    "/policy-fund",
    "/small-business",
    "/privacy",
    "/terms",
  ];

  return pages.map((page) => ({
    url: `${baseUrl}${page}`,
    changeFrequency: "weekly",
    priority: page === "/" ? 1 : 0.7,
  }));
}
