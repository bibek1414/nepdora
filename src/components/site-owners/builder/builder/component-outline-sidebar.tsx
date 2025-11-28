"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";
import { useUpdateComponentOrderMutation } from "@/hooks/owner-site/components/use-unified";
import { ComponentResponse } from "@/types/owner-site/components/components";

interface ComponentOutlineSidebarProps {
  currentPageSlug: string;
  components: ComponentResponse[];
}

const typeToLabel: Record<string, string> = {
  hero: "Hero",
  about: "About",
  products: "Products",
  category: "Categories",
  subcategory: "Subcategories",
  blog: "Blog",
  services: "Services",
  contact: "Contact",
  appointment: "Appointment",
  team: "Team",
  testimonials: "Testimonials",
  faq: "FAQ",
  cta: "CTA",
  portfolio: "Portfolio",
  banner: "Banner",
  newsletter: "Newsletter",
  youtube: "YouTube",
  gallery: "Gallery",
  policies: "Policies",
  pricing: "Pricing",
  text_editor: "Text Editor",
};

export const ComponentOutlineSidebar: React.FC<
  ComponentOutlineSidebarProps
> = ({ currentPageSlug, components }) => {
  const ordered = useMemo(
    () => [...components].sort((a, b) => (a.order || 0) - (b.order || 0)),
    [components]
  );
  const [localItems, setLocalItems] = useState<ComponentResponse[]>(ordered);
  React.useEffect(() => {
    setLocalItems(ordered);
  }, [ordered]);

  const updateOrderMutation = useUpdateComponentOrderMutation(currentPageSlug);

  const commitOrder = useCallback(
    (items: ComponentResponse[]) => {
      const orderUpdates = items.map((c, idx) => ({
        componentId: c.component_id,
        order: idx,
      }));
      updateOrderMutation.mutate({ orderUpdates });
    },
    [updateOrderMutation]
  );

  const handleReorder = useCallback(
    (from: number, to: number) => {
      const next = Array.from(localItems);
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      const normalized = next.map((c, idx) => ({ ...c, order: idx }));
      setLocalItems(normalized);
      commitOrder(normalized);
    },
    [localItems, commitOrder]
  );

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source } = result;
      if (!destination) return;
      if (destination.index === source.index) return;
      handleReorder(source.index, destination.index);
    },
    [handleReorder]
  );

  return (
    <div className="sticky top-15 right-0 z-20 h-screen w-40 shrink-0 border-l bg-white">
      <div className="flex items-center gap-2 border-b px-3 py-2 text-xs font-medium">
        <div className="leading-none">
          Components <br />
          <span className="text-muted-foreground text-[9px]">
            (Drag to place in desired position)
          </span>
        </div>
      </div>
      <div className="p-2">
        {localItems.length === 0 ? (
          <p className="text-muted-foreground px-2 py-4 text-xs">
            Add components to start arranging them here.
          </p>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="outline" type="COMPONENT">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-1 ${
                    snapshot.isDraggingOver ? "bg-blue-50/50" : ""
                  } rounded-md`}
                >
                  {localItems.map((c, index) => {
                    // Count how many components of the same type appear before this one
                    const sameTypeCount = localItems
                      .slice(0, index + 1)
                      .filter(
                        item => item.component_type === c.component_type
                      ).length;

                    // Get the base label
                    const baseLabel =
                      typeToLabel[c.component_type] || c.component_type;

                    // Add number if there are multiple components of the same type
                    const displayLabel =
                      localItems.filter(
                        item => item.component_type === c.component_type
                      ).length > 1
                        ? `${baseLabel} ${sameTypeCount}`
                        : baseLabel;

                    return (
                      <Draggable
                        key={c.component_id}
                        draggableId={c.component_id}
                        index={index}
                      >
                        {(p, s) => (
                          <div
                            ref={p.innerRef}
                            {...p.draggableProps}
                            className={`flex items-center gap-2 rounded-md bg-gray-50 p-2 text-xs transition ${
                              s.isDragging ? "ring-primary/50 ring-1" : ""
                            }`}
                          >
                            <div
                              {...p.dragHandleProps}
                              className="cursor-grab p-0.5 active:cursor-grabbing"
                              title="Drag to reorder"
                            >
                              <GripVertical className="h-3 w-3 text-gray-400" />
                            </div>
                            <span className="truncate">{displayLabel}</span>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};
