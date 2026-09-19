import { format } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { WEEKLY_TARGET } from "@/lib/desk";
import { rollingFourWeekAverage, useDesk, weekIncome } from "@/lib/store";
import { money } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input, Label } from "./ui/input";

export function LedgerView() {
  const cash = useDesk((s) => s.cash);
  const ledger = useDesk((s) => s.ledger);
  const opportunities = useDesk((s) => s.opportunities);
  const addLedger = useDesk((s) => s.addLedger);
  const weeklyIn = weekIncome(ledger);
  const avg = rollingFourWeekAverage(ledger);
  const incomeAll = ledger.filter((e) => e.type === "in").reduce((a, e) => a + e.amount, 0);
  const tax = incomeAll * 0.3;
  const [type, setType] = useState<"in" | "out">("in");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [opp, setOpp] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const err = addLedger({
      type,
      amount: Number(amount),
      note,
      opportunityId: opp || undefined,
    });
    if (err) {
      toast.error(err);
      return;
    }
    toast.success(type === "in" ? "Income posted." : "Spend posted.");
    setAmount("");
    setNote("");
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-3xl tracking-tight text-fg">Cash</h2>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Only money that actually moved. The mandate is a rolling average of deposits, not a hope. Set aside tax —
          this is a reminder, not a filing.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">On hand</p>
          <p className="mt-2 font-mono text-2xl tabular-nums text-fg">{money(cash)}</p>
        </Card>
        <Card>
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">This week in</p>
          <p className="mt-2 font-mono text-2xl tabular-nums text-sage">{money(weeklyIn)}</p>
          <p className="mt-1 text-xs text-faint">{money(Math.max(0, WEEKLY_TARGET - weeklyIn))} short of mandate</p>
        </Card>
        <Card>
          <p className="text-[11px] uppercase tracking-[0.14em] text-muted">Tax set-aside 30%</p>
          <p className="mt-2 font-mono text-2xl tabular-nums text-fg">{money(tax)}</p>
          <p className="mt-1 text-xs text-faint">On lifetime logged income {money(incomeAll)}</p>
        </Card>
      </div>

      <Card>
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2 flex gap-2">
            <Button type="button" size="sm" variant={type === "in" ? "primary" : "secondary"} onClick={() => setType("in")}>
              Income
            </Button>
            <Button type="button" size="sm" variant={type === "out" ? "primary" : "secondary"} onClick={() => setType("out")}>
              Spend
            </Button>
          </div>
          <div>
            <Label htmlFor="amt">Amount</Label>
            <Input
              id="amt"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <Label htmlFor="opp">Board item (optional)</Label>
            <select
              id="opp"
              value={opp}
              onChange={(e) => setOpp(e.target.value)}
              className="h-11 w-full rounded-xl bg-bg-subtle px-3 text-sm text-fg shadow-[var(--shadow-border)]"
            >
              <option value="">Unassigned</option>
              {opportunities.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="note">Note</Label>
            <Input id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="What moved" />
          </div>
          <div className="sm:col-span-2 flex justify-end">
            <Button type="submit">Post</Button>
          </div>
        </form>
      </Card>

      <div className="space-y-2">
        {ledger.length === 0 ? (
          <Card>
            <p className="text-sm text-muted">
              Seed is {money(cash)} on hand. Post the first real spend or the first real dollar of revenue — not a
              hypothetical.
            </p>
          </Card>
        ) : (
          ledger.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between gap-3 rounded-2xl bg-bg-elevated px-4 py-3 shadow-[var(--shadow-border)]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-fg">{e.note}</p>
                <p className="text-xs text-faint">{format(new Date(e.at), "MMM d, yyyy · p")}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={e.type === "in" ? "sage" : "danger"}>{e.type === "in" ? "In" : "Out"}</Badge>
                <p className={`font-mono tabular-nums text-sm ${e.type === "in" ? "text-sage" : "text-fg"}`}>
                  {e.type === "in" ? "+" : "−"}
                  {money(e.amount)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="text-xs text-faint">
        Rolling four-week average {money(avg)} / {money(WEEKLY_TARGET)}. Unlimited is allowed — the floor is the
        mandate, not a cap.
      </p>
    </div>
  );
}
