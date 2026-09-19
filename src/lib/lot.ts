import { createServerFn } from "@tanstack/react-start";

/** Real Coinbase lot. 72h clock started 18 Sep 2026 21:11 ET. */
export const LOT = {
  btc: 0.00118496,
  fill: 81546.38,
  cost: 97.5,
  dustUsdc: 0.0611387691968,
  orderId: "1d94a616-f478-4490-9205-958a31a79954",
  startedAt: Date.parse("2026-09-18T21:11:00-04:00"),
  deadlineAt: Date.parse("2026-09-21T21:11:00-04:00"),
  alertEvery: 1000,
} as const;

export type SpotQuote = {
  ok: true;
  price: number;
  at: string;
} | { ok: false; error: string };

export const fetchBtcSpot = createServerFn({ method: "GET" }).handler(async (): Promise<SpotQuote> => {
  try {
    const r = await fetch("https://api.coinbase.com/v2/prices/BTC-USDC/spot", {
      headers: { "User-Agent": "north-desk-lot" },
    });
    if (!r.ok) return { ok: false, error: `ticker ${r.status}` };
    const j = (await r.json()) as { data?: { amount?: string } };
    const price = Number(j.data?.amount);
    if (!Number.isFinite(price) || price <= 0) return { ok: false, error: "bad price" };
    return { ok: true, price, at: new Date().toISOString() };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "ticker down" };
  }
});

export function markFromPrice(price: number) {
  return LOT.btc * price + LOT.dustUsdc;
}

export function remainParts(now = Date.now()) {
  const ms = Math.max(0, LOT.deadlineAt - now);
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return { ms, h, m, s, dead: ms <= 0 };
}
