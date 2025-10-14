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
import { AboutUsComponent } from "@/components/site-owners/builder/about/about-component";
import { ProductsComponent } from "@/components/site-owners/builder/products/products-component";
import { CategoryComponent } from "@/components/site-owners/builder/category/category-component";
import { SubCategoryComponent } from "@/components/site-owners/builder/sub-category/sub-category-component";
import { BlogComponent } from "@/components/site-owners/builder/blog/blog-components";
import { ServicesComponent } from "@/components/site-owners/builder/services/services-component";
import { TeamComponent } from "@/components/site-owners/builder/team-member/team-component";
import { ContactComponent } from "@/components/site-owners/builder/contact/contact-component";
import { TestimonialsComponent } from "@/components/site-owners/builder/testimonials/testimonial-component";
import { FAQComponent } from "@/components/site-owners/builder/faq/faq-component";
import { PortfolioComponent } from "@/components/site-owners/builder/portfolio/portfolio-component";
import { NewsletterComponent } from "@/components/site-owners/builder/newsletter/newsletter-component";
import { PlaceholderManager } from "@/components/ui/content-placeholder";
import { Navbar } from "@/types/owner-site/components/navbar";
import { Footer } from "@/types/owner-site/components/footer";
import { ComponentResponse } from "@/types/owner-site/components/components";
import { HeroComponentData } from "@/types/owner-site/components/hero";
import { AboutUsComponentData } from "@/types/owner-site/components/about";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import { CategoryComponentData } from "@/types/owner-site/components/category";
import { SubCategoryComponentData } from "@/types/owner-site/components/sub-category";
import { BlogComponentData } from "@/types/owner-site/components/blog";
import { ServicesComponentData } from "@/types/owner-site/components/services";
import { TeamComponentData } from "@/types/owner-site/components/team";
import { ContactComponentData } from "@/types/owner-site/components/contact";
import { TestimonialsComponentData } from "@/types/owner-site/components/testimonials";
import { FAQComponentData } from "@/types/owner-site/components/faq";
import { PortfolioComponentData } from "@/types/owner-site/components/portfolio";
import { NewsletterComponentData } from "@/types/owner-site/components/newsletter";
import { useUpdateComponentOrderMutation } from "@/hooks/owner-site/components/unified";
import { BannerComponentData } from "@/types/owner-site/components/banner";
import { BannerComponent } from "@/components/site-owners/builder/banner/banner-component";
import { YouTubeComponent } from "@/components/site-owners/builder/youtube/youtube-component";
import { YouTubeComponentData } from "@/types/owner-site/components/youtube";
import {
  Plus,
  Navigation,
  GripVertical,
  FileText,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { Button } from "@/components/ui/site-owners/button";

interface CanvasAreaProps {
  droppedComponents: ComponentResponse[];
  navbar?: Navbar | null;
  onAddNavbar: () => void;
  footer?: Footer | null;
  onAddFooter: () => void;
  currentPageId: number | string;
  pageComponents: ComponentResponse[];
  isLoading: boolean;
  error: Error | null;
  onAddHero?: () => void;
  onAddAboutUs?: () => void;
  onAddProducts?: () => void;
  onAddCategories?: () => void;
  onAddSubCategories?: () => void;
  onAddBlog?: () => void;
  onAddServices?: () => void;
  onAddContact?: () => void;
  onAddTeam?: () => void;
  onAddTestimonials?: () => void;
  onAddFAQ?: () => void;
  onAddPortfolio?: () => void;
  onAddBanner?: () => void;
  onAddNewsletter?: () => void;
  onAddYouTube?: () => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  droppedComponents,
  navbar,
  onAddNavbar,
  footer,
  onAddFooter,
  currentPageId,
  pageComponents: initialPageComponents,
  isLoading,
  error,
  onAddHero,
  onAddAboutUs,
  onAddProducts,
  onAddCategories,
  onAddSubCategories,
  onAddBlog,
  onAddServices,
  onAddContact,
  onAddTeam,
  onAddTestimonials,
  onAddFAQ,
}) => {
  // Local state to manage component order optimistically
  const [pageComponents, setPageComponents] = useState<ComponentResponse[]>(
    initialPageComponents.sort((a, b) => (a.order || 0) - (b.order || 0))
  );
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
  const updateOrderMutation = useUpdateComponentOrderMutation(currentPageId);

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
        id: component.id,
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

  // Component renderer with proper typing
  const renderComponent = (component: ComponentResponse, index: number) => {
    const commonProps = {
      isEditable: true,
      pageId: currentPageId,
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
      case "about":
        componentElement = (
          <AboutUsComponent
            key={`about-${component.id}`}
            component={component as AboutUsComponentData}
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
      case "youtube":
        componentElement = (
          <YouTubeComponent
            key={`youtube-${component.id}`}
            component={component as YouTubeComponentData}
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
        return (
          <BannerComponent
            key={`banner-${component.id}`}
            component={component as BannerComponentData}
            siteUser=""
            {...commonProps}
          />
        );
      default:
        return null;
    }

    const isFirst = index === 0;
    const isLast = index === pageComponents.length - 1;

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
            className={`group relative ${
              snapshot.isDragging ? "opacity-75 shadow-2xl" : ""
            }`}
          >
            {/* Control buttons container */}
            <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
              {/* Drag handle */}
              <div
                {...provided.dragHandleProps}
                className="cursor-grab rounded border bg-white p-1 shadow-md transition-colors hover:bg-gray-50 active:cursor-grabbing"
                title="Drag to reorder"
              >
                <GripVertical className="h-4 w-4 text-gray-500" />
              </div>

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
                  disabled={isLast}
                  className={`rounded border bg-white p-1 shadow-md transition-colors ${
                    isLast
                      ? "cursor-not-allowed text-gray-300"
                      : "cursor-pointer text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                  title={isLast ? "Already at bottom" : "Move down"}
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Component wrapper with visual feedback */}
            <div
              className={`transition-all duration-200 ${
                snapshot.isDragging
                  ? "rounded-lg ring-2 ring-blue-500 ring-offset-2"
                  : "rounded-lg hover:ring-1 hover:ring-gray-300 hover:ring-offset-1"
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
  const hasTeam = pageComponents.some(c => c.component_type === "team");
  const hasTestimonials = pageComponents.some(
    c => c.component_type === "testimonials"
  );
  const hasFAQ = pageComponents.some(c => c.component_type === "faq");
  const hasNewsletter = pageComponents.some(
    c => c.component_type === "newsletter"
  );

  return (
    <div className="rounded-lg border-2 border-dashed bg-white transition-colors">
      {/* Navbar Section */}
      {navbar ? (
        <div className="group relative mb-4 border-b">
          <NavbarComponent navbar={navbar} siteUser="" />
        </div>
      ) : (
        <div className="border-b border-dashed border-gray-300 bg-gray-50/50">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="mx-auto mb-4 w-fit rounded-full bg-gray-100 p-4">
                <Navigation
                  className="h-8 w-8"
                  style={{
                    color: theme.colors.primary,
                  }}
                />
              </div>
              <h4 className="text-foreground mb-2 text-lg font-semibold">
                Add a Navigation Bar
              </h4>
              <p className="text-muted-foreground mb-4 max-w-xs text-sm">
                Every website needs navigation. Start with a professional navbar
                template.
              </p>
              <Button onClick={onAddNavbar} variant="default" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Navbar
              </Button>
            </div>
          </div>
        </div>
      )}

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
                  className={`space-y-0 ${
                    snapshot.isDraggingOver ? "bg-blue-50" : ""
                  } transition-colors duration-200`}
                >
                  {pageComponents.map((component, index) =>
                    renderComponent(component, index)
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}

        {/* Content area for placeholders and interactions */}
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
            onAddHero={onAddHero}
            onAddAboutUs={onAddAboutUs}
            onAddTeam={onAddTeam}
            onAddTestimonials={onAddTestimonials}
            onAddProducts={onAddProducts}
            onAddCategories={onAddCategories}
            onAddSubCategories={onAddSubCategories}
            onAddBlog={onAddBlog}
            onAddContact={onAddContact}
            onAddFAQ={onAddFAQ}
          />

          {/* Other Components (existing dropped components) */}
          {droppedComponents.map(component => (
            <div
              key={component.id}
              className="mb-4 rounded-lg border border-dashed border-gray-300 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-foreground font-medium">
                  Component: {component.component_type}
                </p>
              </div>
            </div>
          ))}
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
              <div className="mx-auto mb-4 w-fit rounded-full bg-gray-100 p-4">
                <FileText
                  className="h-8 w-8"
                  style={{
                    color: theme.colors.primary,
                  }}
                />
              </div>
              <h4 className="text-foreground mb-2 text-lg font-semibold">
                Add a Footer
              </h4>
              <p className="text-muted-foreground mb-4 max-w-xs text-sm">
                Finish your page with a professional footer to provide essential
                links.
              </p>
              <Button onClick={onAddFooter} variant="default" className="gap-2">
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
