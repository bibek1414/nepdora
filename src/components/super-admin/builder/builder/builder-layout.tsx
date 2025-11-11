"use client";

import React, { useState, useCallback, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useRouter } from "next/navigation";
import { CanvasArea } from "@/components/super-admin/builder/builder/canvas-area";
import { TopNavigation } from "@/components/super-admin/builder/builder/top-navigation";
import { ComponentSidebar } from "@/components/super-admin/builder/builder/component-sidebar";
import {
  useNavbarQuery,
  useCreateNavbarMutation,
} from "@/hooks/super-admin/components/use-navbar";
import { NavbarData } from "@/types/owner-site/components/navbar";
import { NavbarTemplateDialog } from "@/components/site-owners/builder/navbar/navbar-template-dialog";
import { usePages } from "@/hooks/super-admin/components/use-page";
import { useCreatePage } from "@/hooks/super-admin/components/use-page";
import { Page } from "@/types/super-admin/components/page";
import {
  useFooterQuery,
  useCreateFooterMutation,
} from "@/hooks/super-admin/components/use-footer";
import { FooterStylesDialog } from "@/components/site-owners/builder/footer/footer-styles-dialog";
import { HeroStylesDialog } from "@/components/site-owners/builder/hero/hero-styles-dialog";
import { defaultHeroData } from "@/types/owner-site/components/hero";
import {
  useCreateComponentMutation,
  usePageComponentsQuery,
} from "@/hooks/super-admin/components/use-unified";
import { AboutUsStylesDialog } from "@/components/site-owners/builder/about/about-styles-dialog";
import {
  defaultAboutUs1Data,
  defaultAboutUs3Data,
  defaultAboutUs2Data,
  defaultAboutUs4Data,
  defaultAboutUs5Data,
  defaultAboutUs6Data,
  defaultAboutUs7Data,
  defaultAboutUs8Data,
} from "@/types/owner-site/components/about";
import { AboutUsData } from "@/types/owner-site/components/about";
import { defaultProductsData } from "@/types/owner-site/components/products";
import { ProductsStylesDialog } from "@/components/site-owners/builder/products/products-styles-dialog";
import { CategoryStylesDialog } from "@/components/site-owners/builder/category/category-style-dialog";
import { SubCategoryStylesDialog } from "@/components/site-owners/builder/sub-category/sub-category-style-dialog";
import { Facebook, Twitter } from "lucide-react";
import { defaultBlogData } from "@/types/owner-site/components/blog";
import { BlogStylesDialog } from "@/components/site-owners/builder/blog/blog-style-dialog";
import { ServicesStyleDialog } from "@/components/site-owners/builder/services/services-style-dialog";
import { defaultServicesData } from "@/types/owner-site/components/services";
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
import { PageTemplateDialog } from "@/components/site-owners/builder/templates/page-template-dialog";
import { PageTemplate } from "@/types/owner-site/components/page-template";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTemplates } from "@/hooks/super-admin/components/use-templates";
import { PoliciesStylesDialog } from "@/components/site-owners/builder/policies/policies-styles-dialog";
import {
  defaultReturnExchangeData,
  defaultShippingData,
  defaultPrivacyData,
  defaultTermsData,
} from "@/types/owner-site/components/policies";

interface BuilderLayoutProps {
  params: {
    templateSlug: string;
    pageSlug: string;
  };
}

export const BuilderLayout: React.FC<BuilderLayoutProps> = ({ params }) => {
  const router = useRouter();
  const { templateSlug, pageSlug } = params;
  const { data: templatesData = [], isLoading: isTemplatesLoading } =
    useTemplates();

  const { data: navbarResponse, isLoading: isNavbarLoading } =
    useNavbarQuery(templateSlug);
  const createNavbarMutation = useCreateNavbarMutation(templateSlug);

  // Footer hooks
  const { data: footerResponse, isLoading: isFooterLoading } =
    useFooterQuery(templateSlug);
  const createFooterMutation = useCreateFooterMutation(templateSlug);

  // Use the page hooks
  const { data: pagesData = [], isLoading: isPagesLoading } =
    usePages(templateSlug);
  const createPageMutation = useCreatePage(templateSlug);

  // Page components with proper ordering
  const {
    data: pageComponentsResponse,
    isLoading: isPageComponentsLoading,
    error: pageComponentsError,
  } = usePageComponentsQuery(pageSlug, templateSlug);

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
  const [isServicesStylesDialogOpen, setIsServicesStylesDialogOpen] =
    useState(false);
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
  const [isPageTemplateDialogOpen, setIsPageTemplateDialogOpen] =
    useState(false);
  const [isPoliciesStylesDialogOpen, setIsPoliciesStylesDialogOpen] =
    useState(false);

  // Use pageSlug from URL params as current page
  const currentPage = pageSlug;
  const queryClient = useQueryClient();

  // Unified component mutations with templateSlug parameter
  const createHeroMutation = useCreateComponentMutation(
    currentPage,
    "hero",
    templateSlug
  );
  const createAboutUsMutation = useCreateComponentMutation(
    currentPage,
    "about",
    templateSlug
  );
  const createProductsComponentMutation = useCreateComponentMutation(
    currentPage,
    "products",
    templateSlug
  );
  const createCategoryComponentMutation = useCreateComponentMutation(
    currentPage,
    "category",
    templateSlug
  );
  const createSubCategoryComponentMutation = useCreateComponentMutation(
    currentPage,
    "subcategory",
    templateSlug
  );
  const createBlogComponentMutation = useCreateComponentMutation(
    currentPage,
    "blog",
    templateSlug
  );
  const createServicesComponentMutation = useCreateComponentMutation(
    currentPage,
    "services",
    templateSlug
  );
  const createContactComponentMutation = useCreateComponentMutation(
    currentPage,
    "contact",
    templateSlug
  );
  const createTeamComponentMutation = useCreateComponentMutation(
    currentPage,
    "team",
    templateSlug
  );
  const createTestimonialsComponentMutation = useCreateComponentMutation(
    currentPage,
    "testimonials",
    templateSlug
  );
  const createFAQComponentMutation = useCreateComponentMutation(
    currentPage,
    "faq",
    templateSlug
  );
  const createPortfolioComponentMutation = useCreateComponentMutation(
    currentPage,
    "portfolio",
    templateSlug
  );
  const createBannerComponentMutation = useCreateComponentMutation(
    currentPage,
    "banner",
    templateSlug
  );
  const createNewsletterComponentMutation = useCreateComponentMutation(
    currentPage,
    "newsletter",
    templateSlug
  );
  const createYouTubeComponentMutation = useCreateComponentMutation(
    currentPage,
    "youtube",
    templateSlug
  );
  const createPoliciesComponentMutation = useCreateComponentMutation(
    currentPage,
    "policies",
    templateSlug
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
            "services",
            "contact",
            "team",
            "testimonials",
            "faq",
            "portfolio",
            "banner",
            "newsletter",
            "youtube",
            "policies",
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
      !isCreatingHomePage &&
      !isTemplatesLoading
    ) {
      setIsCreatingHomePage(true);
      console.log("Creating home page with template:", templateSlug);
      createPageMutation.mutate(
        { title: "Home" },
        {
          onSuccess: (data: Page) => {
            setIsCreatingHomePage(false);
            if (pageSlug !== data.slug) {
              router.push(`/superadmin/builder/${templateSlug}/${data.slug}`);
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
    pageSlug,
    templatesData,
    isTemplatesLoading,
    templateSlug,
  ]);

  // Validate current page exists
  useEffect(() => {
    if (pagesData && pagesData.length > 0) {
      const pageExists = pagesData.find(page => page.slug === pageSlug);

      if (!pageExists && !isCreatingHomePage) {
        const firstPage = pagesData[0];
        router.push(`/superadmin/builder/${templateSlug}/${firstPage.slug}`);
      }
    }
  }, [pagesData, pageSlug, router, isCreatingHomePage, templateSlug]);

  // Get current page data
  const currentPageData = pagesData.find(page => page.slug === currentPage);

  // Handle page change
  const handlePageChange = (newPageSlug: string) => {
    router.push(`/superadmin/builder/${templateSlug}/${newPageSlug}`);
  };

  const handlePageCreated = (page: Page) => {
    router.push(`/superadmin/builder/${templateSlug}/${page.slug}`);
  };

  // Handle page deletion and navigation
  const handlePageDeleted = (deletedSlug: string) => {
    if (pageSlug === deletedSlug && pagesData.length > 1) {
      const remainingPages = pagesData.filter(
        page => page.slug !== deletedSlug
      );
      if (remainingPages.length > 0) {
        router.push(
          `/superadmin/builder/${templateSlug}/${remainingPages[0].slug}`
        );
      }
    }
  };

  const handleComponentClick = (componentId: string) => {
    if (componentId === "page-templates") {
      setIsPageTemplateDialogOpen(true);
    } else if (componentId === "navbar") {
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
    } else if (componentId === "services-sections") {
      setIsServicesStylesDialogOpen(true);
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
    } else if (componentId === "policies-sections") {
      setIsPoliciesStylesDialogOpen(true);
    } else {
      console.log(`${componentId} clicked`);
    }
  };

  // Template selection handlers
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

  const handlePageTemplateSelect = async (template: PageTemplate) => {
    try {
      router.push(`/superadmin/template/builder?templateId=${template.id}`);
      setIsPageTemplateDialogOpen(false);
    } catch (error) {
      console.error("Failed to navigate to template builder:", error);
      toast.error("Failed to open template builder. Please try again.");
    }
  };

  const handleFooterStyleSelect = (styleId: string) => {
    const payload = {
      content: "footer content",
      footerData: {
        style: styleId,
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
    createFooterMutation.mutate(payload, {
      onSuccess: () => setIsFooterDialogOpen(false),
    });
  };

  const handlePoliciesTemplateSelect = (
    template: "return-exchange" | "shipping" | "privacy" | "terms"
  ) => {
    let policyData;

    switch (template) {
      case "return-exchange":
        policyData = defaultReturnExchangeData;
        break;
      case "shipping":
        policyData = defaultShippingData;
        break;
      case "privacy":
        policyData = defaultPrivacyData;
        break;
      case "terms":
        policyData = defaultTermsData;
        break;
      default:
        policyData = defaultReturnExchangeData;
    }

    createPoliciesComponentMutation.mutate(policyData, {
      onSuccess: () => {
        setIsPoliciesStylesDialogOpen(false);
      },
      onError: error => {
        console.error("Failed to create policies component:", error);
      },
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
    template:
      | "hero-1"
      | "hero-2"
      | "hero-3"
      | "hero-4"
      | "hero-5"
      | "hero-6"
      | "hero-7"
      | "hero-8"
      | "hero-9"
      | "hero-10"
  ) => {
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
    template: "portfolio-1" | "portfolio-2" | "portfolio-3" | "portfolio-4"
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
    template:
      | "about-1"
      | "about-2"
      | "about-3"
      | "about-4"
      | "about-5"
      | "about-6"
      | "about-7"
      | "about-8"
  ) => {
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
      case "about-5":
        aboutUsData = defaultAboutUs5Data;
        break;
      case "about-6":
        aboutUsData = defaultAboutUs6Data;
        break;
      case "about-7":
        aboutUsData = defaultAboutUs7Data;
        break;
      case "about-8":
        aboutUsData = defaultAboutUs8Data;
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
    template:
      | "grid-1"
      | "grid-2"
      | "list-1"
      | "carousel-1"
      | "grid-4"
      | "grid-5"
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
    template: "grid-1" | "grid-2" | "list-1" | "grid-3" | "link-1" | "card-1"
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
    template:
      | "grid-1"
      | "grid-2"
      | "list-1"
      | "grid-3"
      | "carousel-1"
      | "stagger-1"
      | "card-7"
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
      ...defaultBlogData,
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

  const handleServicesTemplateSelect = (
    template: "grid-1" | "grid-2" | "list-1" | "grid-3"
  ) => {
    const servicesData = {
      ...defaultServicesData,
      style: template,
    };

    createServicesComponentMutation.mutate(servicesData, {
      onSuccess: () => {
        setIsServicesStylesDialogOpen(false);
      },
      onError: error => {
        console.error("Failed to create services component:", error);
      },
    });
  };

  const handleTeamTemplateSelect = (
    template: "grid-1" | "grid-2" | "list-1" | "card-4"
  ) => {
    const teamData: ComponentTypeMap["team"] = {
      ...defaultTeamData,
      style: template as ComponentTypeMap["team"]["style"],
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
    template:
      | "accordion"
      | "plus-minus"
      | "card-grid"
      | "card-grid-4"
      | "simple"
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

  const handleAddServices = () => {
    setIsServicesStylesDialogOpen(true);
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

  const handleAddPolicies = () => {
    setIsPoliciesStylesDialogOpen(true);
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
        case "services-sections":
          componentType = "services";
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
        case "policies-sections":
          componentType = "policies";
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
              "services",
              "contact",
              "team",
              "testimonials",
              "faq",
              "portfolio",
              "banner",
              "newsletter",
              "youtube",
              "policies",
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
      {/* All dialog components */}
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

      <PageTemplateDialog
        isOpen={isPageTemplateDialogOpen}
        onClose={() => setIsPageTemplateDialogOpen(false)}
        onSelectTemplate={handlePageTemplateSelect}
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

      <ServicesStyleDialog
        open={isServicesStylesDialogOpen}
        onOpenChange={setIsServicesStylesDialogOpen}
        onStyleSelect={handleServicesTemplateSelect}
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

      <PoliciesStylesDialog
        open={isPoliciesStylesDialogOpen}
        onOpenChange={setIsPoliciesStylesDialogOpen}
        onStyleSelect={handlePoliciesTemplateSelect}
      />

      <TopNavigation
        pages={pagesData}
        templateSlug={templateSlug}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onPageCreated={handlePageCreated}
        onPageDeleted={handlePageDeleted}
      />

      <div className="bg-background flex min-h-screen flex-col">
        <div className="flex flex-1">
          <ComponentSidebar onComponentClick={handleComponentClick} />

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
                  templateSlug={templateSlug}
                  isLoading={isPageComponentsLoading}
                  error={pageComponentsError}
                  onAddHero={handleAddHeroFromCanvas}
                  onAddAboutUs={handleAddAboutUsFromCanvas}
                  onAddProducts={handleAddProducts}
                  onAddCategories={handleAddCategories}
                  onAddSubCategories={handleAddSubCategories}
                  onAddBlog={handleAddBlog}
                  onAddServices={handleAddServices}
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
