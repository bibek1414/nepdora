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

  onAddSection: (position?: "above" | "below", index?: number) => void;
  onReplaceSection: (componentId: string, category?: string) => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  droppedComponents,
  navbar,
  footer,
  currentPageSlug,
  pageComponents: initialPageComponents,
  isLoading,
  error,
  onAddSection,
  onReplaceSection,
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
      // Create a new array with the reordered items
      const reorderedComponents = Array.from(pageComponents);
      const [movedComponent] = reorderedComponents.splice(sourceIndex, 1);
      reorderedComponents.splice(destinationIndex, 0, movedComponent);

      // Update the order values
      const updatedComponents = reorderedComponents.map((component, index) => ({
        ...component,
        order: index,
      }));

      // Optimistically update the UI
      setPageComponents(updatedComponents);

      // Create the order updates for the backend
      const orderUpdates = updatedComponents.map((component, index) => ({
        componentId: component.component_id,
        order: index,
      }));

      // Update the backend
      updateOrderMutation.mutate({ orderUpdates });
    },
    [pageComponents, updateOrderMutation]
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source } = result;

      // If no destination, do nothing
      if (!destination) {
        return;
      }

      // If dropped in the same position, do nothing
      if (destination.index === source.index) {
        return;
      }

      handleReorder(source.index, destination.index);
    },
    [handleReorder]
  );

  // Handle arrow button clicks
  const handleMoveUp = useCallback(
    (componentIndex: number) => {
      if (componentIndex > 0) {
        handleReorder(componentIndex, componentIndex - 1);
      }
    },
    [handleReorder]
  );

  const handleMoveDown = useCallback(
    (componentIndex: number) => {
      if (componentIndex < pageComponents.length - 1) {
        handleReorder(componentIndex, componentIndex + 1);
      }
    },
    [handleReorder, pageComponents.length]
  );

  // Handle add section above/below by delegating to parent
  const handleAddSection = useCallback(
    (position: "above" | "below", index: number) => {
      onAddSection(position, index);
    },
    [onAddSection]
  );

  // Component renderer with proper typing
  const renderComponent = (component: ComponentResponse, index: number) => {
    const type = component.component_type as keyof ComponentTypeMap;
    const config = COMPONENT_REGISTRY[type];

    if (!config) {
      console.warn(`Unknown component type: ${component.component_type}`);
      return null;
    }

    const Component = config.component;

    // Common props for builder mode
    const commonProps = {
      key: `${component.component_type}-${component.id}`,
      component: component,
      isEditable: true,
      siteUser: "", // siteUser not needed in builder cards for most components
      pageSlug: currentPageSlug,
      onReplace: onReplaceSection,
      onUpdate: () => {}, // Handled by individual components internally via hooks
    };

    // Specific props (empty handlers for builder mode)
    const specificProps = {
      onProductClick: () => {},
      onBlogClick: () => {},
      onServiceClick: () => {},
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
            className={`group relative scroll-mt-24 ${snapshot.isDragging ? "l z-50" : ""}`}
            style={{
              ...provided.draggableProps.style,
              ...(snapshot.isDragging && {
                // Counter the parent scale(0.7) during drag
                transform: provided.draggableProps.style?.transform
                  ? `${provided.draggableProps.style.transform}`
                  : undefined,
              }),
            }}
            onMouseEnter={() => setHoveredComponentIndex(index)}
            onMouseLeave={() => setHoveredComponentIndex(null)}
          >
            <div
              {...provided.dragHandleProps}
              className="pointer-events-none absolute inset-0"
              aria-hidden
            />

            {/* Hover Add Section Controls */}
            {isHovered && (
              <>
                {/* Add Section Above Button */}
                <div className="absolute -top-6 left-1/2 z-30 -translate-x-1/2 transform">
                  <Button
                    onClick={() => handleAddSection("above", index)}
                    variant="outline"
                    size="sm"
                    className="gap-1 border border-dashed border-blue-300 bg-white text-blue-600 shadow-sm hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Plus className="h-3 w-3" />
                    Add Section Above
                  </Button>
                </div>

                {/* Add Section Below Button */}
                <div className="absolute -bottom-6 left-1/2 z-30 -translate-x-1/2 transform">
                  <Button
                    onClick={() => handleAddSection("below", index)}
                    variant="outline"
                    size="sm"
                    className="gap-1 border border-dashed border-blue-300 bg-white text-blue-600 shadow-sm hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Plus className="h-3 w-3" />
                    Add Section Below
                  </Button>
                </div>
              </>
            )}

            {/* Control buttons container */}
            <div className="absolute top-2 -left-12 z-20 flex flex-col gap-1">
              {/* Arrow controls */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={isFirst}
                  className={`rounded border bg-white p-1 shadow-md transition-colors ${
                    isFirst
                      ? "cursor-not-allowed text-gray-300"
                      : "cursor-pointer text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                  title={isFirst ? "Already at top" : "Move up"}
                >
                  <ChevronUp className="h-4 w-4" />
                </button>

                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={isLastComponent}
                  className={`rounded border bg-white p-1 shadow-md transition-colors ${
                    isLastComponent
                      ? "cursor-not-allowed text-gray-300"
                      : "cursor-pointer text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                  title={isLastComponent ? "Already at bottom" : "Move down"}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Component wrapper with visual feedback */}
            <div
              className={`transition-all duration-150 ${
                snapshot.isDragging
                  ? "scale-[0.5] rounded-xl shadow-2xl ring-4 ring-blue-500"
                  : "rounded-lg hover:ring-2 hover:ring-gray-300"
              }`}
            >
              {componentElement}
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  return (
    <div className="rounded-lg border-2 border-dashed bg-white transition-colors">
      {/* Navbar Section */}
      {navbar ? (
        <div className="group relative mb-4 border-b">
          <NavbarComponent
            navbar={navbar}
            siteUser=""
            onReplace={category => onReplaceSection("navbar", category)}
          />
        </div>
      ) : null}

      {/* Main Content Area with Drag and Drop */}
      <div className="min-h-[400px]">
        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <span className="text-muted-foreground ml-2 text-sm">
              Loading components...
            </span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="mx-8 my-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">
              Error loading components: {error.message || "Unknown error"}
            </p>
          </div>
        )}

        {/* Draggable Components */}
        {!isLoading && pageComponents.length > 0 && (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="page-components" type="COMPONENT">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`space-y-8 py-4 ${
                    snapshot.isDraggingOver ? "bg-blue-50" : ""
                  } transition-colors duration-200`}
                >
                  {pageComponents.map((component, index) => (
                    <React.Fragment key={component.component_id}>
                      {/* Render the component */}
                      {renderComponent(component, index)}
                    </React.Fragment>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        {/* Empty state */}
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
      {footer ? (
        <div className="group relative border-t">
          <FooterComponent
            footer={footer}
            isEditable={true}
            siteUser=""
            onReplace={() => onReplaceSection(footer.id, "footer-sections")}
          />
        </div>
      ) : null}
    </div>
  );
};
