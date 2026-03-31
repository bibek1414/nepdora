"use client";

import React, { useState, useCallback } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { NavbarComponent } from "@/components/site-owners/builder/navbar/navbar-component";
import { Footer as FooterComponent } from "@/components/site-owners/builder/footer/footer-component";
import { PlaceholderManager } from "@/components/ui/content-placeholder";
import { Navbar } from "@/types/owner-site/components/navbar";
import { Footer } from "@/types/owner-site/components/footer";
import { ComponentResponse } from "@/types/owner-site/components/components";
import { useUpdateComponentOrderMutation } from "@/hooks/owner-site/components/use-unified";
import { Plus, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPONENT_REGISTRY } from "@/types/owner-site/components/registry";
import { ComponentTypeMap } from "@/types/owner-site/components/components";
import { CanvasSkeleton } from "./builder-skeleton";
import { cn } from "@/lib/utils";
import "./builder.css";

interface CanvasAreaProps {
  droppedComponents: ComponentResponse[];
  navbar?: Navbar | null;
  onAddNavbar: () => void;
  footer?: Footer | null;
  onAddFooter: () => void;
  currentPageSlug: string;
  pageComponents: ComponentResponse[];
  isLoading: boolean;
  error: Error | null;
  deviceMode?: 'desktop' | 'tablet' | 'mobile';

  onAddSection: (position?: "above" | "below", index?: number) => void;
  onReplaceSection: (componentId: string, category?: string) => void;
  onProductClick?: (productSlug: string, order: number) => void;
  onBlogClick?: (blogSlug: string, order: number) => void;
  onPortfolioClick?: (portfolioSlug: string, order: number) => void;
  onServiceClick?: (serviceSlug: string, order: number) => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  droppedComponents,
  navbar,
  footer,
  currentPageSlug,
  pageComponents: initialPageComponents,
  isLoading,
  error,
  deviceMode = 'desktop',
  onAddSection,
  onReplaceSection,
  onProductClick,
  onBlogClick,
  onPortfolioClick,
  onServiceClick,
}) => {
  // Local state to manage component order optimistically
  const [pageComponents, setPageComponents] = useState<ComponentResponse[]>(
    initialPageComponents.sort((a, b) => (a.order || 0) - (b.order || 0))
  );
  const [hoveredComponentIndex, setHoveredComponentIndex] = useState<
    number | null
  >(null);

  React.useEffect(() => {
    setPageComponents(
      initialPageComponents.sort((a, b) => (a.order || 0) - (b.order || 0))
    );
  }, [initialPageComponents]);

  // Hook for updating component order
  const updateOrderMutation = useUpdateComponentOrderMutation(currentPageSlug);

  // Handle component reordering (used by both drag-drop and arrows)
  const handleReorder = useCallback(
    (sourceIndex: number, destinationIndex: number) => {
      const reorderedComponents = Array.from(pageComponents);
      const [movedComponent] = reorderedComponents.splice(sourceIndex, 1);
      reorderedComponents.splice(destinationIndex, 0, movedComponent);

      const updatedComponents = reorderedComponents.map((component, index) => ({
        ...component,
        order: index,
      }));

      setPageComponents(updatedComponents);

      const orderUpdates = updatedComponents.map((component, index) => ({
        componentId: component.component_id,
        order: index,
      }));

      updateOrderMutation.mutate({ orderUpdates });
    },
    [pageComponents, updateOrderMutation]
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source } = result;
      if (!destination || destination.index === source.index) return;
      handleReorder(source.index, destination.index);
    },
    [handleReorder]
  );

  // Handle arrow button clicks
  const handleMoveUp = useCallback(
    (componentIndex: number) => {
      if (componentIndex > 0) handleReorder(componentIndex, componentIndex - 1);
    },
    [handleReorder]
  );

  const handleMoveDown = useCallback(
    (componentIndex: number) => {
      if (componentIndex < pageComponents.length - 1) handleReorder(componentIndex, componentIndex + 1);
    },
    [handleReorder, pageComponents.length]
  );

  const handleAddSection = useCallback(
    (position: "above" | "below", index: number) => {
      onAddSection(position, index);
    },
    [onAddSection]
  );

  const renderComponent = (component: ComponentResponse, index: number) => {
    const type = component.component_type as keyof ComponentTypeMap;
    const config = COMPONENT_REGISTRY[type];

    if (!config) {
      console.warn(`Unknown component type: ${component.component_type}`);
      return null;
    }

    const Component = config.component;
    const commonProps = {
      key: `${component.component_type}-${component.id}`,
      component: component,
      isEditable: true,
      siteUser: "",
      pageSlug: currentPageSlug,
      onReplace: onReplaceSection,
      onUpdate: () => {},
    };

    const specificProps = {
      onProductClick: onProductClick || (() => {}),
      onBlogClick: onBlogClick || (() => {}),
      onServiceClick: onServiceClick || (() => {}),
      onPortfolioClick: onPortfolioClick || (() => {}),
      onCategoryClick: () => {},
      onSubCategoryClick: () => {},
      onMemberClick: () => {},
      onPricingClick: () => {},
      onTestimonialClick: () => {},
    };

    const componentElement = <Component {...commonProps} {...specificProps} />;
    const isFirst = index === 0;
    const isLastComponent = index === pageComponents.length - 1;
    const isHovered = hoveredComponentIndex === index;

    return (
      <Draggable
        key={component.component_id}
        draggableId={component.component_id}
        index={index}
      >
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            id={component.component_id}
            className={cn(
              "group relative scroll-mt-24 transition-all duration-200",
              snapshot.isDragging && "z-50"
            )}
            style={provided.draggableProps.style}
            onMouseEnter={() => setHoveredComponentIndex(index)}
            onMouseLeave={() => setHoveredComponentIndex(null)}
          >
            <div
              {...provided.dragHandleProps}
              className="pointer-events-none absolute inset-0"
              aria-hidden
            />

            {/* Section Label */}
            <div className={cn(
              "builder-section-label transition-all duration-200 opacity-0 group-hover:opacity-100",
              isHovered && "bg-blue-50/50 opacity-100"
            )}
            onClick={() => handleAddSection("above", index)}
            >
              ☰ {COMPONENT_REGISTRY[type]?.displayName || type} section — click to edit
            </div>

            {/* Hover Add Section Controls */}
            {isHovered && !snapshot.isDragging && (
              <>
                <div className="absolute -top-6 left-1/2 z-30 -translate-x-1/2 transform">
                  <Button
                    onClick={() => handleAddSection("above", index)}
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 border border-dashed border-blue-300 bg-white text-[11px] text-blue-600 shadow-sm hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Plus className="h-3 w-3" />
                    Add Above
                  </Button>
                </div>
                <div className="absolute -bottom-6 left-1/2 z-30 -translate-x-1/2 transform">
                  <Button
                    onClick={() => handleAddSection("below", index)}
                    variant="outline"
                    size="sm"
                    className="h-7 gap-1 border border-dashed border-blue-300 bg-white text-[11px] text-blue-600 shadow-sm hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Plus className="h-3 w-3" />
                    Add Below
                  </Button>
                </div>
              </>
            )}

            {/* Control buttons container */}
            <div className="absolute top-10 -left-12 z-20 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={isFirst}
                  className={cn(
                    "rounded border bg-white p-1 shadow-sm transition-colors",
                    isFirst ? "cursor-not-allowed text-gray-200" : "cursor-pointer text-gray-500 hover:bg-gray-50 hover:text-builder-accent"
                  )}
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={isLastComponent}
                  className={cn(
                    "rounded border bg-white p-1 shadow-sm transition-colors",
                    isLastComponent ? "cursor-not-allowed text-gray-200" : "cursor-pointer text-gray-500 hover:bg-gray-50 hover:text-builder-accent"
                  )}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Component wrapper */}
            <div className={cn(
              "transition-all duration-150 rounded-md overflow-hidden",
              snapshot.isDragging ? "ring-4 ring-blue-500/50" : "hover:ring-2 hover:ring-builder-accent/20"
            )}>
              {componentElement}
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <div className="builder-canvas-wrapper scrollbar-hide">
      <div className={cn(
        "builder-canvas-frame min-h-screen",
        deviceMode === 'tablet' && "tablet",
        deviceMode === 'mobile' && "mobile"
      )}>
        {/* Site Preview Nav */}
        {navbar && (
          <div className="border-b bg-white">
            <NavbarComponent
              navbar={navbar}
              siteUser=""
              onReplace={category => onReplaceSection("navbar", category)}
            />
          </div>
        )}

        {/* Main Content Area */}
        <div className="min-h-[400px] bg-white">
          {isLoading && <CanvasSkeleton />}
          {error && (
            <div className="mx-8 my-4 rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm text-red-600">
                Error loading components: {error.message || "Unknown error"}
              </p>
            </div>
          )}
          {!isLoading && pageComponents.length > 0 && (
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="page-components" type="COMPONENT">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "transition-colors duration-200",
                      snapshot.isDraggingOver ? "bg-blue-50/30" : ""
                    )}
                  >
                    {pageComponents.map((component, index) => (
                      <React.Fragment key={component.component_id}>
                        {renderComponent(component, index)}
                      </React.Fragment>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
          {!isLoading && pageComponents.length === 0 && (
            <div className="p-8">
              <PlaceholderManager
                isLoading={isLoading}
                pageComponentsLength={pageComponents.length}
                onAddSection={() => handleAddSection("below", 0)}
              />
            </div>
          )}
        </div>

        {/* Footer Section */}
        {footer && (
          <div className="border-t bg-white">
            <FooterComponent
              footer={footer}
              isEditable={true}
              siteUser=""
              onReplace={() => onReplaceSection(footer.id, "footer-sections")}
            />
          </div>
        )}
      </div>
    </div>
  );
};
