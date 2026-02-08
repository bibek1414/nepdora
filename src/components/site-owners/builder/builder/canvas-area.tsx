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
import { HeroComponent } from "@/components/site-owners/builder/hero/hero-component";
import { OthersComponent } from "@/components/site-owners/builder/others/others-component";
import { AboutUsComponent } from "@/components/site-owners/builder/about/about-component";
import { ProductsComponent } from "@/components/site-owners/builder/products/products-component";
import { CategoryComponent } from "@/components/site-owners/builder/category/category-component";
import { SubCategoryComponent } from "@/components/site-owners/builder/sub-category/sub-category-component";
import { BlogComponent } from "@/components/site-owners/builder/blog/blog-components";
import { ServicesComponent } from "@/components/site-owners/builder/services/services-component";
import { TeamComponent } from "@/components/site-owners/builder/team-member/team-component";
import { ContactComponent } from "@/components/site-owners/builder/contact/contact-component";
import { AppointmentComponent } from "@/components/site-owners/builder/appointment/appointment-component";
import { TestimonialsComponent } from "@/components/site-owners/builder/testimonials/testimonial-component";
import { CTAComponent } from "@/components/site-owners/builder/cta/cta-component";
import { CTAComponentData } from "@/types/owner-site/components/cta";
import { FAQComponent } from "@/components/site-owners/builder/faq/faq-component";
import { PortfolioComponent } from "@/components/site-owners/builder/portfolio/portfolio-component";
import { NewsletterComponent } from "@/components/site-owners/builder/newsletter/newsletter-component";
import { PlaceholderManager } from "@/components/ui/content-placeholder";
import { Navbar } from "@/types/owner-site/components/navbar";
import { Footer } from "@/types/owner-site/components/footer";
import { ComponentResponse } from "@/types/owner-site/components/components";
import { HeroComponentData } from "@/types/owner-site/components/hero";
import { OthersComponentData } from "@/types/owner-site/components/others";
import { AboutUsComponentData } from "@/types/owner-site/components/about";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import { CategoryComponentData } from "@/types/owner-site/components/category";
import { SubCategoryComponentData } from "@/types/owner-site/components/sub-category";
import { BlogComponentData } from "@/types/owner-site/components/blog";
import { ServicesComponentData } from "@/types/owner-site/components/services";
import { TeamComponentData } from "@/types/owner-site/components/team";
import { ContactComponentData } from "@/types/owner-site/components/contact";
import { AppointmentComponentData } from "@/types/owner-site/components/appointment";
import { TestimonialsComponentData } from "@/types/owner-site/components/testimonials";
import { FAQComponentData } from "@/types/owner-site/components/faq";
import { PortfolioComponentData } from "@/types/owner-site/components/portfolio";
import { NewsletterComponentData } from "@/types/owner-site/components/newsletter";
import { useUpdateComponentOrderMutation } from "@/hooks/owner-site/components/use-unified";
import { BannerComponentData } from "@/types/owner-site/components/banner";
import { BannerComponent } from "@/components/site-owners/builder/banner/banner-component";
import { VidoesComponent } from "@/components/site-owners/builder/videos/videos-component";
import { VideosComponentData } from "@/types/owner-site/components/videos";
import { GalleryComponent } from "@/components/site-owners/builder/gallery/gallery-component";
import { GalleryComponentData } from "@/types/owner-site/components/gallery";
import { Plus, ChevronUp, ChevronDown } from "lucide-react";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { Button } from "@/components/ui/site-owners/button";
import { PolicyComponent } from "@/components/site-owners/builder/policies/policies-component";
import { PolicyComponentData } from "@/types/owner-site/components/policies";
import { TextEditorComponentData } from "@/types/owner-site/components/text-editor";
import { TextEditorComponent } from "@/components/site-owners/builder/text-editor/text-editor-component";
import { PricingComponent } from "@/components/site-owners/builder/pricing/pricing-component";
import { PricingComponentData } from "@/types/owner-site/components/pricing";
import { OurClientsComponent } from "@/components/site-owners/builder/our-clients/our-clients-component";
import { OurClientsComponentData } from "@/types/owner-site/components/our-client";

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
  onReplaceSection: (componentId: string) => void;
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

  const { data: themeResponse } = useThemeQuery();
  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

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
    const commonProps = {
      isEditable: true,
      pageSlug: currentPageSlug,
      onReplace: onReplaceSection,
    };

    let componentElement: React.ReactNode;

    switch (component.component_type) {
      case "hero":
        componentElement = (
          <HeroComponent
            key={`hero-${component.id}`}
            component={component as HeroComponentData}
            siteUser=""
            {...commonProps}
          />
        );
        break;
      case "others":
        componentElement = (
          <OthersComponent
            key={`others-${component.id}`}
            siteUser=""
            component={component as OthersComponentData}
            {...commonProps}
          />
        );
        break;
      case "about":
        componentElement = (
          <AboutUsComponent
            key={`about-${component.id}`}
            component={component as AboutUsComponentData}
            {...commonProps}
          />
        );
        break;
      case "gallery":
        componentElement = (
          <GalleryComponent
            key={`gallery-${component.id}`}
            component={component as GalleryComponentData}
            siteUser=""
            {...commonProps}
          />
        );
        break;
      case "products":
        componentElement = (
          <ProductsComponent
            key={`products-${component.id}`}
            component={component as ProductsComponentData}
            onUpdate={() => {}}
            onProductClick={() => {}}
            {...commonProps}
          />
        );
        break;
      case "category":
        componentElement = (
          <CategoryComponent
            key={`category-${component.id}`}
            component={component as CategoryComponentData}
            onUpdate={() => {}}
            onCategoryClick={() => {}}
            {...commonProps}
          />
        );
        break;
      case "subcategory":
        componentElement = (
          <SubCategoryComponent
            key={`subcategory-${component.id}`}
            component={component as SubCategoryComponentData}
            onUpdate={() => {}}
            onSubCategoryClick={() => {}}
            {...commonProps}
          />
        );
        break;
      case "blog":
        componentElement = (
          <BlogComponent
            key={`blog-${component.id}`}
            component={component as BlogComponentData}
            onUpdate={() => {}}
            onBlogClick={() => {}}
            {...commonProps}
          />
        );
        break;
      case "our_clients":
        componentElement = (
          <OurClientsComponent
            key={`our-clients-${component.id}`}
            component={component as OurClientsComponentData}
            onUpdate={() => {}}
            {...commonProps}
          />
        );
        break;
      case "services":
        componentElement = (
          <ServicesComponent
            key={`services-${component.id}`}
            component={component as ServicesComponentData}
            onUpdate={() => {}}
            onServiceClick={() => {}}
            {...commonProps}
          />
        );
        break;
      case "contact":
        componentElement = (
          <ContactComponent
            key={`contact-${component.id}`}
            component={component as ContactComponentData}
            onUpdate={() => {}}
            {...commonProps}
          />
        );
        break;
      case "appointment":
        componentElement = (
          <AppointmentComponent
            key={`appointment-${component.id}`}
            component={component as AppointmentComponentData}
            onUpdate={() => {}}
            {...commonProps}
          />
        );
        break;
      case "cta":
        componentElement = (
          <CTAComponent
            key={`cta-${component.id}`}
            component={component as CTAComponentData}
            siteUser=""
            {...commonProps}
          />
        );
        break;
      case "team":
        componentElement = (
          <TeamComponent
            key={`team-${component.id}`}
            component={component as TeamComponentData}
            onUpdate={() => {}}
            onMemberClick={() => {}}
            {...commonProps}
          />
        );
        break;
      case "policies":
        componentElement = (
          <PolicyComponent
            key={`policies-${component.id}`}
            component={component as PolicyComponentData}
            siteUser=""
            {...commonProps}
          />
        );
        break;
        componentElement = (
          <TextEditorComponent
            key={`text_editor-${component.id}`}
            component={component as TextEditorComponentData}
            siteUser=""
            {...commonProps}
          />
        );
        break;
      case "pricing":
        componentElement = (
          <PricingComponent
            key={`pricing-${component.id}`}
            component={component as PricingComponentData}
            onUpdate={() => {}}
            onPricingClick={() => {}}
            {...commonProps}
          />
        );
        break;
      case "our_clients":
        componentElement = (
          <OurClientsComponent
            key={`our_clients-${component.id}`}
            component={component as OurClientsComponentData}
            onUpdate={() => {}}
            {...commonProps}
          />
        );
        break;
      case "videos":
        componentElement = (
          <VidoesComponent
            key={`videos-${component.id}`}
            component={component as VideosComponentData}
            onUpdate={() => {}}
            {...commonProps}
          />
        );
        break;
      case "testimonials":
        componentElement = (
          <TestimonialsComponent
            key={`testimonials-${component.id}`}
            component={component as TestimonialsComponentData}
            onUpdate={() => {}}
            onTestimonialClick={() => {}}
            {...commonProps}
          />
        );
        break;
      case "faq":
        componentElement = (
          <FAQComponent
            key={`faq-${component.id}`}
            component={component as FAQComponentData}
            onUpdate={() => {}}
            {...commonProps}
          />
        );
        break;
      case "portfolio":
        componentElement = (
          <PortfolioComponent
            key={`portfolio-${component.id}`}
            component={component as PortfolioComponentData}
            siteUser=""
            {...commonProps}
          />
        );
        break;
      case "newsletter":
        componentElement = (
          <NewsletterComponent
            key={`newsletter-${component.id}`}
            component={component as NewsletterComponentData}
            siteUser=""
            {...commonProps}
          />
        );
        break;
      case "banner":
        componentElement = (
          <BannerComponent
            key={`banner-${component.id}`}
            component={component as BannerComponentData}
            siteUser=""
            {...commonProps}
          />
        );
        break;
      default:
        return null;
    }

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
            className={`group relative ${snapshot.isDragging ? "l z-50" : ""}`}
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

  // Calculate component statistics
  const hasHero = pageComponents.some(c => c.component_type === "hero");
  const hasOthers = pageComponents.some(c => c.component_type === "others");
  const hasAbout = pageComponents.some(c => c.component_type === "about");
  const hasProducts = pageComponents.some(c => c.component_type === "products");
  const hasCategories = pageComponents.some(
    c => c.component_type === "category"
  );
  const hasSubCategories = pageComponents.some(
    c => c.component_type === "subcategory"
  );
  const hasBlog = pageComponents.some(c => c.component_type === "blog");
  const hasServices = pageComponents.some(c => c.component_type === "services");
  const hasContact = pageComponents.some(c => c.component_type === "contact");
  const hasAppointment = pageComponents.some(
    c => c.component_type === "appointment"
  );
  const hasTeam = pageComponents.some(c => c.component_type === "team");
  const hasTestimonials = pageComponents.some(
    c => c.component_type === "testimonials"
  );
  const hasFAQ = pageComponents.some(c => c.component_type === "faq");
  const hasNewsletter = pageComponents.some(
    c => c.component_type === "newsletter"
  );
  const hasPricing = pageComponents.some(c => c.component_type === "pricing");
  const hasOurClients = pageComponents.some(
    c => c.component_type === "our_clients"
  );

  return (
    <div className="rounded-lg border-2 border-dashed bg-white transition-colors">
      {/* Navbar Section */}
      {navbar ? (
        <div className="group relative mb-4 border-b">
          <NavbarComponent navbar={navbar} siteUser="" />
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
              navbar={navbar}
              hasHero={hasHero}
              hasAbout={hasAbout}
              hasTeam={hasTeam}
              hasTestimonials={hasTestimonials}
              hasProducts={hasProducts}
              hasCategories={hasCategories}
              hasSubCategories={hasSubCategories}
              hasBlog={hasBlog}
              hasContact={hasContact}
              hasFAQ={hasFAQ}
              pageComponentsLength={pageComponents.length}
              droppedComponentsLength={droppedComponents.length}
              onAddSection={() => handleAddSection("below", 0)}
            />
          </div>
        )}
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
      ) : null}
    </div>
  );
};
