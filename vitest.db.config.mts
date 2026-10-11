import { fileURLToPath } from "node:url";
import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";

// Runs *.db.test.ts against the linked Supabase project, using the keys in .env.local.
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: { "server-only": fileURLToPath(new URL("./src/test/empty-module.ts", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.db.test.ts"],
    env: loadEnv("development", process.cwd(), ""),
    testTimeout: 20_000,
    // One file at a time: they share the database, so parallel files would race for the same slot.
    fileParallelism: false,
  },
});
