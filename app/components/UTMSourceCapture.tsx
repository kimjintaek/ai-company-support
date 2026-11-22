"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "marketing_utm_source";
const KNOWN_SOURCES = new Set(["naver", "youtube", "instagram", "daangn"]);

export default function UTMSourceCapture() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY)) return;
      const source = new URLSearchParams(window.location.search)
        .get("utm_source")
        ?.trim()
        .toLowerCase();
      if (source && KNOWN_SOURCES.has(source)) {
        window.localStorage.setItem(STORAGE_KEY, source);
      }
    } catch {
      // Storage can be unavailable in privacy-restricted browsers.
    }
  }, [pathname]);

  return null;
}
