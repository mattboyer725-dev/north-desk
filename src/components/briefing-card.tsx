import { format } from "date-fns";
import { AGENTS, type PulseReport } from "@/lib/desk";
import { money } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Card } from "./ui/card";

export function BriefingCard({ report }: { report: PulseReport }) {
  const agent = AGENTS.find((a) => a.id === report.agent);
  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
            {agent?.name} · {format(new Date(report.at), "MMM d, h:mm a")}
          </p>
          <h3 className="mt-1 font-serif text-xl leading-snug text-fg">{report.headline}</h3>
        </div>
        <Badge>{agent?.role}</Badge>
      </div>
      {report.realityCheck ? (
        <p className="text-sm leading-relaxed text-muted">{report.realityCheck}</p>
      ) : null}
      {report.counselWarnings.length > 0 ? (
        <div className="rounded-2xl bg-danger/10 px-4 py-3">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-danger">Counsel</p>
          <ul className="mt-2 space-y-1 text-sm text-fg">
            {report.counselWarnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <ol className="space-y-3">
        {report.moves.map((m, i) => (
          <li key={`${m.title}-${i}`} className="rounded-2xl bg-bg-subtle px-4 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-medium text-fg">
                <span className="mr-2 font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                {m.title}
              </p>
              <p className="shrink-0 font-mono text-xs text-muted">
                {m.timebox}
                {m.capital > 0 ? ` · ${money(m.capital)}` : ""}
              </p>
            </div>
            <p className="mt-1 text-sm text-muted">{m.why}</p>
            {m.legalNote ? <p className="mt-1 text-xs text-faint">{m.legalNote}</p> : null}
          </li>
        ))}
      </ol>
      {report.body ? <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">{report.body}</p> : null}
      {report.weeklyMath ? (
        <p className="text-sm text-sage">{report.weeklyMath}</p>
      ) : null}
      {report.doNotDo.length > 0 ? (
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">Do not</p>
          <ul className="mt-2 space-y-1 text-sm text-muted">
            {report.doNotDo.map((w) => (
              <li key={w} className="pl-3 -indent-3">
                — {w}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Card>
  );
}
