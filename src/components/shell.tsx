import { format } from "date-fns";
import { BookOpen, Compass, LayoutGrid, Radio, Scale, Users, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";
import { useDesk } from "@/lib/store";
import { cn, money, todayKey } from "@/lib/utils";
import { CommandView } from "./command-view";
import { CrewView } from "./crew-view";
import { DuelView } from "./duel-view";
import { LedgerView } from "./ledger-view";
import { Mark } from "./mark";
import { PipelineView } from "./pipeline-view";
import { PlaybooksView } from "./playbooks-view";
import { PulseView } from "./pulse-view";

const VIEWS = [
  { id: "command", label: "Floor", icon: Compass },
  { id: "crew", label: "Crew", icon: Users },
  { id: "board", label: "Board", icon: LayoutGrid },
  { id: "lanes", label: "Lanes", icon: BookOpen },
  { id: "cash", label: "Cash", icon: Wallet },
  { id: "pulse", label: "Pulse", icon: Radio },
  { id: "duel", label: "Duel", icon: Scale },
] as const;

type ViewId = (typeof VIEWS)[number]["id"];

export function Shell() {
  const [view, setView] = useState<ViewId>("command");
  const cash = useDesk((s) => s.cash);
  const lastPulseDate = useDesk((s) => s.lastPulseDate);
  const pulseLocked = lastPulseDate === todayKey();

  useEffect(() => {
    void useDesk.persist.rehydrate();
  }, []);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          className: "!bg-bg-elevated !text-fg !border-line !rounded-2xl",
        }}
      />
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Mark className="size-8" />
            <div>
              <p className="font-serif text-lg leading-none tracking-tight">North Desk</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted">Legal income operations</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs tabular-nums text-muted" suppressHydrationWarning>
              {format(new Date(), "EEE d MMM yyyy")}
            </p>
            <p className="mt-1 font-mono text-xs tabular-nums text-fg">{money(cash)} on hand</p>
          </div>
        </div>
        <div className="masthead-rule" />
        <nav className="mx-auto hidden max-w-5xl gap-1 px-4 py-2 sm:flex sm:px-6" aria-label="Desk">
          {VIEWS.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setView(v.id)}
              className={cn(
                "h-11 rounded-full px-3 text-sm transition-[background-color,color] duration-150",
                view === v.id ? "bg-bg-subtle text-fg" : "text-muted hover:text-fg",
              )}
            >
              {v.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-28 pt-6 sm:px-6 sm:pb-16">
        {view === "command" && <CommandView pulseLocked={pulseLocked} />}
        {view === "crew" && <CrewView pulseLocked={pulseLocked} />}
        {view === "board" && <PipelineView />}
        {view === "lanes" && <PlaybooksView />}
        {view === "cash" && <LedgerView />}
        {view === "pulse" && <PulseView pulseLocked={pulseLocked} />}
        {view === "duel" && <DuelView />}
        <p className="mt-10 max-w-2xl text-xs leading-relaxed text-faint">
          North Desk is an operations tool, not a broker, law firm, or CPA. It does not guarantee income. Markets can
          lose money. Do not treat filings as investment, legal, or tax advice. Original work only. Disclose
          affiliates. Pay your taxes.
        </p>
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/95 pb-[env(safe-area-inset-bottom)] sm:hidden"
        aria-label="Mobile desk"
      >
        <div className="grid grid-cols-7">
          {VIEWS.map((v) => {
            const Icon = v.icon;
            const on = view === v.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setView(v.id)}
                className={cn(
                  "flex h-14 flex-col items-center justify-center gap-0.5 text-[9px] uppercase tracking-wide",
                  on ? "text-fg" : "text-muted",
                )}
              >
                <Icon className="size-4" />
                {v.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
