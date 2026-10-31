/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SkeletonLoaderProps {
  mode: 'overview' | 'input' | 'simulator' | 'coaching' | 'ledger';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ mode }) => {
  return (
    <div
      className="w-full space-y-8 animate-in fade-in duration-400 select-none pointer-events-none"
      aria-label="Loading workspace"
    >
      {/* Paper-grain Shimmer Overlay Styles */}
      <style>{`
        @keyframes paperShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .paper-skeleton {
          position: relative;
          overflow: hidden;
          background: #EFECE6;
          border-radius: 2px;
        }
        .paper-skeleton::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.6) 50%,
            transparent 100%
          );
          animation: paperShimmer 1.8s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* Header Skeleton Bar */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-[#E6E4DE]">
        <div className="space-y-2.5">
          <div className="w-32 h-3.5 paper-skeleton" />
          <div className="w-72 sm:w-96 h-9 paper-skeleton" />
        </div>
        <div className="flex gap-2.5">
          <div className="w-28 h-8 paper-skeleton" />
          <div className="w-36 h-8 paper-skeleton" />
        </div>
      </div>

      {/* Main Anchor Card Skeleton (Net Worth / Hero) */}
      <div className="bg-white border border-[#E6E4DE] p-6 sm:p-8 lg:p-10 shadow-2xs space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-3">
            <div className="w-24 h-3 paper-skeleton" />
            <div className="w-56 h-12 paper-skeleton" />
            <div className="w-64 h-3.5 paper-skeleton" />
          </div>
          <div className="lg:col-span-7 grid grid-cols-3 gap-4">
            <div className="space-y-2 p-3 bg-[#FAF9F6] border border-[#E6E4DE]">
              <div className="w-16 h-2.5 paper-skeleton" />
              <div className="w-24 h-6 paper-skeleton" />
            </div>
            <div className="space-y-2 p-3 bg-[#FAF9F6] border border-[#E6E4DE]">
              <div className="w-16 h-2.5 paper-skeleton" />
              <div className="w-24 h-6 paper-skeleton" />
            </div>
            <div className="space-y-2 p-3 bg-[#FAF9F6] border border-[#E6E4DE]">
              <div className="w-16 h-2.5 paper-skeleton" />
              <div className="w-24 h-6 paper-skeleton" />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-7 bg-white border border-[#E6E4DE] p-6 sm:p-7 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E4DE]">
            <div className="w-36 h-5 paper-skeleton" />
            <div className="w-20 h-3.5 paper-skeleton" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="w-28 h-3.5 paper-skeleton" />
                  <div className="w-20 h-3.5 paper-skeleton" />
                </div>
                <div className="w-full h-2 paper-skeleton" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#191A18]/5 border border-[#E6E4DE] p-6 space-y-4">
            <div className="w-32 h-3.5 paper-skeleton" />
            <div className="w-48 h-8 paper-skeleton" />
            <div className="w-full h-2 paper-skeleton" />
          </div>
          <div className="bg-white border border-[#E6E4DE] p-6 space-y-4">
            <div className="w-40 h-5 paper-skeleton" />
            <div className="space-y-3">
              <div className="w-full h-12 paper-skeleton" />
              <div className="w-full h-12 paper-skeleton" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
