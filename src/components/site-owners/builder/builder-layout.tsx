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
} from "@/hooks/owner-site/components/use-navbar";
import { NavbarData } from "@/types/owner-site/components/navbar";
import { NavbarTemplateDialog } from "@/components/site-owners/navbar/navbar-template-dialog";
import { usePages } from "@/hooks/owner-site/use-page";
import { useCreatePage } from "@/hooks/owner-site/use-page";
import { Page } from "@/types/owner-site/components/page";
import {
  useFooterQuery,
  useCreateFooterMutation,
} from "@/hooks/owner-site/components/use-footer";
import { FooterStylesDialog } from "@/components/site-owners/footer/footer-styles-dialog";
import { HeroStylesDialog } from "@/components/site-owners/hero/hero-styles-dialog";
import { defaultHeroData } from "@/types/owner-site/components/hero";
import { useCreateComponentMutation } from "@/hooks/owner-site/components/unified";
import { AboutUsStylesDialog } from "@/components/site-owners/about/about-styles-dialog";
import {
  defaultAboutUs1Data,
  defaultAboutUs2Data,
  defaultAboutUs3Data,
  defaultAboutUs4Data,
} from "@/types/owner-site/components/about";
import { AboutUsData } from "@/types/owner-site/components/about";
import { defaultProductsData } from "@/types/owner-site/components/products";
import { ProductsStylesDialog } from "@/components/site-owners/products/products-styles-dialog";
import { Facebook, Twitter } from "lucide-react";
import { defaultBlogDisplayData } from "@/types/owner-site/components/blog";
import { BlogStylesDialog } from "@/components/site-owners/blog/blog-style-dialog";
import {
  ComponentResponse,
  ComponentTypeMap,
} from "@/types/owner-site/components/components";

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

  const [droppedComponents, setDroppedComponents] = useState<
    ComponentResponse[]
  >([]);
  const [isNavbarDialogOpen, setIsNavbarDialogOpen] = useState(false);
  const [isFooterDialogOpen, setIsFooterDialogOpen] = useState(false);
  const [isHeroStylesDialogOpen, setIsHeroStylesDialogOpen] = useState(false);

  const [isAboutUsStylesDialogOpen, setIsAboutUsStylesDialogOpen] =
    useState(false);
  const [isProductsStylesDialogOpen, setIsProductsStylesDialogOpen] =
    useState(false);
  const [isBlogStylesDialogOpen, setIsBlogStylesDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("");
  const [isCreatingHomePage, setIsCreatingHomePage] = useState(false);

  // Unified component mutations
  const createHeroMutation = useCreateComponentMutation(currentPage, "hero");
  const createAboutUsMutation = useCreateComponentMutation(
    currentPage,
    "about"
  );
  const createProductsComponentMutation = useCreateComponentMutation(
    currentPage,
    "products"
  );
  const createBlogComponentMutation = useCreateComponentMutation(
    currentPage,
    "blog"
  );

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

  // Update the component click handler
  const handleComponentClick = (componentId: string) => {
    if (componentId === "navbar") {
      setIsNavbarDialogOpen(true);
    } else if (componentId === "footer") {
      setIsFooterDialogOpen(true);
    } else if (componentId === "hero-sections") {
      setIsHeroStylesDialogOpen(true);
    } else if (componentId === "about-sections") {
      setIsAboutUsStylesDialogOpen(true);
    } else if (componentId === "products-sections") {
      setIsProductsStylesDialogOpen(true);
    } else if (componentId === "blog-sections") {
      setIsBlogStylesDialogOpen(true);
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

  const handleHeroTemplateSelect = (
    template: "hero-1" | "hero-2" | "hero-3" | "hero-4" | "hero-5"
  ) => {
    // Create hero data with the selected template
    const heroData = {
      ...defaultHeroData,
      template: template,
    };

    // Use unified mutation with just the data
    createHeroMutation.mutate(heroData, {
      onSuccess: () => {
        setIsHeroStylesDialogOpen(false);
      },
      onError: error => {
        console.error("Failed to create hero component:", error);
      },
    });
  };

  const handleAboutUsTemplateSelect = (
    template: "about-1" | "about-2" | "about-3" | "about-4"
  ) => {
    // Select the correct default data based on the chosen template
    let aboutUsData: AboutUsData;

    switch (template) {
      case "about-1":
        aboutUsData = defaultAboutUs1Data;
        break;
      case "about-2":
        aboutUsData = defaultAboutUs2Data;
        break;
      case "about-3":
        aboutUsData = defaultAboutUs3Data;
        break;
      case "about-4":
        aboutUsData = defaultAboutUs4Data;
        break;
      default:
        aboutUsData = defaultAboutUs1Data;
    }

    // Use unified mutation with just the data
    createAboutUsMutation.mutate(aboutUsData, {
      onSuccess: () => {
        setIsAboutUsStylesDialogOpen(false);
      },
      onError: error => {
        console.error("Failed to create about us component:", error);
      },
    });
  };

  const handleProductsTemplateSelect = (
    template: "grid-1" | "grid-2" | "list-1" | "carousel-1"
  ) => {
    // Create products component with the selected template
    const productsData = {
      ...defaultProductsData,
      style: template, // Set the selected style
    };

    // Use unified mutation with just the data
    createProductsComponentMutation.mutate(productsData, {
      onSuccess: () => {
        setIsProductsStylesDialogOpen(false);
      },
      onError: error => {
        console.error("Failed to create products component:", error);
      },
    });
  };

  const handleBlogTemplateSelect = (
    template: "grid-1" | "grid-2" | "list-1"
  ) => {
    const blogData = {
      ...defaultBlogDisplayData,
      style: template,
    };

    // Use unified mutation with just the data
    createBlogComponentMutation.mutate(blogData, {
      onSuccess: () => {
        setIsBlogStylesDialogOpen(false);
      },
      onError: error => {
        console.error("Failed to create blog component:", error);
      },
    });
  };

  const handleAddHeroFromCanvas = () => {
    setIsHeroStylesDialogOpen(true);
  };

  const handleAddAboutUsFromCanvas = () => {
    setIsAboutUsStylesDialogOpen(true);
  };

  const handleAddProducts = () => {
    setIsProductsStylesDialogOpen(true);
  };

  const handleAddBlog = () => {
    setIsBlogStylesDialogOpen(true);
  };

  // Updated handleDrop with proper typing and component_type mapping
  const handleDrop = useCallback((item: { type: string; id?: string }) => {
    if (item.type === "navbar" || item.type === "footer") return;

    // Map drag item type to component_type
    let componentType: keyof ComponentTypeMap;
    switch (item.type) {
      case "hero-sections":
        componentType = "hero";
        break;
      case "about-sections":
        componentType = "about";
        break;
      case "products-sections":
        componentType = "products";
        break;
      case "blog-sections":
        componentType = "blog";
        break;
      default:
        // If type doesn't match expected types, try to use it directly
        if (["hero", "about", "products", "blog"].includes(item.type)) {
          componentType = item.type as keyof ComponentTypeMap;
        } else {
          console.warn(`Unknown component type: ${item.type}`);
          return;
        }
    }

    const newComponent: ComponentResponse = {
      id: `${componentType}-${Date.now()}`,
      component_id: item.id || `${componentType}-${Date.now()}`,
      component_type: componentType,
      data: {} as ComponentTypeMap[keyof ComponentTypeMap],
      order: 0,
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

      <HeroStylesDialog
        open={isHeroStylesDialogOpen}
        onOpenChange={setIsHeroStylesDialogOpen}
        onStyleSelect={handleHeroTemplateSelect}
      />

      <AboutUsStylesDialog
        open={isAboutUsStylesDialogOpen}
        onOpenChange={setIsAboutUsStylesDialogOpen}
        onStyleSelect={handleAboutUsTemplateSelect}
      />

      <ProductsStylesDialog
        open={isProductsStylesDialogOpen}
        onOpenChange={setIsProductsStylesDialogOpen}
        onStyleSelect={handleProductsTemplateSelect}
      />

      <BlogStylesDialog
        open={isBlogStylesDialogOpen}
        onOpenChange={setIsBlogStylesDialogOpen}
        onStyleSelect={handleBlogTemplateSelect}
      />

      <TopNavigation
        pages={pagesData}
        currentPage={currentPage}
        siteUser={params.siteUser}
        onPageChange={handlePageChange}
      />
      <div className="bg-background flex min-h-screen flex-col">
        <div className="flex flex-1">
          <ComponentSidebar
            siteUser={params.siteUser}
            onComponentClick={handleComponentClick}
          />

          <div className="flex flex-1 flex-col">
            <div className="flex-1 overflow-auto bg-gray-50 p-6">
              <div className="mx-auto max-w-7xl">
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
                  navbar={navbarResponse?.data}
                  onAddNavbar={() => setIsNavbarDialogOpen(true)}
                  footer={footerResponse?.data}
                  onAddFooter={() => setIsFooterDialogOpen(true)}
                  currentPageSlug={currentPage}
                  onAddHero={handleAddHeroFromCanvas}
                  onAddAboutUs={handleAddAboutUsFromCanvas}
                  onAddProducts={handleAddProducts}
                  onAddBlog={handleAddBlog}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};
