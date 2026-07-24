import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["app/**/*.test.ts"],
    passWithNoTests: true,
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@/": new URL("./", import.meta.url).pathname,
      "~/": new URL("./app/", import.meta.url).pathname,
    },
  },
});
