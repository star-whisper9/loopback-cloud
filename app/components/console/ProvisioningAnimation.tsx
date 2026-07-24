import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Power } from "lucide-react";
import { useT } from "~/i18n/useT";
import { useMachine, useMachineActions } from "~/lib/useMachine";
import { PROVISIONING_DURATION_MS } from "~/lib/machineTypes";

const STEP_COUNT = 8;
const STEP_INTERVAL = PROVISIONING_DURATION_MS / STEP_COUNT;
const DONE_COUNTDOWN_MS = 3000;

export function ProvisioningAnimation() {
  const t = useT();
  const machine = useMachine();
  const { updateStatus } = useMachineActions();
  const [completedSteps, setCompletedSteps] = useState(0);
  const [phase, setPhase] = useState<"steps" | "done">("steps");
  const [countdown, setCountdown] = useState(DONE_COUNTDOWN_MS / 1000);
  const startedRef = useRef(machine?.provisioningStartedAt ?? Date.now());
  const isShutdown = machine?.provisioningTarget === "stopped";

  useEffect(() => {
    const elapsed = Date.now() - startedRef.current;
    if (elapsed >= PROVISIONING_DURATION_MS) {
      setCompletedSteps(STEP_COUNT);
      setPhase("done");
      return;
    }
    const alreadyDone = Math.floor(elapsed / STEP_INTERVAL);
    setCompletedSteps(alreadyDone);

    const timer = setInterval(() => {
      setCompletedSteps((prev) => {
        const next = prev + 1;
        if (next >= STEP_COUNT) {
          clearInterval(timer);
          setPhase("done");
          return STEP_COUNT;
        }
        return next;
      });
    }, STEP_INTERVAL);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (phase !== "done") return;
    if (countdown <= 0) {
      updateStatus(isShutdown ? "stopped" : "running");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, countdown, updateStatus, isShutdown]);

  const steps = isShutdown
    ? Array.from({ length: STEP_COUNT }, (_, i) =>
        t(`console.provisioning.shutdownSteps.${i}` as any),
      )
    : Array.from({ length: STEP_COUNT }, (_, i) =>
        t(`console.provisioning.steps.${i}` as any),
      );

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6">
      <AnimatePresence mode="wait">
        {phase === "steps" ? (
          <motion.div
            key="steps"
            initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-3"
          >
            {steps.map((label, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 text-sm transition-colors duration-300 ${
                  i < completedSteps
                    ? "text-accent"
                    : i === completedSteps
                      ? "text-fg"
                      : "text-fg-muted/40"
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px]">
                  {i < completedSteps ? <Check className="h-3 w-3" /> : ""}
                </span>
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={prefersReduced ? undefined : { opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-accent shadow-[0_0_40px_var(--color-accent)]">
              {isShutdown ? (
                <Power className="h-8 w-8 text-accent" />
              ) : (
                <Check className="h-8 w-8 text-accent" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-fg">
              {isShutdown
                ? t("console.provisioning.shutdownDone")
                : t("console.provisioning.done")}
            </h2>
            <p className="mt-2 text-sm text-fg-muted">
              {isShutdown
                ? t("console.provisioning.shutdownCountdown")
                : t("console.provisioning.countdown")}{" "}
              ({countdown}s)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
