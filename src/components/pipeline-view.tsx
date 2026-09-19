import { useMemo, useState } from "react";
import { PLAYBOOKS, STATUS_LABEL, type Opportunity, type OpportunityStatus } from "@/lib/desk";
import { useDesk } from "@/lib/store";
import { money, uid } from "@/lib/utils";
import { RunAgentDialog } from "./run-agent-dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Dialog, DialogContent } from "./ui/dialog";
import { Input, Label, Textarea } from "./ui/input";

const STATUSES: OpportunityStatus[] = ["intake", "counsel", "building", "live", "earning", "killed"];

function toneFor(s: OpportunityStatus) {
  if (s === "earning" || s === "live") return "sage" as const;
  if (s === "killed") return "danger" as const;
  if (s === "counsel") return "warn" as const;
  return "default" as const;
}

export function PipelineView() {
  const opportunities = useDesk((s) => s.opportunities);
  const setStatus = useDesk((s) => s.setStatus);
  const addOpportunity = useDesk((s) => s.addOpportunity);
  const updateOpportunity = useDesk((s) => s.updateOpportunity);
  const [filter, setFilter] = useState<OpportunityStatus | "all">("all");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    playbookId: PLAYBOOKS[0].id,
    thesis: "",
    nextAction: "",
    capitalAsk: "0",
  });

  const visible = useMemo(
    () => opportunities.filter((o) => (filter === "all" ? true : o.status === filter)),
    [opportunities, filter],
  );

  function submit() {
    if (!draft.title.trim()) return;
    addOpportunity({
      id: uid(),
      title: draft.title.trim(),
      playbookId: draft.playbookId,
      status: "intake",
      thesis: draft.thesis.trim() || "Operator-filed. Awaiting counsel.",
      capitalAsk: Number(draft.capitalAsk) || 0,
      weeklyLow: 0,
      weeklyHigh: 0,
      legalNotes: "Must clear Counsel before Building.",
      nextAction: draft.nextAction.trim() || "Run Counsel by moving to Counsel, then Building only if it survives.",
      counselCleared: false,
    });
    setDraft({ title: "", playbookId: PLAYBOOKS[0].id, thesis: "", nextAction: "", capitalAsk: "0" });
    setOpen(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-3xl tracking-tight text-fg">Board</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">
            Nothing goes Live until Counsel has cleared it. Kill anything that smells like a cloned brand, a yield
            promise, or unlicensed advice.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <RunAgentDialog agent="scout" label="Run Scout" size="sm" />
          <Button size="sm" onClick={() => setOpen(true)}>
            New item
          </Button>
        </div>
      </div>

      <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
        {(["all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`h-11 shrink-0 rounded-full px-3 text-xs font-medium uppercase tracking-wide transition-[background-color,color] duration-150 ${
              filter === s ? "bg-accent text-accent-fg" : "text-muted hover:text-fg"
            }`}
          >
            {s === "all" ? "All" : STATUS_LABEL[s]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {visible.length === 0 ? (
          <Card>
            <p className="text-sm text-muted">Nothing in this column. File an item or run Scout.</p>
          </Card>
        ) : (
          visible.map((o) => (
            <OppCard
              key={o.id}
              o={o}
              onStatus={(s) => setStatus(o.id, s)}
              onPatch={(p) => updateOpportunity(o.id, p)}
            />
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title="New board item">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={draft.title}
            onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            placeholder="One-line offer"
          />
          <div className="mt-3">
            <Label htmlFor="book">Playbook</Label>
            <select
              id="book"
              value={draft.playbookId}
              onChange={(e) => setDraft((d) => ({ ...d, playbookId: e.target.value }))}
              className="h-11 w-full rounded-xl bg-bg-subtle px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none"
            >
              {PLAYBOOKS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-3">
            <Label htmlFor="thesis">Thesis</Label>
            <Textarea
              id="thesis"
              value={draft.thesis}
              onChange={(e) => setDraft((d) => ({ ...d, thesis: e.target.value }))}
            />
          </div>
          <div className="mt-3">
            <Label htmlFor="cap">Capital ask (USD)</Label>
            <Input
              id="cap"
              inputMode="decimal"
              value={draft.capitalAsk}
              onChange={(e) => setDraft((d) => ({ ...d, capitalAsk: e.target.value }))}
            />
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={!draft.title.trim()}>
              File
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OppCard({
  o,
  onStatus,
  onPatch,
}: {
  o: Opportunity;
  onStatus: (s: OpportunityStatus) => void;
  onPatch: (p: Partial<Opportunity>) => void;
}) {
  const book = PLAYBOOKS.find((p) => p.id === o.playbookId);
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={toneFor(o.status)}>{STATUS_LABEL[o.status]}</Badge>
            <span className="text-xs text-faint">{book?.name}</span>
          </div>
          <h3 className="mt-2 font-serif text-xl leading-snug text-fg">{o.title}</h3>
        </div>
        <select
          aria-label="Status"
          value={o.status}
          onChange={(e) => onStatus(e.target.value as OpportunityStatus)}
          className="h-11 rounded-xl bg-bg-subtle px-3 text-sm text-fg shadow-[var(--shadow-border)]"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s} disabled={s === "building" && !o.counselCleared && o.status === "intake"}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{o.thesis}</p>
      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-[11px] uppercase tracking-[0.14em] text-faint">Ask</dt>
          <dd className="font-mono tabular-nums text-fg">{money(o.capitalAsk)}</dd>
        </div>
        <div>
          <dt className="text-[11px] uppercase tracking-[0.14em] text-faint">Honest weekly</dt>
          <dd className="font-mono tabular-nums text-fg">
            {money(o.weeklyLow)}–{money(o.weeklyHigh)}
          </dd>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <dt className="text-[11px] uppercase tracking-[0.14em] text-faint">Next</dt>
          <dd className="text-fg">{o.nextAction}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-faint">{o.legalNotes}</p>
      {o.plan ? <p className="mt-3 whitespace-pre-wrap text-sm text-muted">{o.plan}</p> : null}
      {o.offer ? <p className="mt-3 whitespace-pre-wrap text-sm text-muted">{o.offer}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {o.status === "counsel" || o.status === "intake" ? (
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              onPatch({
                status: "building",
                counselCleared: true,
                nextAction: "Ship the 48-hour definition of done.",
              })
            }
          >
            Counsel clears
          </Button>
        ) : null}
        <RunAgentDialog agent="builder" focusTitle={o.title} label="Builder" size="sm" />
        <RunAgentDialog agent="closer" focusTitle={o.title} label="Closer" size="sm" />
        {o.status !== "killed" ? (
          <Button size="sm" variant="ghost" onClick={() => onStatus("killed")}>
            Kill
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
