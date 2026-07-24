import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Button,
  Modal,
  Input,
  Label,
  Select,
  ListBox,
  RadioGroup,
  Radio,
  Checkbox,
} from "@heroui/react";
import { useT } from "~/i18n/useT";
import { useMachineActions } from "~/lib/useMachine";
import { convertInitialPolicyToRules } from "~/lib/machineStore";
import type {
  Machine,
  Region,
  OperatingSystem,
  FirewallInitialPolicy,
  CpuMode,
  MemoryTier,
  SlaLevel,
  BackupStrategy,
  BandwidthTier,
} from "~/lib/machineTypes";

interface ProvisioningFormProps {
  mode: "community" | "enterprise";
  open: boolean;
  onClose: () => void;
}

const REGIONS: Region[] = [
  "localhost-1A",
  "LoopbackZone-B",
  "WallclockOutpost",
  "KernelGarden-East",
  "Sandbox7",
];

const OS_LIST: OperatingSystem[] = [
  "ubuntu-24.04",
  "debian-12",
  "rocky-9",
  "alpine-3.20",
  "windows-server-2022",
];

const OS_LABELS: Record<OperatingSystem, string> = {
  "ubuntu-24.04": "Ubuntu 24.04 LTS",
  "debian-12": "Debian 12",
  "rocky-9": "Rocky Linux 9",
  "alpine-3.20": "Alpine 3.20",
  "windows-server-2022": "Windows Server 2022",
};

const OS_ICONS: Record<OperatingSystem, string> = {
  "ubuntu-24.04": "/ubuntu.svg",
  "debian-12": "/debian.svg",
  "rocky-9": "/rockylinux.svg",
  "alpine-3.20": "/alpine.svg",
  "windows-server-2022": "/windows.svg",
};

const POLICIES: FirewallInitialPolicy[] = [
  "default-ssh-http-https",
  "ssh-only",
  "deny-all",
  "no-policy",
];

const POLICY_LABEL_KEYS: Record<FirewallInitialPolicy, string> = {
  "default-ssh-http-https": "console.form.policyDefaultSshHttpHttps",
  "ssh-only": "console.form.policySshOnly",
  "deny-all": "console.form.policyDenyAll",
  "no-policy": "console.form.policyNoPolicy",
};

const COMMUNITY_MEMORY: MemoryTier[] = ["1GB", "2GB", "4GB", "all"];
const ENTERPRISE_MEMORY: MemoryTier[] = [
  "1GB",
  "4GB",
  "16GB",
  "all",
  "virtual8x",
];

const COMMUNITY_BANDWIDTH = [
  { id: "shared-100m", labelKey: "console.form.bandwidthShared100m" },
  { id: "shared-1g", labelKey: "console.form.bandwidthShared1g" },
];

const ENTERPRISE_BANDWIDTH = [
  { id: "dedicated-1g", labelKey: "console.form.bandwidthDedicated1g" },
  { id: "quantum-10g", labelKey: "console.form.bandwidthQuantum10g" },
  { id: "beyond-100g", labelKey: "console.form.bandwidthBeyond100g" },
];

const ENTERPRISE_CPU: CpuMode[] = ["1x", "1.5x", "2x", "4x"];

const ENTERPRISE_SLA: SlaLevel[] = [
  "sla-99-9",
  "sla-99-99",
  "sla-99-999",
  "sla-infinity",
];

const ENTERPRISE_BACKUP: BackupStrategy[] = [
  "hosts-mirror",
  "hosts-double-mirror",
  "hosts-triple-mirror",
  "eternal-redundancy",
];

const SLA_LABEL_KEYS: Record<SlaLevel, string> = {
  "sla-99-9": "console.form.sla99_9",
  "sla-99-99": "console.form.sla99_99",
  "sla-99-999": "console.form.sla99_999",
  "sla-infinity": "console.form.slaInfinity",
  "best-effort": "console.form.sla99_9",
};

const BACKUP_LABEL_KEYS: Record<BackupStrategy, string> = {
  "hosts-mirror": "console.form.backupHostsMirror",
  "hosts-double-mirror": "console.form.backupHostsDoubleMirror",
  "hosts-triple-mirror": "console.form.backupHostsTripleMirror",
  "eternal-redundancy": "console.form.backupEternalRedundancy",
  disabled: "console.form.backupHostsMirror",
};

export function ProvisioningForm({
  mode,
  open,
  onClose,
}: ProvisioningFormProps) {
  const t = useT();
  const navigate = useNavigate();
  const { createMachine } = useMachineActions();
  const isEnterprise = mode === "enterprise";
  const cores =
    typeof navigator !== "undefined" ? (navigator.hardwareConcurrency ?? 8) : 8;

  const [hostname, setHostname] = useState("");
  const [region, setRegion] = useState<Region>("localhost-1A");
  const [cpuMode, setCpuMode] = useState<CpuMode>("1x");
  const [memory, setMemory] = useState<MemoryTier>("4GB");
  const [bandwidth, setBandwidth] = useState<BandwidthTier>(
    isEnterprise ? "dedicated-1g" : "shared-100m",
  );
  const [os, setOs] = useState<OperatingSystem>("ubuntu-24.04");
  const [policy, setPolicy] = useState<FirewallInitialPolicy>(
    isEnterprise ? "deny-all" : "default-ssh-http-https",
  );
  const [sla, setSla] = useState<SlaLevel>("sla-99-99");
  const [backup, setBackup] = useState<BackupStrategy>("hosts-mirror");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cpuCores = isEnterprise
    ? Math.round(
        cores *
          (cpuMode === "1.5x"
            ? 1.5
            : cpuMode === "2x"
              ? 2
              : cpuMode === "4x"
                ? 4
                : 1),
      )
    : cores;

  function validate(): boolean {
    const errs: Record<string, string> = {};
    const maxLen = isEnterprise ? 32 : 20;
    if (!hostname.trim() || hostname.length > maxLen) {
      errs.hostname = t("console.form.required");
    }
    if (!termsAccepted) {
      errs.terms = t("console.form.termsError");
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const machine: Machine = {
      id: `lb-${crypto.randomUUID().slice(0, 8)}`,
      hostname: hostname.trim(),
      edition: mode,
      region,
      cpuCores,
      cpuMode: isEnterprise ? cpuMode : "fixed",
      memoryTier: memory,
      bandwidthTier: bandwidth,
      os,
      initialPolicy: policy,
      slaLevel: isEnterprise ? sla : "best-effort",
      backupStrategy: isEnterprise ? backup : "disabled",
      publicIp: "127.0.0.1",
      privateIp: "127.0.0.1",
      dockerPort: 30000 + Math.floor(Math.random() * 35535),
      firewallRules: convertInitialPolicyToRules(policy),
      status: "provisioning",
      createdAt: Date.now(),
      provisioningStartedAt: Date.now(),
      speedTestHistory: [],
    };
    try {
      createMachine(machine);
    } catch {
      setErrors({ submit: t("console.toast.storageError") });
      return;
    }
    onClose();
    navigate("/console");
  }

  return (
    <Modal>
      <Modal.Backdrop isOpen={open} onOpenChange={(v) => !v && onClose()}>
        <Modal.Container scroll="inside">
          <Modal.Dialog className="sm:max-w-3xl">
            <Modal.CloseTrigger className="text-white" />
            <Modal.Header>
              <Modal.Heading>
                {isEnterprise
                  ? t("console.form.titleEnterprise")
                  : t("console.form.titleCommunity")}
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="space-y-6 p-6">
              {/* Group A */}
              <fieldset>
                <legend className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">
                  {t("console.form.groupA")}
                </legend>
                <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
                  <div>
                    <Label className="mb-1 block text-sm text-fg">
                      {t("console.form.f1.label")}
                    </Label>
                    <Input
                      variant="secondary"
                      fullWidth
                      value={hostname}
                      onChange={(e) =>
                        setHostname((e.target as HTMLInputElement).value)
                      }
                      placeholder={t("console.form.f1.placeholder")}
                      maxLength={isEnterprise ? 32 : 20}
                    />
                    {errors.hostname && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.hostname}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-fg-muted">
                      {t("console.form.f1.desc")}
                    </p>
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm text-fg">
                      {t("console.form.f2.label")}
                    </Label>
                    <Select
                      variant="secondary"
                      selectedKey={region}
                      onSelectionChange={(k) => setRegion(k as Region)}
                    >
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {REGIONS.map((r) => (
                            <ListBox.Item key={r} id={r} textValue={r}>
                              {r}
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                    <p className="mt-1 text-xs text-fg-muted">
                      {t("console.form.f2.desc")}
                    </p>
                  </div>
                </div>
              </fieldset>

              {/* Group B */}
              <fieldset>
                <legend className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">
                  {t("console.form.groupB")}
                </legend>
                <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
                  <div>
                    <Label className="mb-1 block text-sm text-fg">
                      {t("console.form.f3.label")}
                    </Label>
                    {isEnterprise ? (
                      <Select
                        variant="secondary"
                        selectedKey={cpuMode}
                        onSelectionChange={(k) => setCpuMode(k as CpuMode)}
                      >
                        <Select.Trigger>
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            {ENTERPRISE_CPU.map((c) => (
                              <ListBox.Item key={c} id={c} textValue={c}>
                                {t(
                                  `console.form.cpu${c.replace(".", "")}` as any,
                                  {
                                    cores: String(cores),
                                  },
                                )}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    ) : (
                      <p className="text-sm text-fg">
                        {t("console.form.cpuFixed", { cores: String(cores) })}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-fg-muted">
                      {t("console.form.f3.desc")}
                    </p>
                  </div>
                  <div>
                    <Label className="mb-1 block text-sm text-fg">
                      {t("console.form.f4.label")}
                    </Label>
                    <Select
                      variant="secondary"
                      selectedKey={memory}
                      onSelectionChange={(k) => setMemory(k as MemoryTier)}
                    >
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {(isEnterprise
                            ? ENTERPRISE_MEMORY
                            : COMMUNITY_MEMORY
                          ).map((m) => (
                            <ListBox.Item key={m} id={m} textValue={m}>
                              {m === "all"
                                ? t("console.form.memoryAll")
                                : m === "virtual8x"
                                  ? t("console.form.memoryVirtual8x")
                                  : m}
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="mb-1 block text-sm text-fg">
                      {t("console.form.f5.label")}
                    </Label>
                    <Select
                      variant="secondary"
                      selectedKey={bandwidth}
                      onSelectionChange={(k) => setBandwidth(k as BandwidthTier)}
                    >
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {(isEnterprise
                            ? ENTERPRISE_BANDWIDTH
                            : COMMUNITY_BANDWIDTH
                          ).map((b) => (
                            <ListBox.Item
                              key={b.id}
                              id={b.id}
                              textValue={t(b.labelKey as any)}
                            >
                              {t(b.labelKey as any)}
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                </div>
              </fieldset>

              {/* Group C */}
              <fieldset>
                <legend className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">
                  {t("console.form.groupC")}
                </legend>
                <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Label className="mb-1 block text-sm text-fg">
                      {t("console.form.f6.label")}
                    </Label>
                    <Select
                      variant="secondary"
                      selectedKey={os}
                      onSelectionChange={(k) => setOs(k as OperatingSystem)}
                    >
                      <Select.Trigger>
                        <Select.Value />
                        <Select.Indicator />
                      </Select.Trigger>
                      <Select.Popover>
                        <ListBox>
                          {OS_LIST.map((o) => (
                            <ListBox.Item
                              key={o}
                              id={o}
                              textValue={OS_LABELS[o]}
                            >
                              <div className="flex items-center">
                                <img
                                  src={OS_ICONS[o]}
                                  alt=""
                                  className="mr-2 h-4 w-4 shrink-0"
                                />
                                {OS_LABELS[o]}
                              </div>
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          ))}
                        </ListBox>
                      </Select.Popover>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="mb-1 block text-sm text-fg">
                      {t("console.form.f7.label")}
                    </Label>
                    <RadioGroup
                      value={policy}
                      onChange={(v) => setPolicy(v as FirewallInitialPolicy)}
                      className="grid gap-2 sm:grid-cols-2 rounded-lg border border-white/10 bg-white/[0.02] p-4"
                    >
                      {POLICIES.map((p) => (
                        <Radio key={p} value={p} className={"mt-0"}>
                          <Radio.Content>
                            <Radio.Control>
                              <Radio.Indicator />
                            </Radio.Control>
                            {t(POLICY_LABEL_KEYS[p] as any)}
                          </Radio.Content>
                        </Radio>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </fieldset>

              {/* Group D — enterprise only */}
              {isEnterprise && (
                <fieldset>
                  <legend className="mb-3 text-xs font-bold uppercase tracking-widest text-accent">
                    {t("console.form.groupD")}
                  </legend>
                  <div className="grid gap-x-6 gap-y-4 md:grid-cols-2">
                    <div>
                      <Label className="mb-1 block text-sm text-fg">
                        {t("console.form.f8.label")}
                      </Label>
                      <Select
                        variant="secondary"
                        className="!bg-white/[0.04] !border-white/10"
                        selectedKey={sla}
                        onSelectionChange={(k) => setSla(k as SlaLevel)}
                      >
                        <Select.Trigger>
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            {ENTERPRISE_SLA.map((s) => (
                              <ListBox.Item key={s} id={s} textValue={s}>
                                {t(SLA_LABEL_KEYS[s] as any)}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>
                    <div>
                      <Label className="mb-1 block text-sm text-fg">
                        {t("console.form.f9.label")}
                      </Label>
                      <Select
                        variant="secondary"
                        className="!bg-white/[0.04] !border-white/10"
                        selectedKey={backup}
                        onSelectionChange={(k) =>
                          setBackup(k as BackupStrategy)
                        }
                      >
                        <Select.Trigger>
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            {ENTERPRISE_BACKUP.map((b) => (
                              <ListBox.Item key={b} id={b} textValue={b}>
                                {t(BACKUP_LABEL_KEYS[b] as any)}
                                <ListBox.ItemIndicator />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>
                  </div>
                </fieldset>
              )}

              {/* Form-end divider + Terms */}
              <div className="grow border-t border-white/10" />
              <div>
                <Checkbox
                  isSelected={termsAccepted}
                  onChange={setTermsAccepted}
                  name="terms"
                  className="items-start"
                >
                  <Checkbox.Content>
                    <Checkbox.Control>
                      <Checkbox.Indicator />
                    </Checkbox.Control>
                    {t("console.form.f10.label")}
                  </Checkbox.Content>
                </Checkbox>
                {errors.terms && (
                  <p className="mt-1 text-xs text-red-400">{errors.terms}</p>
                )}
              </div>

              {errors.submit && (
                <p className="text-sm text-red-400">{errors.submit}</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" variant="outline">
                {t("console.form.cancel")}
              </Button>
              <Button onPress={handleSubmit}>{t("console.form.submit")}</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
