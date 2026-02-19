"use client";

import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { useStableReducedMotion } from "@/components/ui/useStableReducedMotion";

interface ScrollytellingSectionProps {
  className?: string;
}

// SVG Line component with pathLength animation
function AnimatedLine({ scrollYProgress, y1, y2, range }: {
  scrollYProgress: MotionValue<number>;
  y1: string;
  y2: string;
  range: [number, number];
}) {
  const pathLength = useTransform(scrollYProgress, range, [0, 1]);

  return (
    <motion.line
      x1="0"
      y1={y1}
      x2="100%"
      y2={y2}
      stroke="#c9a962"
      strokeWidth="1"
      style={{ pathLength }}
    />
  );
}

/**
 * Immersive Scrollytelling Section
 * 
 * Creates a high-end storytelling experience where:
 * - Large text slides horizontally based on scroll
 * - Images parallax at different speeds
 * - Content reveals progressively
 */
export default function ScrollytellingSection({ className = "" }: ScrollytellingSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useStableReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Smooth spring configuration for luxurious feel
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  // Large headline horizontal movement
  const headlineX = useTransform(scrollYProgress, [0, 0.5, 1], [-300, 0, 300]);
  const headlineX2 = useTransform(scrollYProgress, [0, 0.5, 1], [300, 0, -300]);
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // Subtext reveal
  const subtextY = useTransform(scrollYProgress, [0.1, 0.3, 0.4, 0.8, 0.9], [100, 0, 0, 0, -100]);
  const subtextOpacity = useTransform(scrollYProgress, [0.1, 0.25, 0.7, 0.9], [0, 1, 1, 0]);

  // Image parallax
  const imageY1 = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const imageY2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  // Feature cards stagger
  const card1X = useTransform(scrollYProgress, [0.2, 0.4, 0.6], [-200, 0, 200]);
  const card2X = useTransform(scrollYProgress, [0.25, 0.45, 0.65], [200, 0, -200]);
  const card3X = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [-200, 0, 200]);
  const cardOpacity = useTransform(scrollYProgress, [0.2, 0.35, 0.65, 0.8], [0, 1, 1, 0]);

  // Apply smooth spring to all transforms
  const smoothHeadlineX = useSpring(headlineX, springConfig);
  const smoothHeadlineX2 = useSpring(headlineX2, springConfig);
  const smoothHeadlineOpacity = useSpring(headlineOpacity, springConfig);
  const smoothSubtextY = useSpring(subtextY, springConfig);
  const smoothSubtextOpacity = useSpring(subtextOpacity, springConfig);
  const smoothImageY1 = useSpring(imageY1, springConfig);
  const smoothImageY2 = useSpring(imageY2, springConfig);
  const smoothImageScale = useSpring(imageScale, springConfig);
  const smoothCard1X = useSpring(card1X, springConfig);
  const smoothCard2X = useSpring(card2X, springConfig);
  const smoothCard3X = useSpring(card3X, springConfig);
  const smoothCardOpacity = useSpring(cardOpacity, springConfig);

  if (shouldReduceMotion) {
    return (
      <section className={`relative py-32 overflow-hidden bg-[#0a1628] ${className}`}>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-6">
            Discover the <span className="gradient-text">Unseen</span>
          </h2>
          <p className="text-white/60 text-xl max-w-2xl mx-auto mb-16">
            Journey through ancient temples, pristine beaches, and lush tea plantations
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className={`relative min-h-[300vh] bg-[#0a1628] ${className}`}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-[#c9a962]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] bg-[#c9a962]/10 rounded-full blur-[120px]" />

        {/* Large scrolling headline - Line 1 */}
        <motion.div
          className="absolute top-[15%] left-0 w-full flex justify-center items-center pointer-events-none"
          style={{
            x: smoothHeadlineX,
            opacity: smoothHeadlineOpacity,
          }}
        >
          <h2 className="font-display text-[clamp(3rem,12vw,10rem)] text-white whitespace-nowrap tracking-tight">
            Discover the
          </h2>
        </motion.div>

        {/* Large scrolling headline - Line 2 */}
        <motion.div
          className="absolute top-[35%] left-0 w-full flex justify-center items-center pointer-events-none"
          style={{
            x: smoothHeadlineX2,
            opacity: smoothHeadlineOpacity,
          }}
        >
          <h2 className="font-display text-[clamp(3rem,12vw,10rem)] gradient-text whitespace-nowrap tracking-tight">
            Unseen
          </h2>
        </motion.div>

        {/* Subtext */}
        <motion.div
          className="absolute top-[55%] left-0 w-full flex justify-center px-6"
          style={{
            y: smoothSubtextY,
            opacity: smoothSubtextOpacity,
          }}
        >
          <p className="text-white/60 text-lg md:text-2xl max-w-2xl text-center leading-relaxed">
            Journey through ancient temples, pristine beaches, and lush tea plantations.
            Every scroll reveals a new chapter of Sri Lanka&apos;s magic.
          </p>
        </motion.div>

        {/* Floating Images */}
        <motion.div
          className="absolute left-[5%] top-[60%] w-48 md:w-64 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl"
          style={{
            y: smoothImageY1,
            scale: smoothImageScale,
          }}
        >
          <Image
            src="https://miro.medium.com/v2/resize:fit:1400/0*XKho2cag3QQivD6E"
            alt="Ceylon tea plantation hills in Sri Lanka"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </motion.div>

        <motion.div
          className="absolute right-[5%] top-[20%] w-40 md:w-56 aspect-square rounded-2xl overflow-hidden shadow-2xl"
          style={{
            y: smoothImageY2,
            scale: smoothImageScale,
          }}
        >
          <Image
            src="https://imgs.mongabay.com/wp-content/uploads/sites/20/2019/02/15071723/Sri-Lanka-elephants.jpg"
            alt="Sri Lankan elephant in natural habitat"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          className="absolute bottom-[10%] left-[10%] md:left-[15%]"
          style={{
            x: smoothCard1X,
            opacity: smoothCardOpacity,
          }}
        >
          <div className="glass-card p-6 md:p-8 max-w-xs">
            <div className="text-4xl md:text-5xl font-display gradient-text mb-2">500+</div>
            <div className="text-white/60 text-sm tracking-wide">Handcrafted Journeys</div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-[10%] left-1/2 -translate-x-1/2"
          style={{
            x: smoothCard2X,
            opacity: smoothCardOpacity,
          }}
        >
          <div className="glass-card p-6 md:p-8 max-w-xs">
            <div className="text-4xl md:text-5xl font-display gradient-text mb-2">12</div>
            <div className="text-white/60 text-sm tracking-wide">Years of Excellence</div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-[10%] right-[10%] md:right-[15%]"
          style={{
            x: smoothCard3X,
            opacity: smoothCardOpacity,
          }}
        >
          <div className="glass-card p-6 md:p-8 max-w-xs">
            <div className="text-4xl md:text-5xl font-display gradient-text mb-2">98%</div>
            <div className="text-white/60 text-sm tracking-wide">Guest Satisfaction</div>
          </div>
        </motion.div>

        {/* Decorative lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <AnimatedLine scrollYProgress={scrollYProgress} y1="30%" y2="30%" range={[0, 0.5]} />
          <AnimatedLine scrollYProgress={scrollYProgress} y1="70%" y2="70%" range={[0.5, 1]} />
        </svg>
      </div>
    </section>
  );
}
