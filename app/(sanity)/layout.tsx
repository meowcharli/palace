// app/(sanity)/layout.tsx
import "../globals.css";
import { Inter } from "next/font/google";
// Make sure to import with the correct case
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
        {/* Make sure the Header is placed here */}
        <Header />
        {children}
      </body>
    </html>
  );
}
