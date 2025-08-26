"use client";

import React from "react";
import { useDrop } from "react-dnd";
import { NavbarComponent } from "@/components/site-owners/navbar/navbar-component";
import { Footer as FooterComponent } from "@/components/site-owners/footer/footer";
import { HeroComponent } from "@/components/site-owners/hero/hero-component";
import { AboutUsComponent } from "@/components/site-owners/about/about-component";
import { ProductsComponent } from "@/components/site-owners/products/products-component";
import { Navbar } from "@/types/owner-site/components/navbar";
import { Footer } from "@/types/owner-site/components/footer";
import { HeroComponentData } from "@/types/owner-site/components/hero";
import { AboutUsComponentData } from "@/types/owner-site/components/about";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import { useDeleteNavbarMutation } from "@/hooks/owner-site/components/use-navbar";
import { useDeleteFooterMutation } from "@/hooks/owner-site/components/use-footer";
import { usePageComponentsQuery } from "@/hooks/owner-site/components/use-hero";
import {
  Plus,
  Navigation,
  Edit,
  X,
  FileText,
  Sparkles,
  Info,
  ShoppingBag,
} from "lucide-react";
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
  onAddAboutUs?: () => void;
  onAddProducts?: () => void;
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
  onAddAboutUs,
  onAddProducts,
}) => {
  const deleteNavbarMutation = useDeleteNavbarMutation();
  const deleteFooterMutation = useDeleteFooterMutation();

  // Fetch all components for the current page
  const {
    data: pageComponentsResponse,
    isLoading,
    error,
  } = usePageComponentsQuery(currentPageSlug);

  // Process all page components
  const pageComponents = React.useMemo(() => {
    if (!pageComponentsResponse) {
      console.log("No page components response");
      return [];
    }

    console.log("Full API Response:", pageComponentsResponse);

    // Get components array from the response
    let components = [];

    // Handle different possible response structures
    if (Array.isArray(pageComponentsResponse.data)) {
      components = pageComponentsResponse.data;
    } else if (Array.isArray(pageComponentsResponse.components)) {
      components = pageComponentsResponse.components;
    } else if (Array.isArray(pageComponentsResponse)) {
      components = pageComponentsResponse;
    } else {
      console.log("Unexpected response structure:", pageComponentsResponse);
      return [];
    }

    console.log("Raw components from API:", components);

    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredComponents = components.filter((component: any) => {
      const hasValidType =
        component.component_type &&
        ["hero", "about", "products"].includes(component.component_type);
      const hasValidData = component && component.data;
      const hasValidId = component && typeof component.id !== "undefined";

      console.log("Component filtering:", {
        id: component?.id,
        component_type: component?.component_type,
        hasData: !!component?.data,
        isValid: hasValidType && hasValidData && hasValidId,
      });

      return hasValidType && hasValidData && hasValidId;
    });

    // Transform to match expected interface structure
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedComponents = filteredComponents.map((component: any) => {
      console.log("Transforming component:", {
        original: component,
        data: component.data,
        type: component.component_type,
      });

      return {
        id: component.id,
        component_id: component.component_id,
        component_type: component.component_type,
        data: component.data,
        type: component.component_type,
        order: component.order || 0,
        page: component.page,
      };
    });

    console.log("Transformed page components:", transformedComponents);
    return transformedComponents;
  }, [pageComponentsResponse]);

  console.log("Page Components Debug:", {
    pageComponentsResponse,
    pageComponents,
    pageComponentsLength: pageComponents.length,
    currentPageSlug,
    isLoading,
    error,
  });

  // Check for specific component types
  const hasHero = pageComponents.some(c => c.component_type === "hero");
  const hasAbout = pageComponents.some(c => c.component_type === "about");
  const hasProducts = pageComponents.some(c => c.component_type === "products");

  const handleDeleteNavbar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navbar?.id) {
      deleteNavbarMutation.mutate(navbar.id);
    }
  };

  // Component renderer
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderComponent = (component: any) => {
    switch (component.component_type) {
      case "hero":
        return (
          <HeroComponent
            key={`hero-${component.id}`}
            component={component as HeroComponentData}
            isEditable={true}
            pageSlug={currentPageSlug}
          />
        );
      case "about":
        return (
          <AboutUsComponent
            key={`about-${component.id}`}
            component={component as AboutUsComponentData}
            isEditable={true}
            pageSlug={currentPageSlug}
          />
        );
      case "products":
        return (
          <ProductsComponent
            key={`products-${component.id}`}
            component={component as ProductsComponentData}
            isEditable={true}
            siteId={undefined}
            pageSlug={currentPageSlug}
            onUpdate={(componentId, newData) => {
              console.log("Products component updated:", componentId, newData);
              // Handle component update here
            }}
            onProductClick={(productId, order) => {
              console.log("Product clicked:", productId, order);
              // Handle product click in builder mode
            }}
          />
        );
      default:
        return null;
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
          <NavbarComponent navbar={navbar} siteId="" />
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
        {/* Loading state for components */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
            <span className="text-muted-foreground ml-2 text-sm">
              Loading components...
            </span>
          </div>
        )}

        {/* Error state for components */}
        {error && (
          <div className="mx-8 my-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">
              Error loading components: {error.message || "Unknown error"}
            </p>
          </div>
        )}

        {/* Render all sorted components */}
        {!isLoading && pageComponents.length > 0 && (
          <div className="space-y-0">
            {pageComponents
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map(renderComponent)}
          </div>
        )}

        {/* Content area for placeholders and interactions */}
        <div className="p-8">
          {/* Show hero placeholder if no hero components and navbar exists */}
          {!isLoading &&
            !hasHero &&
            navbar &&
            pageComponents.length === 0 &&
            droppedComponents.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center py-20 text-center">
                <div className="bg-primary/10 mb-4 rounded-full p-6">
                  <Sparkles className="text-primary h-12 w-12" />
                </div>
                <h3 className="text-foreground mb-2 text-xl font-semibold">
                  Add Your First Hero Section
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Create an engaging hero section to welcome your visitors and
                  showcase what you offer.
                </p>
                {onAddHero && (
                  <Button onClick={onAddHero} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Hero Section
                  </Button>
                )}
              </div>
            )}

          {/* Show about us placeholder if hero exists but no about */}
          {!isLoading &&
            hasHero &&
            !hasAbout &&
            !hasProducts &&
            onAddAboutUs && (
              <div className="py-20 text-center">
                <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-4">
                  <Info className="text-primary h-8 w-8" />
                </div>
                <h4 className="text-foreground mb-2 text-lg font-semibold">
                  Tell Your Story
                </h4>
                <p className="text-muted-foreground mx-auto mb-4 max-w-xs text-sm">
                  Add an &quot;About Us&quot; section to introduce your company
                  to visitors.
                </p>
                <div className="flex justify-center gap-2">
                  <Button onClick={onAddAboutUs} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add About Us
                  </Button>
                  {onAddProducts && (
                    <Button
                      onClick={onAddProducts}
                      variant="outline"
                      className="gap-2"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add Products
                    </Button>
                  )}
                </div>
              </div>
            )}

          {/* Show products placeholder if hero and about exist but no products */}
          {!isLoading &&
            hasHero &&
            hasAbout &&
            !hasProducts &&
            onAddProducts && (
              <div className="py-20 text-center">
                <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-4">
                  <ShoppingBag className="text-primary h-8 w-8" />
                </div>
                <h4 className="text-foreground mb-2 text-lg font-semibold">
                  Showcase Your Products
                </h4>
                <p className="text-muted-foreground mx-auto mb-4 max-w-xs text-sm">
                  Display your products in an attractive grid or list layout to
                  attract customers.
                </p>
                <Button onClick={onAddProducts} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Products Section
                </Button>
              </div>
            )}

          {/* Show general start building message if no navbar */}
          {!isLoading &&
            !navbar &&
            pageComponents.length === 0 &&
            droppedComponents.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center py-20 text-center">
                <div className="bg-primary/10 mb-4 rounded-full p-6">
                  <Sparkles className="text-primary h-12 w-12" />
                </div>
                <h3 className="text-foreground mb-2 text-xl font-semibold">
                  Start Building Your Site
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Add a navbar first, then create a compelling hero section to
                  capture your visitors&apos; attention.
                </p>
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
          {(pageComponents.length > 0 || droppedComponents.length > 0) && (
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
