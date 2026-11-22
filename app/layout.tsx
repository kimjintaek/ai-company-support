import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import UTMSourceCapture from "./components/UTMSourceCapture";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "다온지원센터 | AI 정책자금·기업지원사업 진단 및 매칭",
  description: "다온지원센터는 AI 분석과 전문가 검토로 기업별 정책자금·지원사업을 진단하고 매칭합니다. 49,000원으로 1년간 이용할 수 있습니다.",
  openGraph: {
    title: "다온지원센터 | AI 정책자금·기업지원사업 진단 및 매칭",
    description: "다온지원센터는 AI 분석과 전문가 검토로 기업별 정책자금·지원사업을 진단하고 매칭합니다. 49,000원으로 1년간 이용할 수 있습니다.",
    url: "https://ai-company-support.vercel.app",
    siteName: "다온지원센터",
    locale: "ko_KR",
    type: "website",
  },
  verification: {
    other: {
      "naver-site-verification": "66c212623954594cd95a6533dd59ecf89d1db5cb",
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <UTMSourceCapture />
        <Analytics />
      </body>
    </html>
  );
}
