import { useEffect } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
  useRouteLoaderData,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { resolveLocale } from "./i18n/resolveLocale";
import { type Locale } from "./i18n/types";
import zh from "./i18n/zh";
import en, { type Dict } from "./i18n/en";
import { I18nProvider } from "./i18n/I18nProvider";
import { MachineProvider } from "./lib/useMachine";
import { publicAsset } from "./lib/publicAsset";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: publicAsset("favicon.svg") },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

const DICTS: Record<Locale, Dict> = { zh, en };

function parseCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const url = new URL(request.url);
  const cookieLang = parseCookie("loopback-lang");
  const acceptLanguages =
    typeof navigator !== "undefined" ? [...navigator.languages] : [];
  const locale = resolveLocale({ url, cookie: cookieLang, acceptLanguages });
  return { locale, dict: DICTS[locale] };
}

type RootLoaderData = Awaited<ReturnType<typeof clientLoader>>;

export function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const hashAnchor = target.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (hashAnchor) {
        const href = hashAnchor.getAttribute("href");
        if (!href || href === "#") return;

        const id = decodeURIComponent(href.slice(1));
        if (id === "top") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          history.replaceState(null, "", href);
          return;
        }

        const el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, "", href);
        return;
      }

      const pathHashAnchor = target.closest<HTMLAnchorElement>(
        'a[href^="/#"]',
      );
      if (pathHashAnchor) {
        const href = pathHashAnchor.getAttribute("href");
        if (!href) return;
        const hashIndex = href.indexOf("#");
        const path = href.slice(0, hashIndex) || "/";
        const hash = href.slice(hashIndex);
        const id = decodeURIComponent(hash.slice(1));

        e.preventDefault();

        if (window.location.pathname === path) {
          if (id === "top") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }
          history.replaceState(null, "", hash);
          return;
        }

        navigate(href);

        setTimeout(() => {
          if (id === "top") {
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
          }
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 50);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [navigate]);

  return (
    <html lang="zh" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<typeof clientLoader>("root") as
    RootLoaderData | undefined;
  if (!data) {
    throw new Error(
      "TODO: root clientLoader data missing — investigate SPA loader wiring",
    );
  }
  return (
    <I18nProvider locale={data.locale} dict={data.dict}>
      <MachineProvider>
        <Outlet />
      </MachineProvider>
    </I18nProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
