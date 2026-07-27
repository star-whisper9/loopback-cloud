import type { Route } from "./+types/docs";
import { resolveLocale } from "~/i18n/resolveLocale";
import type { DocLocale } from "~/lib/docs/types";
import { resolveDoc } from "~/lib/docs/resolveDoc";
import { DocsLayout } from "~/components/docs/DocsLayout";

function parseCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

export async function clientLoader({ params, request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const cookieLang = parseCookie("loopback-lang");
  const acceptLanguages =
    typeof navigator !== "undefined" ? [...navigator.languages] : [];
  const resolved = resolveLocale({ url, cookie: cookieLang, acceptLanguages });
  const locale: DocLocale = resolved === "zh" || resolved === "en" ? resolved : "en";
  const path = (params["*"] ?? "").replace(/\/+$/g, "");
  return { locale, path };
}

export default function Docs({ loaderData }: Route.ComponentProps) {
  const { locale, path } = loaderData;
  const resolved = resolveDoc(locale, path);
  return (
    <DocsLayout
      locale={locale}
      doc={resolved.doc}
      fallback={resolved.fallback}
    />
  );
}
