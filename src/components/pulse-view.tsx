import { useDesk } from "@/lib/store";
import { todayKey } from "@/lib/utils";
import { BriefingCard } from "./briefing-card";
import { RunAgentDialog } from "./run-agent-dialog";
import { Card } from "./ui/card";

export function PulseView({ pulseLocked }: { pulseLocked: boolean }) {
  const pulses = useDesk((s) => s.pulses);
  const last = useDesk((s) => s.lastPulseDate);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-3xl tracking-tight text-fg">Pulse</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            One coordinated briefing per calendar day. Pulse reads the board and the ledger, then Counsel stamps the
            rails. After it files, the desk waits until tomorrow.
          </p>
        </div>
        <RunAgentDialog
          agent="pulse"
          dailyLock
          disabled={pulseLocked}
          label={pulseLocked ? "Already filed" : "Run today’s Pulse"}
        />
      </div>

      {pulseLocked ? (
        <p className="text-sm text-sage">
          Pulse is locked for {last ?? todayKey()}. Scout, Builder, Allocator, and Closer can still run if you need a
          specialist.
        </p>
      ) : null}

      {pulses.length === 0 ? (
        <Card>
          <h3 className="font-serif text-2xl text-fg">No filings</h3>
          <p className="mt-2 text-sm text-muted">
            The first Pulse should name three moves that fit inside remaining cash and the seven legal lanes. If it
            suggests a chart-trade or a cloned product, ignore it — Counsel already forbids both.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {pulses.map((p) => (
            <BriefingCard key={p.id} report={p} />
          ))}
        </div>
      )}
    </div>
  );
}
