import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { Machine, MachineStatus } from "./machineTypes";
import { machineStore } from "./machineStore";

interface MachineContextValue {
  machine: Machine | null;
  createMachine: (m: Machine) => void;
  updateStatus: (status: MachineStatus) => void;
  deleteMachine: () => void;
  patchMachine: (patch: Partial<Machine>) => void;
}

const MachineContext = createContext<MachineContextValue | null>(null);

export function MachineProvider({ children }: { children: ReactNode }) {
  const [machine, setMachine] = useState<Machine | null>(null);

  useEffect(() => {
    const loaded = machineStore.read();
    if (loaded !== null && loaded.status === "provisioning") {
      const elapsed = Date.now() - (loaded.provisioningStartedAt ?? loaded.createdAt);
      if (elapsed > 6000) {
        machineStore.update({ status: "running", provisioningStartedAt: undefined });
        setMachine({ ...loaded, status: "running", provisioningStartedAt: undefined });
        return;
      }
    }
    setMachine(loaded);
  }, []);

  const createMachine = useCallback((m: Machine) => {
    machineStore.write(m);
    setMachine(m);
  }, []);

  const updateStatus = useCallback((status: MachineStatus) => {
    machineStore.update({ status });
    setMachine((prev) => (prev ? { ...prev, status } : prev));
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
      value={{ machine, createMachine, updateStatus, deleteMachine, patchMachine }}
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

export function useMachineActions() {
  const ctx = useContext(MachineContext);
  if (!ctx) throw new Error("useMachineActions must be used inside <MachineProvider>");
  const { createMachine, updateStatus, deleteMachine, patchMachine } = ctx;
  return { createMachine, updateStatus, deleteMachine, patchMachine };
}
