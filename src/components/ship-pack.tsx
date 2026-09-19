import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DO_NOT, OFFERS, WEEK1_REPO, WEEK_TASKS } from "@/lib/week1";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const KEY = "north-desk-week1";

type Saved = { checks: Record<string, boolean> };

function load(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { checks: {} };
    const p = JSON.parse(raw) as Saved;
    return { checks: p.checks ?? {} };
  } catch {
    return { checks: {} };
  }
}

async function copy(text: string, label: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied.`);
  } catch {
    toast.error("Could not copy. Select the text instead.");
  }
}

export function ShipPack() {
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [open, setOpen] = useState<string>(OFFERS[0].id);

  useEffect(() => {
    setChecks(load().checks);
  }, []);

  function toggle(id: string) {
    setChecks((c) => {
      const next = { ...c, [id]: !c[id] };
      localStorage.setItem(KEY, JSON.stringify({ checks: next }));
      return next;
    });
  }

  const done = WEEK_TASKS.filter((t) => checks[t.id]).length;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">Week one — already built</p>
          <h3 className="mt-1 font-serif text-2xl text-fg">Sell LIORIN, list ASH COW, freeze new desks</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/offer"
            className="inline-flex h-11 items-center rounded-xl px-4 text-sm text-accent shadow-[var(--shadow-border)]"
          >
            Public offer
          </a>
          <a
            href={WEEK1_REPO}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center rounded-xl px-4 text-sm text-muted shadow-[var(--shadow-border)]"
          >
            GitHub pack
          </a>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-3">
        {OFFERS.map((o) => (
          <Card key={o.id} className="flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <p className="font-serif text-xl text-fg">{o.name}</p>
              <Badge tone={o.id === "verityx" ? "warn" : "sage"}>{o.status}</Badge>
            </div>
            <p className="mt-2 font-mono text-sm tabular-nums text-fg">{o.price}</p>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{o.promise}</p>
            <p className="mt-2 text-xs text-faint">{o.who}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => copy(o.letter, o.name)}>
                Copy email
              </Button>
              <Button size="sm" variant="ghost" asChild>
                <a href={o.href} target="_blank" rel="noreferrer">
                  Open
                </a>
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setOpen(o.id)}>
                {open === o.id ? "Shown" : "Preview"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {OFFERS.filter((o) => o.id === open).map((o) => (
        <Card key={`preview-${o.id}`}>
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Email · {o.name}</p>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-fg">{o.letter}</pre>
        </Card>
      ))}

      <Card>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">This week</p>
          <p className="font-mono text-xs tabular-nums text-muted">
            {done}/{WEEK_TASKS.length}
          </p>
        </div>
        <ul className="space-y-2">
          {WEEK_TASKS.map((t) => (
            <li key={t.id}>
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-bg-subtle px-3 py-3">
                <input
                  type="checkbox"
                  checked={Boolean(checks[t.id])}
                  onChange={() => toggle(t.id)}
                  className="mt-1 size-4 accent-accent"
                />
                <span>
                  <span className="block text-sm font-medium text-fg">{t.label}</span>
                  <span className="mt-0.5 block text-sm text-muted">{t.detail}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </Card>

      <div className="rounded-3xl bg-bg-elevated px-5 py-4 shadow-[var(--shadow-border)]">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">Do not</p>
        <ul className="mt-2 space-y-1 text-sm text-muted">
          {DO_NOT.map((d) => (
            <li key={d} className="pl-3 -indent-3">
              — {d}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
