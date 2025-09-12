"use client";

import React from "react";
import { NavbarComponent } from "@/components/site-owners/builder/navbar/navbar-component";
import { Footer as FooterComponent } from "@/components/site-owners/builder/footer/footer";
import { HeroComponent } from "@/components/site-owners/builder/hero/hero-component";
import { AboutUsComponent } from "@/components/site-owners/builder/about/about-component";
import { ProductsComponent } from "@/components/site-owners/builder/products/products-component";
import { CategoryComponent } from "@/components/site-owners/builder/category/category-component";
import { SubCategoryComponent } from "@/components/site-owners/builder/sub-category/sub-category-component";
import { BlogComponent } from "@/components/site-owners/builder/blog/blog-components";
import { TeamComponent } from "@/components/site-owners/builder/team-member/team-component";
import { ContactComponent } from "@/components/site-owners/builder/contact/contact-component";
import { TestimonialsComponent } from "@/components/site-owners/builder/testimonials/testimonial-component";
import { PlaceholderManager } from "@/components/ui/content-placeholder";
import { Navbar } from "@/types/owner-site/components/navbar";
import { Footer } from "@/types/owner-site/components/footer";
import { HeroComponentData } from "@/types/owner-site/components/hero";
import { AboutUsComponentData } from "@/types/owner-site/components/about";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import { CategoryComponentData } from "@/types/owner-site/components/category";
import { SubCategoryComponentData } from "@/types/owner-site/components/sub-category";
import { BlogComponentData } from "@/types/owner-site/components/blog";
import { TeamComponentData } from "@/types/owner-site/components/team";
import { ContactComponentData } from "@/types/owner-site/components/contact";
import { TestimonialsComponentData } from "@/types/owner-site/components/testimonials";
import { useDeleteNavbarMutation } from "@/hooks/owner-site/components/use-navbar";
import { usePageComponentsQuery } from "@/hooks/owner-site/components/unified";
import { ComponentResponse } from "@/types/owner-site/components/components";
import { Plus, Navigation, Edit, X, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FAQComponent } from "@/components/site-owners/builder/faq/faq-component";
import { FAQComponentData } from "@/types/owner-site/components/faq";

// Define proper types for API responses
interface ApiResponse {
  data?: ComponentResponse[];
  components?: ComponentResponse[];
}

interface CanvasAreaProps {
  droppedComponents: ComponentResponse[];
  navbar?: Navbar | null;
  onAddNavbar: () => void;
  footer?: Footer | null;
  onAddFooter: () => void;
  currentPageSlug: string;
  onAddHero?: () => void;
  onAddAboutUs?: () => void;
  onAddProducts?: () => void;
  onAddCategories?: () => void;
  onAddSubCategories?: () => void;
  onAddBlog?: () => void;
  onAddContact?: () => void;
  onAddTeam?: () => void;
  onAddTestimonials?: () => void;
  onAddFAQ?: () => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  droppedComponents,
  navbar,
  onAddNavbar,
  footer,
  onAddFooter,
  currentPageSlug,
  onAddHero,
  onAddAboutUs,
  onAddProducts,
  onAddCategories,
  onAddSubCategories,
  onAddBlog,
  onAddContact,
  onAddTeam,
  onAddTestimonials,
  onAddFAQ,
}) => {
  const deleteNavbarMutation = useDeleteNavbarMutation();

  // Fetch all components for the current page using the unified hook
  const {
    data: pageComponentsResponse,
    isLoading,
    error,
  } = usePageComponentsQuery(currentPageSlug);

  // Process all page components with proper typing
  const pageComponents = React.useMemo(() => {
    if (!pageComponentsResponse) return [];

    let components: ComponentResponse[] = [];

    if (Array.isArray(pageComponentsResponse)) {
      components = pageComponentsResponse as ComponentResponse[];
    } else {
      const apiResponse = pageComponentsResponse as ApiResponse;
      if (Array.isArray(apiResponse.data)) {
        components = apiResponse.data;
      } else if (Array.isArray(apiResponse.components)) {
        components = apiResponse.components;
      } else {
        return [];
      }
    }

    const filteredComponents = components.filter(
      (component: ComponentResponse) => {
        const hasValidType =
          component.component_type &&
          [
            "hero",
            "about",
            "products",
            "category",
            "subcategory",
            "blog",
            "contact",
            "team",
            "testimonials",
            "faq",
          ].includes(component.component_type);
        const hasValidData = component && component.data;
        const hasValidId = component && typeof component.id !== "undefined";
        return hasValidType && hasValidData && hasValidId;
      }
    );

    const transformedComponents = filteredComponents.map(
      (component: ComponentResponse) => ({
        id: component.id,
        component_id: component.component_id,
        component_type: component.component_type,
        data: component.data,
        type: component.component_type,
        order: component.order || 0,
        page: component.page,
      })
    );

    return transformedComponents;
  }, [pageComponentsResponse]);

  // Check for specific component types
  const hasHero = pageComponents.some(
    component => component.component_type === "hero"
  );
  const hasAbout = pageComponents.some(
    component => component.component_type === "about"
  );
  const hasProducts = pageComponents.some(
    component => component.component_type === "products"
  );
  const hasCategories = pageComponents.some(
    component => component.component_type === "category"
  );
  const hasSubCategories = pageComponents.some(
    component => component.component_type === "subcategory"
  );
  const hasBlog = pageComponents.some(
    component => component.component_type === "blog"
  );
  const hasContact = pageComponents.some(
    component => component.component_type === "contact"
  );
  const hasTeam = pageComponents.some(
    component => component.component_type === "team"
  );
  const hasTestimonials = pageComponents.some(
    component => component.component_type === "testimonials"
  );
  const hasFAQ = pageComponents.some(
    component => component.component_type === "faq"
  );

  const handleDeleteNavbar = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navbar?.id) {
      deleteNavbarMutation.mutate(navbar.id);
    }
  };

  // Component renderer with proper typing
  const renderComponent = (component: ComponentResponse) => {
    switch (component.component_type) {
      case "hero":
        return (
          <HeroComponent
            key={`hero-${component.id}`}
            component={component as HeroComponentData}
            isEditable={true}
            siteUser=""
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
            onUpdate={(
              _componentId: string,
              _newData: ProductsComponentData
            ) => {}}
            onProductClick={(_productId: number, _order: number) => {}}
          />
        );
      case "category":
        return (
          <CategoryComponent
            key={`category-${component.id}`}
            component={component as CategoryComponentData}
            isEditable={true}
            siteId={undefined}
            pageSlug={currentPageSlug}
            onUpdate={(
              _componentId: string,
              _newData: CategoryComponentData
            ) => {}}
            onCategoryClick={(_categoryId: number, _order: number) => {}}
          />
        );
      case "subcategory":
        return (
          <SubCategoryComponent
            key={`subcategory-${component.id}`}
            component={component as SubCategoryComponentData}
            isEditable={true}
            siteId={undefined}
            pageSlug={currentPageSlug}
            onUpdate={(
              _componentId: string,
              _newData: SubCategoryComponentData
            ) => {}}
            onSubCategoryClick={(_subCategoryId: number, _order: number) => {}}
          />
        );
      case "blog":
        return (
          <BlogComponent
            key={`blog-${component.id}`}
            component={component as BlogComponentData}
            isEditable={true}
            siteId={undefined}
            pageSlug={currentPageSlug}
            onUpdate={(_componentId: string, _newData: BlogComponentData) => {}}
            onBlogClick={(_blogSlug: string, _order: number) => {}}
          />
        );
      case "contact":
        return (
          <ContactComponent
            key={`contact-${component.id}`}
            component={component as ContactComponentData}
            isEditable={true}
            siteId={undefined}
            pageSlug={currentPageSlug}
            onUpdate={(
              _componentId: string,
              _newData: ContactComponentData
            ) => {}}
          />
        );
      case "team":
        return (
          <TeamComponent
            key={`team-${component.id}`}
            component={component as TeamComponentData}
            isEditable={true}
            siteId={undefined}
            pageSlug={currentPageSlug}
            onUpdate={(_componentId: string, _newData: TeamComponentData) => {}}
            onMemberClick={(_memberId: number, _order: number) => {}}
          />
        );
      case "testimonials":
        return (
          <TestimonialsComponent
            key={`testimonials-${component.id}`}
            component={component as TestimonialsComponentData}
            isEditable={true}
            siteId={undefined}
            pageSlug={currentPageSlug}
            onUpdate={(
              _componentId: string,
              _newData: TestimonialsComponentData
            ) => {}}
            onTestimonialClick={(_testimonialId: number, _order: number) => {}}
          />
        );
      case "faq":
        return (
          <FAQComponent
            key={`faq-${component.id}`}
            component={component as FAQComponentData}
            isEditable={true}
            siteId={undefined}
            pageSlug={currentPageSlug}
            onUpdate={(_componentId: string, _newData: FAQComponentData) => {}}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border-2 border-dashed bg-white transition-colors">
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
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
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
