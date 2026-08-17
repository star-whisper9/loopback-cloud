import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

const PROJECT_BASE_PATH = "/loopback-cloud/";

export default defineConfig(({ mode }) => ({
  base:
    process.env.BASE_PATH ??
    (mode === "production" ? PROJECT_BASE_PATH : "/"),
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
}));
