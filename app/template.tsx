"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  // Skip animation for Sanity Studio routes
  const isSanityStudio = pathname.startsWith('/studio');

  useEffect(() => {
    document.documentElement.classList.add('visible');
    // Force re-mount to ensure animation always plays
    setIsMounted(true);
  }, [pathname]); // Re-run when pathname changes

  // Don't render until mounted to ensure fresh animation
  if (!isMounted) {
    return <div className="min-h-screen w-full opacity-0" />;
  }

  // Return children without animation wrapper for Sanity Studio
  if (isSanityStudio) {
    return <div className="min-h-screen w-full">{children}</div>;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${pathname}-${Date.now()}`} // Force unique key to prevent caching issues
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="min-h-screen w-full"
        onAnimationComplete={() => console.log('Animation completed for:', pathname)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}