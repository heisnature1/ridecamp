/**
 * Browser-side gallery store.
 *
 * Admins post pictures with a short caption from the dashboard; the public
 * Gallery page reads from the same place. Posts live in localStorage under
 * `ridecamp_gallery` and notify subscribers in this tab (custom event) and
 * any other open tab (`storage` event), just like the lead store.
 */

export const GALLERY_STORAGE_KEY = "ridecamp_gallery";
const CHANGE_EVENT = "ridecamp:gallery-change";

export type GalleryPost = {
  id: string;
  /** display title, e.g. "New fleet delivery in Accra" */
  title: string;
  /** short caption shown under the image */
  caption: string;
  /** URL the image is served from — `/images/…` for bundled assets or any http(s) link */
  image: string;
  /** ISO timestamp of when it was posted */
  createdAt: string;
};

const canUseBrowser = typeof window !== "undefined";

function newId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === "function") return c.randomUUID();
  return `post-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function readRaw(): GalleryPost[] {
  if (!canUseBrowser) return [];
  try {
    const raw = window.localStorage.getItem(GALLERY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((p: any) => normalizePost(p))
      .filter((p: GalleryPost) => p.id && p.title);
  } catch {
    return [];
  }
}

function write(posts: GalleryPost[]) {
  if (!canUseBrowser) return;
  try {
    window.localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(posts));
  } catch {
    /* ignore quota / private-mode errors */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  }
}

export function normalizePost(raw: unknown): GalleryPost {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof r.id === "string" && r.id ? r.id : newId(),
    title: typeof r.title === "string" ? r.title.trim() : "",
    caption: typeof r.caption === "string" ? r.caption.trim() : "",
    image: typeof r.image === "string" ? r.image.trim() : "",
    createdAt:
      typeof r.createdAt === "string" && !Number.isNaN(Date.parse(r.createdAt))
        ? r.createdAt
        : new Date().toISOString(),
  };
}

export function getGallery(): GalleryPost[] {
  return readRaw().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function addPost(post: Omit<GalleryPost, "id" | "createdAt">): GalleryPost {
  const next = normalizePost({ ...post, createdAt: new Date().toISOString() });
  const existing = readRaw();
  write([next, ...existing]);
  return next;
}

export function updatePost(id: string, patch: Partial<Omit<GalleryPost, "id">>): void {
  write(
    readRaw().map((p) =>
      p.id === id
        ? {
            ...p,
            title: patch.title !== undefined ? patch.title : p.title,
            caption: patch.caption !== undefined ? patch.caption : p.caption,
            image: patch.image !== undefined ? patch.image : p.image,
          }
        : p,
    ),
  );
}

export function deletePost(id: string): void {
  write(readRaw().filter((p) => p.id !== id));
}

export function subscribe(cb: () => void): () => void {
  if (!canUseBrowser) return () => {};
  const handler = () => cb();
  window.addEventListener(CHANGE_EVENT, handler as EventListener);
  const storageHandler = (e: StorageEvent) => {
    if (e.key === GALLERY_STORAGE_KEY) cb();
  };
  window.addEventListener("storage", storageHandler as EventListener);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handler as EventListener);
    window.removeEventListener("storage", storageHandler as EventListener);
  };
}

/** Seed posts so the public gallery is never empty on first load. */
export function seedGallery(): GalleryPost[] {
  const existing = readRaw();
  if (existing.length) return [];
  const seeds: Omit<GalleryPost, "id" | "createdAt">[] = [
    {
      title: "Ekon 450 M1 — road tested in Accra",
      image: "/images/motor.jpg",
      caption:
        "The Spiro Ekon 450 M1 on Ghanaian roads. Reinforced frame, tuned suspension, 300 kg load capacity.",
    },
    {
      title: "Swap point, East Legon",
      image: "/images/swap-station.jpg",
      caption:
        "Swap a flat battery for a fully charged one in minutes. No waiting hours to charge.",
    },
    {
      title: "Fleet delivery",
      image: "/images/fleet-delivery.jpg",
      caption:
        "Delivery fleets switching from petrol to electric — lower running cost, more trips per day.",
    },
  ];
  const now = Date.now();
  const created = seeds.map((s, i) =>
    normalizePost({ ...s, id: `seed-${i + 1}`, createdAt: new Date(now - (seeds.length - i) * 86400000).toISOString() }),
  );
  write([...created, ...existing]);
  return created;
}