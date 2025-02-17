import "../globals.css";
import { Noto_Serif } from "next/font/google";

// Configure Noto Serif font
const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "700"], // Adjust weights as needed
  display: "swap",
});

export { metadata, viewport } from "next-sanity/studio";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={notoSerif.variable}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
