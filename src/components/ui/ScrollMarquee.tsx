"use client";

import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useRef } from "react";
import { useStableReducedMotion } from "@/components/ui/useStableReducedMotion";

interface MarqueeScrollProps {
  items: string[];
  className?: string;
  speed?: number;
  direction?: "left" | "right";
}

/**
 * Marquee-style horizontal scrolling text section
 * Text moves continuously as user scrolls down the page
 */
export function MarqueeScroll({
  items,
  className = "",
  speed = 1,
  direction = "left",
}: MarqueeScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useStableReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "left" ? ["0%", `${-50 * speed}%`] : [`${-50 * speed}%`, "0%"]
  );

  const smoothX = useSpring(x, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (shouldReduceMotion) {
    return (
      <div ref={containerRef} className={`py-16 overflow-hidden ${className}`}>
        <div className="flex gap-8">
          {items.map((item, i) => (
            <span key={i} className="text-white/30 text-4xl md:text-6xl font-display whitespace-nowrap">
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`py-16 overflow-hidden ${className}`}>
      <motion.div className="flex gap-8" style={{ x: smoothX }}>
        {/* Duplicate items for seamless loop */}
        {[...items, ...items, ...items, ...items].map((item, index) => (
          <span
            key={index}
            className="text-white/20 text-5xl md:text-7xl lg:text-8xl font-display whitespace-nowrap tracking-tight"
          >
            {item}
            <span className="mx-8 text-[#c9a962]/40">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

interface ParallaxTextProps {
  text: string;
  className?: string;
  subtext?: string;
}

/**
 * Large text with parallax effect that slides horizontally
 * as the user scrolls through the section.
 */
export function ParallaxText({ text, className = "", subtext }: ParallaxTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useStableReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Multiple layers with different speeds
  const x1 = useTransform(scrollYProgress, [0, 1], [-200, 200]);
  const x2 = useTransform(scrollYProgress, [0, 1], [200, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const bgOpacity = useTransform(opacity, v => v * 0.1);

  const smoothX1 = useSpring(x1, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const smoothX2 = useSpring(x2, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const smoothBgOpacity = useSpring(bgOpacity, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (shouldReduceMotion) {
    return (
      <div ref={containerRef} className={`py-32 ${className}`}>
        <div className="text-center">
          <h2 className="font-display text-5xl md:text-7xl text-white">{text}</h2>
          {subtext && <p className="text-white/60 text-xl mt-4">{subtext}</p>}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative py-32 overflow-hidden ${className}`}>
      {/* Background decorative text */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 left-0 pointer-events-none select-none"
        style={{ x: smoothX2, opacity: smoothBgOpacity }}
      >
        <span className="text-[15rem] md:text-[25rem] font-display text-white/5 whitespace-nowrap">
          {text}
        </span>
      </motion.div>

      {/* Main content */}
      <motion.div
        className="relative z-10 text-center px-6"
        style={{ x: smoothX1, opacity: smoothOpacity, scale: smoothScale }}
      >
        <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6">
          {text}
        </h2>
        {subtext && (
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">{subtext}</p>
        )}
      </motion.div>
    </div>
  );
}

// Component for individual split line
function SplitRevealLine({
  line,
  index,
  scrollYProgress,
}: {
  line: { text: string; highlight?: boolean };
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const isEven = index % 2 === 0;
  const startOffset = index * 0.1;

  const x = useTransform(
    scrollYProgress,
    [startOffset, startOffset + 0.2, startOffset + 0.4],
    isEven ? [-300, 0, 0] : [300, 0, 0]
  );

  const opacity = useTransform(
    scrollYProgress,
    [startOffset, startOffset + 0.15, startOffset + 0.35, startOffset + 0.5],
    [0, 1, 1, 0.3]
  );

  const smoothX = useSpring(x, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className={`font-display text-4xl md:text-6xl lg:text-7xl tracking-tight ${
        line.highlight ? "gradient-text" : "text-white"
      }`}
      style={{ x: smoothX, opacity: smoothOpacity }}
    >
      {line.text}
    </motion.div>
  );
}

interface SplitRevealTextProps {
  lines: { text: string; highlight?: boolean }[];
  className?: string;
}

/**
 * Text lines that reveal from alternating horizontal directions
 * as the user scrolls, creating a dramatic entrance effect.
 */
export function SplitRevealText({ lines, className = "" }: SplitRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useStableReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  if (shouldReduceMotion) {
    return (
      <div ref={containerRef} className={`space-y-4 ${className}`}>
        {lines.map((line, i) => (
          <div
            key={i}
            className={`font-display text-4xl md:text-6xl ${
              line.highlight ? "gradient-text" : "text-white"
            }`}
          >
            {line.text}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`space-y-2 md:space-y-4 ${className}`}>
      {lines.map((line, index) => (
        <SplitRevealLine
          key={index}
          line={line}
          index={index}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}

export default MarqueeScroll;
