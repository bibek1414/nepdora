"use client";

import React from "react";
import { useDrop } from "react-dnd";
import { NavbarComponent } from "@/components/site-owners/navbar/navbar-component";
import { Footer as FooterComponent } from "@/components/site-owners/footer/footer";
import { HeroComponent } from "@/components/site-owners/hero/hero-component";
import { AboutUsComponent } from "@/components/site-owners/about/about-component";
import { ProductsComponent } from "@/components/site-owners/products/products-component";
import { BlogComponent } from "@/components/site-owners/blog/blog-components";
import { TeamComponent } from "@/components/site-owners/team-member/team-component";
import { Navbar } from "@/types/owner-site/components/navbar";
import { Footer } from "@/types/owner-site/components/footer";
import { HeroComponentData } from "@/types/owner-site/components/hero";
import { AboutUsComponentData } from "@/types/owner-site/components/about";
import { ProductsComponentData } from "@/types/owner-site/components/products";
import { BlogComponentData } from "@/types/owner-site/components/blog";
import { TeamComponentData } from "@/types/owner-site/components/team";
import { useDeleteNavbarMutation } from "@/hooks/owner-site/components/use-navbar";
import { useDeleteFooterMutation } from "@/hooks/owner-site/components/use-footer";
import { usePageComponentsQuery } from "@/hooks/owner-site/components/unified";
import {
  ComponentResponse,
  ComponentTypeMap,
} from "@/types/owner-site/components/components";
import {
  Plus,
  Navigation,
  Edit,
  X,
  FileText,
  Sparkles,
  Info,
  ShoppingBag,
  Rss,
  Mail,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactComponent } from "@/components/site-owners/contact/contact-component";
import { ContactComponentData } from "@/types/owner-site/components/contact";

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
  onAddBlog?: () => void;
  onAddContact?: () => void;
  onAddTeam?: () => void;
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
  onAddBlog,
  onAddContact,
  onAddTeam,
}) => {
  const deleteNavbarMutation = useDeleteNavbarMutation();
  const deleteFooterMutation = useDeleteFooterMutation();

  // Fetch all components for the current page using the unified hook
  const {
    data: pageComponentsResponse,
    isLoading,
    error,
  } = usePageComponentsQuery(currentPageSlug);

  // Process all page components with proper typing
  const pageComponents = React.useMemo(() => {
    if (!pageComponentsResponse) {
      console.log("No page components response");
      return [];
    }

    console.log("Full API Response:", pageComponentsResponse);

    // Get components array from the response
    let components: ComponentResponse[] = [];

    // Handle different possible response structures with proper type checking
    if (Array.isArray(pageComponentsResponse)) {
      components = pageComponentsResponse as ComponentResponse[];
    } else {
      const apiResponse = pageComponentsResponse as ApiResponse;
      if (Array.isArray(apiResponse.data)) {
        components = apiResponse.data;
      } else if (Array.isArray(apiResponse.components)) {
        components = apiResponse.components;
      } else {
        console.log("Unexpected response structure:", pageComponentsResponse);
        return [];
      }
    }

    console.log("Raw components from API:", components);

    const filteredComponents = components.filter(
      (component: ComponentResponse) => {
        const hasValidType =
          component.component_type &&
          ["hero", "about", "products", "blog", "contact", "team"].includes(
            component.component_type
          );
        const hasValidData = component && component.data;
        const hasValidId = component && typeof component.id !== "undefined";

        console.log("Component filtering:", {
          id: component?.id,
          component_type: component?.component_type,
          hasData: !!component?.data,
          isValid: hasValidType && hasValidData && hasValidId,
        });

        return hasValidType && hasValidData && hasValidId;
      }
    );

    // Transform to match expected interface structure
    const transformedComponents = filteredComponents.map(
      (component: ComponentResponse) => {
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
      }
    );

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
  const hasHero = pageComponents.some(
    component => component.component_type === "hero"
  );
  const hasAbout = pageComponents.some(
    component => component.component_type === "about"
  );
  const hasProducts = pageComponents.some(
    component => component.component_type === "products"
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
            onUpdate={(componentId: string, newData: ProductsComponentData) => {
              console.log("Products component updated:", componentId, newData);
              // Handle component update here
            }}
            onProductClick={(productId: number, order: number) => {
              console.log("Product clicked:", productId, order);
              // Handle product click in builder mode
            }}
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
            onUpdate={(componentId: string, newData: BlogComponentData) => {
              console.log("Blog component updated:", componentId, newData);
            }}
            onBlogClick={(blogSlug: string, order: number) => {
              console.log("Blog clicked:", blogSlug, order);
            }}
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
            onUpdate={(componentId: string, newData: ContactComponentData) => {
              console.log("Contact component updated:", componentId, newData);
            }}
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
            onUpdate={(componentId: string, newData: TeamComponentData) => {
              console.log("Team component updated:", componentId, newData);
            }}
            onMemberClick={(memberId: number, order: number) => {
              console.log("Team member clicked:", memberId, order);
            }}
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
            !hasBlog &&
            !hasTeam && (
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
                  {onAddTeam && (
                    <Button
                      onClick={onAddTeam}
                      variant="outline"
                      className="gap-2"
                    >
                      <Users className="h-4 w-4" />
                      Add Team
                    </Button>
                  )}
                  {onAddBlog && (
                    <Button
                      onClick={onAddBlog}
                      variant="outline"
                      className="gap-2"
                    >
                      <Rss className="h-4 w-4" />
                      Add Blog
                    </Button>
                  )}
                  {onAddContact && (
                    <Button
                      onClick={onAddContact}
                      variant="outline"
                      className="gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Add Contact
                    </Button>
                  )}
                </div>
              </div>
            )}

          {/* Show team placeholder after about us */}
          {!isLoading &&
            hasHero &&
            hasAbout &&
            !hasTeam &&
            !hasProducts &&
            !hasBlog &&
            onAddTeam && (
              <div className="py-20 text-center">
                <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-4">
                  <Users className="text-primary h-8 w-8" />
                </div>
                <h4 className="text-foreground mb-2 text-lg font-semibold">
                  Showcase Your Team
                </h4>
                <p className="text-muted-foreground mx-auto mb-4 max-w-xs text-sm">
                  Introduce your team members to build trust and connect with
                  your audience.
                </p>
                <div className="flex justify-center gap-2">
                  <Button onClick={onAddTeam} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Team Section
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
                  {onAddBlog && (
                    <Button
                      onClick={onAddBlog}
                      variant="outline"
                      className="gap-2"
                    >
                      <Rss className="h-4 w-4" />
                      Add Blog
                    </Button>
                  )}
                </div>
              </div>
            )}

          {/* Show products placeholder after team */}
          {!isLoading &&
            hasHero &&
            hasAbout &&
            hasTeam &&
            !hasProducts &&
            !hasBlog &&
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
                <div className="flex justify-center gap-2">
                  <Button onClick={onAddProducts} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Products Section
                  </Button>
                  {onAddBlog && (
                    <Button
                      onClick={onAddBlog}
                      variant="outline"
                      className="gap-2"
                    >
                      <Rss className="h-4 w-4" />
                      Add Blog
                    </Button>
                  )}
                </div>
              </div>
            )}

          {/* Show blog placeholder */}
          {!isLoading &&
            hasHero &&
            hasAbout &&
            hasTeam &&
            hasProducts &&
            !hasBlog &&
            onAddBlog && (
              <div className="py-20 text-center">
                <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-4">
                  <Rss className="text-primary h-8 w-8" />
                </div>
                <h4 className="text-foreground mb-2 text-lg font-semibold">
                  Share Your Stories
                </h4>
                <p className="text-muted-foreground mx-auto mb-4 max-w-xs text-sm">
                  Add a blog section to keep your audience informed and engaged.
                </p>
                <Button onClick={onAddBlog} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Blog Section
                </Button>
              </div>
            )}

          {/* Show contact placeholder */}
          {!isLoading &&
            hasHero &&
            hasAbout &&
            hasTeam &&
            hasProducts &&
            hasBlog &&
            !hasContact &&
            onAddContact && (
              <div className="py-20 text-center">
                <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-4">
                  <Mail className="text-primary h-8 w-8" />
                </div>
                <h4 className="text-foreground mb-2 text-lg font-semibold">
                  Add Contact Form
                </h4>
                <p className="text-muted-foreground mx-auto mb-4 max-w-xs text-sm">
                  Let visitors easily get in touch with you through a contact
                  form.
                </p>
                <Button onClick={onAddContact} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Contact Section
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
