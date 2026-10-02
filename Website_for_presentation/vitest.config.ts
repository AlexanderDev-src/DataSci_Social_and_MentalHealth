import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const src = (dir: string) => fileURLToPath(new URL(`./src/${dir}`, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@domain": src("domain"),
      "@data": src("data"),
      "@shared": src("shared"),
      "@features": src("features"),
    },
  },
});
