"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [nextPath, setNextPath] = useState<string | null>(null);

  useEffect(() => {
    // Make page visible after hydration
    document.documentElement.classList.add('visible');
    
    // Enable animations after initial load
    const timer = setTimeout(() => setIsAnimating(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Handle route changes
  const handleRouteChange = (url: string) => {
    if (pathname !== url) {
      setNextPath(url);
      setIsAnimating(false);
    }
  };

  // Handle animation completion
  useEffect(() => {
    if (!isAnimating && nextPath) {
      const timer = setTimeout(() => {
        router.push(nextPath);
        setNextPath(null);
      }, 1000); // Match with exit animation duration
      return () => clearTimeout(timer);
    }
  }, [isAnimating, nextPath, router]);

  // Intercept clicks on links
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.href && anchor.href.startsWith(window.location.origin)) {
        // Don't prevent default for external links or links with target="_blank"
        if (anchor.target === '_blank' || anchor.hasAttribute('download')) {
          return;
        }
        
        // Don't prevent default if it's the same path
        const href = anchor.href.replace(window.location.origin, '');
        if (href === pathname) {
          return;
        }
        
        e.preventDefault();
        handleRouteChange(href);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);

  return (
    <AnimatePresence mode="wait" onExitComplete={() => setIsAnimating(true)}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: isAnimating ? 1 : 0,
          y: isAnimating ? 0 : -20 
        }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ 
          duration: 1.5, 
          ease: [0.22, 1, 0.36, 1],
        }}
        className="min-h-screen w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}