import { useMemo, useState } from "react";
import { Bar, BarChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { SEED, WEEKLY_TARGET, mixMath } from "@/lib/desk";
import { rollingFourWeekAverage, useDesk, weekIncome, weeklySeries } from "@/lib/store";
import { money } from "@/lib/utils";
import { BriefingCard } from "./briefing-card";
import { RunAgentDialog } from "./run-agent-dialog";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";
import { Label } from "./ui/input";
import { ShipPack } from "./ship-pack";
import { LiveAccount } from "./live-account";
import { CORNERSTONE_LIVE, CORNERSTONE_STEPS } from "@/lib/cornerstone";

export function CommandView({ pulseLocked }: { pulseLocked: boolean }) {
  const cash = useDesk((s) => s.cash);
  const ledger = useDesk((s) => s.ledger);
  const pulses = useDesk((s) => s.pulses);
  const opportunities = useDesk((s) => s.opportunities);
  const weeklyIn = weekIncome(ledger);
  const avg = rollingFourWeekAverage(ledger);
  const gap = Math.max(0, WEEKLY_TARGET - weeklyIn);
  const series = useMemo(() => weeklySeries(ledger), [ledger]);
  const latest = pulses[0];
  const [price, setPrice] = useState(49);
  const [share, setShare] = useState(0.3);
  const mix = mixMath(price, share);
  const live = opportunities.filter((o) => o.status === "live" || o.status === "earning").length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-bg-elevated px-5 py-4 shadow-[var(--shadow-border)]">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">Loop</p>
          <p className="mt-1 text-sm text-fg">
            Site, inbound, term. BTC is a lot, not the desk.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/bridge" className="inline-flex h-11 items-center rounded-xl px-4 text-sm text-accent shadow-[var(--shadow-border)]">
            GitHub · Vercel
          </a>
          <a href="/wager" className="inline-flex h-11 items-center rounded-xl px-4 text-sm text-muted shadow-[var(--shadow-border)]">
            Public wager
          </a>
          <a href="/offer" className="inline-flex h-11 items-center rounded-xl px-4 text-sm text-muted shadow-[var(--shadow-border)]">
            Public offer
          </a>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {CORNERSTONE_STEPS.map((s) => (
          <Card key={s.id}>
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">{s.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.detail}</p>
          </Card>
        ))}
      </div>
      <p className="text-xs text-faint">
        Live board{" "}
        <a className="text-accent underline-offset-4 hover:underline" href={CORNERSTONE_LIVE}>
          {CORNERSTONE_LIVE.replace("https://", "")}
        </a>
        . BTC 0.00118496 is satellite.
      </p>
      <LiveAccount />
      <section className="rounded-3xl bg-bg-elevated px-5 py-6 shadow-[var(--shadow-border)] sm:px-7 sm:py-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">This week vs mandate</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-serif text-4xl leading-none tracking-tight text-fg sm:text-5xl">
            <span className="tabular-nums">{money(weeklyIn)}</span>
            <span className="text-muted"> / {money(WEEKLY_TARGET)}</span>
          </h2>
          <RunAgentDialog
            agent="pulse"
            dailyLock
            disabled={pulseLocked}
            label={pulseLocked ? "Pulse filed today" : "Run daily Pulse"}
            size="lg"
          />
        </div>
        <div className="mt-5 h-px w-full bg-line" />
        <dl className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Stat k="Cash on hand" v={money(cash)} />
          <Stat k="4-week average" v={money(avg)} hint="mandate is an average" />
          <Stat k="Gap this week" v={money(gap)} />
          <Stat k="Live offers" v={String(live)} />
        </dl>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted">
          The $100 is working capital, not a market position. {money(SEED)} in an index fund does not become{" "}
          {money(WEEKLY_TARGET)} a week. That figure is a small-operator target — about {money(WEEKLY_TARGET * 52)} a
          year — from legal products and services you actually sell.
        </p>
      </section>

      <ShipPack />

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">Eight-week income</p>
            <Badge tone="line">Target {money(WEEKLY_TARGET)}</Badge>
          </div>
          <div className="relative h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <XAxis
                  dataKey="label"
                  tick={{ fill: "var(--color-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, WEEKLY_TARGET]}
                  tick={{ fill: "var(--color-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "color-mix(in oklab, var(--color-fg) 4%, transparent)" }}
                  contentStyle={{
                    background: "var(--color-bg-elevated)",
                    border: "1px solid var(--color-line)",
                    borderRadius: 12,
                    color: "var(--color-fg)",
                    fontSize: 12,
                  }}
                  formatter={(v) => [money(Number(v ?? 0)), "Income"]}
                />
                <ReferenceLine y={WEEKLY_TARGET} stroke="var(--color-sage)" strokeDasharray="4 4" />
                <Bar dataKey="inn" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            {series.every((s) => s.inn === 0) ? (
              <p className="pointer-events-none absolute inset-x-8 top-6 text-center text-sm text-muted">
                No deposits yet. The dashed line is the $2,500 mandate, not a forecast.
              </p>
            ) : null}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">Mix to hit the mandate</p>
          <p className="mt-2 text-sm text-muted">
            Split this week between product units and service revenue. The numbers are required volume, not a forecast.
          </p>
          <div className="mt-4">
            <Label htmlFor="share">Product share {Math.round(share * 100)}%</Label>
            <input
              id="share"
              type="range"
              min={0}
              max={100}
              value={Math.round(share * 100)}
              onChange={(e) => setShare(Number(e.target.value) / 100)}
              className="mt-1 h-11 w-full accent-accent"
            />
          </div>
          <div className="mt-3">
            <Label htmlFor="price">Product price {money(price)}</Label>
            <input
              id="price"
              type="range"
              min={9}
              max={249}
              step={1}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="mt-1 h-11 w-full accent-accent"
            />
          </div>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Service to close</dt>
              <dd className="tabular-nums text-fg">{money(mix.serviceNeed)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Product units</dt>
              <dd className="tabular-nums text-fg">
                {mix.units} × {money(price)}
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      {latest ? (
        <div>
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">Latest filing</p>
          <BriefingCard report={latest} />
        </div>
      ) : (
        <Card>
          <h3 className="font-serif text-2xl text-fg">The desk is quiet</h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            File the first Pulse when you are ready to work. Scout can also drop intake items onto the board. Counsel
            will refuse anything that looks like a lawsuit, a fake yield, or a cloned brand.
          </p>
        </Card>
      )}
    </div>
  );
}

function Stat({ k, v, hint }: { k: string; v: string; hint?: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.14em] text-muted">{k}</dt>
      <dd className="mt-1 font-mono text-lg tabular-nums text-fg">{v}</dd>
      {hint ? <p className="text-xs text-faint">{hint}</p> : null}
    </div>
  );
}
