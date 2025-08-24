"use client";

import React from "react";
import { useDrop } from "react-dnd";
import { NavbarComponent } from "@/components/site-owners/navbar/navbar-component";
import { Footer as FooterComponent } from "@/components/site-owners/footer/footer";
import { HeroComponent } from "@/components/site-owners/hero/hero-component";
import { Navbar } from "@/types/owner-site/components/navbar";
import { Footer } from "@/types/owner-site/components/footer";
import { HeroComponentData } from "@/types/owner-site/components/hero";
import { useDeleteNavbarMutation } from "@/hooks/owner-site/components/navbar";
import { useDeleteFooterMutation } from "@/hooks/owner-site/components/footer";
import { usePageComponentsQuery } from "@/hooks/owner-site/components/hero";
import { Plus, Navigation, Edit, X, FileText, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CanvasAreaProps {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  droppedComponents: any[];
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDrop: (item: any, position: { x: number; y: number }) => void;
  navbar?: Navbar | null;
  onAddNavbar: () => void;
  footer?: Footer | null;
  onAddFooter: () => void;
  currentPageSlug: string;
  onAddHero?: () => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  droppedComponents,
  onDrop,
  navbar,
  onAddNavbar,
  footer,
  onAddFooter,
  currentPageSlug,
  onAddHero,
}) => {
  const deleteNavbarMutation = useDeleteNavbarMutation();
  const deleteFooterMutation = useDeleteFooterMutation();

  // Fetch hero components for the current page
  const {
    data: heroComponentsResponse,
    isLoading: isHeroLoading,
    error: heroError,
  } = usePageComponentsQuery(currentPageSlug);

  // Simplified hero components extraction
  const heroComponents = React.useMemo(() => {
    if (!heroComponentsResponse) {
      console.log("No hero components response");
      return [];
    }

    console.log("Full API Response:", heroComponentsResponse);

    // Get components array from the response
    let components = [];

    // Handle different possible response structures
    if (Array.isArray(heroComponentsResponse.data)) {
      components = heroComponentsResponse.data;
    } else if (Array.isArray(heroComponentsResponse.components)) {
      components = heroComponentsResponse.components;
    } else if (Array.isArray(heroComponentsResponse)) {
      components = heroComponentsResponse;
    } else {
      console.log("Unexpected response structure:", heroComponentsResponse);
      return [];
    }

    console.log("Raw components from API:", components);

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredComponents = components.filter((component: any) => {
      const isHeroType = component.component_type === "hero";
      const hasValidData = component && component.data;
      const hasValidId = component && typeof component.id !== "undefined";

      console.log("Component filtering:", {
        id: component?.id,
        component_type: component?.component_type,
        hasData: !!component?.data,
        isValid: isHeroType && hasValidData && hasValidId,
      });

      return isHeroType && hasValidData && hasValidId;
    });

    // Transform to match expected interface structure
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedComponents = filteredComponents.map((component: any) => {
      console.log("Transforming component:", {
        original: component,
        data: component.data,
        template: component.data?.template,
      });

      return {
        id: component.id,
        component_id: component.component_id,
        component_type: component.component_type,
        data: component.data,
        type: "hero" as const,
        order: component.order || 0,
        page: component.page,
      };
    });

    console.log("Transformed hero components:", transformedComponents);
    return transformedComponents;
  }, [heroComponentsResponse]);

  console.log("Hero Components Debug:", {
    heroComponentsResponse,
    heroComponents,
    heroComponentsLength: heroComponents.length,
    currentPageSlug,
    isHeroLoading,
    heroError,
  });

  const handleDeleteNavbar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navbar?.id) {
      deleteNavbarMutation.mutate(navbar.id);
    }
  };

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "component",
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          <NavbarComponent navbar={navbar} />
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

      {/* Main Content Area */}
      <div className="min-h-[400px]">
        {/* Loading state for hero components */}
        {isHeroLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <span className="text-muted-foreground ml-2 text-sm">
              Loading components...
            </span>
          </div>
        )}

        {/* Error state for hero components */}
        {heroError && (
          <div className="mx-8 my-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">
              Error loading hero components:{" "}
              {heroError.message || "Unknown error"}
            </p>
          </div>
        )}

        {/* Hero Components Section */}
        {!isHeroLoading && heroComponents.length > 0 && (
          <div className="space-y-0">
            {heroComponents
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((heroComponent: HeroComponentData, index: number) => {
                console.log("Rendering hero component:", {
                  id: heroComponent.id,
                  index,
                  data: heroComponent.data,
                  template: heroComponent.data?.template,
                });

                // Ensure the component has valid data before rendering
                if (!heroComponent.data) {
                  console.error("Hero component missing data:", heroComponent);
                  return null;
                }

                return (
                  <div
                    key={`hero-${heroComponent.id}-${index}`}
                    className="mb-0"
                  >
                    <HeroComponent
                      component={heroComponent}
                      isEditable={true}
                      pageSlug={currentPageSlug}
                    />
                  </div>
                );
              })}
          </div>
        )}

        {/* Content area for other components and interactions */}
        <div className="p-8">
          {/* Show hero placeholder if no hero components and no other content */}
          {!isHeroLoading &&
            heroComponents.length === 0 &&
            droppedComponents.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center py-20 text-center">
                <div className="bg-primary/10 mb-4 rounded-full p-6">
                  <Sparkles className="text-primary h-12 w-12" />
                </div>
                <h3 className="text-foreground mb-2 text-xl font-semibold">
                  {navbar
                    ? "Add Your First Hero Section"
                    : "Start Building Your Site"}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {navbar
                    ? "Create an engaging hero section to welcome your visitors and showcase what you offer."
                    : "Add a navbar first, then create a compelling hero section to capture your visitors' attention."}
                </p>
                {navbar && onAddHero && (
                  <Button onClick={onAddHero} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Hero Section
                  </Button>
                )}
              </div>
            )}

          {/* Other Components */}
          {droppedComponents.map(component => (
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

          {/* Drop Zone Indicator */}
          {(heroComponents.length > 0 || droppedComponents.length > 0) && (
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

      {/* Footer Section */}
      {footer ? (
        <div className="group relative border-t">
          <FooterComponent
            componentId={footer.id}
            footerData={footer.data}
            style={footer.data.style}
            isEditable={true}
          />
        </div>
      ) : (
        <div className="border-t border-dashed border-gray-300 bg-gray-50/50">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-4">
                <FileText className="text-primary h-8 w-8" />
              </div>
              <h4 className="text-foreground mb-2 text-lg font-semibold">
                Add a Footer
              </h4>
              <p className="text-muted-foreground mb-4 max-w-xs text-sm">
                Finish your page with a professional footer to provide essential
                links.
              </p>
              <Button onClick={onAddFooter} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Footer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
