import { describe, it, expect, beforeEach, vi, beforeAll } from "vitest";
import { machineStore, convertInitialPolicyToRules } from "./machineStore";
import type { Machine, FirewallInitialPolicy } from "./machineTypes";

beforeAll(() => {
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
      clear: () => store.clear(),
      get length() {
        return store.size;
      },
      key: (index: number) => [...store.keys()][index] ?? null,
    },
    writable: true,
    configurable: true,
  });
});

function makeTestMachine(overrides: Partial<Machine> = {}): Machine {
  return {
    id: "lb-test0001",
    hostname: "test-host",
    edition: "community",
    region: "localhost-1A",
    cpuCores: 8,
    cpuMode: "fixed",
    memoryTier: "4GB",
    bandwidthTier: "shared-100m",
    os: "ubuntu-24.04",
    initialPolicy: "default-ssh-http-https",
    slaLevel: "best-effort",
    backupStrategy: "disabled",
    publicIp: "127.0.0.1",
    privateIp: "127.0.0.1",
    dockerPort: 40000,
    firewallRules: [],
    status: "running",
    createdAt: 1700000000000,
    speedTestHistory: [],
    ...overrides,
  };
}

const STORAGE_KEY = "loopback-cloud:state-v1";

function seedStorage(machine: Machine | null): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ schemaVersion: 1, machine }),
  );
}

describe("machineStore.read", () => {
  beforeEach(() => localStorage.clear());

  it("returns null when localStorage is empty", () => {
    expect(machineStore.read()).toBeNull();
  });

  it("returns machine for valid snapshot", () => {
    const m = makeTestMachine();
    seedStorage(m);
    const result = machineStore.read();
    expect(result).not.toBeNull();
    expect(result!.id).toBe("lb-test0001");
    expect(result!.hostname).toBe("test-host");
  });

  it("resets and returns null on invalid JSON", () => {
    localStorage.setItem(STORAGE_KEY, "not-json{{{");
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(machineStore.read()).toBeNull();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("resets and returns null on schema version mismatch", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ schemaVersion: 99, machine: null }),
    );
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(machineStore.read()).toBeNull();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("resets and returns null when machine fields are missing", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ schemaVersion: 1, machine: { id: "x" } }),
    );
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(machineStore.read()).toBeNull();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});

describe("machineStore.write / read roundtrip", () => {
  beforeEach(() => localStorage.clear());

  it("writes and reads back the same machine", () => {
    const m = makeTestMachine();
    machineStore.write(m);
    const result = machineStore.read();
    expect(result).toEqual(m);
  });
});

describe("machineStore.update", () => {
  beforeEach(() => localStorage.clear());

  it("shallow-merges patch into existing machine", () => {
    seedStorage(makeTestMachine({ status: "running" }));
    machineStore.update({ status: "stopped" });
    expect(machineStore.read()!.status).toBe("stopped");
    expect(machineStore.read()!.hostname).toBe("test-host");
  });

  it("throws when machine is null (Fail-Fast)", () => {
    seedStorage(null);
    expect(() => machineStore.update({ status: "running" })).toThrow(/TODO/);
  });
});

describe("machineStore.write failure re-throws", () => {
  beforeEach(() => localStorage.clear());

  it("re-throws when localStorage.setItem throws", () => {
    const original = localStorage.setItem.bind(localStorage);
    localStorage.setItem = () => {
      throw new DOMException("QuotaExceededError");
    };
    try {
      expect(() => machineStore.write(makeTestMachine())).toThrow();
    } finally {
      localStorage.setItem = original;
    }
  });
});

describe("convertInitialPolicyToRules", () => {
  const policies: FirewallInitialPolicy[] = [
    "default-ssh-http-https",
    "ssh-only",
    "deny-all",
    "no-policy",
  ];

  it("default-ssh-http-https produces 3 rules", () => {
    const rules = convertInitialPolicyToRules("default-ssh-http-https");
    expect(rules).toHaveLength(3);
    expect(rules.map((r) => r.name)).toEqual(["SSH", "HTTP", "HTTPS"]);
    expect(rules[0].port).toBe(22);
    expect(rules[0].source).toBe("127.0.0.1/32");
  });

  it("ssh-only produces 1 rule", () => {
    const rules = convertInitialPolicyToRules("ssh-only");
    expect(rules).toHaveLength(1);
    expect(rules[0].name).toBe("SSH");
  });

  it("deny-all and no-policy produce empty arrays", () => {
    expect(convertInitialPolicyToRules("deny-all")).toEqual([]);
    expect(convertInitialPolicyToRules("no-policy")).toEqual([]);
  });

  it("all rules have enabled=true and unique ids", () => {
    for (const p of policies) {
      const rules = convertInitialPolicyToRules(p);
      const ids = new Set(rules.map((r) => r.id));
      expect(ids.size).toBe(rules.length);
      for (const r of rules) expect(r.enabled).toBe(true);
    }
  });
});
