"use client";

import React from "react";
import { useDrop } from "react-dnd";
import { NavbarComponent } from "@/components/site-owners/navbar/navbar-component";
import { Navbar } from "@/types/owner-site/components/navbar";
import { Plus, Navigation, Edit, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteNavbarMutation } from "@/hooks/owner-site/components/navbar";

interface CanvasAreaProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  droppedComponents: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDrop: (item: any, position: { x: number; y: number }) => void;
  navbar?: Navbar | null;
  onAddNavbar: () => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  droppedComponents,
  onDrop,
  navbar,
  onAddNavbar,
}) => {
  const deleteNavbarMutation = useDeleteNavbarMutation();

  const handleDeleteNavbar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navbar?.id) {
      deleteNavbarMutation.mutate(navbar.id);
    }
  };
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "component",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    drop: (item: any, monitor) => {
      const clientOffset = monitor.getClientOffset();
      if (clientOffset) {
        onDrop(item, { x: clientOffset.x, y: clientOffset.y });
      }
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = isOver && canDrop;

  return (
    <div
      className={`min-h-[600px] rounded-lg border-2 border-dashed bg-white transition-colors ${
        isActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
      }`}
    >
      {/* Navbar Section */}
      {navbar ? (
        <div className="group relative border-b">
          {/* NavbarComponent now handles its own editing UI */}
          <NavbarComponent navbar={navbar} />
          {/* Keep a simple delete button on the outside for clarity */}
          <div className="absolute -top-2 -right-2 z-20 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              onClick={handleDeleteNavbar}
              variant="destructive"
              size="sm"
              className="h-8 w-8 p-0"
              disabled={deleteNavbarMutation.isPending}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-b border-dashed border-gray-300 bg-gray-50/50">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-4">
                <Navigation className="text-primary h-8 w-8" />
              </div>
              <h4 className="text-foreground mb-2 text-lg font-semibold">
                Add a Navigation Bar
              </h4>
              <p className="text-muted-foreground mb-4 max-w-xs text-sm">
                Every website needs navigation. Start with a professional navbar
                template.
              </p>
              <Button onClick={onAddNavbar} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Navbar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Canvas Content Area (Code remains the same) */}
      <div className="min-h-[400px] p-8">
        {droppedComponents.length === 0 && navbar && (
          <div className="flex h-full flex-col items-center justify-center py-20 text-center">
            <div className="bg-primary/10 mb-4 rounded-full p-6">
              <Plus className="text-primary h-12 w-12" />
            </div>
            <h3 className="text-foreground mb-2 text-xl font-semibold">
              Continue Building Your Site
            </h3>
            <p className="text-muted-foreground max-w-md">
              Great! You have a navbar. Now drag components from the sidebar to
              add content to your page.
            </p>
          </div>
        )}

        {droppedComponents.length === 0 && !navbar && (
          <div className="flex h-full flex-col items-center justify-center py-20 text-center">
            <div className="bg-primary/10 mb-4 rounded-full p-6">
              <Plus className="text-primary h-12 w-12" />
            </div>
            <h3 className="text-foreground mb-2 text-xl font-semibold">
              Start Building Your Site
            </h3>
            <p className="text-muted-foreground max-w-md">
              Add a navbar first, then drag components from the sidebar to build
              your website.
            </p>
          </div>
        )}

        {droppedComponents
          .filter(c => c.type !== "navbar")
          .map(component => (
            <div
              key={component.id}
              className="mb-4 rounded-lg border border-dashed border-gray-300 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-foreground font-medium">
                  Component: {component.type}
                </p>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
          ))}

        {/* Drop zone indicator */}
        {(droppedComponents.length > 0 || navbar) && (
          <div
            className={`mt-8 rounded-lg border-2 border-dashed p-8 transition-colors ${
              isActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25"
            }`}
          >
            <div className="text-muted-foreground text-center">
              <Plus className="mx-auto mb-2 h-8 w-8" />
              <p>Drop components here to add them to your page</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
