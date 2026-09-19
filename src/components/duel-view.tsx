import { BOA_DESTINATION, CONTEST_END_LABEL, INVESTOR_AGENTS, REPRIMANDS, RUIN_WALL, SUPPORT_RULES } from "@/lib/contest";
import { WEEKLY_TARGET } from "@/lib/desk";
import { useDesk } from "@/lib/store";
import { money } from "@/lib/utils";
import { LIORIN_LIVE } from "@/lib/week1";
import { Card } from "./ui/card";

const INVESTOR_MARK = 0;
const COINBASE_USD = 0;

export function DuelView() {
  const ledger = useDesk((s) => s.ledger);
  const operatorIn = ledger.filter((e) => e.type === "in").reduce((n, e) => n + e.amount, 0);
  const operatorWins = operatorIn > INVESTOR_MARK;
  const investorWins = INVESTOR_MARK > operatorIn;
  const neither = operatorIn === 0 && INVESTOR_MARK === 0;

  return (
    <div className="space-y-5">
      <section className="rounded-3xl bg-bg-elevated px-5 py-6 shadow-[var(--shadow-border)] sm:px-7 sm:py-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">One week · two desks</p>
        <h2 className="mt-3 font-serif text-4xl leading-none tracking-tight sm:text-5xl">Only one survives.</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Operator desk sells what we already built. Investor desk is listed US stocks in a cash account — and it
          reprimands every other online bet. Deadline {CONTEST_END_LABEL}. Score is dollars that actually land in{" "}
          {BOA_DESTINATION}. Grok cannot wire the bank. Markets can lose money. The ruin wall only stops debt.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Operator · ours</p>
          <p className="mt-2 font-serif text-3xl tabular-nums">{money(operatorIn)}</p>
          <p className="mt-1 text-sm text-muted">BoA-bound this week (ledger inflows)</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            LIORIN Member $4.44 after trial. Club term $1,200 / $2,500. Seed $100 stays working capital.{" "}
            <a className="text-accent underline-offset-4 hover:underline" href={`${LIORIN_LIVE}/pricing`}>
              Live pricing
            </a>
            .
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-sage">
            {operatorWins ? "Leading" : neither ? "Tied at zero" : "Behind"}
          </p>
        </Card>
        <Card>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Investor · listed stocks</p>
          <p className="mt-2 font-serif text-3xl tabular-nums">{money(INVESTOR_MARK)}</p>
          <p className="mt-1 text-sm text-muted">Coinbase USD {money(COINBASE_USD)} · no stock lot</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Coinbase is cash $0 and is not the stock venue. Warden will not buy crypto to 'catch up'. Robinhood
            (listed stocks, cash) is the ask. Until it is funded, this desk reports $0 and supports operator.
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.14em] text-warn">
            {investorWins ? "Leading" : "Cannot trade on empty cash"}
          </p>
        </Card>
      </div>

      <Card>
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Who survives {CONTEST_END_LABEL}</p>
        <p className="mt-3 font-serif text-2xl tracking-tight">
          {neither
            ? "Neither. $0 and $0 is not a winner."
            : operatorWins
              ? "Operator — more BoA-bound cash."
              : "Investor — more BoA-bound cash."}
        </p>
        <p className="mt-2 text-sm text-muted">
          Mandate is still {money(WEEKLY_TARGET)} / week average. A $100 stock lot cannot print that in seven days
          without ruin. We will not pretend otherwise.
        </p>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        {INVESTOR_AGENTS.map((a) => (
          <Card key={a.id}>
            <p className="text-[11px] uppercase tracking-[0.16em] text-muted">
              {a.name} · {a.role}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{a.brief}</p>
          </Card>
        ))}
      </div>

      <Card>
        <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Warden reprimands</p>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {REPRIMANDS.map((r) => (
            <li key={r}>— {r}</li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted">Ruin wall (both desks)</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {RUIN_WALL.map((r) => (
              <li key={r}>— {r}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <p className="text-[11px] uppercase tracking-[0.16em] text-muted">How they support each other</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {SUPPORT_RULES.map((r) => (
              <li key={r}>— {r}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
