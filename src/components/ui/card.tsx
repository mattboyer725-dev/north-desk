import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-bg-elevated p-4 shadow-[var(--shadow-border)] sm:p-5",
        className,
      )}
      {...props}
    />
  );
}
