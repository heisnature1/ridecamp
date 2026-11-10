/**
 * Scroll progress, pinned under the nav.
 *
 * The page change itself is `PageTransition` (logo + orbit lines); the coloured
 * wipe that used to live here is gone. The bar is GSAP scrubbed
 * (`useScrollProgress`) so it tracks the real scroll position rather than
 * guessing from React state.
 */
import { useScrollProgress } from "../../lib/scrollFx";

export function ScrollProgress() {
  useScrollProgress();
  return <div className="scroll-progress" data-scroll-progress aria-hidden="true" />;
}
