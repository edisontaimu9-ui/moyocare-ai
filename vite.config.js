import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base: "./" keeps asset paths relative so this works whether it's deployed
// at a custom domain root, a project-pages subpath, or previewed locally.
export default defineConfig({
  plugins: [react()],
  base: "./",
});
