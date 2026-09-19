import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  AGENTS,
  SEED,
  STARTER_OPPS,
  WEEKLY_TARGET,
  type AgentId,
  type LedgerEntry,
  type Opportunity,
  type OpportunityStatus,
  type PulseReport,
} from "./desk";
import { addDays, startOfWeek, uid } from "./utils";

type AgentLog = { lastRun: string | null; lastNote: string };

type DeskState = {
  cash: number;
  weeklyTarget: number;
  opportunities: Opportunity[];
  ledger: LedgerEntry[];
  pulses: PulseReport[];
  lastPulseDate: string | null;
  agentLogs: Record<AgentId, AgentLog>;
  addOpportunity: (o: Omit<Opportunity, "id" | "createdAt"> & { id?: string }) => void;
  updateOpportunity: (id: string, patch: Partial<Opportunity>) => void;
  setStatus: (id: string, status: OpportunityStatus) => void;
  addLedger: (e: Omit<LedgerEntry, "id" | "at"> & { at?: string }) => string | null;
  addPulse: (p: Omit<PulseReport, "id">, dailyLock: boolean) => void;
  markAgent: (id: AgentId, note: string) => void;
  resetDesk: () => void;
};

function emptyLogs(): Record<AgentId, AgentLog> {
  return Object.fromEntries(
    AGENTS.map((a) => [a.id, { lastRun: null, lastNote: "" }]),
  ) as Record<AgentId, AgentLog>;
}

const initial = {
  cash: SEED,
  weeklyTarget: WEEKLY_TARGET,
  opportunities: STARTER_OPPS,
  ledger: [] as LedgerEntry[],
  pulses: [] as PulseReport[],
  lastPulseDate: null as string | null,
  agentLogs: emptyLogs(),
};

export const useDesk = create<DeskState>()(
  persist(
    (set, get) => ({
      ...initial,
      addOpportunity: (o) =>
        set((s) => ({
          opportunities: [
            {
              plan: undefined,
              offer: undefined,
              ...o,
              id: o.id ?? uid(),
              createdAt: new Date().toISOString(),
              counselCleared: o.counselCleared ?? false,
            },
            ...s.opportunities,
          ],
        })),
      updateOpportunity: (id, patch) =>
        set((s) => ({
          opportunities: s.opportunities.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        })),
      setStatus: (id, status) =>
        set((s) => ({
          opportunities: s.opportunities.map((x) => {
            if (x.id !== id) return x;
            const counselCleared =
              status === "killed"
                ? false
                : status === "building" || status === "live" || status === "earning"
                  ? true
                  : x.counselCleared;
            return { ...x, status, counselCleared };
          }),
        })),
      addLedger: (e) => {
        const amount = Number(e.amount);
        if (!Number.isFinite(amount) || amount <= 0) return "Enter an amount greater than zero.";
        const cash = get().cash;
        if (e.type === "out" && amount > cash + 1e-9) {
          return `Cash on hand is ${cash.toFixed(2)}. That spend does not fit.`;
        }
        const entry: LedgerEntry = {
          id: uid(),
          at: e.at ?? new Date().toISOString(),
          type: e.type,
          amount,
          note: e.note.trim() || (e.type === "in" ? "Income" : "Spend"),
          opportunityId: e.opportunityId,
        };
        set((s) => ({
          ledger: [entry, ...s.ledger],
          cash: Number((s.cash + (e.type === "in" ? amount : -amount)).toFixed(2)),
        }));
        return null;
      },
      addPulse: (p, dailyLock) =>
        set((s) => ({
          pulses: [{ ...p, id: uid() }, ...s.pulses].slice(0, 30),
          lastPulseDate: dailyLock ? p.at.slice(0, 10) : s.lastPulseDate,
          agentLogs: {
            ...s.agentLogs,
            [p.agent]: { lastRun: p.at, lastNote: p.headline },
          },
        })),
      markAgent: (id, note) =>
        set((s) => ({
          agentLogs: {
            ...s.agentLogs,
            [id]: { lastRun: new Date().toISOString(), lastNote: note },
          },
        })),
      resetDesk: () =>
        set({
          ...initial,
          opportunities: STARTER_OPPS.map((o) => ({ ...o })),
          agentLogs: emptyLogs(),
        }),
    }),
    {
      name: "north-desk-v1",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({
        cash: s.cash,
        weeklyTarget: s.weeklyTarget,
        opportunities: s.opportunities,
        ledger: s.ledger,
        pulses: s.pulses,
        lastPulseDate: s.lastPulseDate,
        agentLogs: s.agentLogs,
      }),
    },
  ),
);

export function weekIncome(ledger: LedgerEntry[], now = new Date()) {
  const start = startOfWeek(now).getTime();
  const end = addDays(startOfWeek(now), 7).getTime();
  return ledger
    .filter((e) => {
      const t = new Date(e.at).getTime();
      return e.type === "in" && t >= start && t < end;
    })
    .reduce((a, e) => a + e.amount, 0);
}

export function rollingFourWeekAverage(ledger: LedgerEntry[], now = new Date()) {
  const start = addDays(startOfWeek(now), -21).getTime();
  const end = addDays(startOfWeek(now), 7).getTime();
  const income = ledger
    .filter((e) => {
      const t = new Date(e.at).getTime();
      return e.type === "in" && t >= start && t < end;
    })
    .reduce((a, e) => a + e.amount, 0);
  return income / 4;
}

export function weeklySeries(ledger: LedgerEntry[], now = new Date()) {
  const thisWeek = startOfWeek(now);
  return Array.from({ length: 8 }, (_, i) => {
    const start = addDays(thisWeek, (i - 7) * 7);
    const end = addDays(start, 7);
    const s = start.getTime();
    const e = end.getTime();
    const inn = ledger
      .filter((x) => x.type === "in" && new Date(x.at).getTime() >= s && new Date(x.at).getTime() < e)
      .reduce((a, x) => a + x.amount, 0);
    return { label: `${start.getMonth() + 1}/${start.getDate()}`, inn };
  });
}
