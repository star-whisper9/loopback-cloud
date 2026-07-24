import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button, AlertDialog } from "@heroui/react";
import {
  Play,
  Square,
  Trash2,
  ArrowLeft,
  Activity,
  Gauge,
  Shield,
} from "lucide-react";
import { useT, useLocale } from "~/i18n/useT";
import { useMachine, useMachineActions } from "~/lib/useMachine";
import { cn } from "~/lib/utils";
import { ProvisioningAnimation } from "./ProvisioningAnimation";
import { Dashboard } from "./Dashboard/Dashboard";
import { SpeedTest } from "./SpeedTest/SpeedTest";
import { Firewall } from "./Firewall/Firewall";

const TABS = [
  { id: "dashboard", icon: Activity },
  { id: "speedtest", icon: Gauge },
  { id: "firewall", icon: Shield },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function ConsoleLayout() {
  const t = useT();
  const locale = useLocale();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const machine = useMachine();
  const { updateStatus, deleteMachine } = useMachineActions();

  useEffect(() => {
    if (machine === null) navigate("/", { replace: true });
  }, [machine, navigate]);

  const tab = (searchParams.get("tab") as TabId) || "dashboard";
  const setTab = (id: TabId) => setSearchParams({ tab: id }, { replace: true });

  if (machine === null) return null;

  const isRunning = machine.status === "running";

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="border-b border-white/10 bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent shadow-[0_0_12px_var(--color-accent)]" />
            <span className="whitespace-nowrap text-sm font-semibold text-fg">
              {t("brand")}
            </span>
            <span className="whitespace-nowrap font-mono text-xs text-fg-muted">
              {machine.id}
            </span>
            <span
              className={cn(
                "whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                isRunning
                  ? "bg-accent/20 text-accent"
                  : "bg-yellow-500/20 text-yellow-400",
              )}
            >
              {isRunning
                ? t("console.layout.statusRunning")
                : machine.status === "provisioning"
                  ? t("console.layout.statusProvisioning")
                  : t("console.layout.statusStopped")}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {isRunning ? (
              <Button
                size="sm"
                variant="outline"
                onPress={() => updateStatus("stopped")}
              >
                <Square className="h-3 w-3" />
                <span className="hidden sm:inline">{t("console.layout.stop")}</span>
              </Button>
            ) : (
              machine.status === "stopped" && (
                <Button
                  size="sm"
                  variant="outline"
                  onPress={() => updateStatus("running")}
                >
                  <Play className="h-3 w-3" />
                  <span className="hidden sm:inline">{t("console.layout.start")}</span>
                </Button>
              )
            )}
            <AlertDialog>
              <Button size="sm" variant="outline">
                <Trash2 className="h-3 w-3" />
                <span className="hidden sm:inline">{t("console.layout.delete")}</span>
              </Button>
              <AlertDialog.Backdrop>
                <AlertDialog.Container>
                  <AlertDialog.Dialog className="sm:max-w-90">
                    <AlertDialog.Header>
                      <AlertDialog.Heading>
                        {t("console.layout.confirmDeleteTitle")}
                      </AlertDialog.Heading>
                    </AlertDialog.Header>
                    <AlertDialog.Body>
                      <p>{t("console.layout.confirmDeleteBody")}</p>
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                      <Button slot="close" variant="outline" size="sm">
                        {t("console.firewall.cancel")}
                      </Button>
                      <Button
                        slot="close"
                        size="sm"
                        onPress={() => {
                          deleteMachine();
                          navigate("/", { replace: true });
                        }}
                      >
                        {t("console.layout.delete")}
                      </Button>
                    </AlertDialog.Footer>
                  </AlertDialog.Dialog>
                </AlertDialog.Container>
              </AlertDialog.Backdrop>
            </AlertDialog>
            <Button size="sm" variant="outline" onPress={() => navigate("/")}>
              <ArrowLeft className="h-3 w-3" />
              <span className="hidden sm:inline">{t("console.layout.back")}</span>
            </Button>
          </div>
        </div>
        {/* Instance info bar */}
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-1 px-6 pb-3 text-xs text-fg-muted sm:flex sm:flex-wrap">
          <span>
            {t("console.layout.publicIp")}: {machine.publicIp}
          </span>
          <span>
            {t("console.layout.spec")}: {machine.cpuCores}
            {locale === "zh" ? " 核" : " cores"} / {machine.memoryTier}
          </span>
          <span>
            {t("console.layout.region")}: {machine.region}
          </span>
          <span>
            {t("console.layout.os")}: {machine.os}
          </span>
        </div>
      </header>

      {/* Tab bar */}
      {machine.status !== "provisioning" && (
        <>
          <nav className="border-b border-white/10">
            <div className="mx-auto flex max-w-6xl gap-1 px-6">
              {TABS.map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={cn(
                    "flex items-center gap-1.5 border-b-2 px-4 py-3 text-sm transition-colors",
                    tab === id
                      ? "border-accent text-accent"
                      : "border-transparent text-fg-muted hover:text-fg",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t(
                    `console.layout.tab${id.charAt(0).toUpperCase()}${id.slice(1)}` as any,
                  )}
                </button>
              ))}
            </div>
          </nav>

          {/* Tab content */}
          <main className="mx-auto max-w-6xl px-6 py-8">
            {tab === "dashboard" && <Dashboard />}
            {tab === "speedtest" && <SpeedTest />}
            {tab === "firewall" && <Firewall />}
          </main>
        </>
      )}

      {machine.status === "provisioning" && <ProvisioningAnimation />}
    </div>
  );
}
