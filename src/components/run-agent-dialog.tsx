import { useState } from "react";
import { toast } from "sonner";
import { AGENTS, PLAYBOOKS, type AgentId } from "@/lib/desk";
import { runAgent } from "@/lib/run-agent";
import { rollingFourWeekAverage, useDesk, weekIncome } from "@/lib/store";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Label, Textarea } from "./ui/input";

export function RunAgentDialog({
  agent,
  focusTitle,
  dailyLock,
  disabled,
  label,
  size = "md",
}: {
  agent: AgentId;
  focusTitle?: string;
  dailyLock?: boolean;
  disabled?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const meta = AGENTS.find((a) => a.id === agent)!;
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const cash = useDesk((s) => s.cash);
  const weeklyTarget = useDesk((s) => s.weeklyTarget);
  const opportunities = useDesk((s) => s.opportunities);
  const ledger = useDesk((s) => s.ledger);
  const addPulse = useDesk((s) => s.addPulse);
  const addOpportunity = useDesk((s) => s.addOpportunity);
  const markAgent = useDesk((s) => s.markAgent);

  async function go() {
    setBusy(true);
    try {
      const result = await runAgent({
        data: {
          agent,
          cash,
          weeklyIn: weekIncome(ledger),
          rollingAvg: rollingFourWeekAverage(ledger),
          weeklyTarget,
          opportunities: opportunities
            .filter((o) => o.status !== "killed")
            .slice(0, 12)
            .map((o) => ({
              title: o.title,
              status: o.status,
              thesis: o.thesis,
              playbookId: o.playbookId,
            })),
          focusTitle,
          notes: notes.trim() || undefined,
        },
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      addPulse(
        {
          at: new Date().toISOString(),
          agent: result.agent,
          headline: result.headline,
          realityCheck: result.realityCheck,
          counselWarnings: result.counselWarnings,
          moves: result.moves,
          body: result.body,
          doNotDo: result.doNotDo,
          weeklyMath: result.weeklyMath,
        },
        Boolean(dailyLock),
      );
      if (result.suggestions?.length) {
        for (const s of result.suggestions) {
          const book = PLAYBOOKS.some((p) => p.id === s.playbookId) ? s.playbookId : "digital";
          addOpportunity({
            title: s.title,
            playbookId: book,
            status: "intake",
            thesis: s.thesis,
            capitalAsk: Math.max(0, s.capitalAsk),
            weeklyLow: Math.max(0, s.weeklyLow),
            weeklyHigh: Math.max(0, s.weeklyHigh),
            legalNotes: s.legalNotes,
            nextAction: s.nextAction,
            counselCleared: false,
          });
        }
        toast.success(`${meta.name} filed ${result.suggestions.length} intake item${result.suggestions.length === 1 ? "" : "s"}.`);
      } else {
        toast.success(`${meta.name} filed a briefing.`);
      }
      markAgent("counsel", "Rails applied to latest run");
      if (agent === "pulse") markAgent("ledger", "Weekly math restated");
      setOpen(false);
      setNotes("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Run failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={size} disabled={disabled} variant={agent === "pulse" ? "primary" : "secondary"}>
          {label ?? `Run ${meta.name}`}
        </Button>
      </DialogTrigger>
      <DialogContent title={meta.name}>
        <p className="mb-4 text-sm text-muted">{meta.brief}</p>
        {focusTitle ? (
          <p className="mb-4 text-sm text-fg">
            Focus: <span className="text-accent">{focusTitle}</span>
          </p>
        ) : null}
        <Label htmlFor={`notes-${agent}`}>Operator note (optional)</Label>
        <Textarea
          id={`notes-${agent}`}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={400}
          placeholder="Constraints, skills, audience, what you already built…"
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={go} disabled={busy}>
            {busy ? "Running…" : "Run"}
          </Button>
        </div>
        <p className="mt-3 text-xs text-faint">
          User-initiated. Counsel rails are attached. Not advice. Not a guarantee.
        </p>
      </DialogContent>
    </Dialog>
  );
}
