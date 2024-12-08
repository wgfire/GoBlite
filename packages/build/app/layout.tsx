import type { Metadata } from "next";
import "./globals.css";
import "@go-blite/shadcn/style"; // 引入 shadcn 组件样式

export const metadata: Metadata = {
  title: "web-site",
  description: "简单高效的静态页面生成器"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
