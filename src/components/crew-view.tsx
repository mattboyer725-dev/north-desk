import { AGENTS, COUNSEL_RAILS } from "@/lib/desk";
import { useDesk } from "@/lib/store";
import { RunAgentDialog } from "./run-agent-dialog";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

export function CrewView({ pulseLocked }: { pulseLocked: boolean }) {
  const logs = useDesk((s) => s.agentLogs);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-3xl tracking-tight text-fg">The crew</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Seven seats. Pulse runs once per calendar day. Scout, Allocator, Builder, and Closer run when you ask.
          Counsel and Ledger do not freelance — they constrain every other run.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {AGENTS.map((a) => {
          const log = logs[a.id];
          return (
            <Card key={a.id} className="flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-2xl text-fg">{a.name}</p>
                  <Badge className="mt-2" tone="line">
                    {a.role}
                  </Badge>
                </div>
                {a.runnable ? (
                  <RunAgentDialog
                    agent={a.id}
                    dailyLock={a.id === "pulse"}
                    disabled={a.id === "pulse" && pulseLocked}
                    size="sm"
                    label={a.id === "pulse" && pulseLocked ? "Filed" : "Run"}
                  />
                ) : (
                  <Badge>Standing</Badge>
                )}
              </div>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{a.brief}</p>
              <p className="mt-4 font-mono text-[11px] text-faint">
                {log?.lastNote ? log.lastNote : "No filing yet"}
              </p>
            </Card>
          );
        })}
      </div>

      <div>
        <h3 className="font-serif text-2xl text-fg">Counsel rails</h3>
        <p className="mt-2 mb-4 max-w-xl text-sm text-muted">
          These are attached to every model run. If a briefing fights them, throw the briefing out.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {COUNSEL_RAILS.map((r) => (
            <div key={r.title} className="rounded-3xl bg-bg-elevated px-5 py-4 shadow-[var(--shadow-border)]">
              <p className="text-sm font-medium text-fg">{r.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{r.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
