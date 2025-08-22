"use client";

import React, { useState, useCallback, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { CanvasArea } from "@/components/site-owners/builder/canvas-area";
import { TopNavigation } from "@/components/site-owners/builder/top-navigation";
import { ComponentSidebar } from "@/components/site-owners/builder/component-sidebar";
import {
  useNavbarQuery,
  useCreateNavbarMutation,
} from "@/hooks/owner-site/components/navbar";
import { NavbarData } from "@/types/owner-site/components/navbar";
import { NavbarTemplateDialog } from "@/components/site-owners/navbar/navbar-template-dialog";
import { usePages } from "@/hooks/owner-site/page";
import { useCreatePage } from "@/hooks/owner-site/page";
import { Page } from "@/types/owner-site/components/page";
import {
  useFooterQuery,
  useCreateFooterMutation,
} from "@/hooks/owner-site/components/footer";
import { FooterData } from "@/types/owner-site/components/footer";
import { FooterStylesDialog } from "@/components/site-owners/footer/footer-styles-dialog";
import { Facebook, Twitter } from "lucide-react";

interface Component {
  id: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

interface BuilderLayoutProps {
  params: {
    siteUser: string;
  };
}

export const BuilderLayout: React.FC<BuilderLayoutProps> = ({ params }) => {
  const { data: navbarResponse, isLoading: isNavbarLoading } = useNavbarQuery();
  const createNavbarMutation = useCreateNavbarMutation();

  // Footer hooks
  const { data: footerResponse, isLoading: isFooterLoading } = useFooterQuery();
  const createFooterMutation = useCreateFooterMutation();

  // Use the page hooks
  const { data: pagesData = [], isLoading: isPagesLoading } = usePages();
  const createPageMutation = useCreatePage();

  const [droppedComponents, setDroppedComponents] = useState<Component[]>([]);
  const [isNavbarDialogOpen, setIsNavbarDialogOpen] = useState(false);
  const [isFooterDialogOpen, setIsFooterDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("");
  const [isCreatingHomePage, setIsCreatingHomePage] = useState(false);

  // Auto-create home page if no pages exist
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
            console.log("Default home page created successfully:", data);
            setCurrentPage(data.slug);
            setIsCreatingHomePage(false);
          },
          onError: error => {
            console.error("Failed to create default home page:", error);
            setIsCreatingHomePage(false);
          },
        }
      );
    }
  }, [pagesData, isPagesLoading, createPageMutation, isCreatingHomePage]);

  // Initialize current page from API data
  useEffect(() => {
    if (pagesData && pagesData.length > 0) {
      // Set current page to the first page if not set or if current page doesn't exist
      if (!currentPage || !pagesData.find(page => page.slug === currentPage)) {
        setCurrentPage(pagesData[0].slug);
      }
    }
  }, [pagesData, currentPage]);

  // Get current page data
  const currentPageData = pagesData.find(page => page.slug === currentPage);

  const handleComponentClick = (componentId: string) => {
    if (componentId === "navbar") {
      setIsNavbarDialogOpen(true);
    } else if (componentId === "footer") {
      setIsFooterDialogOpen(true);
    } else {
      console.log(`${componentId} clicked`);
    }
  };

  const handleNavbarTemplateSelect = (templateData: NavbarData) => {
    const payload = {
      content: "navbar content",
      navbarData: templateData,
      component_id: `nav-${Date.now()}`,
    };
    createNavbarMutation.mutate(payload, {
      onSuccess: () => {
        setIsNavbarDialogOpen(false);
      },
    });
  };

  const handleFooterStyleSelect = (styleId: string) => {
    const payload = {
      content: "footer content",
      footerData: {
        style: styleId,
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
    createFooterMutation.mutate(payload, {
      onSuccess: () => setIsFooterDialogOpen(false),
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDrop = useCallback((item: any) => {
    if (item.type === "navbar" || item.type === "footer") return;

    const newComponent = {
      id: `${item.type}-${Date.now()}`,
      type: item.type,
      data: {},
    };
    setDroppedComponents(prev => [...prev, newComponent]);
  }, []);

  const handlePageChange = (pageSlug: string) => {
    setCurrentPage(pageSlug);
    // TODO: Save current page components before switching
    // TODO: Load components for the new page
    setDroppedComponents([]); // Reset components for now
  };

  const isLoading =
    isNavbarLoading || isFooterLoading || isPagesLoading || isCreatingHomePage;

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
    <DndProvider backend={HTML5Backend}>
      <NavbarTemplateDialog
        isOpen={isNavbarDialogOpen}
        onClose={() => setIsNavbarDialogOpen(false)}
        onSelectTemplate={handleNavbarTemplateSelect}
      />

      <FooterStylesDialog
        open={isFooterDialogOpen}
        onOpenChange={setIsFooterDialogOpen}
        onStyleSelect={handleFooterStyleSelect}
      />

      <div className="bg-background flex min-h-screen flex-col">
        <TopNavigation
          pages={pagesData}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />

        <div className="flex flex-1">
          <ComponentSidebar
            siteUser={params.siteUser}
            onComponentClick={handleComponentClick}
          />

          <div className="flex flex-1 flex-col">
            <div className="flex-1 overflow-auto bg-gray-50 p-6">
              <div className="mx-auto max-w-6xl">
                <div className="mb-4">
                  <h2 className="text-foreground text-2xl font-bold capitalize">
                    {currentPageData?.title || currentPage} Page
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    /{currentPage}
                  </p>
                </div>
                <CanvasArea
                  droppedComponents={droppedComponents}
                  onDrop={handleDrop}
                  navbar={navbarResponse?.data}
                  onAddNavbar={() => setIsNavbarDialogOpen(true)}
                  footer={footerResponse?.data}
                  onAddFooter={() => setIsFooterDialogOpen(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};
