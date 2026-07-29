const DATETIME_RE =
  /^(\d{4})-(\d{2})-(\d{2})(?:[Tt ](\d{1,2})(?::(\d{2}))?(?::(\d{2}))?(?:\.(\d+))?)?(?:\s*([Zz]|[+-]\d{1,2}(?::?\d{2})?))?$/;

const TIMEZONE_RE = /^([+-])(\d{1,2})(?::?(\d{2}))?$/;

/**
 * Normalizes a datetime string to an ISO 8601 UTC string.
 *
 * Accepted formats:
 * - ISO 8601: `2026-07-29T13:16:13.500Z`, `2026-07-29T13:16:13+08:00`
 * - Loose: `2026-07-29 13:16:13 +8`, `2026-07-29 13:16`, `2026-07-29 13`, `2026-07-29`
 *
 * Missing time parts default to `00`; a missing timezone is treated as UTC
 * (consistent with js-yaml's YAML 1.1 timestamp semantics and reproducible
 * across build machines).
 */
export function normalizeDatetime(input: string): string {
  const trimmed = input.trim();
  const m = trimmed.match(DATETIME_RE);
  if (!m) throw new Error(`invalid datetime format: "${input}"`);

  const [, year, month, day, hourRaw, minRaw, secRaw, fracRaw, tzRaw] = m;
  const frac = fracRaw ? "." + fracRaw.slice(0, 3).padEnd(3, "0") : "";

  let tz: string;
  if (!tzRaw || tzRaw === "Z" || tzRaw === "z") {
    tz = "Z";
  } else {
    const tzm = tzRaw.match(TIMEZONE_RE);
    if (!tzm) throw new Error(`invalid timezone in datetime: "${input}"`);
    tz = `${tzm[1]}${tzm[2].padStart(2, "0")}:${tzm[3] ?? "00"}`;
  }

  const iso = `${year}-${month}-${day}T${(hourRaw ?? "00").padStart(2, "0")}:${minRaw ?? "00"}:${secRaw ?? "00"}${frac}${tz}`;
  const parsed = new Date(iso);
  if (isNaN(parsed.getTime()))
    throw new Error(`invalid datetime: "${input}" (normalized: "${iso}")`);
  return parsed.toISOString();
}
