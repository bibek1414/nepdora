"use client";

import React, { useState, useCallback, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useRouter } from "next/navigation";
import { CanvasArea } from "@/components/site-owners/builder/builder/canvas-area";
import { TopNavigation } from "@/components/site-owners/builder/builder/top-navigation";
import { ComponentSidebar } from "@/components/site-owners/builder/builder/component-sidebar";
import {
  useNavbarQuery,
  useCreateNavbarMutation,
} from "@/hooks/owner-site/components/use-navbar";
import { NavbarData } from "@/types/owner-site/components/navbar";
import { NavbarTemplateDialog } from "@/components/site-owners/builder/navbar/navbar-template-dialog";
import { usePages } from "@/hooks/owner-site/use-page";
import { useCreatePage } from "@/hooks/owner-site/use-page";
import { Page } from "@/types/owner-site/components/page";
import {
  useFooterQuery,
  useCreateFooterMutation,
} from "@/hooks/owner-site/components/use-footer";
import { FooterStylesDialog } from "@/components/site-owners/builder/footer/footer-styles-dialog";
import { HeroStylesDialog } from "@/components/site-owners/builder/hero/hero-styles-dialog";
import { defaultHeroData } from "@/types/owner-site/components/hero";
import {
  useCreateComponentMutation,
  usePageComponentsQuery,
} from "@/hooks/owner-site/components/unified";
import { AboutUsStylesDialog } from "@/components/site-owners/builder/about/about-styles-dialog";
import {
  defaultAboutUs1Data,
  defaultAboutUs3Data,
  defaultAboutUs4Data,
} from "@/types/owner-site/components/about";
import { AboutUsData } from "@/types/owner-site/components/about";
import { defaultProductsData } from "@/types/owner-site/components/products";
import { ProductsStylesDialog } from "@/components/site-owners/builder/products/products-styles-dialog";
import { CategoryStylesDialog } from "@/components/site-owners/builder/category/category-style-dialog";
import { SubCategoryStylesDialog } from "@/components/site-owners/builder/sub-category/sub-category-style-dialog";
import { Facebook, Twitter } from "lucide-react";
import { defaultBlogDisplayData } from "@/types/owner-site/components/blog";
import { BlogStylesDialog } from "@/components/site-owners/builder/blog/blog-style-dialog";
import {
  ComponentResponse,
  ComponentTypeMap,
} from "@/types/owner-site/components/components";
import { ContactStylesDialog } from "@/components/site-owners/builder/contact/contact-style-dialog";
import { defaultContactData } from "@/types/owner-site/components/contact";
import { TeamStylesDialog } from "@/components/site-owners/builder/team-member/team-style-dialog";
import { defaultTeamData } from "@/types/owner-site/components/team";
import { TestimonialsStylesDialog } from "@/components/site-owners/builder/testimonials/testimonial-style-dialog";
import { defaultTestimonialsData } from "@/types/owner-site/components/testimonials";
import { FAQStylesDialog } from "@/components/site-owners/builder/faq/faq-styles-dialog";
import { defaultFAQData } from "@/types/owner-site/components/faq";
import { PortfolioStylesDialog } from "@/components/site-owners/builder/portfolio/portfolio-styles-dialog";
import { defaultPortfolioData } from "@/types/owner-site/components/portfolio";
import { BannerStylesDialog } from "@/components/site-owners/builder/banner/banner-styles-dialog";
import { defaultBannerData } from "@/types/owner-site/components/banner";
import { NewsletterStylesDialog } from "@/components/site-owners/builder/newsletter/newsletter-style-dialog";
import { defaultNewsletterData } from "@/types/owner-site/components/newsletter";
import { YouTubeStylesDialog } from "@/components/site-owners/builder/youtube/youtube-styles-dialog";
import { defaultYouTubeData } from "@/types/owner-site/components/youtube";
import { heroTemplateConfigs } from "@/types/owner-site/components/hero";
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

  // Page components with proper ordering
  const {
    data: pageComponentsResponse,
    isLoading: isPageComponentsLoading,
    error: pageComponentsError,
  } = usePageComponentsQuery(pageSlug);

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
  const [isCategoriesStylesDialogOpen, setIsCategoriesStylesDialogOpen] =
    useState(false);
  const [isSubCategoriesStylesDialogOpen, setIsSubCategoriesStylesDialogOpen] =
    useState(false);
  const [isBlogStylesDialogOpen, setIsBlogStylesDialogOpen] = useState(false);
  const [isCreatingHomePage, setIsCreatingHomePage] = useState(false);
  const [isContactStylesDialogOpen, setIsContactStylesDialogOpen] =
    useState(false);
  const [isTeamStylesDialogOpen, setIsTeamStylesDialogOpen] = useState(false);
  const [isTestimonialsStylesDialogOpen, setIsTestimonialsStylesDialogOpen] =
    useState(false);
  const [isFAQStylesDialogOpen, setIsFAQStylesDialogOpen] = useState(false);
  const [isPortfolioStylesDialogOpen, setIsPortfolioStylesDialogOpen] =
    useState(false);
  const [isBannerStylesDialogOpen, setIsBannerStylesDialogOpen] =
    useState(false);
  const [isNewsletterStylesDialogOpen, setIsNewsletterStylesDialogOpen] =
    useState(false);
  const [isYouTubeStylesDialogOpen, setIsYouTubeStylesDialogOpen] =
    useState(false);
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
  const createCategoryComponentMutation = useCreateComponentMutation(
    currentPage,
    "category"
  );
  const createSubCategoryComponentMutation = useCreateComponentMutation(
    currentPage,
    "subcategory"
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
  const createTestimonialsComponentMutation = useCreateComponentMutation(
    currentPage,
    "testimonials"
  );
  const createFAQComponentMutation = useCreateComponentMutation(
    currentPage,
    "faq"
  );
  const createPortfolioComponentMutation = useCreateComponentMutation(
    currentPage,
    "portfolio"
  );
  const createBannerComponentMutation = useCreateComponentMutation(
    currentPage,
    "banner"
  );
  const createNewsletterComponentMutation = useCreateComponentMutation(
    currentPage,
    "newsletter"
  );
  const createYouTubeComponentMutation = useCreateComponentMutation(
    currentPage,
    "youtube"
  );
  // Process page components with proper typing
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
            "portfolio",
            "banner",
            "newsletter",
            "youtube",
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

  // Get current page data
  const currentPageData = pagesData.find(page => page.slug === currentPage);

  // Handle page change
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

  // Component click handlers - same as before
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
    } else if (componentId === "categories-sections") {
      setIsCategoriesStylesDialogOpen(true);
    } else if (componentId === "subcategories-sections") {
      setIsSubCategoriesStylesDialogOpen(true);
    } else if (componentId === "blog-sections") {
      setIsBlogStylesDialogOpen(true);
    } else if (componentId === "contact-sections") {
      setIsContactStylesDialogOpen(true);
    } else if (componentId === "testimonials-sections") {
      setIsTestimonialsStylesDialogOpen(true);
    } else if (componentId === "faq-sections") {
      setIsFAQStylesDialogOpen(true);
    } else if (componentId === "portfolio-sections") {
      setIsPortfolioStylesDialogOpen(true);
    } else if (componentId === "team-members-sections") {
      setIsTeamStylesDialogOpen(true);
    } else if (componentId === "banner-sections") {
      setIsBannerStylesDialogOpen(true);
    } else if (componentId === "youtube-sections") {
      setIsYouTubeStylesDialogOpen(true);
    } else if (componentId === "newsletter-sections") {
      setIsNewsletterStylesDialogOpen(true);
    } else {
      console.log(`${componentId} clicked`);
    }
  };

  // Template selection handlers - same as before but ensuring proper order assignment
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
        copyright: `Â© ${new Date().getFullYear()} Your Brand. All Rights Reserved.`,
      },
      component_id: `footer-${Date.now()}`,
    };
    createFooterMutation.mutate(payload, {
      onSuccess: () => setIsFooterDialogOpen(false),
    });
  };

  // Helper function to get next order value
  const getNextOrder = () => {
    if (pageComponents.length === 0) return 0;
    const maxOrder = Math.max(...pageComponents.map(c => c.order || 0));
    return maxOrder + 1;
  };

  // Template selection handlers with proper order assignment
  const handleHeroTemplateSelect = (
    template: "hero-1" | "hero-2" | "hero-3" | "hero-4" | "hero-5"
  ) => {
    // Get the specific configuration for this template
    const templateConfig = heroTemplateConfigs[template];

    const heroData = {
      ...defaultHeroData,
      template: template,
      backgroundType: templateConfig.backgroundType,
      backgroundColor:
        templateConfig.backgroundColor || defaultHeroData.backgroundColor,
      backgroundImageUrl:
        templateConfig.backgroundImageUrl || defaultHeroData.backgroundImageUrl,
      showOverlay: templateConfig.showOverlay ?? defaultHeroData.showOverlay,
      overlayOpacity:
        templateConfig.overlayOpacity ?? defaultHeroData.overlayOpacity,
      showSlider: templateConfig.showSlider ?? defaultHeroData.showSlider,
    };

    createHeroMutation.mutate(heroData, {
      onSuccess: () => {
        setIsHeroStylesDialogOpen(false);
      },
      onError: error => {
        console.error("Failed to create hero component:", error);
      },
    });
  };
  const handleYouTubeTemplateSelect = (
    template: "grid" | "carousel" | "playlist"
  ) => {
    const youtubeData = {
      ...defaultYouTubeData,
      style: template,
    };

    createYouTubeComponentMutation.mutate(youtubeData, {
      onSuccess: () => {
        setIsYouTubeStylesDialogOpen(false);
      },
      onError: error => {
        console.error("Failed to create YouTube component:", error);
      },
    });
  };

  const handleBannerTemplateSelect = (
    template: "banner-1" | "banner-2" | "banner-3" | "banner-4"
  ) => {
    const bannerData = {
      ...defaultBannerData,
      template: template,
    };

    createBannerComponentMutation.mutate(bannerData, {
      onSuccess: () => {
        setIsBannerStylesDialogOpen(false);
      },
      onError: error => {
        console.error("Failed to create banner component:", error);
      },
    });
  };

  const handleNewsletterTemplateSelect = (
    template: "style-1" | "style-2" | "style-3"
  ) => {
    const newsletterData = {
      ...defaultNewsletterData,
      style: template,
    };

    createNewsletterComponentMutation.mutate(newsletterData, {
      onSuccess: () => {
        setIsNewsletterStylesDialogOpen(false);
      },
      onError: error => {
        console.error("Failed to create newsletter component:", error);
      },
    });
  };

  const handlePortfolioTemplateSelect = (
    template: "portfolio-1" | "portfolio-2" | "portfolio-3"
  ) => {
    const portfolioData = {
      ...defaultPortfolioData,
      style: template,
    };

    createPortfolioComponentMutation.mutate(portfolioData, {
      onSuccess: () => {
        setIsPortfolioStylesDialogOpen(false);
      },
      onError: error => {
        console.error("Failed to create portfolio component:", error);
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
    template: "about-1" | "about-3" | "about-4"
  ) => {
    let aboutUsData: AboutUsData;

    switch (template) {
      case "about-1":
        aboutUsData = defaultAboutUs1Data;
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
    template: "grid-1" | "grid-2" | "list-1" | "carousel-1" | "grid-4"
  ) => {
    const productsData = {
      ...defaultProductsData,
      style: template,
    };

    createProductsComponentMutation.mutate(productsData, {
      onSuccess: () => {
        setIsProductsStylesDialogOpen(false);
      },
      onError: error => {
        console.error("Failed to create products component:", error);
      },
    });
  };

  const handleCategoryTemplateSelect = (
    template: "grid-1" | "grid-2" | "list-1"
  ) => {
    const categoryData = {
      page_size: 8,
      component_type: "category" as const,
      title: "Our Categories",
      subtitle: "Browse our product categories",
      style: template,
      showDescription: true,
      showProductCount: true,
      itemsPerRow: 4,
    };

    createCategoryComponentMutation.mutate(categoryData, {
      onSuccess: () => {
        setIsCategoriesStylesDialogOpen(false);
      },
      onError: error => {
        console.error("Failed to create category component:", error);
      },
    });
  };

  const handleSubCategoryTemplateSelect = (
    template: "grid-1" | "grid-2" | "list-1"
  ) => {
    const subCategoryData = {
      component_type: "subcategory" as const,
      page_size: 8,
      title: "Our SubCategories",
      subtitle: "Explore our product subcategories",
      style: template,
      showDescription: true,
      showProductCount: true,
      showParentCategory: true,
      itemsPerRow: 4,
    };

    createSubCategoryComponentMutation.mutate(subCategoryData, {
      onSuccess: () => {
        setIsSubCategoriesStylesDialogOpen(false);
      },
      onError: error => {
        console.error("Failed to create subcategory component:", error);
      },
    });
  };

  const handleTestimonialsTemplateSelect = (
    template: "grid-1" | "grid-2" | "list-1"
  ) => {
    const testimonialsData = {
      ...defaultTestimonialsData,
      style: template,
    };

    createTestimonialsComponentMutation.mutate(testimonialsData, {
      onSuccess: () => {
        setIsTestimonialsStylesDialogOpen(false);
      },
      onError: error => {
        console.error("Failed to create testimonials component:", error);
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

    createTeamComponentMutation.mutate(teamData, {
      onSuccess: () => {
        setIsTeamStylesDialogOpen(false);
      },
      onError: error => {
        console.error("Failed to create team component:", error);
      },
    });
  };

  const handleFAQTemplateSelect = (
    template: "accordion" | "plus-minus" | "card-grid"
  ) => {
    const faqData = {
      ...defaultFAQData,
      style: template,
    };

    createFAQComponentMutation.mutate(faqData, {
      onSuccess: () => {
        setIsFAQStylesDialogOpen(false);
      },
      onError: error => {
        console.error("Failed to create FAQ component:", error);
      },
    });
  };

  // Add handlers
  const handleAddHeroFromCanvas = () => {
    setIsHeroStylesDialogOpen(true);
  };

  const handleAddAboutUsFromCanvas = () => {
    setIsAboutUsStylesDialogOpen(true);
  };

  const handleAddProducts = () => {
    setIsProductsStylesDialogOpen(true);
  };

  const handleAddCategories = () => {
    setIsCategoriesStylesDialogOpen(true);
  };

  const handleAddSubCategories = () => {
    setIsSubCategoriesStylesDialogOpen(true);
  };

  const handleAddBlog = () => {
    setIsBlogStylesDialogOpen(true);
  };

  const handleAddContact = () => {
    setIsContactStylesDialogOpen(true);
  };
  const handleAddYouTube = () => {
    setIsYouTubeStylesDialogOpen(true);
  };

  const handleAddTeam = () => {
    setIsTeamStylesDialogOpen(true);
  };

  const handleAddPortfolio = () => {
    setIsPortfolioStylesDialogOpen(true);
  };

  const handleAddBanner = () => {
    setIsBannerStylesDialogOpen(true);
  };

  const handleAddNewsletter = () => {
    setIsNewsletterStylesDialogOpen(true);
  };

  const handleAddTestimonials = () => {
    setIsTestimonialsStylesDialogOpen(true);
  };

  const handleAddFAQ = () => {
    setIsFAQStylesDialogOpen(true);
  };

  // Updated handleDrop with proper typing and component_type mapping
  const handleDrop = useCallback(
    (item: { type: string; id?: string }) => {
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
        case "categories-sections":
          componentType = "category";
          break;
        case "subcategories-sections":
          componentType = "subcategory";
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
        case "testimonials-sections":
          componentType = "testimonials";
          break;
        case "portfolio-sections":
          componentType = "portfolio";
          break;
        case "faq-sections":
          componentType = "faq";
          break;
        case "banner-sections":
          componentType = "banner";
          break;
        case "newsletter-sections":
          componentType = "newsletter";
          break;
        case "youtube-sections":
          componentType = "youtube";
          break;
        default:
          if (
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
              "portfolio",
              "banner",
              "newsletter",
              "youtube",
            ].includes(item.type)
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
        order: getNextOrder(),
      };

      setDroppedComponents(prev => [...prev, newComponent]);
    },
    [pageComponents]
  );

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
    <DndProvider backend={HTML5Backend}>
      {/* All dialog components remain the same */}
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

      <CategoryStylesDialog
        open={isCategoriesStylesDialogOpen}
        onOpenChange={setIsCategoriesStylesDialogOpen}
        onStyleSelect={handleCategoryTemplateSelect}
      />

      <PortfolioStylesDialog
        open={isPortfolioStylesDialogOpen}
        onOpenChange={setIsPortfolioStylesDialogOpen}
        onStyleSelect={handlePortfolioTemplateSelect}
      />

      <SubCategoryStylesDialog
        open={isSubCategoriesStylesDialogOpen}
        onOpenChange={setIsSubCategoriesStylesDialogOpen}
        onStyleSelect={handleSubCategoryTemplateSelect}
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

      <TestimonialsStylesDialog
        open={isTestimonialsStylesDialogOpen}
        onOpenChange={setIsTestimonialsStylesDialogOpen}
        onStyleSelect={handleTestimonialsTemplateSelect}
      />

      <FAQStylesDialog
        open={isFAQStylesDialogOpen}
        onOpenChange={setIsFAQStylesDialogOpen}
        onStyleSelect={handleFAQTemplateSelect}
      />

      <BannerStylesDialog
        open={isBannerStylesDialogOpen}
        onOpenChange={setIsBannerStylesDialogOpen}
        onStyleSelect={handleBannerTemplateSelect}
      />

      <NewsletterStylesDialog
        open={isNewsletterStylesDialogOpen}
        onOpenChange={setIsNewsletterStylesDialogOpen}
        onStyleSelect={handleNewsletterTemplateSelect}
      />
      <YouTubeStylesDialog
        open={isYouTubeStylesDialogOpen}
        onOpenChange={setIsYouTubeStylesDialogOpen}
        onStyleSelect={handleYouTubeTemplateSelect}
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
                  pageComponents={pageComponents}
                  isLoading={isPageComponentsLoading}
                  error={pageComponentsError}
                  onAddHero={handleAddHeroFromCanvas}
                  onAddAboutUs={handleAddAboutUsFromCanvas}
                  onAddProducts={handleAddProducts}
                  onAddCategories={handleAddCategories}
                  onAddSubCategories={handleAddSubCategories}
                  onAddBlog={handleAddBlog}
                  onAddContact={handleAddContact}
                  onAddTeam={handleAddTeam}
                  onAddTestimonials={handleAddTestimonials}
                  onAddFAQ={handleAddFAQ}
                  onAddPortfolio={handleAddPortfolio}
                  onAddBanner={handleAddBanner}
                  onAddNewsletter={handleAddNewsletter}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
};
