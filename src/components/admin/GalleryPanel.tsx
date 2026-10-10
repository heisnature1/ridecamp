import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Image, Edit, Trash2, Upload, X as XIcon } from "lucide-react";
import { Panel, PanelTitle, EmptyState } from "./ui";
import { addPost, updatePost, deletePost, type GalleryPost } from "../../lib/galleryStore";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ImageUploadZone({
  value,
  onChange,
  onRemove,
  label = "Image",
  required = true,
  className = "",
}: {
  value: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
  label?: string;
  required?: boolean;
  className?: string;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please drop an image file");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setPreview(dataUrl);
      onChange(dataUrl);
    } catch {
      alert("Failed to read file");
    }
  }, [onChange]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setPreview(dataUrl);
      onChange(dataUrl);
    } catch {
      alert("Failed to read file");
    }
  }, [onChange]);

  const handleRemove = useCallback(() => {
    setPreview(null);
    onChange("");
    onRemove?.();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [onChange, onRemove]);

  const hasImage = preview || value;
  const displayImage = preview || value;

  return (
    <div className={className}>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-semibold text-navy">{label} {required && <span className="text-red-500">*</span>}</span>

        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
            dragActive ? "border-brand bg-brand/5" : hasImage ? "border-line" : "border-line hover:border-brand/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label={`Upload ${label.toLowerCase()}`}
          />

          {hasImage ? (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <img
                src={displayImage}
                alt={`${label} preview`}
                className="size-full object-cover"
              />
              {onRemove && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white transition hover:bg-black/80"
                  aria-label={`Remove ${label.toLowerCase()}`}
                >
                  <XIcon className="size-4" />
                </button>
              )}
            </div>
          ) : (
            <div className="aspect-[4/3] flex flex-col items-center justify-center p-6 text-center">
              <Upload className="size-10 text-slate/40" />
              <p className="mt-2 text-sm text-slate">Drag & drop or click to upload</p>
              <p className="text-[11px] text-slate/50">PNG, JPG, WebP up to 5MB</p>
            </div>
          )}
        </div>

        {hasImage && (
          <p className="text-[11px] text-green-600 flex items-center gap-1">
            <Image className="size-3" /> Image ready
          </p>
        )}
      </label>
    </div>
  );
}

export default function GalleryPanel({
  posts,
  onToast,
  onAdd,
  onUpdate,
  onDelete,
}: {
  posts: GalleryPost[];
  onToast: (text: string, tone?: "ok" | "warn") => void;
  onAdd: (post: GalleryPost) => void;
  onUpdate: (id: string, patch: Partial<GalleryPost>) => void;
  onDelete: (id: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editImage, setEditImage] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [newImage, setNewImage] = useState("");

  const handleAdd = () => {
    if (!newTitle.trim() || !newImage.trim()) {
      onToast("Title and image URL are required", "warn");
      return;
    }
    const post = addPost({ title: newTitle.trim(), caption: newCaption.trim(), image: newImage.trim() });
    onAdd(post);
    onToast("Gallery post added");
    setIsAdding(false);
    setNewTitle("");
    setNewCaption("");
    setNewImage("");
  };

  const handleUpdate = (id: string) => {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    if (!editTitle.trim() || !editImage.trim()) {
      onToast("Title and image URL are required", "warn");
      return;
    }
    updatePost(id, { title: editTitle.trim(), caption: editCaption.trim(), image: editImage.trim() });
    onUpdate(id, { title: editTitle.trim(), caption: editCaption.trim(), image: editImage.trim() });
    onToast("Gallery post updated");
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this gallery post?")) {
      deletePost(id);
      onDelete(id);
      onToast("Gallery post deleted", "warn");
    }
  };

  const startEdit = (post: GalleryPost) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditCaption(post.caption);
    setEditImage(post.image);
  };

  const startAdd = () => {
    setIsAdding(true);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const cancelAdd = () => {
    setIsAdding(false);
    setNewTitle("");
    setNewCaption("");
    setNewImage("");
  };

  return (
    <Panel className="space-y-6">
      <PanelTitle
        title="Gallery posts"
        hint="Manage images and captions shown on the public Gallery page"
        action={
          <button type="button" onClick={startAdd} className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-dark active:scale-95">
            <Plus className="size-3.5" /> Add post
          </button>
        }
      />

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 0.61, 0.36, 1] }}
            className="rounded-2xl border border-line bg-cloud p-5 space-y-4"
          >
            <h3 className="font-display text-lg font-bold text-navy">New gallery post</h3>
            <div className="space-y-3">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-semibold text-navy">Title *</span>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. New fleet delivery in Accra"
                  className="rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-semibold text-navy">Caption</span>
                <textarea
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Short description shown under the image"
                  rows={2}
                  className="rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </label>
              <ImageUploadZone
                value={newImage}
                onChange={setNewImage}
                label="Image"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={cancelAdd} className="rounded-full bg-white px-4 py-2 text-xs font-bold text-navy ring-1 ring-line transition hover:ring-navy active:scale-95">
                Cancel
              </button>
              <button type="button" onClick={handleAdd} className="rounded-full bg-brand px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-dark active:scale-95">
                Add post
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {posts.length === 0 ? (
        <EmptyState
          icon={<Image className="size-7 text-brand" />}
          title="No gallery posts yet"
          body="Add your first image and caption to display it on the public Gallery page."
          action={
            <button type="button" onClick={startAdd} className="rounded-full bg-brand px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-dark active:scale-95">
              Add first post
            </button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: Math.min(i, 5) * 0.06, ease: [0.22, 0.61, 0.36, 1] }}
              className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                <img
                  src={post.image}
                  alt={post.title}
                  className="size-full object-cover transition duration-500"
                  loading="lazy"
                />
                {editingId === post.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                    <div className="rounded-xl bg-white p-4 w-full max-w-md mx-4">
                      <h4 className="font-display font-bold text-navy mb-3">Editing: {post.title}</h4>
                      <div className="space-y-3">
                        <label className="flex flex-col gap-1.5 text-sm">
                          <span className="font-semibold text-navy">Title *</span>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                          />
                        </label>
                        <label className="flex flex-col gap-1.5 text-sm">
                          <span className="font-semibold text-navy">Caption</span>
                          <textarea
                            value={editCaption}
                            onChange={(e) => setEditCaption(e.target.value)}
                            rows={2}
                            className="rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                          />
                        </label>
                        <ImageUploadZone
                          value={editImage}
                          onChange={setEditImage}
                          label="Image"
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={cancelEdit} className="rounded-full bg-white px-4 py-2 text-xs font-bold text-navy ring-1 ring-line transition hover:ring-navy active:scale-95">
                          Cancel
                        </button>
                        <button type="button" onClick={() => handleUpdate(post.id)} className="rounded-full bg-brand px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-dark active:scale-95">
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-display text-base font-bold text-navy truncate">{post.title}</h3>
                {post.caption && <p className="text-sm leading-relaxed text-slate line-clamp-2">{post.caption}</p>}
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate/70">
                  {new Date(post.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-line">
                  <button
                    type="button"
                    onClick={() => startEdit(post)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-navy ring-1 ring-line transition hover:ring-navy active:scale-95"
                  >
                    <Edit className="size-3.5" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(post.id)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-red-600 ring-1 ring-red-200 transition hover:ring-red-400 active:scale-95"
                  >
                    <Trash2 className="size-3.5" /> Delete
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </Panel>
  );
}