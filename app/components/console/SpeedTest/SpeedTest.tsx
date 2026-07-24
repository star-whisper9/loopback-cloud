import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useT } from "~/i18n/useT";
import { useMachine, useMachineActions } from "~/lib/useMachine";
import {
  MAX_SPEED_HISTORY,
  BANDWIDTH_CAPS,
  type SpeedTestResult,
} from "~/lib/machineTypes";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

type Phase = "idle" | "ping" | "download" | "upload" | "done";

const PHASE_DURATION: Record<string, number> = {
  ping: 1500,
  download: 2000,
  upload: 2000,
};

export function SpeedTest() {
  const t = useT();
  const machine = useMachine();
  const { patchMachine } = useMachineActions();
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<SpeedTestResult | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const isStopped = machine?.status === "stopped";
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const runTest = useCallback(() => {
    if (!machine || isStopped) return;
    const caps = BANDWIDTH_CAPS[machine.bandwidthTier];

    const pingMs = Math.max(0.001, 0.001 + Math.random() * 0.004);

    const jitter = 0.82 + Math.random() * 0.17;
    const downloadMbps = Math.round(caps.maxDownloadMbps * jitter);
    const uploadMbps = Math.round(caps.maxUploadMbps * jitter);

    const phases: Phase[] = ["ping", "download", "upload"];
    let idx = 0;

    const runPhase = () => {
      if (idx >= phases.length) {
        const r: SpeedTestResult = {
          timestamp: Date.now(),
          pingMs: Math.round(pingMs * 100) / 100,
          downloadMbps: Math.round(downloadMbps),
          uploadMbps: Math.round(uploadMbps),
        };
        setResult(r);
        setPhase("done");
        const history = [...(machine.speedTestHistory ?? []), r].slice(
          -MAX_SPEED_HISTORY,
        );
        patchMachine({ speedTestHistory: history });
        return;
      }
      const p = phases[idx];
      setPhase(p);
      setProgress(0);
      const dur = PHASE_DURATION[p];
      const start = Date.now();
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - start;
        setProgress(Math.min(elapsed / dur, 1));
        if (elapsed >= dur) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          idx++;
          runPhase();
        }
      }, 30);
    };
    runPhase();
  }, [machine, isStopped, patchMachine]);

  if (!machine) return null;

  if (isStopped) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-fg">
          {t("console.speedTest.stoppedOverlay")}
        </p>
      </div>
    );
  }

  const phaseLabel =
    phase === "ping"
      ? t("console.speedTest.ping")
      : phase === "download"
        ? t("console.speedTest.download")
        : phase === "upload"
          ? t("console.speedTest.upload")
          : "";

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Big button / progress */}
      <div className="relative flex h-48 w-48 items-center justify-center">
        <svg
          className="absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="4"
          />
          {(phase === "ping" || phase === "download" || phase === "upload") && (
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${progress * 283} 283`}
            />
          )}
        </svg>
        {phase === "idle" || phase === "done" ? (
          <HoverBorderGradient
            containerClassName="h-40 w-40 sm:h-48 sm:w-48 rounded-full border-transparent bg-transparent hover:bg-transparent"
            className="flex h-full w-full items-center justify-center rounded-full bg-surface text-lg font-bold text-white"
            as="button"
            onClick={runTest}
            duration={0.8}
          >
            {t("console.speedTest.start")}
          </HoverBorderGradient>
        ) : (
          <div className="text-center">
            <p className="text-xs uppercase tracking-widest text-fg-muted">
              {phaseLabel}
            </p>
            <p className="mt-1 font-mono text-2xl font-bold text-accent">
              {Math.round(progress * 100)}%
            </p>
          </div>
        )}
      </div>

      {/* Results */}
      <AnimatePresence>
        {phase === "done" && result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md space-y-4"
          >
            <div className="grid grid-cols-3 gap-4 text-center">
              <ResultCard
                label={t("console.speedTest.ping")}
                value={`${result.pingMs}`}
                unit={t("console.speedTest.unitMs")}
              />
              <ResultCard
                label={t("console.speedTest.download")}
                value={
                  result.downloadMbps >= 1000
                    ? (result.downloadMbps / 1000).toFixed(1)
                    : String(result.downloadMbps)
                }
                unit={
                  result.downloadMbps >= 1000
                    ? t("console.speedTest.unitGbps")
                    : t("console.speedTest.unitMbps")
                }
              />
              <ResultCard
                label={t("console.speedTest.upload")}
                value={
                  result.uploadMbps >= 1000
                    ? (result.uploadMbps / 1000).toFixed(1)
                    : String(result.uploadMbps)
                }
                unit={
                  result.uploadMbps >= 1000
                    ? t("console.speedTest.unitGbps")
                    : t("console.speedTest.unitMbps")
                }
              />
            </div>
            <p className="text-center text-sm text-accent">
              {t("console.speedTest.beat")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History */}
      <div className="w-full max-w-md">
        <button
          className="text-xs text-fg-muted underline hover:text-fg"
          onClick={() => setShowHistory((v) => !v)}
        >
          {t("console.speedTest.history")}
        </button>
        {showHistory &&
          ((machine.speedTestHistory?.length ?? 0) > 0 ? (
            <ul className="mt-2 space-y-1 text-xs text-fg-muted">
              {[...(machine.speedTestHistory ?? [])].reverse().map((r) => (
                <li
                  key={r.timestamp}
                  className="flex justify-between font-mono"
                >
                  <span>{new Date(r.timestamp).toLocaleTimeString()}</span>
                  <span>
                    {r.pingMs}
                    {t("console.speedTest.unitMs")} /{" "}
                    {r.downloadMbps >= 1000
                      ? (r.downloadMbps / 1000).toFixed(1) +
                        t("console.speedTest.unitGbps")
                      : r.downloadMbps + t("console.speedTest.unitMbps")}{" "}
                    /{" "}
                    {r.uploadMbps >= 1000
                      ? (r.uploadMbps / 1000).toFixed(1) +
                        t("console.speedTest.unitGbps")
                      : r.uploadMbps + t("console.speedTest.unitMbps")}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-xs text-fg-muted">
              {t("console.speedTest.noHistory")}
            </p>
          ))}
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-surface p-4">
      <p className="text-xs text-fg-muted">{label}</p>
      <p className="mt-1 font-mono text-xl font-bold text-fg">
        {value}
        <span className="ml-1 text-xs font-normal">{unit}</span>
      </p>
    </div>
  );
}
