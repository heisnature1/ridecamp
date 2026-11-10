/**
 * Ask every active ScrollTrigger to re-measure.
 *
 * Loaded dynamically on purpose: the router calls this on every navigation, but
 * only pages that actually use scroll effects need the engine. Importing GSAP
 * here statically would put it on the critical path for the admin dashboard and
 * the calculator, which never scroll animate anything.
 */
export function requestScrollRefresh() {
  void import("gsap/ScrollTrigger")
    .then(({ ScrollTrigger }) => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    })
    .catch(() => {
      /* the engine is optional; nothing breaks if it cannot be fetched */
    });
}
