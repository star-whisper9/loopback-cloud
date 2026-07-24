import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { resolveLocale } from "./i18n/resolveLocale";
import { type Locale } from "./i18n/types";
import zh from "./i18n/zh";
import en, { type Dict } from "./i18n/en";
import { I18nProvider } from "./i18n/I18nProvider";

export const links: Route.LinksFunction = () => [
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

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const cookieHeader = request.headers.get("Cookie") ?? "";
  const cookieLang = cookieHeader
    .split(";")
    .map((s) => s.trim())
    .find((s) => s.startsWith("loopback-lang="))
    ?.split("=")[1];
  const acceptLanguages = (request.headers.get("Accept-Language") ?? "")
    .split(",")
    .map((s) => s.split(";")[0].trim())
    .filter(Boolean);
  const locale = resolveLocale({ url, cookie: cookieLang, acceptLanguages });
  return { locale, dict: DICTS[locale] };
}

type RootLoaderData = Awaited<ReturnType<typeof loader>>;

export function Layout({ children }: { children: React.ReactNode }) {
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
  const data = useRouteLoaderData<typeof loader>("root") as
    RootLoaderData | undefined;
  if (!data) {
    throw new Error(
      "TODO: root loader data missing — investigate SSR loader wiring",
    );
  }
  return (
    <I18nProvider locale={data.locale} dict={data.dict}>
      <Outlet />
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
