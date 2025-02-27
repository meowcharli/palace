// components/Logo.tsx
import Image from 'next/image';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function Logo({ className = '', width = 40, height = 40 }: LogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Image
        src="/svg/logowo.svg"  // Updated path to correctly point to the SVG file
        alt="4Sigs Logo"
        fill
        priority
        className="object-contain"
      />
    </div>
  );
}
