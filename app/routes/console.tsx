import { redirect } from "react-router";
import type { Route } from "./+types/console";
import { ConsoleLayout } from "~/components/console/ConsoleLayout";
import { machineStore } from "~/lib/machineStore";

export function meta() {
  return [{ name: "robots", content: "noindex" }];
}

export async function clientLoader(_args: Route.ClientLoaderArgs) {
  const machine = machineStore.read();
  if (machine === null) throw redirect("/");
  return null;
}

export default function ConsoleRoute() {
  return <ConsoleLayout />;
}
