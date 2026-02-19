"use client";

import { motion, useInView } from "framer-motion";
import { ReactNode, useMemo, useRef } from "react";
import { useStableReducedMotion } from "@/components/ui/useStableReducedMotion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  variant?: "fade" | "slideUp" | "scale" | "blur";
  once?: boolean;
  amount?: number;
}

/**
 * Reusable scroll-triggered reveal with sensible defaults.
 * Keeps motion subtle and respects reduced motion preferences.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.65,
  variant = "slideUp",
  once = true,
  amount = 0.2,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, {
    once,
    amount,
    margin: "0px 0px -10% 0px",
  });
  const prefersReducedMotion = useStableReducedMotion();

  const variants = useMemo(() => {
    const baseEase = {
      ease: [0.22, 1, 0.36, 1],
      delay,
      duration,
    } as const;

    if (prefersReducedMotion) {
      return {
        initial: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
        animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
        transition: { duration: 0 },
      } as const;
    }

    const variantMap = {
      fade: {
        initial: { opacity: 0, y: 0 },
        animate: { opacity: 1, y: 0 },
      },
      slideUp: {
        initial: { opacity: 0, y: 28 },
        animate: { opacity: 1, y: 0 },
      },
      scale: {
        initial: { opacity: 0, scale: 0.94 },
        animate: { opacity: 1, scale: 1 },
      },
      blur: {
        initial: { opacity: 0, y: 20, filter: "blur(8px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
      },
    } as const;

    const selected = variantMap[variant] ?? variantMap.slideUp;

    return {
      ...selected,
      transition: { ...baseEase },
    } as const;
  }, [delay, duration, prefersReducedMotion, variant]);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={variants.initial}
      animate={isInView ? variants.animate : variants.initial}
      transition={variants.transition}
    >
      {children}
    </motion.div>
  );
}
