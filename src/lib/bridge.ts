import { createServerFn } from "@tanstack/react-start";

export type ProfitTarget = {
  id: string;
  name: string;
  kind: "cash" | "kit" | "desk" | "hold";
  repo: string;
  live: string | null;
  note: string;
  dependabotOpen?: number;
};

export const PROFIT_TARGETS: ProfitTarget[] = [
  {
    id: "liorin",
    name: "LIORIN",
    kind: "cash",
    repo: "mattboyer725-dev/liorin",
    live: "https://liorin-platform.vercel.app/pricing",
    note: "Live SKU. Member $4.44. Club term $1,200 / $2,500. Two Dependabot group PRs — do not merge majors.",
    dependabotOpen: 2,
  },
  {
    id: "week",
    name: "Week-one pack",
    kind: "cash",
    repo: "mattboyer725-dev/week-one-sprint",
    live: "https://week-one-sprint.vercel.app/",
    note: "Public $1,200 offer. Rec walk-in sheet.",
  },
  {
    id: "ash",
    name: "ASH COW",
    kind: "kit",
    repo: "mattboyer725-dev/ash-cow",
    live: "https://ash-cow.vercel.app/",
    note: "$49 kit. Parked under the term. Not the week.",
  },
  {
    id: "audit",
    name: "AuditShield",
    kind: "desk",
    repo: "— (Vercel only)",
    live: "https://auditshield.vercel.app/",
    note: "Live on Vercel. No matching GitHub name on this login. Treat as a second desk, not a merge into LIORIN.",
  },
  {
    id: "verityx",
    name: "VerityX desk",
    kind: "hold",
    repo: "mattboyer725-dev/verityx-portal",
    live: "https://verityx-sovereign-desk.vercel.app/",
    note: "Up. Eight Dependabot PRs on verityx-sovereign. Do not merge majors. Not this week’s invoice.",
    dependabotOpen: 8,
  },
];

export type PingRow = { id: string; ok: boolean; status: number };

export const pingProfit = createServerFn({ method: "GET" }).handler(async (): Promise<PingRow[]> => {
  const rows = await Promise.all(
    PROFIT_TARGETS.filter((t) => t.live).map(async (t) => {
      try {
        const r = await fetch(t.live as string, {
          method: "GET",
          headers: { "User-Agent": "north-desk-bridge" },
          redirect: "follow",
        });
        return { id: t.id, ok: r.ok, status: r.status };
      } catch {
        return { id: t.id, ok: false, status: 0 };
      }
    }),
  );
  return rows;
});
