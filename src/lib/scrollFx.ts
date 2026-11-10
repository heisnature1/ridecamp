/**
 * Scroll effects — the GSAP layer.
 *
 * Framer Motion handles entrances and interactions beautifully, but it is not
 * built for scrubbed, scroll linked motion. GSAP's ScrollTrigger is, so the
 * two jobs are split by strength rather than duplicated:
 *
 *  - parallax on section backgrounds (scrubbed, frame perfect),
 *  - horizontal drift on the logo marquee stays CSS (no JS cost),
 *  - scroll progress bar (scrubbed),
 *  - the pinned "three steps" sequence on the home page.
 *
 * Everything here is skipped entirely when the visitor prefers reduced motion,
 * and every trigger is reverted on unmount so hot reloading cannot stack them.
 */
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GSAP_EASE, useCalmMotion } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

/**
 * Parallax every `[data-parallax]` element.
 *
 * The attribute value is the strength in pixels: positive means the element
 * travels *slower* than the page (it drifts down as you scroll up), negative
 * means it outruns the page. Applied to `--parallax-shift`, a custom property
 * read by the element's own transform, so it never fights another transform.
 */
export function useParallax(enabled = true) {
  const calm = useCalmMotion();

  useEffect(() => {
    if (calm || !enabled) return;
    if (typeof window === "undefined") return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    if (!elements.length) return;

    const triggers = elements.map((element) => {
      const strength = Number(element.dataset.parallax ?? 0);
      if (!strength) return null;
      return gsap.fromTo(
        element,
        { y: 0 },
        {
          y: strength,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        },
      );
    });

    return () => {
      for (const trigger of triggers) {
        trigger?.scrollTrigger?.kill();
        trigger?.kill();
      }
    };
  }, [calm, enabled]);
}

/** A scrubbed progress bar across the top of the viewport. */
export function useScrollProgress(enabled = true) {
  const calm = useCalmMotion();

  useEffect(() => {
    if (!enabled) return;
    const bar = document.querySelector<HTMLElement>("[data-scroll-progress]");
    if (!bar) return;

    if (calm) {
      // still useful without motion: jump rather than grow
      bar.style.transform = "scaleX(0)";
      return;
    }

    const tween = gsap.fromTo(
      bar,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [calm, enabled]);
}

/**
 * Reveal a group of children in sequence as it scrolls in, using GSAP rather
 * than Framer so the timing can be scrubbed when the group is tall.
 * Children opt in with `[data-reveal-child]`.
 */
export function useScrollRevealGroup(selector: string, enabled = true) {
  const calm = useCalmMotion();

  useEffect(() => {
    if (calm || !enabled) return;
    const groups = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (!groups.length) return;

    const tweens = groups.flatMap((group) => {
      const children = Array.from(group.querySelectorAll<HTMLElement>("[data-reveal-child]"));
      if (!children.length) return [];
      return [
        gsap.from(children, {
          opacity: 0,
          y: 34,
          duration: 0.9,
          ease: GSAP_EASE,
          stagger: 0.09,
          scrollTrigger: { trigger: group, start: "top 82%", once: true },
        }),
      ];
    });

    return () => {
      for (const tween of tweens) {
        tween.scrollTrigger?.kill();
        tween.kill();
      }
    };
  }, [calm, enabled, selector]);
}

export { gsap, ScrollTrigger };
