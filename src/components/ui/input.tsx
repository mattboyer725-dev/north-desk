import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl bg-bg-subtle px-3 text-sm text-fg placeholder:text-faint shadow-[var(--shadow-border)] outline-none focus-visible:shadow-[var(--shadow-border-hover)]",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-xl bg-bg-subtle px-3 py-2.5 text-sm text-fg placeholder:text-faint shadow-[var(--shadow-border)] outline-none focus-visible:shadow-[var(--shadow-border-hover)]",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      className={cn("mb-1.5 block text-[11px] font-medium uppercase tracking-[0.14em] text-muted", className)}
      {...props}
    />
  );
}
