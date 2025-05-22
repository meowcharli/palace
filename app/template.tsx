"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);
  const [nextPath, setNextPath] = useState<string | null>(null);
  const [skipExitAnimation, setSkipExitAnimation] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('visible');
    const timer = setTimeout(() => setIsAnimating(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRouteChange = (url: string) => {
    if (pathname !== url) {
      const isPostsToHome = pathname.startsWith('/posts/') && url === '/';
      setSkipExitAnimation(isPostsToHome);
      
      setIsAnimating(false);
      setNextPath(url);
    }
  };

  useEffect(() => {
    if (!isAnimating && nextPath) {
      const timer = setTimeout(() => {
        router.push(nextPath);
        setNextPath(null);
      }, skipExitAnimation ? 0 : 300); // Reduced from 1000ms - too long for production
      return () => clearTimeout(timer);
    }
  }, [isAnimating, nextPath, router, skipExitAnimation]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.href && anchor.href.startsWith(window.location.origin)) {
        if (anchor.target === '_blank' || anchor.hasAttribute('download')) {
          return;
        }
        
        const href = new URL(anchor.href).pathname;
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
    <AnimatePresence 
      mode="wait" 
      onExitComplete={() => {
        console.log('Exit animation completed'); // Debug log
        setIsAnimating(true);
      }}
    >
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: -40 }}
        animate={{ 
          opacity: isAnimating ? 1 : 0,
          y: isAnimating ? 0 : 40 
        }}
        exit={skipExitAnimation ? undefined : { 
          opacity: 0, 
          y: 20,
          transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
        }}
        transition={{ 
          duration: 2, // Reduced from 5 seconds
          ease: [0.22, 1, 0.36, 1],
        }}
        className="min-h-screen w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}