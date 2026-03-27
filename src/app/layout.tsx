import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mahalle Ustası | En Yakın Ustanız Yanınızda",
  description: "Mahalle Ustası ile hem işinizi halledin hem de ek gelir yaratın. Güvenilir, yerel ve hızlı çözüm.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
