"use client";

import { motion, useScroll, useTransform, useSpring, useReducedMotion, MotionValue } from "framer-motion";
import { ReactNode, useRef } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  direction?: "left" | "right";
  offset?: number;
}

/**
 * Horizontal scroll-triggered reveal animation.
 * Text slides in from the side as user scrolls.
 */
export function ScrollReveal({
  children,
  className,
  direction = "left",
  offset = 200,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Smooth spring animation for natural feel
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  
  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    direction === "left" ? [-offset, 0, offset] : [offset, 0, -offset]
  );

  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.3, 1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);

  const smoothX = useSpring(x, springConfig);
  const smoothOpacity = useSpring(opacity, springConfig);
  const smoothScale = useSpring(scale, springConfig);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        x: smoothX,
        opacity: smoothOpacity,
        scale: smoothScale,
      }}
    >
      {children}
    </motion.div>
  );
}

interface ScrollTextProps {
  text: string;
  className?: string;
  direction?: "left" | "right";
  offset?: number;
}

/**
 * Large horizontal scrolling text that creates a marquee-like effect
 * based on scroll position.
 */
export function ScrollText({
  text,
  className = "",
  direction = "left",
  offset = 300,
}: ScrollTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "left" ? [offset, -offset] : [-offset, offset]
  );

  const smoothX = useSpring(x, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {text}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: smoothX }}
    >
      {text}
    </motion.div>
  );
}

interface ScrollParallaxProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

/**
 * Parallax scroll effect that moves content at different speeds
 * than the scroll for depth perception.
 */
export function ScrollParallax({
  children,
  className,
  speed = 0.5,
}: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} className={className} style={{ y: smoothY }}>
      {children}
    </motion.div>
  );
}

interface ScrollScaleTextProps {
  text: string;
  className?: string;
  baseScale?: number;
}

/**
 * Text that scales and fades based on scroll position
 * Creates a dramatic entrance/exit effect.
 */
export function ScrollScaleText({
  text,
  className = "",
  baseScale = 1.5,
}: ScrollScaleTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [baseScale, 1, 0.8]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.2, 1, 1, 0.2]);

  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30, restDelta: 0.001 });

  if (prefersReducedMotion) {
    return (
      <div ref={ref} className={className}>
        {text}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ scale: smoothScale, opacity: smoothOpacity }}
    >
      {text}
    </motion.div>
  );
}

// Component for individual split line
function SplitLine({
  line,
  index,
  scrollYProgress,
}: {
  line: string;
  index: number;
  scrollYProgress: MotionValue<number>;
}) {
  const direction = index % 2 === 0 ? -1 : 1;
  
  const x = useTransform(
    scrollYProgress,
    [0.1 + index * 0.15, 0.3 + index * 0.15, 0.5 + index * 0.15, 0.7 + index * 0.15],
    [direction * 200, 0, 0, direction * -200]
  );
  
  const opacity = useTransform(
    scrollYProgress,
    [0.1 + index * 0.15, 0.2 + index * 0.15, 0.6 + index * 0.15, 0.7 + index * 0.15],
    [0, 1, 1, 0]
  );

  const smoothX = useSpring(x, { stiffness: 100, damping: 30, restDelta: 0.001 });
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="text-4xl md:text-6xl font-display text-white"
      style={{
        x: smoothX,
        opacity: smoothOpacity,
      }}
    >
      {line}
    </motion.div>
  );
}

interface ScrollSplitTextProps {
  lines: string[];
  className?: string;
}

/**
 * Multiple lines of text that animate in sequentially from alternating sides
 * based on scroll position.
 */
export function ScrollSplitText({ lines, className = "" }: ScrollSplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  if (prefersReducedMotion) {
    return (
      <div ref={containerRef} className={className}>
        {lines.map((line, i) => (
          <div key={i} className="text-4xl md:text-6xl font-display text-white">
            {line}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      {lines.map((line, index) => (
        <SplitLine
          key={index}
          line={line}
          index={index}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}

export default ScrollReveal;
