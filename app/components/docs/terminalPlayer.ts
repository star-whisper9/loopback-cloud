import type { DocLocale } from "~/lib/docs/types";

type TerminalState = "playing" | "paused" | "complete";

interface TerminalLineState {
  element: HTMLElement;
  kind: "command" | "output";
  commandElement: HTMLElement | null;
  text: string;
}

interface TerminalTiming {
  character: number;
  outputLine: number;
  commandPause: number;
}

const TIMINGS: Record<string, TerminalTiming> = {
  fast: { character: 12, outputLine: 18, commandPause: 140 },
  normal: { character: 28, outputLine: 45, commandPause: 280 },
  slow: { character: 52, outputLine: 85, commandPause: 500 },
};

const LABELS: Record<DocLocale, Record<string, string>> = {
  zh: {
    play: "播放",
    pause: "暂停",
    replay: "重播",
    showAll: "显示全部",
    copy: "复制命令",
    copied: "已复制",
  },
  en: {
    play: "Play",
    pause: "Pause",
    replay: "Replay",
    showAll: "Show all",
    copy: "Copy commands",
    copied: "Copied",
  },
};

function readLines(container: HTMLElement): TerminalLineState[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>("[data-terminal-line]"),
  ).map((element) => ({
    element,
    kind: element.dataset.terminalKind === "command" ? "command" : "output",
    commandElement: element.querySelector<HTMLElement>(
      "[data-terminal-command]",
    ),
    text:
      element.querySelector<HTMLElement>("[data-terminal-command]")
        ?.textContent ?? "",
  }));
}

export function initializeTerminalDemos(
  root: ParentNode,
  locale: DocLocale,
): () => void {
  const cleanups = Array.from(
    root.querySelectorAll<HTMLElement>("[data-docs-terminal]"),
  ).map((container) => initializeTerminalDemo(container, locale));

  return () => cleanups.forEach((cleanup) => cleanup());
}

function initializeTerminalDemo(
  container: HTMLElement,
  locale: DocLocale,
): () => void {
  const lines = readLines(container);
  const timing = TIMINGS[container.dataset.terminalSpeed ?? "normal"];
  if (!timing) {
    throw new Error(
      `TODO: missing terminal timing: ${container.dataset.terminalSpeed}`,
    );
  }

  const labels = LABELS[locale];
  const toggleButton = container.querySelector<HTMLButtonElement>(
    '[data-terminal-action="toggle"]',
  );
  const replayButton = container.querySelector<HTMLButtonElement>(
    '[data-terminal-action="replay"]',
  );
  const showAllButton = container.querySelector<HTMLButtonElement>(
    '[data-terminal-action="show-all"]',
  );
  const copyButton = container.querySelector<HTMLButtonElement>(
    '[data-terminal-action="copy"]',
  );

  let state: TerminalState = "complete";
  let runToken = 0;
  let paused = false;
  let disposed = false;
  let timer: number | null = null;
  let resolveTimer: (() => void) | null = null;
  let resolvePause: (() => void) | null = null;
  let copiedTimer: number | null = null;
  let started = false;

  function updateLabels(): void {
    if (toggleButton) {
      const label = state === "playing" ? labels.pause : labels.play;
      toggleButton.textContent = label;
      toggleButton.setAttribute("aria-label", label);
    }
    if (replayButton) {
      replayButton.textContent = labels.replay;
      replayButton.setAttribute("aria-label", labels.replay);
    }
    if (showAllButton) {
      showAllButton.textContent = labels.showAll;
      showAllButton.setAttribute("aria-label", labels.showAll);
    }
    if (copyButton) {
      copyButton.textContent = labels.copy;
      copyButton.setAttribute("aria-label", labels.copy);
    }
  }

  function updateState(nextState: TerminalState): void {
    state = nextState;
    container.dataset.terminalState = nextState;
    updateLabels();
  }

  function interruptPendingWait(): void {
    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
      const resolve = resolveTimer;
      resolveTimer = null;
      resolve?.();
    }
    const resolve = resolvePause;
    resolvePause = null;
    resolve?.();
  }

  async function wait(ms: number, token: number): Promise<boolean> {
    let remaining = ms;

    while (remaining > 0) {
      if (disposed || token !== runToken) return false;

      if (paused) {
        await new Promise<void>((resolve) => {
          resolvePause = resolve;
        });
        continue;
      }

      const startedAt = performance.now();
      await new Promise<void>((resolve) => {
        resolveTimer = resolve;
        timer = window.setTimeout(() => {
          timer = null;
          resolveTimer = null;
          resolve();
        }, Math.min(remaining, 40));
      });
      remaining -= performance.now() - startedAt;
    }

    return !disposed && token === runToken;
  }

  function resetLines(): void {
    for (const line of lines) {
      line.element.hidden = true;
      if (line.commandElement) line.commandElement.textContent = "";
    }
  }

  function showAll(): void {
    interruptPendingWait();
    runToken += 1;
    paused = false;
    started = true;
    for (const line of lines) {
      line.element.hidden = false;
      if (line.commandElement) line.commandElement.textContent = line.text;
    }
    updateState("complete");
  }

  async function play(): Promise<void> {
    interruptPendingWait();
    const token = ++runToken;
    paused = false;
    started = true;
    resetLines();
    updateState("playing");

    for (const line of lines) {
      if (disposed || token !== runToken) return;
      line.element.hidden = false;

      if (line.kind === "command" && line.commandElement) {
        for (let i = 1; i <= line.text.length; i += 1) {
          if (disposed || token !== runToken) return;
          line.commandElement.textContent = line.text.slice(0, i);
          if (!(await wait(timing.character, token))) return;
        }
        if (!(await wait(timing.commandPause, token))) return;
      } else if (!(await wait(timing.outputLine, token))) {
        return;
      }
    }

    if (disposed || token !== runToken) return;
    updateState("complete");

    if (container.dataset.terminalLoop === "true") {
      if (await wait(1200, token) && !disposed && token === runToken) {
        void play();
      }
    }
  }

  function toggle(): void {
    if (state === "playing") {
      paused = true;
      updateState("paused");
      return;
    }
    if (state === "paused") {
      paused = false;
      updateState("playing");
      const resolve = resolvePause;
      resolvePause = null;
      resolve?.();
      return;
    }
    void play();
  }

  function copyCommands(): void {
    if (!navigator.clipboard) {
      throw new Error("TODO: clipboard API unavailable for terminal demo");
    }

    const commands = lines
      .filter((line) => line.kind === "command")
      .map((line) => line.text)
      .join("\n");

    void navigator.clipboard.writeText(commands).then(() => {
      if (!copyButton || disposed) return;
      copyButton.textContent = labels.copied;
      if (copiedTimer !== null) window.clearTimeout(copiedTimer);
      copiedTimer = window.setTimeout(() => {
        copiedTimer = null;
        if (!disposed && copyButton) copyButton.textContent = labels.copy;
      }, 1500);
    });
  }

  updateLabels();
  container.dataset.terminalReady = "true";
  if (!navigator.clipboard && copyButton) copyButton.disabled = true;

  const onToggle = () => toggle();
  const onReplay = () => void play();
  const onShowAll = () => showAll();
  const onCopy = () => copyCommands();
  toggleButton?.addEventListener("click", onToggle);
  replayButton?.addEventListener("click", onReplay);
  showAllButton?.addEventListener("click", onShowAll);
  copyButton?.addEventListener("click", onCopy);

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const autoplay = container.dataset.terminalAutoplay ?? "visible";
  let observer: IntersectionObserver | null = null;

  if (reducedMotion) {
    showAll();
  } else if (autoplay === "load") {
    void play();
  } else if (autoplay === "visible") {
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          if (started || !entries.some((entry) => entry.isIntersecting)) return;
          observer?.disconnect();
          observer = null;
          void play();
        },
        { threshold: 0.25 },
      );
      observer.observe(container);
    } else {
      void play();
    }
  }

  return () => {
    disposed = true;
    runToken += 1;
    interruptPendingWait();
    observer?.disconnect();
    toggleButton?.removeEventListener("click", onToggle);
    replayButton?.removeEventListener("click", onReplay);
    showAllButton?.removeEventListener("click", onShowAll);
    copyButton?.removeEventListener("click", onCopy);
    if (copiedTimer !== null) window.clearTimeout(copiedTimer);
  };
}
