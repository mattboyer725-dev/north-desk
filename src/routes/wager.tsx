import { Link, createFileRoute } from "@tanstack/react-router";
import { LiveAccount } from "@/components/live-account";
import { Mark } from "@/components/mark";
import { LOT } from "@/lib/lot";

export const Route = createFileRoute("/wager")({ component: WagerPage });

export function WagerPage() {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <Mark className="size-8" />
            <span className="font-serif text-lg tracking-tight">North Desk</span>
          </Link>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">LOT-1000-72H</p>
        </div>
      </header>
      <main className="mx-auto max-w-2xl space-y-6 px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
          Settlement · not listed on Kalshi
        </p>
        <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
          Coinbase mark vs $1,000 at 72 hours.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted">
          Started 18 Sep 2026, 9:11 PM ET. Bell 21 Sep 2026, 9:11 PM ET. Snapshot of 0.00118496 BTC plus dust. Cost $
          {LOT.cost.toFixed(2)}. No leverage. No invented fills.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-bg-elevated px-5 py-5 shadow-[var(--shadow-border)]">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Yes</p>
            <p className="mt-2 font-serif text-3xl">Mark ≥ $1,000</p>
          </div>
          <div className="rounded-3xl bg-bg-elevated px-5 py-5 shadow-[var(--shadow-border)]">
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted">No</p>
            <p className="mt-2 font-serif text-3xl">{'Mark < $1,000'}</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-muted">Same terms in the GitHub file. Not an exchange contract.</p>
        <LiveAccount />
        <p className="text-xs text-faint">
          github.com/mattboyer725-dev/week-one-sprint/blob/main/WAGER.md
        </p>
      </main>
    </div>
  );
}
