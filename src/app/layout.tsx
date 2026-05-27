import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Presentation Script Maker",
  description: "발표 자료와 키워드를 발표 대본으로 정리하는 MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
