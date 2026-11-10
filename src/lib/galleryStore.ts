import { supabase, friendlyError, GALLERY_BUCKET } from "./supabase";
import { safeUrl, sanitize } from "./validate";

/**
 * Gallery store — backed by Supabase.
 *
 * Posts live in the `gallery_posts` table and the pictures themselves live in
 * the public `gallery` storage bucket, so a post is visible to every visitor on
 * every device and stays there until an admin deletes it.
 *
 * The public Gallery page reads with the anon key; only a signed in admin can
 * add, edit or delete (enforced by row level security and storage policies).
 */

export const GALLERY_STORAGE_KEY = "ridecamp_gallery_cache";
const TABLE = "gallery_posts";
const CHANGE_EVENT = "ridecamp:gallery-change";

export type GalleryPost = {
  id: string;
  /** display title, e.g. "New fleet delivery in Accra" */
  title: string;
  /** short caption shown under the image */
  caption: string;
  /** public URL the image is served from */
  image: string;
  /** ISO timestamp of when it was posted */
  createdAt: string;
};

const canUseBrowser = typeof window !== "undefined";

type Row = {
  id: string;
  title: string;
  caption: string | null;
  image_url: string;
  created_at: string;
};

function fromRow(row: Row): GalleryPost {
  return {
    id: row.id,
    title: row.title ?? "",
    caption: row.caption ?? "",
    image: row.image_url ?? "",
    createdAt: row.created_at,
  };
}

function emit(posts: GalleryPost[]) {
  if (!canUseBrowser) return;
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: { posts } }));
}

export function normalizePost(raw: unknown): GalleryPost {
  const r = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof r.id === "string" && r.id ? r.id : "",
    title: typeof r.title === "string" ? r.title.trim() : "",
    caption: typeof r.caption === "string" ? r.caption.trim() : "",
    image: typeof r.image === "string" ? r.image.trim() : "",
    createdAt:
      typeof r.createdAt === "string" && !Number.isNaN(Date.parse(r.createdAt))
        ? r.createdAt
        : new Date().toISOString(),
  };
}

/* ------------------------------------------------------------------ */
/* cache                                                               */
/* ------------------------------------------------------------------ */

/** Last snapshot fetched from the server (first paint / offline). */
export function getGallery(): GalleryPost[] {
  if (!canUseBrowser) return [];
  try {
    const raw = window.localStorage.getItem(GALLERY_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(normalizePost)
      .filter((p) => p.id && p.title)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

function setCache(posts: GalleryPost[]) {
  if (canUseBrowser) {
    try {
      window.localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(posts));
    } catch {
      /* ignore quota errors — the list still renders from memory */
    }
  }
  emit(posts);
}

/** Fresh list from the database. Public — no sign in needed. */
export async function fetchGallery(): Promise<GalleryPost[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("id,title,caption,image_url,created_at")
    .order("created_at", { ascending: false });
  if (error) throw new Error(friendlyError(error, "Could not load the gallery."));
  const posts = (data as Row[]).map(fromRow);
  setCache(posts);
  return posts;
}

/* ------------------------------------------------------------------ */
/* image upload                                                        */
/* ------------------------------------------------------------------ */

function extensionFor(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^(png|jpe?g|webp|gif|avif)$/.test(fromName)) return fromName;
  const byType: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
  };
  return byType[file.type] ?? "jpg";
}

/** Upload a picture to the gallery bucket and return its public URL. */
export async function uploadGalleryImage(file: File): Promise<string> {
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensionFor(file)}`;
  const { error } = await supabase.storage.from(GALLERY_BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type || "image/jpeg",
  });
  if (error) throw new Error(friendlyError(error, "Could not upload that image."));
  const { data } = supabase.storage.from(GALLERY_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Best effort removal of the file behind a post (ignored if it is not ours). */
async function removeImage(imageUrl: string) {
  const marker = `/storage/v1/object/public/${GALLERY_BUCKET}/`;
  const at = imageUrl.indexOf(marker);
  if (at === -1) return;
  const path = imageUrl.slice(at + marker.length);
  if (!path) return;
  await supabase.storage.from(GALLERY_BUCKET).remove([path]);
}

/* ------------------------------------------------------------------ */
/* writes (admin only, enforced by RLS)                                */
/* ------------------------------------------------------------------ */

/**
 * Create a post. `image` may be a freshly uploaded URL or a bundled path such
 * as `/images/motor.jpg`.
 */
export async function addPost(
  post: Omit<GalleryPost, "id" | "createdAt">,
): Promise<GalleryPost> {
  const image = safeUrl(post.image);
  if (!image) throw new Error("That image location is not allowed.");
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      title: sanitize(post.title, 120),
      caption: sanitize(post.caption, 500),
      image_url: image,
    })
    .select("id,title,caption,image_url,created_at")
    .single();
  if (error || !data) throw new Error(friendlyError(error, "Could not add that post."));
  const saved = fromRow(data as Row);
  setCache([saved, ...getGallery().filter((p) => p.id !== saved.id)]);
  return saved;
}

export async function updatePost(
  id: string,
  patch: Partial<Pick<GalleryPost, "title" | "caption" | "image">>,
): Promise<void> {
  const payload: Record<string, unknown> = {};
  if (patch.title !== undefined) payload.title = sanitize(patch.title, 120);
  if (patch.caption !== undefined) payload.caption = sanitize(patch.caption, 500);
  if (patch.image !== undefined) {
    const image = safeUrl(patch.image);
    if (!image) throw new Error("That image location is not allowed.");
    payload.image_url = image;
  }

  const previous = getGallery().find((p) => p.id === id);
  const { error } = await supabase.from(TABLE).update(payload).eq("id", id);
  if (error) throw new Error(friendlyError(error, "Could not update that post."));

  if (previous && patch.image !== undefined && previous.image !== patch.image) {
    await removeImage(previous.image);
  }
  setCache(
    getGallery().map((p) =>
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

export async function deletePost(id: string): Promise<void> {
  const previous = getGallery().find((p) => p.id === id);
  const { error } = await supabase.from(TABLE).delete().eq("id", id);
  if (error) throw new Error(friendlyError(error, "Could not delete that post."));
  if (previous) await removeImage(previous.image);
  setCache(getGallery().filter((p) => p.id !== id));
}

/** Fires when the cached list changes in this tab or another one. */
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

/**
 * Make sure the public gallery is not empty on a brand new project.
 * Only an admin can insert, so this quietly does nothing otherwise.
 */
export async function seedGallery(): Promise<GalleryPost[]> {
  const existing = await fetchGallery();
  if (existing.length) return [];
  const seeds = [
    {
      title: "Ekon 450 M1, road tested in Accra",
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
        "Delivery fleets switching from petrol to electric, with a lower running cost and more trips per day.",
    },
  ];
  const { error } = await supabase.from(TABLE).insert(
    seeds.map((s) => ({ title: s.title, caption: s.caption, image_url: s.image })),
  );
  if (error) return [];
  return fetchGallery();
}
