import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Button, AlertDialog } from "@heroui/react";
import { Play, Square, Trash2, ArrowLeft, Activity, Gauge, Shield } from "lucide-react";
import { useT, useLocale } from "~/i18n/useT";
import { useMachine, useMachineActions } from "~/lib/useMachine";
import { cn } from "~/lib/utils";

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
  const setTab = (id: TabId) =>
    setSearchParams({ tab: id }, { replace: true });

  if (machine === null) return null;

  const isRunning = machine.status === "running";

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <header className="border-b border-white/10 bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)] shadow-[0_0_12px_var(--color-accent)]" />
            <span className="text-sm font-semibold text-[var(--color-fg)]">
              {t("brand")}
            </span>
            <span className="font-mono text-xs text-[var(--color-fg-muted)]">
              {machine.id}
            </span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                isRunning
                  ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
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
          <div className="flex items-center gap-2">
            {isRunning ? (
              <Button
                size="sm"
                variant="outline"
                onPress={() => updateStatus("stopped")}
              >
                <Square className="mr-1 h-3 w-3" />
                {t("console.layout.stop")}
              </Button>
            ) : (
              machine.status === "stopped" && (
                <Button
                  size="sm"
                  variant="outline"
                  onPress={() => updateStatus("running")}
                >
                  <Play className="mr-1 h-3 w-3" />
                  {t("console.layout.start")}
                </Button>
              )
            )}
            <AlertDialog>
              <Button size="sm" variant="outline">
                <Trash2 className="mr-1 h-3 w-3" />
                {t("console.layout.delete")}
              </Button>
              <AlertDialog.Backdrop>
                <AlertDialog.Container>
                  <AlertDialog.Dialog className="sm:max-w-[360px]">
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
              <ArrowLeft className="mr-1 h-3 w-3" />
              {t("console.layout.back")}
            </Button>
          </div>
        </div>
        {/* Instance info bar */}
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-1 px-6 pb-3 text-xs text-[var(--color-fg-muted)]">
          <span>
            {t("console.layout.publicIp")}: {machine.publicIp}
          </span>
          <span>
            {t("console.layout.spec")}: {machine.cpuCores}
            {locale === "zh" ? " 核" : " cores"} /{" "}
            {machine.memoryTier}
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
                  ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                  : "border-transparent text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
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
        {tab === "dashboard" && <div className="min-h-[50vh]" />}
        {tab === "speedtest" && <div className="min-h-[50vh]" />}
        {tab === "firewall" && <div className="min-h-[50vh]" />}
      </main>
    </div>
  );
}
