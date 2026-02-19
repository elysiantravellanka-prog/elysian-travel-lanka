import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Provides a stable `prefers-reduced-motion` value that never changes during SSR hydration.
 * Defaults to `false` until the component has mounted on the client, preventing
 * server/client markup mismatches when users prefer reduced motion.
 */
export function useStableReducedMotion() {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? prefersReducedMotion : false;
}
