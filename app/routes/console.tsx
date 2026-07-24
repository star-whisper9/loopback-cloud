import { redirect } from "react-router";
import type { Route } from "./+types/console";
import { ConsoleLayout } from "~/components/console/ConsoleLayout";
import { machineStore } from "~/lib/machineStore";

export function meta() {
  return [{ name: "robots", content: "noindex" }];
}

export async function loader(_args: Route.LoaderArgs) {
  return { locale: "zh" as const };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const serverData = await serverLoader();
  const machine = machineStore.read();
  if (machine === null) throw redirect("/");
  return serverData;
}
clientLoader.hydrate = true;

export function HydrateFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  );
}

export default function ConsoleRoute() {
  return <ConsoleLayout />;
}
