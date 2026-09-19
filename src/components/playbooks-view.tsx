import { useState } from "react";
import { PLAYBOOKS } from "@/lib/desk";
import { useDesk } from "@/lib/store";
import { uid } from "@/lib/utils";
import { toast } from "sonner";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

export function PlaybooksView() {
  const addOpportunity = useDesk((s) => s.addOpportunity);
  const [open, setOpen] = useState<string | null>(PLAYBOOKS[0].id);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-serif text-3xl tracking-tight text-fg">Legal lanes</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Seven ways to spend the seed without collecting a lawsuit. Gap-carving is the method: pick a painful job,
          ship a small original thing, sell it. GitHub is a shop floor, not a slot machine.
        </p>
      </div>
      <div className="space-y-3">
        {PLAYBOOKS.map((p) => {
          const on = open === p.id;
          return (
            <Card key={p.id} className="p-0 sm:p-0">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                onClick={() => setOpen(on ? null : p.id)}
                aria-expanded={on}
              >
                <span>
                  <span className="block font-serif text-xl text-fg">{p.name}</span>
                  <span className="mt-1 block text-xs uppercase tracking-[0.14em] text-muted">{p.lane}</span>
                </span>
                <Badge tone="line">{on ? "Open" : "Read"}</Badge>
              </button>
              {on ? (
                <div className="space-y-4 border-t border-line px-5 py-4">
                  <p className="text-sm leading-relaxed text-muted">{p.path}</p>
                  <p className="text-sm text-fg">
                    <span className="text-muted">Capital. </span>
                    {p.capital}
                  </p>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">First 48 hours</p>
                    <ol className="mt-2 space-y-1.5 text-sm text-fg">
                      {p.fortyEight.map((s, i) => (
                        <li key={s}>
                          <span className="mr-2 font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                          {s}
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">Rails</p>
                    <ul className="mt-2 space-y-1 text-sm text-muted">
                      {p.legal.map((s) => (
                        <li key={s} className="pl-3 -indent-3">
                          — {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-sm text-sage">{p.toTarget}</p>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      addOpportunity({
                        id: uid(),
                        title: p.name,
                        playbookId: p.id,
                        status: "intake",
                        thesis: p.path,
                        capitalAsk: 0,
                        weeklyLow: 0,
                        weeklyHigh: 0,
                        legalNotes: p.legal[0] ?? "",
                        nextAction: p.fortyEight[0] ?? "Start.",
                        counselCleared: false,
                      });
                      toast.success("Filed on the board as intake.");
                    }}
                  >
                    File on board
                  </Button>
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
