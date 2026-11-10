/**
 * Cover state for the link click waiting transition.
 *
 * The cover is raised on a link click and must stay up until the page the
 * visitor asked for is actually ready — not for a fixed number of milliseconds.
 * Three signals decide when that is:
 *
 *  1. the **route chunk has downloaded** (`src/App.tsx` reports this from its
 *     lazy imports, so a slow page keeps the cover up while its code arrives),
 *  2. the **new page has painted** (we wait for two animation frames after the
 *     route commits, so the visitor never sees a half built page),
 *  3. and the route actually **changed**.
 *
 * A ceiling still exists, because a loading screen must never become a trap: if
 * an image is slow or a chunk fails, the cover lifts anyway after `CEILING_MS`.
 * On a fast connection the result is instant; on a slow one it holds on.
 *
 * The store is a tiny external store (`useSyncExternalStore`) so the cover can
 * read it without prop drilling through the router.
 */

/** Never hold longer than this, whatever the network is doing. */
export const CEILING_MS = 8000;

type State = {
  /** a link was followed and the cover is (or should be) up */
  pending: boolean;
  /** the newest route's chunk has finished downloading */
  loaded: boolean;
  /** the visitor asked for reduced motion, so never show it */
  calm: boolean;
};

let state: State = { pending: false, loaded: true, calm: false };
const listeners = new Set<() => void>();

function set(patch: Partial<State>) {
  const next = { ...state, ...patch };
  if (
    next.pending === state.pending &&
    next.loaded === state.loaded &&
    next.calm === state.calm
  ) {
    return;
  }
  state = next;
  for (const listener of listeners) listener();
}

export function subscribeToCover(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function coverSnapshot(): State {
  return state;
}

/** A link was followed: raise the cover and wait for the new page. */
export function raiseCover() {
  set({ pending: true, loaded: false });
}

/** The destination exists in memory already (no chunk to fetch). */
export function markLoaded() {
  set({ loaded: true });
}

/** Drop the cover once the page has painted. */
export function dropCover() {
  set({ pending: false });
}

export function setCoverCalm(calm: boolean) {
  set({ calm });
}
