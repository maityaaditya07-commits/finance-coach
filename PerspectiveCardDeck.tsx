/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Compass,
  CornerDownLeft,
  Sliders,
  Sparkles,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { ActiveTab } from './Header';

interface PerspectiveCardDeckProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onOpenCard: (tab: ActiveTab) => void;
  currency: string;
}

interface FlashcardItem {
  id: ActiveTab;
  title: string;
  subtitle: string;
  tagline: string;
  bgGradient: string;
  textColor: string;
  subtextColor: string;
  borderColor: string;
  icon: React.ElementType;
}

export const PerspectiveCardDeck: React.FC<PerspectiveCardDeckProps> = ({
  activeTab,
  onSelectTab,
  onOpenCard,
}) => {
  const cards: FlashcardItem[] = [
    {
      id: 'overview',
      title: 'Financial Overview',
      subtitle: 'Solvency & Horizon',
      tagline: 'Net worth velocity, liquid reserves & free-to-spend clarity',
      bgGradient: 'from-[#FAF8F5] via-[#F4EFE6] to-[#EAE4D7]',
      textColor: 'text-[#191A18]',
      subtextColor: 'text-[#6A6963]',
      borderColor: 'border-[#D9D3C5]',
      icon: Compass,
    },
    {
      id: 'input',
      title: 'Natural Entry',
      subtitle: 'Expressive Ledger',
      tagline: 'Speak or type spending naturally — categorized with audit proof',
      bgGradient: 'from-[#8C2323] via-[#751A1A] to-[#540F0F]',
      textColor: 'text-[#FAF9F6]',
      subtextColor: 'text-[#F5D5D5]/80',
      borderColor: 'border-[#A33030]',
      icon: CornerDownLeft,
    },
    {
      id: 'simulator',
      title: 'What-If Engine',
      subtitle: 'Dynamic Projections',
      tagline: 'Calibrate lifestyle levers & observe multi-year accumulation',
      bgGradient: 'from-[#1E3A8A] via-[#172E6F] to-[#0F1E4A]',
      textColor: 'text-white',
      subtextColor: 'text-[#93C5FD]/85',
      borderColor: 'border-[#3B82F6]/40',
      icon: Sliders,
    },
    {
      id: 'coaching',
      title: 'AI Advisory',
      subtitle: 'Curated Intelligence',
      tagline: 'Proactive cashflow telemetry with zero black-box obscurity',
      bgGradient: 'from-[#143D2D] via-[#0E2C20] to-[#081B13]',
      textColor: 'text-[#FAF9F6]',
      subtextColor: 'text-[#A7F3D0]/80',
      borderColor: 'border-[#27B889]/30',
      icon: Sparkles,
    },
    {
      id: 'ledger',
      title: 'Audit Ledger',
      subtitle: 'Deterministic Records',
      tagline: 'Immutable transaction ledger with full cryptographic trail',
      bgGradient: 'from-[#F4F1EA] via-[#EAE6DD] to-[#DDD7CB]',
      textColor: 'text-[#191A18]',
      subtextColor: 'text-[#6A6963]',
      borderColor: 'border-[#CCC6BA]',
      icon: BookOpen,
    },
  ];

  const activeIndex = cards.findIndex((c) => c.id === activeTab);
  const [selectedIndex, setSelectedIndex] = useState<number>(activeIndex >= 0 ? activeIndex : 0);

  // Real-time drag physics
  const [dragOffset, setDragOffset] = useState<number>(0);
  const [isPointerDown, setIsPointerDown] = useState<boolean>(false);
  const pointerStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Metallic Specular Shine tracking
  const [glintPos, setGlintPos] = useState<{ x: number; y: number }>({ x: 50, y: 30 });
  const [openingCardId, setOpeningCardId] = useState<ActiveTab | null>(null);

  // Sync selected card when activeTab changes
  useEffect(() => {
    if (activeIndex >= 0 && activeIndex !== selectedIndex) {
      setSelectedIndex(activeIndex);
    }
  }, [activeTab]);

  const goToCard = useCallback(
    (index: number) => {
      const normalized = (index + cards.length) % cards.length;
      setSelectedIndex(normalized);
      onSelectTab(cards[normalized].id);
    },
    [cards, onSelectTab]
  );

  const handlePrev = useCallback(() => {
    goToCard(selectedIndex - 1);
  }, [goToCard, selectedIndex]);

  const handleNext = useCallback(() => {
    goToCard(selectedIndex + 1);
  }, [goToCard, selectedIndex]);

  // Pointer event handlers with smooth horizontal drag
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    setIsPointerDown(true);
    pointerStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now(),
    };
    setDragOffset(0);

    try {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      setGlintPos({ x, y });
    }

    if (!isPointerDown || !pointerStartRef.current) return;

    const deltaX = e.clientX - pointerStartRef.current.x;
    setDragOffset(deltaX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDown || !pointerStartRef.current) return;
    const deltaX = e.clientX - pointerStartRef.current.x;
    const duration = Date.now() - pointerStartRef.current.time;
    const velocity = Math.abs(deltaX) / Math.max(1, duration);

    setIsPointerDown(false);
    setDragOffset(0);

    if (deltaX > 35 || (deltaX > 18 && velocity > 0.3)) {
      handlePrev();
    } else if (deltaX < -35 || (deltaX < -18 && velocity > 0.3)) {
      handleNext();
    }
    pointerStartRef.current = null;
  };

  const handlePointerCancel = () => {
    setIsPointerDown(false);
    setDragOffset(0);
    pointerStartRef.current = null;
  };

  // Buttery-smooth, hardware-accelerated 60fps card opening
  const handleCardClick = (
    cardId: ActiveTab,
    idx: number
  ) => {
    if (Math.abs(dragOffset) > 8) return;

    if (idx !== selectedIndex) {
      goToCard(idx);
      return;
    }

    // Trigger immediate, crisp active state and open workspace smoothly
    setOpeningCardId(cardId);
    setTimeout(() => {
      onOpenCard(cardId);
      setOpeningCardId(null);
    }, 120);
  };

  // Keyboard Navigation: Left/Right to slide, Enter or Space to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onOpenCard(cards[selectedIndex].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, onOpenCard, cards, selectedIndex]);

  const dragFraction = isPointerDown ? dragOffset / 280 : 0;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center px-4 py-2 sm:py-6 select-none">
      {/* Dynamic Specular Sweep Keyframes (Runs on GPU compositor thread) */}
      <style>{`
        @keyframes metallicGlintSweep {
          0% { transform: translateX(-150%) rotate(25deg); }
          100% { transform: translateX(250%) rotate(25deg); }
        }
        .metallic-sheen-line {
          position: absolute;
          inset: -100%;
          background: linear-gradient(
            90deg,
            transparent 30%,
            rgba(255, 255, 255, 0.35) 48%,
            rgba(255, 255, 255, 0.6) 50%,
            rgba(255, 255, 255, 0.35) 52%,
            transparent 70%
          );
          pointer-events: none;
        }
      `}</style>

      {/* Clean Minimalist Editorial Header (Proportionate, no crowding) */}
      <div className="max-w-xl mx-auto text-center px-2 mb-3 sm:mb-6 space-y-1">
        <h2 className="font-editorial text-2xl sm:text-4xl text-[#191A18] dark:text-[#FAF9F6] font-normal tracking-tight">
          Select an Advisory Mode
        </h2>
        <p className="text-xs sm:text-sm text-[#777771] dark:text-[#A6A8A1] font-sans">
          Swipe horizontally to explore advisory modes.
        </p>
      </div>

      {/* 3D Perspective Flashcard Carousel Stage - Height scaled for mobile & desktop */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className="relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing h-[340px] sm:h-[400px] touch-none"
        style={{
          perspective: '1400px',
          perspectiveOrigin: '50% 50%',
        }}
      >
        <div
          className="relative w-full flex items-center justify-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {cards.map((card, idx) => {
            let diff = idx - (selectedIndex - dragFraction);
            if (diff > 2.5) diff -= cards.length;
            if (diff < -2.5) diff += cards.length;

            const isStrictCenter = idx === selectedIndex && !isPointerDown;
            const isOpening = openingCardId === card.id;

            // Spacing: 140px on mobile, 240px on desktop
            const spacing = typeof window !== 'undefined' && window.innerWidth < 640 ? 140 : 240;
            const translateX = diff * spacing;
            const translateZ = 80 - Math.abs(diff) * 110;
            const rotateY = diff * -30;
            const scale = Math.max(0.75, (isOpening ? 1.05 : 1.02) - Math.abs(diff) * 0.15);
            const opacity = Math.max(0.28, 1 - Math.abs(diff) * 0.35);
            const zIndex = Math.round(30 - Math.abs(diff) * 10);

            const IconComponent = card.icon;

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id, idx)}
                className={`absolute top-0 flex flex-col items-center ${
                  isPointerDown
                    ? 'transition-none'
                    : 'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]'
                }`}
                style={{
                  transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  width: '240px',
                  height: '330px',
                  pointerEvents: Math.abs(diff) > 2.2 ? 'none' : 'auto',
                }}
              >
                {/* The Pure Metallic Flashcard Body (100% visible, perfectly proportioned) */}
                <div
                  className={`w-full h-[280px] sm:h-[300px] rounded-2xl bg-gradient-to-b ${card.bgGradient} ${
                    card.borderColor
                  } border shadow-lg flex flex-col justify-between p-5 sm:p-6 relative overflow-hidden group cursor-pointer transition-all duration-200 ${
                    isStrictCenter
                      ? 'ring-2 ring-[#194D39]/30 shadow-2xl'
                      : 'hover:brightness-105'
                  } ${isOpening ? 'scale-[1.03] shadow-2xl brightness-110' : ''}`}
                  style={{
                    boxShadow: isStrictCenter
                      ? '0 20px 40px -10px rgba(25, 26, 24, 0.2), 0 0 0 1px rgba(212, 175, 55, 0.25)'
                      : '0 8px 16px -6px rgba(25, 26, 24, 0.1)',
                  }}
                >
                  {/* Specular Glint Follows Pointer */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(circle 200px at ${glintPos.x}% ${glintPos.y}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.06) 40%, transparent 80%)`,
                      mixBlendMode: 'overlay',
                    }}
                  />

                  {/* Periodic Metallic Diagonal Sheen */}
                  <div className="metallic-sheen-line opacity-30 group-hover:opacity-75 transition-opacity" />

                  {/* Clean Top Bar: Minimal Hairline Brand Accent Only */}
                  <div className="flex items-center justify-between z-10 w-full">
                    <div className="w-6 h-1 rounded-full bg-black/10 dark:bg-white/20" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/70" />
                  </div>

                  {/* Center Tactile Emblem & Visual Anchor */}
                  <div className="my-auto text-center flex flex-col items-center justify-center z-10 space-y-2">
                    {card.id === 'overview' && (
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border border-[#D4AF37]/50 animate-spin-slow" />
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white shadow-md flex items-center justify-center border border-[#E6E4DE]">
                          <Compass className="w-6 h-6 sm:w-7 sm:h-7 text-[#194D39]" />
                        </div>
                      </div>
                    )}

                    {card.id === 'input' && (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center p-2 shadow-inner backdrop-blur-xs">
                        <CornerDownLeft className="w-8 h-8 sm:w-9 sm:h-9 text-white animate-pulse" />
                      </div>
                    )}

                    {card.id === 'simulator' && (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center p-2 shadow-inner backdrop-blur-xs">
                        <Sliders className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
                      </div>
                    )}

                    {card.id === 'coaching' && (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#194D39]/50 border border-[#27B889]/30 flex flex-col items-center justify-center shadow-inner relative backdrop-blur-xs">
                        <Sparkles className="w-8 h-8 sm:w-9 sm:h-9 text-[#D4AF37]" />
                      </div>
                    )}

                    {card.id === 'ledger' && (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/80 border border-[#D9D4C7] flex flex-col items-center justify-center p-2 shadow-xs backdrop-blur-xs">
                        <BookOpen className="w-8 h-8 sm:w-9 sm:h-9 text-[#191A18]" />
                      </div>
                    )}

                    <div className="space-y-0.5">
                      <h3 className={`font-editorial text-xl sm:text-2xl font-normal tracking-tight ${card.textColor}`}>
                        {card.title}
                      </h3>
                      <p className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-widest ${card.subtextColor}`}>
                        {card.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer: Tagline */}
                  <div className="z-10 pt-2 border-t border-black/10 dark:border-white/10 text-center">
                    <p className={`text-[10px] sm:text-[11px] leading-snug line-clamp-2 ${card.textColor} opacity-85 font-sans`}>
                      {card.tagline}
                    </p>
                  </div>
                </div>

                {/* Pure Card Caption Beneath Body (No numbers) */}
                <div className="mt-2 text-center">
                  <span
                    className={`font-editorial text-base sm:text-lg tracking-tight transition-colors duration-200 block ${
                      isStrictCenter
                        ? 'text-[#191A18] dark:text-[#FAF9F6] font-medium'
                        : 'text-[#777771] dark:text-[#A6A8A1] hover:text-[#191A18] dark:hover:text-[#FAF9F6]'
                    }`}
                  >
                    {card.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
