import { useEffect, useState } from "react";

export function useCores(): number | undefined {
  const [cores, setCores] = useState<number | undefined>(undefined);

  useEffect(() => {
    const raw =
      typeof navigator !== "undefined"
        ? navigator.hardwareConcurrency
        : undefined;
    setCores(typeof raw === "number" && raw > 0 ? raw : undefined);
  }, []);

  return cores;
}
