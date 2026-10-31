/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Milliseconds
  direction?: 'up' | 'none';
  threshold?: number;
}

/**
 * ScrollReveal: Premium IntersectionObserver-powered scroll animation component.
 * Applies a restrained, editorial fade-in-up transition (cubic-bezier(0.22, 0.61, 0.36, 1))
 * that respects WCAG AA and prefers-reduced-motion.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  threshold = 0.12,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // If reduced motion is preferred or IntersectionObserver is not available, reveal immediately
    if (
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsVisible(true);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  const transformStyle = direction === 'up' && !isVisible ? 'translateY(18px)' : 'translateY(0)';

  return (
    <div
      ref={containerRef}
      className={`transition-all duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      style={{
        transform: transformStyle,
        transitionDelay: `${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};
