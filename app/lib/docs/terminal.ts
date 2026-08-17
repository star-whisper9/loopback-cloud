export type TerminalAutoplay = "visible" | "load" | "manual";
export type TerminalSpeed = "fast" | "normal" | "slow";

export interface TerminalConfig {
  title: string;
  autoplay: TerminalAutoplay;
  speed: TerminalSpeed;
  loop: boolean;
}

export type TerminalLine =
  | { kind: "command"; prompt: string; text: string }
  | { kind: "output"; text: string };

const DEFAULT_AUTOPLAY: TerminalAutoplay = "visible";
const DEFAULT_SPEED: TerminalSpeed = "normal";

function parseMeta(meta: string | null | undefined): Record<string, string> {
  const attrs: Record<string, string> = {};
  const input = meta ?? "";
  const pattern = /([\w-]+)(?:=(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(input)) !== null) {
    attrs[match[1]] = match[2] ?? match[3] ?? match[4] ?? "true";
  }

  return attrs;
}

export function parseTerminalConfig(
  meta: string | null | undefined,
  defaultTitle: string,
): TerminalConfig {
  const attrs = parseMeta(meta);
  const autoplay = attrs.autoplay === "none" ? "manual" : attrs.autoplay;
  const speed = attrs.speed;

  if (
    autoplay !== undefined &&
    autoplay !== "visible" &&
    autoplay !== "load" &&
    autoplay !== "manual"
  ) {
    throw new Error(`TODO: unsupported terminal autoplay mode: ${autoplay}`);
  }

  if (
    speed !== undefined &&
    speed !== "fast" &&
    speed !== "normal" &&
    speed !== "slow"
  ) {
    throw new Error(`TODO: unsupported terminal speed: ${speed}`);
  }

  if (attrs.loop !== undefined && attrs.loop !== "true" && attrs.loop !== "false") {
    throw new Error(`TODO: terminal loop must be true or false: ${attrs.loop}`);
  }

  return {
    title: attrs.title || defaultTitle,
    autoplay: (autoplay as TerminalAutoplay | undefined) ?? DEFAULT_AUTOPLAY,
    speed: (speed as TerminalSpeed | undefined) ?? DEFAULT_SPEED,
    loop: attrs.loop === "true",
  };
}

export function parseTerminalTranscript(value: string): TerminalLine[] {
  const normalized = value.replace(/\r\n?/g, "\n");
  const rawLines = normalized.split("\n");
  if (rawLines.at(-1) === "") rawLines.pop();

  const lines = rawLines.map((line): TerminalLine => {
    const match = line.match(
      /^\s*((?:[$#%>]|(?:[\w.-]+@)?[\w.-]+(?::[^\s]*)?[$#%>]))\s+(.*)$/,
    );
    if (match) {
      return { kind: "command", prompt: match[1].trim(), text: match[2] };
    }
    return { kind: "output", text: line };
  });

  if (lines.length === 0) {
    throw new Error("TODO: terminal demo must contain at least one line");
  }

  return lines;
}
