"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { toast } from "sonner";
import { KanbanColumn } from "@/components/shared/kanban";
import {
  OpportunityCard,
  OpportunityCardOverlay,
} from "@/components/sales-marketing/opportunities/opportunity-card";
import {
  OPPORTUNITY_STAGES,
  STAGE_LABELS,
  computeColumnStats,
  formatOppCurrency,
  type OpportunityStage,
  type SmwOpportunity,
} from "@/lib/mock-data/smw-opportunities";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

type Props = {
  opportunities: SmwOpportunity[];
  onView: (opp: SmwOpportunity) => void;
  onMoveStage: (id: string, stage: OpportunityStage) => void;
};

export function OpportunityKanban({ opportunities, onView, onMoveStage }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [wonDialog, setWonDialog] = useState<{ id: string; opp: SmwOpportunity } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const activeOpp = useMemo(
    () => (activeId ? opportunities.find((o) => o.id === activeId) : null),
    [activeId, opportunities],
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const oppId = String(active.id);
    const targetStage = String(over.id) as OpportunityStage;
    const opp = opportunities.find((o) => o.id === oppId);
    if (!opp || opp.stage === targetStage) return;

    if (targetStage === "won") {
      setWonDialog({ id: oppId, opp });
      return;
    }
    if ((opp.stage === "won" || opp.stage === "lost") && targetStage !== opp.stage) {
      toast.error("Confirm stage change from closed deal on the 360 page");
      return;
    }

    onMoveStage(oppId, targetStage);
    toast.success(`Moved to ${STAGE_LABELS[targetStage]}`);
  };

  const confirmWon = () => {
    if (!wonDialog) return;
    onMoveStage(wonDialog.id, "won");
    toast.success("Deal marked as won");
    setWonDialog(null);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 overflow-x-auto pb-2">
          {OPPORTUNITY_STAGES.map((stage) => {
            const items = opportunities.filter((o) => o.stage === stage.id);
            const stats = computeColumnStats(opportunities, stage.id);
            const subtitle = `${stats.count} · ${formatOppCurrency(stats.sum)} · W ${formatOppCurrency(stats.weighted)}`;
            const noDragOut = stage.id === "won" || stage.id === "lost";

            return (
              <KanbanColumn key={stage.id} id={stage.id} title={stage.label} subtitle={subtitle}>
                {items.length === 0 ? (
                  <p className="py-6 text-center text-[11px] text-muted-foreground">No deals</p>
                ) : (
                  items.map((opp) => (
                    <OpportunityCard
                      key={opp.id}
                      opportunity={opp}
                      onView={onView}
                      onMoveStage={onMoveStage}
                      dragDisabled={noDragOut && opp.stage === stage.id}
                    />
                  ))
                )}
              </KanbanColumn>
            );
          })}
        </div>

        <DragOverlay dropAnimation={null}>
          {activeOpp ? <OpportunityCardOverlay opportunity={activeOpp} /> : null}
        </DragOverlay>
      </DndContext>

      <Sheet open={!!wonDialog} onOpenChange={(open) => !open && setWonDialog(null)}>
        <SheetContent side="right" className="max-w-sm">
          <h2 className="text-lg font-semibold">Mark deal as won?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {wonDialog?.opp.accountName} — {formatOppCurrency(wonDialog?.opp.amount ?? 0)} at{" "}
            {wonDialog?.opp.probability}% probability.
          </p>
          <div className="mt-6 flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setWonDialog(null)}>
              Cancel
            </Button>
            <Button type="button" className="flex-1" onClick={confirmWon}>
              Confirm won
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
