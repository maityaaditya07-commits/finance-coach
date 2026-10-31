/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';

/**
 * Smoothly interpolates a number from previous value to new value
 */
export function useAnimatedNumber(targetValue: number, duration: number = 600): number {
  const [currentValue, setCurrentValue] = useState<number>(targetValue);

  useEffect(() => {
    // Check for prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCurrentValue(targetValue);
      return;
    }

    const startValue = currentValue;
    const diff = targetValue - startValue;
    if (diff === 0) return;

    const startTime = performance.now();
    let frameId: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const nextValue = Math.round(startValue + diff * ease);

      setCurrentValue(nextValue);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCurrentValue(targetValue);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [targetValue, duration]);

  return currentValue;
}
