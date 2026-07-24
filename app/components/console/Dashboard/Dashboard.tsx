import { useEffect, useState, useCallback } from "react";
import { RotateCw, Play } from "lucide-react";
import { Button } from "@heroui/react";
import { useT } from "~/i18n/useT";
import { useMachine, useMachineActions } from "~/lib/useMachine";
import { MiniChart } from "./MiniChart";
import { cn } from "~/lib/utils";

const WINDOW = 30;
const TICK_MS = 2000;

function fmtUptime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${d > 0 ? d + "d " : ""}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function Dashboard() {
  const t = useT();
  const machine = useMachine();
  const { updateStatus, patchMachine } = useMachineActions();
  const [cpuData, setCpuData] = useState<number[]>([]);
  const [memData, setMemData] = useState<number[]>([]);
  const [netData, setNetData] = useState<number[]>([]);
  const [now, setNow] = useState(Date.now());
  const [restarting, setRestarting] = useState(false);

  const isStopped = machine?.status === "stopped";
  const isProvisioning = machine?.status === "provisioning";

  useEffect(() => {
    if (isStopped || isProvisioning) return;
    const timer = setInterval(() => {
      setCpuData((prev) => [
        ...prev.slice(-(WINDOW - 1)),
        10 + Math.random() * 40 + (machine?.cpuMode === "4x" ? 30 : 0),
      ]);
      setMemData((prev) => {
        const base =
          machine?.memoryTier === "virtual8x"
            ? 200 + Math.random() * 600
            : machine?.memoryTier === "1GB"
              ? 20 + Math.random() * 70
              : 30 + Math.random() * 40;
        return [...prev.slice(-(WINDOW - 1)), base];
      });
      setNetData((prev) => [
        ...prev.slice(-(WINDOW - 1)),
        Math.random() * 15,
      ]);
      setNow(Date.now());
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [isStopped, isProvisioning, machine?.cpuMode, machine?.memoryTier]);

  useEffect(() => {
    if (machine?.status === "running" && restarting) setRestarting(false);
  }, [machine?.status, restarting]);

  const handleRestart = useCallback(() => {
    if (!machine) return;
    setRestarting(true);
    patchMachine({
      status: "provisioning",
      provisioningStartedAt: Date.now(),
    });
  }, [machine, patchMachine]);

  if (!machine) return null;

  if (isStopped) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="text-xl font-bold text-[var(--color-fg)]">
          {t("console.dashboard.stoppedOverlay")}
        </p>
        <Button onPress={() => updateStatus("running")}>
          <Play className="mr-2 h-4 w-4" />
          {t("console.dashboard.stoppedCta")}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <ChartCard
          title={t("console.dashboard.cpu")}
          unit={t("console.dashboard.unitCpu")}
          data={cpuData}
          color="var(--color-accent)"
          max={machine.cpuMode === "4x" ? 400 : 120}
        />
        <ChartCard
          title={t("console.dashboard.memory")}
          unit={t("console.dashboard.unitMemory")}
          data={memData}
          color="var(--color-accent-hi)"
          max={machine.memoryTier === "virtual8x" ? 800 : 100}
        />
        <ChartCard
          title={t("console.dashboard.networkIn")}
          unit={t("console.dashboard.unitNetwork")}
          data={netData}
          color="#4ade80"
          max={30}
        />
      </div>

      <div className="space-y-4 rounded-xl border border-white/10 bg-[var(--color-surface)] p-5">
        <h3 className="text-sm font-bold uppercase tracking-widest text-[var(--color-accent)]">
          {t("console.layout.instanceId")}
        </h3>
        <InfoRow label={t("console.layout.instanceId")} value={machine.id} />
        <InfoRow label={t("console.layout.publicIp")} value={machine.publicIp} />
        <InfoRow label={t("console.layout.privateIp")} value={machine.privateIp} />
        <InfoRow label={t("console.layout.dockerPort")} value={String(machine.dockerPort)} />
        <InfoRow
          label={t("console.layout.spec")}
          value={`${machine.cpuCores} cores / ${machine.memoryTier}`}
        />
        <InfoRow label={t("console.layout.os")} value={machine.os} />
        <InfoRow
          label={t("console.layout.uptime")}
          value={fmtUptime(now - machine.createdAt)}
        />
        <Button
          className="mt-2 w-full"
          variant="outline"
          isDisabled={restarting}
          onPress={handleRestart}
        >
          <RotateCw className={cn("mr-2 h-4 w-4", restarting && "animate-spin")} />
          {restarting
            ? t("console.dashboard.restarting")
            : t("console.dashboard.restart")}
        </Button>
      </div>
    </div>
  );
}

function ChartCard({
  title,
  unit,
  data,
  color,
  max,
}: {
  title: string;
  unit: string;
  data: number[];
  color: string;
  max: number;
}) {
  const latest = data.length > 0 ? data[data.length - 1] : 0;
  return (
    <div className="rounded-xl border border-white/10 bg-[var(--color-surface)] p-4">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="text-sm text-[var(--color-fg-muted)]">{title}</span>
        <span className="font-mono text-lg font-bold text-[var(--color-fg)]">
          {latest.toFixed(1)}
          <span className="ml-1 text-xs font-normal text-[var(--color-fg-muted)]">
            {unit}
          </span>
        </span>
      </div>
      <MiniChart data={data} color={color} max={max} />
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-[var(--color-fg-muted)]">{label}</span>
      <span className="font-mono text-[var(--color-fg)]">{value}</span>
    </div>
  );
}
