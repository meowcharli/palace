// app/(sanity)/layout.tsx
import "../globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background text-text">
        <Header />
        {children}
      </body>
    </html>
  );
}
