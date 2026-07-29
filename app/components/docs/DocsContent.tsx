import type { ReactNode } from "react";
import { CalendarDays, History, Mail, Users } from "lucide-react";
import type { DocAuthor, DocEntry } from "~/lib/docs/types";
import { useLocale, useT } from "~/i18n/useT";
import type { Locale } from "~/i18n/types";
import { TranslatorBanner } from "./TranslatorBanner";

const AUTHOR_NAME_MAX = 24;

function truncateName(name: string): string {
  if (name.length <= AUTHOR_NAME_MAX) return name;
  return name.slice(0, AUTHOR_NAME_MAX) + "...";
}

function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

function MetaField({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="docs-meta__field">
      <dt className="docs-meta__label">
        <span className="docs-meta__label-icon" aria-hidden="true">
          {icon}
        </span>
        {label}
      </dt>
      <dd className="docs-meta__value">{children}</dd>
    </div>
  );
}

function DocAuthors({ authors }: { authors: DocAuthor[] }) {
  return (
    <span className="docs-meta__authors">
      {authors.map((a, i) => (
        <span key={i} className="docs-meta__author">
          <span className="docs-meta__avatar" aria-hidden="true">
            {a.name.trim().charAt(0)}
          </span>
          {a.url ? (
            <a
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="docs-meta__link"
            >
              {truncateName(a.name)}
            </a>
          ) : (
            <span className="docs-meta__name">{truncateName(a.name)}</span>
          )}
          {a.email ? (
            <a
              href={`mailto:${a.email}`}
              className="docs-meta__mail"
              aria-label={a.email}
            >
              <Mail size={13} />
            </a>
          ) : null}
        </span>
      ))}
    </span>
  );
}

export function DocsContent({ doc }: { doc: DocEntry }) {
  const t = useT();
  const locale = useLocale();
  const { description, author, created, updated } = doc.meta;
  const hasMeta = Boolean(author?.length || created || updated);

  return (
    <article className="docs-prose">
      <h1>{doc.meta.title}</h1>
      {description ? <p className="docs-lede">{description}</p> : null}

      {hasMeta ? (
        <dl className="docs-meta">
          {author && author.length > 0 ? (
            <MetaField icon={<Users size={12} />} label={t("docs.metaAuthor")}>
              <DocAuthors authors={author} />
            </MetaField>
          ) : null}
          {created ? (
            <MetaField
              icon={<CalendarDays size={12} />}
              label={t("docs.metaCreated")}
            >
              <time className="docs-meta__time" dateTime={created}>
                {formatDate(created, locale)}
              </time>
            </MetaField>
          ) : null}
          {updated ? (
            <MetaField
              icon={<History size={12} />}
              label={t("docs.metaUpdated")}
            >
              <time className="docs-meta__time" dateTime={updated}>
                {formatDate(updated, locale)}
              </time>
            </MetaField>
          ) : null}
        </dl>
      ) : null}

      {doc.meta.translator ? (
        <TranslatorBanner translator={doc.meta.translator} />
      ) : null}
      <div dangerouslySetInnerHTML={{ __html: doc.html }} />
    </article>
  );
}
