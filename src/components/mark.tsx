import { cn } from "@/lib/utils";

/** Compass rose with East at the top. North sits on the left. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("text-accent", className)}
      role="img"
      aria-label="North Desk compass, east up"
    >
      <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="1.2" />
      {/* East–West axis. East is up. */}
      <path d="M16 3.6 L19.2 16 L16 28.4 L12.8 16 Z" fill="currentColor" />
      {/* North–South axis. North is left. */}
      <path d="M3.6 16 L16 13.5 L28.4 16 L16 18.5 Z" fill="currentColor" opacity="0.36" />
      {/* North pointer at 9 o'clock */}
      <path d="M2.8 16 L8 13.4 L8 18.6 Z" fill="currentColor" />
      <circle cx="16" cy="16" r="1.4" fill="currentColor" />
    </svg>
  );
}
