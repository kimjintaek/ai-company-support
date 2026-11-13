import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "다온 파트너스 | 보험설계사 영업 파트너 모집",
  description:
    "보험영업과 함께 기업고객 발굴 역량을 넓히고 싶은 보험설계사를 위한 영업지원 파트너 모집 안내입니다.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
