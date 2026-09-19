import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mark } from "@/components/mark";
import { PROFIT_TARGETS, pingProfit, type PingRow } from "@/lib/bridge";

export const Route = createFileRoute("/bridge")({ component: BridgePage });

export function BridgePage() {
  const [pings, setPings] = useState<PingRow[]>([]);

  useEffect(() => {
    let alive = true;
    void pingProfit().then((rows) => {
      if (alive) setPings(rows);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-3">
            <Mark className="size-8" />
            <span className="font-serif text-lg tracking-tight">North Desk</span>
          </Link>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">GitHub · Vercel</p>
        </div>
      </header>
      <main className="mx-auto max-w-2xl space-y-5 px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">Profit bridge</p>
        <h1 className="font-serif text-4xl leading-tight tracking-tight">Repos that can invoice. Sites that are up.</h1>
        <p className="max-w-xl text-base leading-relaxed text-muted">
          GitHub is mattboyer725-dev. Vercel is the live pipe. Eighteen repos on the login. Dependabot group/majors stay
          unmerged. Locked cornerstone snapshots stay locked.
        </p>
        <ul className="space-y-3">
          {PROFIT_TARGETS.map((t) => {
            const ping = pings.find((p) => p.id === t.id);
            return (
              <li key={t.id} className="rounded-3xl bg-bg-elevated px-5 py-5 shadow-[var(--shadow-border)]">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-serif text-xl">{t.name}</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                    {ping ? (ping.ok ? `up ${ping.status}` : `down ${ping.status}`) : "ping…"} · {t.kind}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t.note}</p>
                <p className="mt-3 flex flex-wrap gap-3 text-sm">
                  {t.live ? (
                    <a className="text-accent underline-offset-4 hover:underline" href={t.live}>
                      Live
                    </a>
                  ) : null}
                  {t.repo.startsWith("matt") ? (
                    <a
                      className="text-accent underline-offset-4 hover:underline"
                      href={`https://github.com/${t.repo}`}
                    >
                      GitHub
                    </a>
                  ) : (
                    <span className="text-faint">{t.repo}</span>
                  )}
                </p>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
