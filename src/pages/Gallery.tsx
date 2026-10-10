import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import Reveal from "../components/Reveal";
import { getGallery, subscribe, type GalleryPost } from "../lib/galleryStore";

export default function Gallery() {
  const [posts, setPosts] = useState<GalleryPost[]>([]);

  useEffect(() => {
    setPosts(getGallery());
    return subscribe(() => setPosts(getGallery()));
  }, []);

  return (
    <>
      <PageHero
        kicker="Gallery"
        title="Bikes on the road."
        sub="Real moments from riders, fleets and swap points across Ghana. New posts appear here as soon as an admin adds them."
      />

      <section className="bg-white pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          {posts.length === 0 ? (
            <Reveal>
              <div className="rounded-3xl border border-dashed border-line bg-cloud p-12 text-center">
                <p className="font-display text-lg font-bold text-navy">No posts yet.</p>
                <p className="mt-2 text-sm text-slate">
                  An admin can add pictures and captions from the dashboard.
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={Math.min(i, 5) * 0.05}>
                  <article className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
                    <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="size-full object-cover transition duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-base font-bold text-navy">{post.title}</h3>
                      {post.caption && (
                        <p className="mt-1.5 text-sm leading-relaxed text-slate">{post.caption}</p>
                      )}
                      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate/70">
                        {new Date(post.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}

          <Reveal delay={0.15}>
            <div className="mt-14 rounded-3xl bg-navy p-8 text-center text-white">
              <h2 className="font-display text-xl font-bold">Want your ride featured?</h2>
              <p className="mt-2 text-sm text-white/75">
                Send us a photo and a short note — we will add it to the gallery.
              </p>
              <div className="mt-6 flex justify-center">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-dark active:scale-95"
                >
                  Get in touch
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}