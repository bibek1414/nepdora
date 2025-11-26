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
import {
  defaultHeroData,
  heroTemplateConfigs,
  heroTemplateContent,
} from "@/types/owner-site/components/hero";
import { usePageComponentsQuery } from "@/hooks/owner-site/components/use-unified";
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
  defaultAboutUs9Data,
  defaultAboutUs10Data,
} from "@/types/owner-site/components/about";
import { AboutUsData } from "@/types/owner-site/components/about";
import { defaultProductsData } from "@/types/owner-site/components/products";
import { Facebook, Twitter } from "lucide-react";
import { defaultBlogData } from "@/types/owner-site/components/blog";
import { BlogStylesDialog } from "@/components/site-owners/builder/blog/blog-style-dialog";
import { defaultServicesData } from "@/types/owner-site/components/services";
import {
  ComponentResponse,
  ComponentTypeMap,
} from "@/types/owner-site/components/components";
import { defaultContactData } from "@/types/owner-site/components/contact";
import { defaultTeamData } from "@/types/owner-site/components/team";
import { defaultTestimonialsData } from "@/types/owner-site/components/testimonials";
import { defaultFAQData } from "@/types/owner-site/components/faq";
import { PortfolioStylesDialog } from "@/components/site-owners/builder/portfolio/portfolio-styles-dialog";
import { defaultPortfolioData } from "@/types/owner-site/components/portfolio";
import { BannerStylesDialog } from "@/components/site-owners/builder/banner/banner-styles-dialog";
import { defaultBannerData } from "@/types/owner-site/components/banner";
import { defaultNewsletterData } from "@/types/owner-site/components/newsletter";
import { defaultYouTubeData } from "@/types/owner-site/components/youtube";
import { PageTemplateDialog } from "@/components/site-owners/builder/templates/page-template-dialog";
import { PageTemplate } from "@/types/owner-site/components/page-template";
import { ComponentOutlineSidebar } from "@/components/site-owners/builder/builder/component-outline-sidebar";
import { GalleryStylesDialog } from "@/components/site-owners/builder/gallery/gallery-styles-dialog";
import { defaultGalleryData } from "@/types/owner-site/components/gallery";
import { useQueryClient } from "@tanstack/react-query";
import { TextEditorStylesDialog } from "../text-editor/text-editor-dialog";
import { defaultTextEditorData } from "@/types/owner-site/components/text-editor";
import {
  defaultReturnExchangeData,
  defaultShippingData,
  defaultPrivacyData,
  defaultTermsData,
} from "@/types/owner-site/components/policies";
import { toast } from "sonner";
import { componentsApi } from "@/services/api/owner-sites/components/unified";
import { TextSelectionProvider } from "@/contexts/text-selection-context";
import { StickyFormattingToolbar } from "./sticky-formatting-toolbar";
import OnboardingModal from "@/components/on-boarding/admin/on-boarding-component";
import { useAuth } from "@/hooks/use-auth";
import { decodeJwt } from "@/lib/utils";
import { useUpdateComponentOrderMutation } from "@/hooks/owner-site/components/use-unified";
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

  // Add Section state with pending insert index
  const [isAddSectionDialogOpen, setIsAddSectionDialogOpen] = useState(false);
  const [pendingInsertIndex, setPendingInsertIndex] = useState<
    number | undefined
  >(undefined);

  // Dialog states
  const [isGalleryStylesDialogOpen, setIsGalleryStylesDialogOpen] =
    useState(false);
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
  const [isTextEditorStylesDialogOpen, setIsTextEditorStylesDialogOpen] =
    useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Enhanced onboarding check that prioritizes localStorage
  useEffect(() => {
    if (!user) {
      setShowOnboarding(false);
      return;
    }

    const checkOnboardingStatus = () => {
      // Check multiple sources for the most current data
      const sources = [];

      // Source 1: User context
      if (typeof user.is_onboarding_complete !== "undefined") {
        sources.push({ source: "context", value: user.is_onboarding_complete });
      }

      // Source 2: localStorage (most up-to-date after API call)
      try {
        const storedUser = localStorage.getItem("authUser");
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (typeof parsed.is_onboarding_complete !== "undefined") {
            sources.push({
              source: "localStorage",
              value: parsed.is_onboarding_complete,
            });
          }
        }
      } catch (error) {
        console.error("Error reading localStorage:", error);
      }

      // Source 3: JWT token from authTokens
      try {
        const storedTokens = localStorage.getItem("authTokens");
        if (storedTokens) {
          const tokens = JSON.parse(storedTokens);
          if (tokens.access_token) {
            const payload = decodeJwt(tokens.access_token);
            if (payload?.is_onboarding_complete !== undefined) {
              sources.push({
                source: "JWT",
                value: Boolean(payload.is_onboarding_complete),
              });
            }
          }
        }
      } catch (error) {
        console.error("Error decoding JWT:", error);
      }

      console.log("🔍 ONBOARDING STATUS CHECK - All sources:", sources);

      // Priority: localStorage > JWT > context
      const localStorageSource = sources.find(s => s.source === "localStorage");
      if (localStorageSource) {
        console.log("✅ Using localStorage value:", localStorageSource.value);
        return localStorageSource.value;
      }

      const jwtSource = sources.find(s => s.source === "JWT");
      if (jwtSource) {
        console.log("✅ Using JWT value:", jwtSource.value);
        return jwtSource.value;
      }

      const contextSource = sources.find(s => s.source === "context");
      if (contextSource) {
        console.log("✅ Using context value:", contextSource.value);
        return contextSource.value;
      }

      // Default to true (don't show onboarding) if we can't determine
      console.log("✅ No sources found, defaulting to true");
      return true;
    };

    const onboardingComplete = checkOnboardingStatus();
    console.log(
      "🎯 Final onboarding decision - show modal?",
      !onboardingComplete
    );

    setShowOnboarding(!onboardingComplete);
  }, [user]);
  // Queries and Mutations
  const { data: navbarResponse, isLoading: isNavbarLoading } = useNavbarQuery();
  const createNavbarMutation = useCreateNavbarMutation();

  const { data: footerResponse, isLoading: isFooterLoading } = useFooterQuery();
  const createFooterMutation = useCreateFooterMutation();

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
  const updateOrderMutation = useUpdateComponentOrderMutation(currentPage);

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
            "gallery",
            "policies",
            "text_editor",
          ].includes(component.component_type);
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
    const names: Record<string, string> = {
      hero: "Hero",
      about: "About Us",
      products: "Products",
      category: "Category",
      subcategory: "SubCategory",
      blog: "Blog",
      services: "Services",
      contact: "Contact",
      team: "Team",
      testimonials: "Testimonials",
      faq: "FAQ",
      portfolio: "Portfolio",
      banner: "Banner",
      newsletter: "Newsletter",
      youtube: "YouTube",
      gallery: "Gallery",
      policies: "Policies",
      text_editor: "Text Editor",
    };
    return names[componentType] || componentType;
  };

  const createComponentWithIndex = async (
    componentType: keyof ComponentTypeMap,
    data: ComponentTypeMap[keyof ComponentTypeMap],
    insertIndex?: number
  ) => {
    const displayName = getComponentDisplayName(componentType);
    const toastId = `add-${componentType}-${Date.now()}`;

    try {
      toast.loading(`Adding ${displayName}...`, { id: toastId });

      setIsAddSectionDialogOpen(false);
      setPendingInsertIndex(undefined);

      const currentComponents =
        queryClient.getQueryData<ComponentResponse[]>([
          "pageComponents",
          currentPage,
        ]) || pageComponents;

      // The API now handles order updates internally
      await componentsApi.createComponent(
        currentPage,
        {
          component_type: componentType,
          data,
          order: insertIndex ?? currentComponents.length,
        },
        currentComponents,
        insertIndex
      );

      await queryClient.invalidateQueries({
        queryKey: ["pageComponents", currentPage],
      });

      toast.success(`${displayName} added successfully!`, { id: toastId });
    } catch (error) {
      console.error(`Failed to create ${componentType} component:`, error);

      await queryClient.invalidateQueries({
        queryKey: ["pageComponents", currentPage],
      });

      toast.error(`Failed to add ${displayName}`, { id: toastId });
      throw error;
    }
  };
  // Onboarding handlers
  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  const handleOpenOnboarding = () => {
    setShowOnboarding(true);
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Optional: Refresh user data or invalidate queries
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
    let insertIndex: number;

    if (index !== undefined) {
      insertIndex = position === "above" ? index : index + 1;
    } else {
      insertIndex = pageComponents.length;
    }

    setPendingInsertIndex(insertIndex);
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

    createNavbarMutation.mutate(payload, {
      onSuccess: () => {
        console.log("Navbar created successfully from dialog");
      },
      onError: error => {
        console.error("Failed to create navbar from dialog:", error);
        toast.error("Failed to create navbar", { id: toastId });
      },
    });
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

  // Footer handlers
  const handleFooterSelectFromDialog = (
    footerStyle:
      | "style-1"
      | "style-2"
      | "style-3"
      | "style-4"
      | "style-5"
      | "style-6"
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

    const toastId = "footer-create";

    createFooterMutation.mutate(payload, {
      onSuccess: () => {
        console.log("Footer created successfully from dialog");
        toast.success("Footer added successfully!", { id: toastId });
      },
      onError: error => {
        console.error("Failed to create footer from dialog:", error);
        toast.error("Failed to create footer", { id: toastId });
      },
    });
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

    const toastId = "footer-create";

    createFooterMutation.mutate(payload, {
      onSuccess: () => {
        setIsFooterDialogOpen(false);
        toast.success("Footer added successfully!", { id: toastId });
      },
      onError: () => {
        toast.error("Failed to add footer", { id: toastId });
      },
    });
  };

  // Template selection handlers with insertIndex support
  const handleHeroTemplateSelect = async (
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
      | "hero-11"
  ) => {
    const templateConfig = heroTemplateConfigs[template];
    const templateContent = heroTemplateContent[template] || {};
    const heroData = {
      ...defaultHeroData,
      ...templateContent,
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

    setIsHeroStylesDialogOpen(false);
    await createComponentWithIndex("hero", heroData, pendingInsertIndex);
  };

  const handleAboutUsTemplateSelect = async (
    template:
      | "about-1"
      | "about-2"
      | "about-3"
      | "about-4"
      | "about-5"
      | "about-6"
      | "about-7"
      | "about-8"
      | "about-9"
      | "about-10"
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
      case "about-9":
        aboutUsData = defaultAboutUs9Data;
        break;
      case "about-10":
        aboutUsData = defaultAboutUs10Data;
        break;
      default:
        aboutUsData = defaultAboutUs1Data;
    }

    setIsAboutUsStylesDialogOpen(false);
    await createComponentWithIndex("about", aboutUsData, pendingInsertIndex);
  };

  const handleProductsTemplateSelect = async (
    template:
      | "product-1"
      | "product-2"
      | "product-3"
      | "product-4"
      | "product-5"
      | "product-6"
      | "product-7"
  ) => {
    const productsData = { ...defaultProductsData, style: template };
    setIsProductsStylesDialogOpen(false);
    await createComponentWithIndex(
      "products",
      productsData,
      pendingInsertIndex
    );
  };

  const handleCategoryTemplateSelect = async (
    template:
      | "category-1"
      | "category-2"
      | "category-3"
      | "category-4"
      | "category-5"
      | "category-6"
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
    setIsCategoriesStylesDialogOpen(false);
    await createComponentWithIndex(
      "category",
      categoryData,
      pendingInsertIndex
    );
  };

  const handleSubCategoryTemplateSelect = async (
    template: "subcategory-1" | "subcategory-2" | "subcategory-3"
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
    setIsSubCategoriesStylesDialogOpen(false);
    await createComponentWithIndex(
      "subcategory",
      subCategoryData,
      pendingInsertIndex
    );
  };

  const handleBlogTemplateSelect = async (
    template: "blog-1" | "blog-2" | "blog-3" | "blog-4"
  ) => {
    const blogData = { ...defaultBlogData, style: template };
    setIsBlogStylesDialogOpen(false);
    await createComponentWithIndex("blog", blogData, pendingInsertIndex);
  };

  const handleServicesTemplateSelect = async (
    template:
      | "services-1"
      | "services-2"
      | "services-3"
      | "services-4"
      | "services-5"
  ) => {
    const servicesData = { ...defaultServicesData, style: template };
    setIsServicesStylesDialogOpen(false);
    await createComponentWithIndex(
      "services",
      servicesData,
      pendingInsertIndex
    );
  };

  const handleContactTemplateSelect = async (
    template: "contact-1" | "contact-2" | "contact-3" | "contact-4"
  ) => {
    const contactData = { ...defaultContactData, style: template };
    setIsContactStylesDialogOpen(false);
    await createComponentWithIndex("contact", contactData, pendingInsertIndex);
  };

  const handleTeamTemplateSelect = async (
    template: "team-1" | "team-2" | "team-3" | "team-4" | "team-5"
  ) => {
    const teamData: ComponentTypeMap["team"] = {
      ...defaultTeamData,
      style: template as ComponentTypeMap["team"]["style"],
    };
    setIsTeamStylesDialogOpen(false);
    await createComponentWithIndex("team", teamData, pendingInsertIndex);
  };

  const handleTestimonialsTemplateSelect = async (
    template:
      | "testimonial-1"
      | "testimonial-2"
      | "testimonial-3"
      | "testimonial-4"
      | "testimonial-5"
      | "testimonial-6"
      | "testimonial-7"
      | "testimonial-8"
  ) => {
    const testimonialsData = { ...defaultTestimonialsData, style: template };
    setIsTestimonialsStylesDialogOpen(false);
    await createComponentWithIndex(
      "testimonials",
      testimonialsData,
      pendingInsertIndex
    );
  };

  const handleFAQTemplateSelect = async (
    template: "faq-1" | "faq-2" | "faq-3" | "faq-4" | "faq-5" | "faq-6"
  ) => {
    const faqData = { ...defaultFAQData, style: template };
    setIsFAQStylesDialogOpen(false);
    await createComponentWithIndex("faq", faqData, pendingInsertIndex);
  };

  const handlePortfolioTemplateSelect = async (
    template: "portfolio-1" | "portfolio-2" | "portfolio-3" | "portfolio-4"
  ) => {
    const portfolioData = { ...defaultPortfolioData, style: template };
    setIsPortfolioStylesDialogOpen(false);
    await createComponentWithIndex(
      "portfolio",
      portfolioData,
      pendingInsertIndex
    );
  };

  const handleBannerTemplateSelect = async (
    template: "banner-1" | "banner-2" | "banner-3" | "banner-4"
  ) => {
    const bannerData = { ...defaultBannerData, template: template };
    setIsBannerStylesDialogOpen(false);
    await createComponentWithIndex("banner", bannerData, pendingInsertIndex);
  };

  const handleNewsletterTemplateSelect = async (
    template: "newsletter-1" | "newsletter-2" | "newsletter-3"
  ) => {
    const newsletterData = { ...defaultNewsletterData, style: template };
    setIsNewsletterStylesDialogOpen(false);
    await createComponentWithIndex(
      "newsletter",
      newsletterData,
      pendingInsertIndex
    );
  };

  const handleYouTubeTemplateSelect = async (
    template: "youtube-1" | "youtube-2" | "youtube-3"
  ) => {
    const youtubeData = { ...defaultYouTubeData, style: template };
    setIsYouTubeStylesDialogOpen(false);
    await createComponentWithIndex("youtube", youtubeData, pendingInsertIndex);
  };

  const handleGalleryTemplateSelect = async (
    template:
      | "gallery-1"
      | "gallery-2"
      | "gallery-3"
      | "gallery-4"
      | "gallery-5"
  ) => {
    const galleryData = { ...defaultGalleryData, template: template };
    setIsGalleryStylesDialogOpen(false);
    await createComponentWithIndex("gallery", galleryData, pendingInsertIndex);
  };

  const handlePoliciesTemplateSelect = async (
    template: "policies-1" | "policies-2" | "policies-3" | "policies-4"
  ) => {
    let policyData;
    switch (template) {
      case "policies-1":
        policyData = defaultReturnExchangeData;
        break;
      case "policies-2":
        policyData = defaultShippingData;
        break;
      case "policies-3":
        policyData = defaultPrivacyData;
        break;
      case "policies-4":
        policyData = defaultTermsData;
        break;
      default:
        policyData = defaultReturnExchangeData;
    }
    setIsPoliciesStylesDialogOpen(false);
    await createComponentWithIndex("policies", policyData, pendingInsertIndex);
  };

  const handleTextEditorTemplateSelect = async () => {
    setIsTextEditorStylesDialogOpen(false);
    await createComponentWithIndex(
      "text_editor",
      defaultTextEditorData,
      pendingInsertIndex
    );
  };

  // Page template handler
  const handlePageTemplateSelect = async (template: PageTemplate) => {
    const toastId = "page-template-create";

    try {
      toast.loading(`Creating ${template.name} page...`, { id: toastId });

      const newPage = await createPageMutation.mutateAsync({
        title: template.name,
      });
      const existingComponents = await componentsApi.getPageComponents(
        newPage.slug
      );

      for (const component of template.components) {
        const componentData = {
          ...component.defaultData,
          order: component.order,
        };
        await componentsApi.createComponent(
          newPage.slug,
          {
            component_type: component.type as keyof ComponentTypeMap,
            data: componentData,
            order: component.order,
          },
          existingComponents
        );
      }

      queryClient.invalidateQueries({
        queryKey: ["pageComponents", newPage.slug],
      });
      queryClient.invalidateQueries({ queryKey: ["pageComponents"] });
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

  // Add handlers that store insertIndex and open dialogs
  const handleAddHeroFromCanvas = (insertIndex?: number) => {
    setPendingInsertIndex(insertIndex);
    setIsHeroStylesDialogOpen(true);
  };

  const handleAddAboutUsFromCanvas = (insertIndex?: number) => {
    setPendingInsertIndex(insertIndex);
    setIsAboutUsStylesDialogOpen(true);
  };

  const handleAddProducts = (insertIndex?: number) => {
    setPendingInsertIndex(insertIndex);
    setIsProductsStylesDialogOpen(true);
  };

  const handleAddCategories = (insertIndex?: number) => {
    setPendingInsertIndex(insertIndex);
    setIsCategoriesStylesDialogOpen(true);
  };

  const handleAddSubCategories = (insertIndex?: number) => {
    setPendingInsertIndex(insertIndex);
    setIsSubCategoriesStylesDialogOpen(true);
  };

  const handleAddBlog = (insertIndex?: number) => {
    setPendingInsertIndex(insertIndex);
    setIsBlogStylesDialogOpen(true);
  };

  const handleAddServices = (insertIndex?: number) => {
    setPendingInsertIndex(insertIndex);
    setIsServicesStylesDialogOpen(true);
  };

  const handleAddContact = (insertIndex?: number) => {
    setPendingInsertIndex(insertIndex);
    setIsContactStylesDialogOpen(true);
  };

  const handleAddTeam = (insertIndex?: number) => {
    setPendingInsertIndex(insertIndex);
    setIsTeamStylesDialogOpen(true);
  };

  const handleAddTestimonials = (insertIndex?: number) => {
    setPendingInsertIndex(insertIndex);
    setIsTestimonialsStylesDialogOpen(true);
  };

  const handleAddFAQ = (insertIndex?: number) => {
    setPendingInsertIndex(insertIndex);
    setIsFAQStylesDialogOpen(true);
  };

  const handleAddPortfolio = (insertIndex?: number) => {
    setPendingInsertIndex(insertIndex);
    setIsPortfolioStylesDialogOpen(true);
  };

  const handleAddBanner = (insertIndex?: number) => {
    setPendingInsertIndex(insertIndex);
    setIsBannerStylesDialogOpen(true);
  };

  const handleAddNewsletter = (insertIndex?: number) => {
    setPendingInsertIndex(insertIndex);
    setIsNewsletterStylesDialogOpen(true);
  };

  const handleAddYouTube = (insertIndex?: number) => {
    setPendingInsertIndex(insertIndex);
    setIsYouTubeStylesDialogOpen(true);
  };

  const handleAddGallery = (insertIndex?: number) => {
    setPendingInsertIndex(insertIndex);
    setIsGalleryStylesDialogOpen(true);
  };

  const handleAddPolicies = (insertIndex?: number) => {
    setPendingInsertIndex(insertIndex);
    setIsPoliciesStylesDialogOpen(true);
  };

  const handleAddTextEditor = (insertIndex?: number) => {
    setPendingInsertIndex(insertIndex);
    setIsTextEditorStylesDialogOpen(true);
  };
  // Replace your current useEffect with this:
  useEffect(() => {
    const checkOnboardingStatus = () => {
      // First, try to get from user context
      if (user && typeof user.is_onboarding_complete !== "undefined") {
        return user.is_onboarding_complete;
      }

      // Fallback: check localStorage directly
      try {
        const storedUser = localStorage.getItem("authUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          // Check both possible field names
          return (
            parsedUser.is_onboarding_complete ?? parsedUser.onboarding_complete
          );
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }

      // Default to true (don't show onboarding) if we can't determine
      return true;
    };

    const isOnboardingComplete = checkOnboardingStatus();
    console.log("Onboarding status:", {
      fromContext: user?.is_onboarding_complete,
      finalResult: isOnboardingComplete,
    });

    // Only show onboarding if it's explicitly false
    setShowOnboarding(isOnboardingComplete === false);
  }, [user]);
  // Component click handler for Add Section Dialog
  const handleComponentClick = (componentId: string, template?: string) => {
    if (componentId === "page-templates") {
      setIsPageTemplateDialogOpen(true);
    } else if (componentId === "hero-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleHeroTemplateSelect(template as any);
      } else {
        setIsHeroStylesDialogOpen(true);
      }
    } else if (componentId === "about-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleAboutUsTemplateSelect(template as any);
      } else {
        setIsAboutUsStylesDialogOpen(true);
      }
    } else if (componentId === "products-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleProductsTemplateSelect(template as any);
      } else {
        setIsProductsStylesDialogOpen(true);
      }
    } else if (componentId === "categories-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleCategoryTemplateSelect(template as any);
      } else {
        setIsCategoriesStylesDialogOpen(true);
      }
    } else if (componentId === "subcategories-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleSubCategoryTemplateSelect(template as any);
      } else {
        setIsSubCategoriesStylesDialogOpen(true);
      }
    } else if (componentId === "services-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleServicesTemplateSelect(template as any);
      } else {
        setIsServicesStylesDialogOpen(true);
      }
    } else if (componentId === "contact-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleContactTemplateSelect(template as any);
      } else {
        setIsContactStylesDialogOpen(true);
      }
    } else if (componentId === "team-members-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleTeamTemplateSelect(template as any);
      } else {
        setIsTeamStylesDialogOpen(true);
      }
    } else if (componentId === "testimonials-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleTestimonialsTemplateSelect(template as any);
      } else {
        setIsTestimonialsStylesDialogOpen(true);
      }
    } else if (componentId === "gallery-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleGalleryTemplateSelect(template as any);
      } else {
        setIsGalleryStylesDialogOpen(true);
      }
    } else if (componentId === "blog-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleBlogTemplateSelect(template as any);
      } else {
        setIsBlogStylesDialogOpen(true);
      }
    } else if (componentId === "faq-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleFAQTemplateSelect(template as any);
      } else {
        setIsFAQStylesDialogOpen(true);
      }
    } else if (componentId === "portfolio-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handlePortfolioTemplateSelect(template as any);
      } else {
        setIsPortfolioStylesDialogOpen(true);
      }
    } else if (componentId === "banner-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleBannerTemplateSelect(template as any);
      } else {
        setIsBannerStylesDialogOpen(true);
      }
    } else if (componentId === "youtube-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleYouTubeTemplateSelect(template as any);
      } else {
        setIsYouTubeStylesDialogOpen(true);
      }
    } else if (componentId === "newsletter-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleNewsletterTemplateSelect(template as any);
      } else {
        setIsNewsletterStylesDialogOpen(true);
      }
    } else if (componentId === "policies-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handlePoliciesTemplateSelect(template as any);
      } else {
        setIsPoliciesStylesDialogOpen(true);
      }
    } else if (componentId === "text-editor-sections") {
      if (template) {
        handleTextEditorTemplateSelect();
      } else {
        setIsTextEditorStylesDialogOpen(true);
      }
    } else {
      console.log(`${componentId} clicked`);
    }
  };

  // Drop handler
  const handleDrop = useCallback(
    (item: { type: string; id?: string }) => {
      if (item.type === "navbar" || item.type === "footer") return;

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
        case "text-editor-sections":
          componentType = "text_editor";
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
        case "policies-sections":
          componentType = "policies";
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
        case "gallery-sections":
          componentType = "gallery";
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
              "services",
              "contact",
              "team",
              "testimonials",
              "faq",
              "portfolio",
              "banner",
              "newsletter",
              "youtube",
              "text_editor",
              "gallery",
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
        order: pageComponents.length,
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
    <TextSelectionProvider>
      <DndProvider backend={HTML5Backend}>
        {showOnboarding && user && (
          <OnboardingModal
            userData={{
              storeName: user.store_name || "",
              email: user.email,
              phoneNumber: user.phone_number || "",
            }}
            isOverlay={true}
            onClose={handleCloseOnboarding}
            onComplete={handleOnboardingComplete}
          />
        )}
        {/* All Dialog Components */}
        <AddSectionDialog
          open={isAddSectionDialogOpen}
          onOpenChange={setIsAddSectionDialogOpen}
          onComponentClick={handleComponentClick}
          onNavbarSelect={handleNavbarSelectFromDialog}
          onFooterSelect={handleFooterSelectFromDialog}
          websiteType={user?.website_type || "ecommerce"}
        />

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

        <TextEditorStylesDialog
          open={isTextEditorStylesDialogOpen}
          onOpenChange={setIsTextEditorStylesDialogOpen}
          onStyleSelect={handleTextEditorTemplateSelect}
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
        <GalleryStylesDialog
          open={isGalleryStylesDialogOpen}
          onOpenChange={setIsGalleryStylesDialogOpen}
          onStyleSelect={handleGalleryTemplateSelect}
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

        <BannerStylesDialog
          open={isBannerStylesDialogOpen}
          onOpenChange={setIsBannerStylesDialogOpen}
          onStyleSelect={handleBannerTemplateSelect}
        />

        {/* Top Navigation */}
        <TopNavigation
          pages={pagesData}
          currentPage={currentPage}
          siteUser={siteUser}
          onPageChange={handlePageChange}
          onPageCreated={handlePageCreated}
          onPageDeleted={handlePageDeleted}
          onOpenOnboarding={handleOpenOnboarding}
          isOnboardingComplete={user?.is_onboarding_complete}
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
                    onAddServices={handleAddServices}
                    onAddContact={handleAddContact}
                    onAddTeam={handleAddTeam}
                    onAddTestimonials={handleAddTestimonials}
                    onAddFAQ={handleAddFAQ}
                    onAddPortfolio={handleAddPortfolio}
                    onAddBanner={handleAddBanner}
                    onAddNewsletter={handleAddNewsletter}
                    onAddYouTube={handleAddYouTube}
                    onAddGallery={handleAddGallery}
                    onAddPolicies={handleAddPolicies}
                    onAddSection={handleAddSection}
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
