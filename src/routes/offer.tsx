import { createFileRoute, Link } from "@tanstack/react-router";
import { Mark } from "@/components/mark";
import { Button } from "@/components/ui/button";
import { LIORIN_LIVE } from "@/lib/week1";

export const Route = createFileRoute("/offer")({ component: OfferPage });

export function OfferPage() {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="border-b border-line print:hidden">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <Mark className="size-8" />
            <span className="font-serif text-lg tracking-tight">North Desk</span>
          </Link>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Offer</p>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">LIORIN Chess Academy</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
          An 8-session chess block for your club.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
          School-safe teaching and play. Standings, badges, certificates. Nothing of monetary value for students. No
          student DMs. The buyer is an adult, PTA, rec director, or coach.
        </p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-bg-elevated px-5 py-5 shadow-[var(--shadow-border)]">
            <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">8 sessions</dt>
            <dd className="mt-2 font-serif text-3xl tabular-nums">$1,200</dd>
          </div>
          <div className="rounded-3xl bg-bg-elevated px-5 py-5 shadow-[var(--shadow-border)]">
            <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">10-week term</dt>
            <dd className="mt-2 font-serif text-3xl tabular-nums">$2,500</dd>
          </div>
        </dl>
        <p className="mt-6 text-sm leading-relaxed text-muted">
          Live board:{" "}
          <a className="text-accent underline-offset-4 hover:underline" href={LIORIN_LIVE}>
            liorin-platform.vercel.app
          </a>
          . Guest play stays on-device. Member $4.44/mo is the software SKU. School $99.99/mo stays off until EIN /
          W-9 review.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 print:hidden">
          <Button asChild>
            <a href={`${LIORIN_LIVE}/pricing`}>Open pricing</a>
          </Button>
          <Button type="button" variant="secondary" onClick={() => window.print()}>
            Print one-pager
          </Button>
        </div>
        <p className="mt-8 text-sm leading-relaxed text-muted">
          Hastings Rec: 914-478-2380 · recreation@hohny.gov · James Harmon Community Center.
          Invoice the department. Adult books it.
        </p>
        <p className="mt-10 text-xs leading-relaxed text-faint">
          LIORIN Chess Academy is a New York sole proprietorship (Monticello). Not a school district, not a licensed
          therapy practice, not an investment. Reply STOP to any email and we will not write again.
        </p>
      </main>
    </div>
  );
}
