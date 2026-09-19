import { useEffect, useState } from "react";
import { fetchBtcSpot, LOT, markFromPrice, remainParts } from "@/lib/lot";
import { money } from "@/lib/utils";
import { Card } from "./ui/card";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function LiveAccount() {
  const [now, setNow] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [stale, setStale] = useState("Connecting to Coinbase…");

  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    let alive = true;
    async function pull() {
      const q = await fetchBtcSpot();
      if (!alive) return;
      if (q.ok) {
        setPrice(q.price);
        setStale("");
      } else {
        setStale(q.error);
      }
    }
    void pull();
    const t = setInterval(() => void pull(), 15_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, []);

  const clock = now == null ? null : remainParts(now);
  const mark = price != null ? markFromPrice(price) : null;
  const pnl = mark != null ? mark - LOT.cost : null;
  const toThousand = mark != null ? Math.max(0, LOT.alertEvery - mark) : null;

  return (
    <section className="rounded-3xl bg-bg-elevated px-5 py-6 shadow-[var(--shadow-border)] sm:px-7 sm:py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">Coinbase lot</p>
          <p className="mt-2 font-serif text-4xl leading-none tracking-tight text-fg sm:text-5xl">
            {mark != null ? (
              <span className="tabular-nums">{money(mark)}</span>
            ) : (
              <span className="text-muted">—</span>
            )}
          </p>
          <p className="mt-2 text-sm text-muted">
            vs {money(LOT.cost)} cost.
          </p>
        </div>
        <p
          className={`font-mono text-2xl tabular-nums ${clock?.dead ? "text-danger" : "text-fg"}`}
          aria-label="time remaining"
        >
          {clock == null ? "—" : clock.dead ? "00:00:00" : `${pad(clock.h)}:${pad(clock.m)}:${pad(clock.s)}`}
        </p>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Item k="BTC" v={LOT.btc.toFixed(8)} />
        <Item k="Spot" v={price != null ? money(price) : "—"} />
        <Item k="P&L" v={pnl != null ? money(pnl) : "—"} />
        <Item k="To $1,000" v={toThousand != null ? money(toThousand) : "—"} />
      </dl>

      <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">
        {stale ? <span className="text-warn">{stale}</span> : "Spot from Coinbase. No extra cash. No leverage."}
      </p>
    </section>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">{k}</dt>
      <dd className="mt-1 font-mono text-sm tabular-nums text-fg">{v}</dd>
    </div>
  );
}
