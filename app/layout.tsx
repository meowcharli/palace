import type { Metadata } from "next";
import { Inter } from "next/font/google";
import './globals.css';
import ClientLayout from './client-layout';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "type.tax",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <ClientLayout>
        {children}
      </ClientLayout>
    </html>
  );
}