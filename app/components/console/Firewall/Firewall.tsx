import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pause, Play, Trash2 } from "lucide-react";
import { Button, Modal, Input, Label, Select, ListBox } from "@heroui/react";
import { useT } from "~/i18n/useT";
import { useMachine, useMachineActions } from "~/lib/useMachine";
import {
  MAX_FIREWALL_RULES,
  type FirewallRule,
  type FirewallProtocol,
  type FirewallRuleAction,
} from "~/lib/machineTypes";
import { cn } from "~/lib/utils";

const PROTOCOLS: FirewallProtocol[] = ["tcp", "udp", "icmp"];
const ACTIONS: FirewallRuleAction[] = ["allow", "drop"];

function isValidSource(s: string): boolean {
  const trimmed = s.trim();
  const match =
    /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(\/(\d{1,2}))?$/.exec(trimmed);
  if (!match) return false;
  const [_, o1, o2, o3, o4, , prefix] = match;
  if (
    Number(o1) > 255 ||
    Number(o2) > 255 ||
    Number(o3) > 255 ||
    Number(o4) > 255
  )
    return false;
  if (prefix !== undefined && Number(prefix) > 32) return false;
  return true;
}

function isValidPort(p: string): boolean {
  if (p === "any") return true;
  const n = Number(p);
  return Number.isInteger(n) && n >= 1 && n <= 65535;
}

export function Firewall() {
  const t = useT();
  const machine = useMachine();
  const { patchMachine } = useMachineActions();
  const [addOpen, setAddOpen] = useState(false);
  const [undoRule, setUndoRule] = useState<FirewallRule | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [name, setName] = useState("");
  const [source, setSource] = useState("0.0.0.0/0");
  const [protocol, setProtocol] = useState<FirewallProtocol>("tcp");
  const [port, setPort] = useState("80");
  const [action, setAction] = useState<FirewallRuleAction>("allow");
  const [addErrors, setAddErrors] = useState<Record<string, string>>({});

  const isStopped = machine?.status === "stopped";
  const rules = machine?.firewallRules ?? [];
  const atLimit = rules.length >= MAX_FIREWALL_RULES;

  if (!machine) return null;

  const isEmpty = rules.filter((r) => r.enabled).length === 0;
  const emptyWarn =
    machine.initialPolicy === "no-policy"
      ? t("console.firewall.emptyWarnNoStrategy")
      : t("console.firewall.emptyWarnAllDrop");

  function toggleRule(id: string) {
    const updated = rules.map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled } : r,
    );
    patchMachine({ firewallRules: updated });
  }

  function deleteRule(id: string) {
    const deleted = rules.find((r) => r.id === id);
    if (!deleted) return;
    patchMachine({ firewallRules: rules.filter((r) => r.id !== id) });
    setUndoRule(deleted);
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setUndoRule(null), 3000);
  }

  function undoDelete() {
    if (!undoRule) return;
    patchMachine({ firewallRules: [...rules, undoRule] });
    setUndoRule(null);
    if (undoTimer.current) clearTimeout(undoTimer.current);
  }

  function handleAdd() {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = t("console.form.required");
    if (!isValidSource(source))
      errs.source = t("console.firewall.invalidSource");
    if (!isValidPort(port)) errs.port = t("console.firewall.invalidPort");
    setAddErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const newRule: FirewallRule = {
      id: `fw-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim(),
      source: source.trim(),
      protocol,
      port: port === "any" ? "any" : Number(port),
      action,
      enabled: true,
      createdAt: Date.now(),
    };
    patchMachine({ firewallRules: [...rules, newRule] });
    setAddOpen(false);
    setName("");
    setSource("0.0.0.0/0");
    setProtocol("tcp");
    setPort("80");
    setAction("allow");
    setAddErrors({});
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-fg-muted/60">
        {t("console.firewall.honestyNote")}
      </p>

      {isStopped && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {t("console.firewall.stoppedOverlay")}
        </div>
      )}

      {isEmpty && !isStopped && (
        <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-400">
          {emptyWarn}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-widest text-accent">
          {t("console.layout.tabFirewall")}
        </h3>
        <Button
          size="sm"
          isDisabled={atLimit || isStopped}
          onPress={() => setAddOpen(true)}
        >
          <Plus className="mr-1 h-3 w-3" />
          {atLimit
            ? t("console.firewall.ruleLimitReached")
            : t("console.firewall.addRule")}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-fg-muted">
              <th className="px-4 py-3">{t("console.firewall.colName")}</th>
              <th className="px-4 py-3">{t("console.firewall.colSource")}</th>
              <th className="px-4 py-3">{t("console.firewall.colProtocol")}</th>
              <th className="px-4 py-3">{t("console.firewall.colPort")}</th>
              <th className="px-4 py-3">{t("console.firewall.colAction")}</th>
              <th className="px-4 py-3">{t("console.firewall.colStatus")}</th>
              <th className="px-4 py-3">{t("console.firewall.colOps")}</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr
                key={r.id}
                className={cn(
                  "border-b border-white/5 transition-opacity",
                  !r.enabled && "opacity-40",
                )}
              >
                <td className="px-4 py-3 font-mono text-fg">{r.name}</td>
                <td className="px-4 py-3 font-mono text-fg-muted">
                  {r.source}
                </td>
                <td className="px-4 py-3 uppercase text-fg-muted">
                  {r.protocol}
                </td>
                <td className="px-4 py-3 font-mono text-fg-muted">
                  {r.port === "any" ? t("console.firewall.portAny") : r.port}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
                      r.action === "allow"
                        ? "bg-accent/20 text-accent"
                        : "bg-red-500/20 text-red-400",
                    )}
                  >
                    {r.action === "allow"
                      ? t("console.firewall.actionAllow")
                      : t("console.firewall.actionDrop")}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs">
                  {r.enabled
                    ? t("console.firewall.statusEnabled")
                    : t("console.firewall.statusPaused")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      isDisabled={isStopped}
                      onPress={() => toggleRule(r.id)}
                    >
                      {r.enabled ? (
                        <Pause className="h-3 w-3" />
                      ) : (
                        <Play className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      isDisabled={isStopped}
                      onPress={() => deleteRule(r.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {rules.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-fg-muted">
                  —
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {undoRule && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg border border-white/10 bg-surface px-4 py-3 text-sm shadow-xl"
          >
            <span className="text-fg">
              {t("console.firewall.toastDeleted")}
            </span>
            <Button size="sm" variant="outline" onPress={undoDelete}>
              {t("console.firewall.undo")}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal>
        <Modal.Backdrop
          isOpen={addOpen}
          onOpenChange={(v) => !v && setAddOpen(false)}
        >
          <Modal.Container>
            <Modal.Dialog className="sm:max-w-md">
              <Modal.CloseTrigger className="text-white" />
              <Modal.Header>
                <Modal.Heading>
                  {t("console.firewall.addModalTitle")}
                </Modal.Heading>
              </Modal.Header>
              <Modal.Body className="space-y-4 p-6">
                <div>
                  <Label className="mb-1 block text-sm text-fg">
                    {t("console.firewall.fieldName")}
                  </Label>
                  <Input
                    variant="secondary"
                    fullWidth
                    value={name}
                    onChange={(e) =>
                      setName((e.target as HTMLInputElement).value)
                    }
                  />
                  {addErrors.name && (
                    <p className="mt-1 text-xs text-red-400">
                      {addErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="mb-1 block text-sm text-fg">
                    {t("console.firewall.fieldSource")}
                  </Label>
                  <Input
                    variant="secondary"
                    fullWidth
                    value={source}
                    onChange={(e) =>
                      setSource((e.target as HTMLInputElement).value)
                    }
                  />
                  {addErrors.source && (
                    <p className="mt-1 text-xs text-red-400">
                      {addErrors.source}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-1 block text-sm text-fg">
                      {t("console.firewall.fieldProtocol")}
                    </Label>
                    <Select
                      variant="secondary"
                      selectedKey={protocol}
                      onSelectionChange={(k) =>
                        setProtocol(k as FirewallProtocol)
                      }
                    >
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {PROTOCOLS.map((p) => (
                            <ListBox.Item
                              key={p}
                              id={p}
                              textValue={p.toUpperCase()}
                            >
                              {p.toUpperCase()}
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm text-fg">
                      {t("console.firewall.fieldPort")}
                    </Label>
                    <Input
                      variant="secondary"
                      fullWidth
                      value={port}
                      onChange={(e) =>
                        setPort((e.target as HTMLInputElement).value)
                      }
                    />
                    {addErrors.port && (
                      <p className="mt-1 text-xs text-red-400">
                        {addErrors.port}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="mb-1 block text-sm text-fg">
                    {t("console.firewall.fieldAction")}
                  </Label>
                  <Select
                    variant="secondary"
                    selectedKey={action}
                    onSelectionChange={(k) =>
                      setAction(k as FirewallRuleAction)
                    }
                  >
                    <Select.Trigger>
                      <Select.Value />
                      <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                      <ListBox>
                        {ACTIONS.map((a) => (
                          <ListBox.Item
                            key={a}
                            id={a}
                            textValue={a.toUpperCase()}
                          >
                            {a === "allow"
                              ? t("console.firewall.actionAllow")
                              : t("console.firewall.actionDrop")}
                            <ListBox.ItemIndicator />
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button slot="close" variant="outline">
                  {t("console.firewall.cancel")}
                </Button>
                <Button onPress={handleAdd}>{t("console.firewall.add")}</Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
