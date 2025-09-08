"use client";

import React, { useState, useCallback, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useRouter } from "next/navigation";
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
import { ContactStylesDialog } from "@/components/site-owners/contact/contact-style-dialog";
import { defaultContactData } from "@/types/owner-site/components/contact";
import { TeamStylesDialog } from "@/components/site-owners/team-member/team-style-dialog";
import { defaultTeamData } from "@/types/owner-site/components/team";

interface BuilderLayoutProps {
  params: {
    siteUser: string;
    pageSlug: string;
  };
}

export const BuilderLayout: React.FC<BuilderLayoutProps> = ({ params }) => {
  const router = useRouter();
  const { siteUser, pageSlug } = params;

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
  const [isCreatingHomePage, setIsCreatingHomePage] = useState(false);
  const [isContactStylesDialogOpen, setIsContactStylesDialogOpen] =
    useState(false);
  const [isTeamStylesDialogOpen, setIsTeamStylesDialogOpen] = useState(false);

  // Use pageSlug from URL params as current page
  const currentPage = pageSlug;

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
  const createContactComponentMutation = useCreateComponentMutation(
    currentPage,
    "contact"
  );
  const createTeamComponentMutation = useCreateComponentMutation(
    currentPage,
    "team"
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
            setIsCreatingHomePage(false);
            // Redirect to the newly created home page if we're not already there
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
        // Page doesn't exist, redirect to first available page or home
        const firstPage = pagesData[0];
        router.push(`/builder/${siteUser}/${firstPage.slug}`);
      }
    }
  }, [pagesData, pageSlug, router, siteUser, isCreatingHomePage]);

  // Get current page data
  const currentPageData = pagesData.find(page => page.slug === currentPage);

  // Update page change handler to use router
  const handlePageChange = (newPageSlug: string) => {
    router.push(`/builder/${siteUser}/${newPageSlug}`);
  };

  // Handle page creation and navigation
  const handlePageCreated = (page: Page) => {
    router.push(`/builder/${siteUser}/${page.slug}`);
  };

  // Handle page deletion and navigation
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
    } else if (componentId === "contact-sections") {
      setIsContactStylesDialogOpen(true);
    } else if (componentId === "team-members-sections") {
      setIsTeamStylesDialogOpen(true);
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

  const handleContactTemplateSelect = (
    template: "form-1" | "form-2" | "form-3" | "form-4"
  ) => {
    const contactData = {
      ...defaultContactData,
      style: template,
    };

    // Use unified mutation with just the data
    createContactComponentMutation.mutate(contactData, {
      onSuccess: () => {
        setIsContactStylesDialogOpen(false);
      },
      onError: error => {
        console.error("Failed to create contact component:", error);
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

  const handleTeamTemplateSelect = (
    template: "grid-1" | "grid-2" | "list-1"
  ) => {
    const teamData = {
      ...defaultTeamData,
      style: template,
    };

    // Use unified mutation with just the data
    createTeamComponentMutation.mutate(teamData, {
      onSuccess: () => {
        setIsTeamStylesDialogOpen(false);
      },
      onError: error => {
        console.error("Failed to create team component:", error);
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

  const handleAddContact = () => {
    setIsContactStylesDialogOpen(true);
  };

  const handleAddTeam = () => {
    setIsTeamStylesDialogOpen(true);
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
      case "contact-sections":
        componentType = "contact";
        break;
      case "team-members-sections":
        componentType = "team";
        break;
      default:
        // If type doesn't match expected types, try to use it directly
        if (
          ["hero", "about", "products", "blog", "contact", "team"].includes(
            item.type
          )
        ) {
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

      <ContactStylesDialog
        open={isContactStylesDialogOpen}
        onOpenChange={setIsContactStylesDialogOpen}
        onStyleSelect={handleContactTemplateSelect}
      />

      <TeamStylesDialog
        open={isTeamStylesDialogOpen}
        onOpenChange={setIsTeamStylesDialogOpen}
        onStyleSelect={handleTeamTemplateSelect}
      />

      <TopNavigation
        pages={pagesData}
        currentPage={currentPage}
        siteUser={siteUser}
        onPageChange={handlePageChange}
        onPageCreated={handlePageCreated}
        onPageDeleted={handlePageDeleted}
      />

      <div className="bg-background flex min-h-screen flex-col">
        <div className="flex flex-1">
          <ComponentSidebar
            siteUser={siteUser}
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
                  onAddContact={handleAddContact}
                  onAddTeam={handleAddTeam}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};
