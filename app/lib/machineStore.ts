import type {
  Machine,
  FirewallInitialPolicy,
  FirewallRule,
} from "./machineTypes";

const STORAGE_KEY = "loopback-cloud:state-v1";
const SCHEMA_VERSION = 1;

interface Snapshot {
  schemaVersion: number;
  machine: Machine | null;
}

function isMachineValid(m: unknown): m is Machine {
  if (m === null || typeof m !== "object") return false;
  const obj = m as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.hostname === "string" &&
    typeof obj.status === "string" &&
    Array.isArray(obj.firewallRules)
  );
}

function clearAll(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage disabled — nothing to clear
  }
}

function parse(raw: string | null): Snapshot | null {
  if (raw === null) return null;
  let snapshot: unknown;
  try {
    snapshot = JSON.parse(raw);
  } catch {
    console.warn("[Loopback Cloud] corrupted state JSON, resetting");
    clearAll();
    return null;
  }
  if (snapshot === null || typeof snapshot !== "object") {
    console.warn("[Loopback Cloud] invalid snapshot shape, resetting");
    clearAll();
    return null;
  }
  const snap = snapshot as Record<string, unknown>;
  if (snap.schemaVersion !== SCHEMA_VERSION) {
    console.warn(
      `[Loopback Cloud] schema version mismatch (got ${snap.schemaVersion}), resetting`,
    );
    clearAll();
    return null;
  }
  if (snap.machine === null)
    return { schemaVersion: SCHEMA_VERSION, machine: null };
  if (!isMachineValid(snap.machine)) {
    console.warn("[Loopback Cloud] machine schema invalid, resetting");
    clearAll();
    return null;
  }
  return snapshot as Snapshot;
}

export const machineStore = {
  peek(): Machine | null {
    if (typeof localStorage === "undefined") return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return parse(raw)?.machine ?? null;
    } catch {
      return null;
    }
  },

  read(): Machine | null {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    return parse(raw)?.machine ?? null;
  },

  write(machine: Machine): void {
    const snapshot: Snapshot = { schemaVersion: SCHEMA_VERSION, machine };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  },

  update(patch: Partial<Machine>): void {
    const current = machineStore.read();
    if (current === null) {
      throw new Error(
        "TODO: machineStore.update called with null machine — caller should guard against this",
      );
    }
    const merged: Machine = { ...current, ...patch };
    machineStore.write(merged);
  },

  clearAll,
};

let ruleIdCounter = 0;
function makeRuleId(): string {
  return `fw-${Date.now().toString(36)}-${(ruleIdCounter++).toString(36)}`;
}

export function convertInitialPolicyToRules(
  policy: FirewallInitialPolicy,
): FirewallRule[] {
  const now = Date.now();
  const base = {
    enabled: true,
    createdAt: now,
    source: "0.0.0.0/0",
    protocol: "tcp" as const,
    action: "allow" as const,
  };
  switch (policy) {
    case "default-ssh-http-https":
      return [
        {
          ...base,
          id: makeRuleId(),
          name: "SSH",
          port: 22,
          source: "127.0.0.1/32",
        },
        { ...base, id: makeRuleId(), name: "HTTP", port: 80 },
        { ...base, id: makeRuleId(), name: "HTTPS", port: 443 },
      ];
    case "ssh-only":
      return [
        {
          ...base,
          id: makeRuleId(),
          name: "SSH",
          port: 22,
          source: "127.0.0.1/32",
        },
      ];
    case "deny-all":
      return [];
    case "no-policy":
      return [];
    default: {
      const _exhaustive: never = policy;
      throw new Error(`TODO: unknown firewall policy: ${_exhaustive}`);
    }
  }
}
