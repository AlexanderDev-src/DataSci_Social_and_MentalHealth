// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// GitHub Pages serves the site from /<repo>/, so the deploy workflow passes the
// address in. Run locally, both are unset and the site lives at the root.
export default defineConfig({
  site: process.env.SITE_URL,
  base: process.env.BASE_PATH || "/",
  integrations: [react()],
});
