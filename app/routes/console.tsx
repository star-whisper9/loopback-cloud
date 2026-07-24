import type { Route } from "./+types/console";
import { ConsoleLayout } from "~/components/console/ConsoleLayout";

export function meta() {
  return [{ name: "robots", content: "noindex" }];
}

export async function loader(_args: Route.LoaderArgs) {
  return { locale: "zh" as const };
}

export default function ConsoleRoute() {
  return <ConsoleLayout />;
}
