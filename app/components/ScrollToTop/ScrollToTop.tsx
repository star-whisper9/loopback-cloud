import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "~/lib/utils";

const THRESHOLD = 400;

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > THRESHOLD);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-16 right-16 z-50 flex h-12 w-12 items-center justify-center rounded-full",
        "border border-[var(--color-accent)]/40 bg-[var(--color-surface)]/90 backdrop-blur-sm",
        "text-[var(--color-accent)] shadow-[0_0_20px_-6px_var(--color-accent)]",
        "transition-all duration-300",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none",
      )}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
