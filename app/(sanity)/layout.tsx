// app/(sanity)/layout.tsx
import "../globals.css";

export default function SanityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // For Sanity Studio, we don't need the header or custom HTML structure
  // Just return the children directly since NextStudio handles its own layout
  return children;
}