export type Region =
  | "localhost-1A"
  | "LoopbackZone-B"
  | "WallclockOutpost"
  | "KernelGarden-East"
  | "Sandbox7";

export type OperatingSystem =
  | "ubuntu-24.04"
  | "debian-12"
  | "rocky-9"
  | "alpine-3.20"
  | "amazon-linux-2023"
  | "windows-server-2022";

export type FirewallInitialPolicy =
  "default-ssh-http-https" | "ssh-only" | "deny-all" | "no-policy";

export type CpuMode = "fixed" | "1x" | "1.5x" | "2x" | "4x";

export type MemoryTier = "1GB" | "2GB" | "4GB" | "16GB" | "all" | "virtual8x";

export type SlaLevel =
  "best-effort" | "sla-99-9" | "sla-99-99" | "sla-99-999" | "sla-infinity";

export type BackupStrategy =
  | "disabled"
  | "hosts-mirror"
  | "hosts-double-mirror"
  | "hosts-triple-mirror"
  | "eternal-redundancy";

export type FirewallRuleAction = "allow" | "drop";
export type FirewallProtocol = "tcp" | "udp" | "icmp";

export interface FirewallRule {
  id: string;
  name: string;
  source: string;
  protocol: FirewallProtocol;
  port: number | "any";
  action: FirewallRuleAction;
  enabled: boolean;
  createdAt: number;
}

export interface SpeedTestResult {
  timestamp: number;
  pingMs: number;
  downloadMbps: number;
  uploadMbps: number;
}

export type MachineStatus = "provisioning" | "running" | "stopped";

export interface Machine {
  id: string;
  hostname: string;
  edition: "community" | "enterprise";
  region: Region;
  cpuCores: number;
  cpuMode: CpuMode;
  memoryTier: MemoryTier;
  bandwidthTier: string;
  os: OperatingSystem;
  initialPolicy: FirewallInitialPolicy;
  slaLevel: SlaLevel;
  backupStrategy: BackupStrategy;
  publicIp: "127.0.0.1";
  privateIp: "127.0.0.1";
  dockerPort: number;
  firewallRules: FirewallRule[];
  status: MachineStatus;
  createdAt: number;
  provisioningStartedAt?: number;
  speedTestHistory: SpeedTestResult[];
}

export const MAX_FIREWALL_RULES = 50;
export const MAX_SPEED_HISTORY = 5;
export const PROVISIONING_DURATION_MS = 6000;
