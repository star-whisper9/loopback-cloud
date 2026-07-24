import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { Machine, MachineStatus } from "./machineTypes";
import { PROVISIONING_DURATION_MS } from "./machineTypes";
import { machineStore } from "./machineStore";

interface MachineContextValue {
  machine: Machine | null;
  createMachine: (m: Machine) => void;
  updateStatus: (status: MachineStatus) => void;
  startMachine: () => void;
  stopMachine: () => void;
  deleteMachine: () => void;
  patchMachine: (patch: Partial<Machine>) => void;
}

const MachineContext = createContext<MachineContextValue | null>(null);

export function MachineProvider({ children }: { children: ReactNode }) {
  const [machine, setMachine] = useState<Machine | null>(() => {
    if (typeof window === "undefined") return null;
    return machineStore.read();
  });

  useEffect(() => {
    const loaded = machineStore.read();
    if (loaded !== null && loaded.status === "provisioning") {
      const elapsed =
        Date.now() - (loaded.provisioningStartedAt ?? loaded.createdAt);
      if (elapsed > PROVISIONING_DURATION_MS) {
        const target = loaded.provisioningTarget ?? "running";
        machineStore.update({
          status: target,
          provisioningStartedAt: undefined,
          provisioningTarget: undefined,
        });
        setMachine({
          ...loaded,
          status: target,
          provisioningStartedAt: undefined,
          provisioningTarget: undefined,
        });
        return;
      }
    }
  }, []);

  const createMachine = useCallback((m: Machine) => {
    machineStore.write(m);
    setMachine(m);
  }, []);

  const updateStatus = useCallback((status: MachineStatus) => {
    machineStore.update({ status });
    setMachine((prev) => (prev ? { ...prev, status } : prev));
  }, []);

  const startMachine = useCallback(() => {
    const patch: Partial<Machine> = {
      status: "provisioning",
      provisioningStartedAt: Date.now(),
      provisioningTarget: "running",
    };
    machineStore.update(patch);
    setMachine((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const stopMachine = useCallback(() => {
    const patch: Partial<Machine> = {
      status: "provisioning",
      provisioningStartedAt: Date.now(),
      provisioningTarget: "stopped",
    };
    machineStore.update(patch);
    setMachine((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const deleteMachine = useCallback(() => {
    machineStore.clearAll();
    setMachine(null);
  }, []);

  const patchMachine = useCallback((patch: Partial<Machine>) => {
    machineStore.update(patch);
    setMachine((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  return (
    <MachineContext.Provider
      value={{
        machine,
        createMachine,
        updateStatus,
        startMachine,
        stopMachine,
        deleteMachine,
        patchMachine,
      }}
    >
      {children}
    </MachineContext.Provider>
  );
}

export function useMachine(): Machine | null {
  const ctx = useContext(MachineContext);
  if (!ctx) throw new Error("useMachine must be used inside <MachineProvider>");
  return ctx.machine;
}

export function useHydratedMachine(): Machine | null {
  const raw = useMachine();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated ? raw : null;
}

export function useMachineActions() {
  const ctx = useContext(MachineContext);
  if (!ctx)
    throw new Error("useMachineActions must be used inside <MachineProvider>");
  const {
    createMachine,
    updateStatus,
    startMachine,
    stopMachine,
    deleteMachine,
    patchMachine,
  } = ctx;
  return {
    createMachine,
    updateStatus,
    startMachine,
    stopMachine,
    deleteMachine,
    patchMachine,
  };
}
