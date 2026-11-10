import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    /**
     * Keep the animation engines and the content data in their own chunks.
     * The admin dashboard never runs GSAP or Framer Motion, so it should not
     * pay for them, and content rarely changes while the app does.
     */
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("framer-motion") || id.includes("gsap") || id.includes("motion-dom")) return "motion";
          if (id.includes("lucide-react")) return "icons";
          if (id.includes("@supabase")) return "data";
          return "vendor";
        },
      },
    },
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: true,
  },
  preview: {
    host: "0.0.0.0",
    port: 4173,
    allowedHosts: true,
  },
});
