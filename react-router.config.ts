import { copyFileSync } from "node:fs";
import { join } from "node:path";
import type { Config } from "@react-router/dev/config";

const PROJECT_BASE_PATH = "/loopback-cloud/";

export default {
  ssr: false,
  basename:
    process.env.BASE_PATH ??
    (process.env.NODE_ENV === "production" ? PROJECT_BASE_PATH : "/"),
  buildEnd({ reactRouterConfig }) {
    const clientDirectory = join(reactRouterConfig.buildDirectory, "client");
    copyFileSync(
      join(clientDirectory, "index.html"),
      join(clientDirectory, "404.html"),
    );
  },
} satisfies Config;
