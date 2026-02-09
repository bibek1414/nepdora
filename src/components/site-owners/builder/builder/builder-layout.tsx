"use client";

import React, { useState, useCallback, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useRouter } from "next/navigation";
import { CanvasArea } from "@/components/site-owners/builder/builder/canvas-area";
import { TopNavigation } from "@/components/site-owners/builder/builder/top-navigation";
import { AddSectionDialog } from "@/components/site-owners/builder/builder/add-section-dialog";
import {
  useNavbarQuery,
  useCreateNavbarMutation,
  useReplaceNavbarMutation,
} from "@/hooks/owner-site/components/use-navbar";
import { NavbarData } from "@/types/owner-site/components/navbar";
import { NavbarTemplateDialog } from "@/components/site-owners/builder/navbar/navbar-template-dialog";
import { usePages } from "@/hooks/owner-site/use-page";
import { useCreatePage } from "@/hooks/owner-site/use-page";
import { Page } from "@/types/owner-site/components/page";
import {
  useFooterQuery,
  useCreateFooterMutation,
  useReplaceFooterMutation,
} from "@/hooks/owner-site/components/use-footer";
import { ComponentOutlineSidebar } from "@/components/site-owners/builder/builder/component-outline-sidebar";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ComponentResponse,
  ComponentTypeMap,
} from "@/types/owner-site/components/components";
import { PageTemplateDialog } from "@/components/site-owners/builder/templates/page-template-dialog";
import { PageTemplate } from "@/types/owner-site/components/page-template";
import {
  usePageComponentsQuery,
  useCreateComponentMutation,
  useGenericReplaceComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import { TextSelectionProvider } from "@/contexts/text-selection-context";
import { StickyFormattingToolbar } from "./sticky-formatting-toolbar";
import { useAuth } from "@/hooks/use-auth";
import { Facebook, Twitter } from "lucide-react";
import { COMPONENT_REGISTRY } from "@/types/owner-site/components/registry";

interface BuilderLayoutProps {
  params: {
    siteUser: string;
    pageSlug: string;
  };
}

export const BuilderLayout: React.FC<BuilderLayoutProps> = ({ params }) => {
  const router = useRouter();
  const { siteUser, pageSlug } = params;
  const { user } = useAuth();

  // Dialog states
  const [isAddSectionDialogOpen, setIsAddSectionDialogOpen] = useState(false);
  const [pendingInsertIndex, setPendingInsertIndex] = useState<
    number | undefined
  >(undefined);
  const [pendingCategoryFilter, setPendingCategoryFilter] = useState<
    string | undefined
  >(undefined);
  const [pendingReplaceId, setPendingReplaceId] = useState<string | null>(null);

  // Dialog states
  const [isNavbarDialogOpen, setIsNavbarDialogOpen] = useState(false);
  const [isPageTemplateDialogOpen, setIsPageTemplateDialogOpen] =
    useState(false);

  // Queries and Mutations
  const { data: navbarResponse, isLoading: isNavbarLoading } = useNavbarQuery();
  const createNavbarMutation = useCreateNavbarMutation();
  const replaceNavbarMutation = useReplaceNavbarMutation();
  const createFooterMutation = useCreateFooterMutation();
  const replaceFooterMutation = useReplaceFooterMutation();
  const { data: footerResponse, isLoading: isFooterLoading } = useFooterQuery();

  const { data: pagesData = [], isLoading: isPagesLoading } = usePages();
  const createPageMutation = useCreatePage();
  const [isCreatingHomePage, setIsCreatingHomePage] = useState(false);
  const {
    data: pageComponentsResponse,
    isLoading: isPageComponentsLoading,
    error: pageComponentsError,
  } = usePageComponentsQuery(pageSlug);

  const [droppedComponents, setDroppedComponents] = useState<
    ComponentResponse[]
  >([]);

  const currentPage = pageSlug;
  const queryClient = useQueryClient();

  // Mutations
  const createComponentMutation = useCreateComponentMutation(pageSlug);
  const replaceComponentMutation = useGenericReplaceComponentMutation(pageSlug);

  // Process page components
  const pageComponents = React.useMemo(() => {
    if (!pageComponentsResponse) return [];

    let components: ComponentResponse[] = [];

    if (Array.isArray(pageComponentsResponse)) {
      components = pageComponentsResponse as ComponentResponse[];
    } else {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiResponse = pageComponentsResponse as any;
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
          Object.keys(COMPONENT_REGISTRY).includes(component.component_type);
        const hasValidData = component && component.data;
        const hasValidId = component && typeof component.id !== "undefined";
        return hasValidType && hasValidData && hasValidId;
      }
    );

    return filteredComponents.map((component: ComponentResponse) => ({
      id: component.id,
      component_id: component.component_id,
      component_type: component.component_type,
      data: component.data,
      type: component.component_type,
      order: component.order || 0,
      page: component.page,
    }));
  }, [pageComponentsResponse]);

  // Helper function to get component display name
  const getComponentDisplayName = (componentType: string): string => {
    return (
      COMPONENT_REGISTRY[componentType as keyof ComponentTypeMap]
        ?.displayName || componentType
    );
  };

  const createComponentWithIndex = async (
    componentType: keyof ComponentTypeMap,
    data: ComponentTypeMap[keyof ComponentTypeMap],
    insertIndex?: number
  ) => {
    const displayName = getComponentDisplayName(componentType);
    const mode = pendingReplaceId ? "replace" : "add";
    const toastId = `${mode}-${componentType}-${Date.now()}`;

    try {
      toast.loading(
        `${mode === "replace" ? "Replacing" : "Adding"} ${displayName}...`,
        { id: toastId }
      );

      setIsAddSectionDialogOpen(false);
      const replaceId = pendingReplaceId;
      setPendingReplaceId(null);
      setPendingInsertIndex(undefined);

      let componentId = "";

      if (mode === "replace" && replaceId) {
        const result = await replaceComponentMutation.mutateAsync({
          componentId: replaceId,
          componentType,
          data,
          order:
            pageComponents.find(c => c.component_id === replaceId)?.order ?? 0,
        });
        componentId = result.component_id;
      } else {
        const result = await createComponentMutation.mutateAsync({
          componentType,
          data,
          insertIndex,
        });
        componentId = result.component_id;
      }

      // Scroll to the new/replaced component after a short delay to allow it to render
      if (componentId) {
        setTimeout(() => {
          const element = document.getElementById(componentId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      }

      toast.success(
        `${displayName} ${mode === "replace" ? "replaced" : "added"} successfully!`,
        { id: toastId }
      );
    } catch (error) {
      console.error(`Failed to ${mode} ${componentType} component:`, error);
      toast.error(`Failed to ${mode} ${displayName}`, { id: toastId });
    }
  };

  // Auto-create home page
  useEffect(() => {
    if (
      !isPagesLoading &&
      pagesData &&
      pagesData.length === 0 &&
      !isCreatingHomePage
    ) {
      setIsCreatingHomePage(true);
      createPageMutation.mutate(
        { title: "Home" },
        {
          onSuccess: (data: Page) => {
            setIsCreatingHomePage(false);
            if (pageSlug !== data.slug) {
              router.push(`/builder/${siteUser}/${data.slug}`);
            }
          },
          onError: error => {
            console.error("Failed to create default home page:", error);
            setIsCreatingHomePage(false);
          },
        }
      );
    }
  }, [
    pagesData,
    isPagesLoading,
    createPageMutation,
    isCreatingHomePage,
    router,
    siteUser,
    pageSlug,
  ]);

  // Validate current page exists
  useEffect(() => {
    if (pagesData && pagesData.length > 0) {
      const pageExists = pagesData.find(page => page.slug === pageSlug);
      if (!pageExists && !isCreatingHomePage) {
        const firstPage = pagesData[0];
        router.push(`/builder/${siteUser}/${firstPage.slug}`);
      }
    }
  }, [pagesData, pageSlug, router, siteUser, isCreatingHomePage]);

  const currentPageData = pagesData.find(page => page.slug === currentPage);

  // Page handlers
  const handlePageChange = (newPageSlug: string) => {
    router.push(`/builder/${siteUser}/${newPageSlug}`);
  };

  const handlePageCreated = (page: Page) => {
    router.push(`/builder/${siteUser}/${page.slug}`);
  };

  const handlePageDeleted = (deletedSlug: string) => {
    if (currentPage === deletedSlug && pagesData.length > 1) {
      const remainingPages = pagesData.filter(
        page => page.slug !== deletedSlug
      );
      if (remainingPages.length > 0) {
        router.push(`/builder/${siteUser}/${remainingPages[0].slug}`);
      }
    }
  };

  // Updated handler for Add Section that stores the insertIndex
  const handleAddSection = (position?: "above" | "below", index?: number) => {
    setPendingReplaceId(null);
    setPendingCategoryFilter(undefined);
    let insertIndex: number;

    if (index !== undefined && pageComponents[index]) {
      const currentOrder = pageComponents[index].order;
      insertIndex = position === "above" ? currentOrder : currentOrder + 1;
    } else if (pageComponents.length > 0) {
      // If index is undefined but we have components, add to the end
      const maxOrder = Math.max(...pageComponents.map(c => c.order || 0));
      insertIndex = maxOrder + 1;
    } else {
      insertIndex = 0;
    }

    setPendingInsertIndex(insertIndex);
    setIsAddSectionDialogOpen(true);
  };

  const handleReplaceSection = (componentId: string, category?: string) => {
    setPendingReplaceId(componentId);
    setPendingInsertIndex(undefined);
    setPendingCategoryFilter(category);
    setIsAddSectionDialogOpen(true);
  };

  // Navbar handlers
  const handleNavbarSelectFromDialog = (navbarData: NavbarData) => {
    const payload = {
      content: "navbar content",
      navbarData: navbarData,
      component_id: `nav-${Date.now()}`,
    };

    const toastId = "navbar-create";

    if (pendingCategoryFilter === "navbar-sections") {
      replaceNavbarMutation.mutate(payload, {
        onSuccess: () => {
          setPendingCategoryFilter(undefined);
          setPendingReplaceId(null);
        },
        onError: error => {
          toast.error("Failed to replace navbar", { id: toastId });
        },
      });
    } else {
      createNavbarMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Navbar added successfully!", { id: toastId });
        },
        onError: error => {
          toast.error("Failed to create navbar", { id: toastId });
        },
      });
    }
  };

  const handleNavbarTemplateSelect = (templateData: NavbarData) => {
    const payload = {
      content: "navbar content",
      navbarData: templateData,
      component_id: `nav-${Date.now()}`,
    };

    const toastId = "navbar-create";

    createNavbarMutation.mutate(payload, {
      onSuccess: () => {
        setIsNavbarDialogOpen(false);
        toast.success("Navbar added successfully!", { id: toastId });
      },
      onError: () => {
        toast.error("Failed to add navbar", { id: toastId });
      },
    });
  };

  const handleFooterSelectFromDialog = (
    footerStyle:
      | "style-1"
      | "style-2"
      | "style-3"
      | "style-4"
      | "style-5"
      | "style-6"
      | "style-7"
      | "style-8"
      | "style-9"
  ) => {
    const payload = {
      content: "footer content",
      footerData: {
        style: footerStyle,
        logoText: "Your Brand",
        logoType: "text" as "text" | "image" | "both",
        logoImage: "",
        companyName: "Your Brand",
        description:
          "Innovative solutions for a modern world. We build amazing experiences.",
        sections: [
          {
            id: "s1",
            title: "Company",
            links: [
              { id: "l1", text: "About Us", href: "#" },
              { id: "l2", text: "Careers", href: "#" },
            ],
          },
          {
            id: "s2",
            title: "Resources",
            links: [
              { id: "l3", text: "Blog", href: "#" },
              { id: "l4", text: "Help Center", href: "#" },
            ],
          },
        ],
        socialLinks: [
          { id: "soc1", platform: "Facebook", href: "#", icon: Facebook },
          { id: "soc2", platform: "Twitter", href: "#", icon: Twitter },
        ],
        contactInfo: {
          email: "support@yourbrand.com",
          phone: "+1 234 567 890",
        },
        newsletter: {
          enabled: true,
          title: "Join our Newsletter",
          description:
            "Get the latest news and updates delivered to your inbox.",
        },
        copyright: `© ${new Date().getFullYear()} Your Brand. All Rights Reserved.`,
      },
      component_id: `footer-${Date.now()}`,
    };

    const toastId = "footer-replace";

    if (pendingCategoryFilter === "footer-sections") {
      replaceFooterMutation.mutate(payload, {
        onSuccess: () => {
          setPendingCategoryFilter(undefined);
          setPendingReplaceId(null);
        },
        onError: error => {
          toast.error("Failed to replace footer", { id: toastId });
        },
      });
    } else {
      createFooterMutation.mutate(payload, {
        onSuccess: () => {
          toast.success("Footer added successfully!", { id: toastId });
        },
        onError: error => {
          toast.error("Failed to create footer", { id: toastId });
        },
      });
    }
  };

  // Add handler for opening CTA dialog
  const handleAddCTA = (insertIndex?: number) => {
    setPendingInsertIndex(insertIndex);
    handleTemplateSelect("cta", "cta-1");
  };

  // Generic template selection handler
  const handleTemplateSelect = async (
    type: keyof ComponentTypeMap,
    template: string
  ) => {
    const config = COMPONENT_REGISTRY[type];
    if (!config) return;

    const data = config.getDefaultData(template);
    await createComponentWithIndex(type, data, pendingInsertIndex);
  };

  // Page template handler
  const handlePageTemplateSelect = async (template: PageTemplate) => {
    const toastId = "page-template-create";

    try {
      toast.loading(`Creating ${template.name} page...`, { id: toastId });

      const newPage = await createPageMutation.mutateAsync({
        title: template.name,
      });

      for (const component of template.components) {
        await createComponentMutation.mutateAsync({
          componentType: component.type as keyof ComponentTypeMap,
          data: {
            ...component.defaultData,
            order: component.order,
          },
          insertIndex: component.order,
        });
      }

      router.push(`/builder/${siteUser}/${newPage.slug}`);
      setIsPageTemplateDialogOpen(false);
      toast.success(
        `Page "${template.name}" created successfully with ${template.components.length} components!`,
        { id: toastId }
      );
    } catch (error) {
      console.error("Failed to create page from template:", error);
      toast.error("Failed to create page from template. Please try again.", {
        id: toastId,
      });
    }
  };

  // Component click handler for Add Section Dialog
  const handleComponentClick = (sectionId: string, template?: string) => {
    if (sectionId === "page-templates") {
      setIsPageTemplateDialogOpen(true);
      return;
    }

    const sectionToType: Record<string, keyof ComponentTypeMap> = {
      "hero-sections": "hero",
      "others-sections": "others",
      "about-sections": "about",
      "cta-sections": "cta",
      "pricing-sections": "pricing",
      "products-sections": "products",
      "categories-sections": "category",
      "subcategories-sections": "subcategory",
      "services-sections": "services",
      "our-clients-sections": "our_clients",
      "contact-sections": "contact",
      "appointment-sections": "appointment",
      "team-members-sections": "team",
      "testimonials-sections": "testimonials",
      "gallery-sections": "gallery",
      "blog-sections": "blog",
      "faq-sections": "faq",
      "portfolio-sections": "portfolio",
      "banner-sections": "banner",
      "videos-sections": "videos",
      "newsletter-sections": "newsletter",
      "policies-sections": "policies",
      "text-editor-sections": "text_editor",
    };

    const type = sectionToType[sectionId];
    if (type && template) {
      handleTemplateSelect(type, template);
    }
  };

  const isLoading =
    isNavbarLoading ||
    isFooterLoading ||
    isPagesLoading ||
    isPageComponentsLoading ||
    isCreatingHomePage;

  if (isLoading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="border-primary h-32 w-32 animate-spin rounded-full border-b-2"></div>
          {isCreatingHomePage && (
            <p className="text-muted-foreground text-sm">
              Setting up your first page...
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <TextSelectionProvider>
      <DndProvider backend={HTML5Backend}>
        {/* All Dialog Components */}
        <AddSectionDialog
          open={isAddSectionDialogOpen}
          onOpenChange={isOpen => {
            setIsAddSectionDialogOpen(isOpen);
            if (!isOpen) {
              setPendingReplaceId(null);
              setPendingCategoryFilter(undefined);
            }
          }}
          onComponentClick={handleComponentClick}
          onNavbarSelect={handleNavbarSelectFromDialog}
          onFooterSelect={handleFooterSelectFromDialog}
          websiteType={user?.website_type || "ecommerce"}
          categoryFilter={pendingCategoryFilter}
        />

        <NavbarTemplateDialog
          isOpen={isNavbarDialogOpen}
          onClose={() => setIsNavbarDialogOpen(false)}
          onSelectTemplate={handleNavbarTemplateSelect}
        />

        <PageTemplateDialog
          isOpen={isPageTemplateDialogOpen}
          onClose={() => setIsPageTemplateDialogOpen(false)}
          onSelectTemplate={handlePageTemplateSelect}
        />

        {/* Top Navigation */}
        <TopNavigation
          pages={pagesData}
          currentPage={currentPage}
          siteUser={siteUser}
          onPageChange={handlePageChange}
          onPageCreated={handlePageCreated}
          onPageDeleted={handlePageDeleted}
        />

        {/* Sticky Formatting Toolbar */}
        <StickyFormattingToolbar />

        {/* Main Layout */}
        <div className="bg-background flex min-h-screen flex-col">
          <div className="flex flex-1">
            <div className="flex flex-1 flex-col">
              <div className="mt-10 flex-1 overflow-auto bg-gray-200 p-6">
                <div className="mx-auto max-w-7xl origin-top scale-75">
                  <div className="py-4">
                    <h2 className="text-foreground text-2xl font-bold capitalize">
                      {currentPageData?.title || currentPage} Page
                    </h2>
                  </div>

                  <CanvasArea
                    droppedComponents={droppedComponents}
                    navbar={navbarResponse?.data}
                    onAddNavbar={() => setIsNavbarDialogOpen(true)}
                    footer={footerResponse?.data}
                    onAddFooter={() => setIsAddSectionDialogOpen(true)}
                    currentPageSlug={currentPage}
                    pageComponents={pageComponents}
                    isLoading={isPageComponentsLoading}
                    error={pageComponentsError}
                    onAddSection={handleAddSection}
                    onReplaceSection={handleReplaceSection}
                  />
                </div>
              </div>
            </div>

            <ComponentOutlineSidebar
              currentPageSlug={currentPage}
              components={pageComponents}
            />
          </div>
        </div>
      </DndProvider>
    </TextSelectionProvider>
  );
};
