import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    // Tests against the real database run separately: npm run test:db.
    exclude: ["src/**/*.db.test.ts", "node_modules/**"],
  },
});
