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
import { CTAData } from "@/types/owner-site/components/cta";
import { NavbarData } from "@/types/owner-site/components/navbar";
import { NavbarTemplateDialog } from "@/components/site-owners/builder/navbar/navbar-template-dialog";
import { usePages } from "@/hooks/owner-site/use-page";
import { useCreatePage } from "@/hooks/owner-site/use-page";
import { Page } from "@/types/owner-site/components/page";
import {
  useFooterQuery,
  useCreateFooterMutation,
} from "@/hooks/owner-site/components/use-footer";
import { ComponentOutlineSidebar } from "@/components/site-owners/builder/builder/component-outline-sidebar";
import { defaultGalleryData } from "@/types/owner-site/components/gallery";
import { useQueryClient } from "@tanstack/react-query";
import { defaultTextEditorData } from "@/types/owner-site/components/text-editor";
import { defaultPricingData } from "@/types/owner-site/components/pricing";

import {
  defaultReturnExchangeData,
  defaultShippingData,
  defaultPrivacyData,
  defaultTermsData,
} from "@/types/owner-site/components/policies";
import { toast } from "sonner";
import {
  ComponentResponse,
  ComponentTypeMap,
} from "@/types/owner-site/components/components";
import {
  ContactData,
  defaultContactData,
  defaultContactData2,
  defaultContactData3,
  defaultContactData4,
  defaultContactData5,
  defaultContactData6,
  defaultContactData7,
  defaultContactData8,
  defaultContactData9,
} from "@/types/owner-site/components/contact";
import { getDefaultCTAData } from "@/types/owner-site/components/cta";
import {
  getDefaultHeroData,
  HeroData,
} from "@/types/owner-site/components/hero";
import {
  getDefaultOthersData,
  OthersData,
} from "@/types/owner-site/components/others";
import {
  getDefaultAboutUsData,
  AboutUsData,
} from "@/types/owner-site/components/about";
import { defaultProductsData } from "@/types/owner-site/components/products";
import { defaultBlogData } from "@/types/owner-site/components/blog";
import { defaultOurClientsData } from "@/types/owner-site/components/our-client";
import { defaultServicesData } from "@/types/owner-site/components/services";
import { defaultAppointmentData } from "@/types/owner-site/components/appointment";
import { defaultTeamData } from "@/types/owner-site/components/team";
import { defaultTestimonialsData } from "@/types/owner-site/components/testimonials";
import { defaultFAQData } from "@/types/owner-site/components/faq";
import { defaultPortfolioData } from "@/types/owner-site/components/portfolio";
import { defaultBannerData } from "@/types/owner-site/components/banner";
import { defaultNewsletterData } from "@/types/owner-site/components/newsletter";
import { defaultVideosData } from "@/types/owner-site/components/videos";
import { PageTemplateDialog } from "@/components/site-owners/builder/templates/page-template-dialog";
import { PageTemplate } from "@/types/owner-site/components/page-template";
import { usePageComponentsQuery } from "@/hooks/owner-site/components/use-unified";
import { componentsApi } from "@/services/api/owner-sites/components/unified";
import { TextSelectionProvider } from "@/contexts/text-selection-context";
import { StickyFormattingToolbar } from "./sticky-formatting-toolbar";
import { useAuth } from "@/hooks/use-auth";
import { Facebook, Twitter } from "lucide-react";

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
  const [pendingReplaceId, setPendingReplaceId] = useState<string | null>(null);

  // Dialog states
  // Dialog states
  const [isNavbarDialogOpen, setIsNavbarDialogOpen] = useState(false);
  const [isPageTemplateDialogOpen, setIsPageTemplateDialogOpen] =
    useState(false);
  // Queries and Mutations
  const { data: navbarResponse, isLoading: isNavbarLoading } = useNavbarQuery();
  const createNavbarMutation = useCreateNavbarMutation();
  const createFooterMutation = useCreateFooterMutation();
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
            "others",
            "about",
            "products",
            "category",
            "subcategory",
            "blog",
            "services",
            "contact",
            "appointment",
            "our_clients",
            "cta",
            "team",
            "testimonials",
            "faq",
            "portfolio",
            "banner",
            "newsletter",
            "videos",
            "gallery",
            "policies",
            "pricing",
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
      others: "Others",
      about: "About Us",
      products: "Products",
      category: "Category",
      subcategory: "SubCategory",
      blog: "Blog",
      services: "Services",
      contact: "Contact",
      cta: "CTA",
      appointment: "Appointment",
      our_clients: "Our Clients",
      team: "Team",
      testimonials: "Testimonials",
      faq: "FAQ",
      portfolio: "Portfolio",
      banner: "Banner",
      newsletter: "Newsletter",
      videos: "Videos",
      gallery: "Gallery",
      policies: "Policies",
      pricing: "Pricing",
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

      const currentComponents =
        queryClient.getQueryData<ComponentResponse[]>([
          "pageComponents",
          currentPage,
        ]) || pageComponents;

      let componentId = "";
      if (mode === "replace" && replaceId) {
        const componentToReplace = currentComponents.find(
          c => c.component_id === replaceId
        );
        const order = componentToReplace?.order ?? 0;

        const replacedComponent = await componentsApi.replaceComponent(
          currentPage,
          replaceId,
          {
            component_type: componentType,
            data,
            order,
          }
        );
        componentId = replacedComponent.component_id;
      } else {
        // The API now handles order updates internally
        const newComponent = await componentsApi.createComponent(
          currentPage,
          {
            component_type: componentType,
            data,
            order: insertIndex ?? currentComponents.length,
          },
          currentComponents,
          insertIndex
        );
        componentId = newComponent.component_id;
      }

      await queryClient.invalidateQueries({
        queryKey: ["pageComponents", currentPage],
      });

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

      await queryClient.invalidateQueries({
        queryKey: ["pageComponents", currentPage],
      });

      toast.error(`Failed to add ${displayName}`, { id: toastId });
      throw error;
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

  const handleReplaceSection = (componentId: string) => {
    setPendingReplaceId(componentId);
    setPendingInsertIndex(undefined);
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
      onSuccess: () => {},
      onError: error => {
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
  const handleCTATemplateSelect = async (template: CTAData["template"]) => {
    const ctaData = getDefaultCTAData(template);

    await createComponentWithIndex("cta", ctaData, pendingInsertIndex);
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
  // Add handler for opening CTA dialog
  const handleAddCTA = (insertIndex?: number) => {
    setPendingInsertIndex(insertIndex);

    handleCTATemplateSelect("cta-1");
  };

  // Template selection handlers with insertIndex support
  const handleHeroTemplateSelect = async (template: HeroData["template"]) => {
    // Get ONLY the data needed for this specific template
    const heroData = getDefaultHeroData(template);

    // This will now send only the necessary fields for the selected template
    await createComponentWithIndex("hero", heroData, pendingInsertIndex);
  };
  const handleOthersTemplateSelect = async (
    template: OthersData["template"]
  ) => {
    const othersData = getDefaultOthersData(template);

    await createComponentWithIndex("others", othersData, pendingInsertIndex);
  };

  const handleAboutUsTemplateSelect = async (
    template: AboutUsData["template"]
  ) => {
    const aboutUsData = getDefaultAboutUsData(template);

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

    await createComponentWithIndex(
      "subcategory",
      subCategoryData,
      pendingInsertIndex
    );
  };

  const handleBlogTemplateSelect = async (
    template: "blog-1" | "blog-2" | "blog-3" | "blog-4" | "blog-5" | "blog-6"
  ) => {
    const blogData = { ...defaultBlogData, style: template };

    await createComponentWithIndex("blog", blogData, pendingInsertIndex);
  };

  const handleOurClientsTemplateSelect = async (
    template: "our-clients-1" | "our-clients-2" | "our-clients-3"
  ) => {
    const ourClientsData = { ...defaultOurClientsData, style: template };

    await createComponentWithIndex(
      "our_clients",
      ourClientsData,
      pendingInsertIndex
    );
  };
  const handleServicesTemplateSelect = async (
    template:
      | "services-1"
      | "services-2"
      | "services-3"
      | "services-4"
      | "services-5"
      | "services-6"
  ) => {
    const servicesData = { ...defaultServicesData, style: template };

    await createComponentWithIndex(
      "services",
      servicesData,
      pendingInsertIndex
    );
  };
  const defaultContactMap: Record<ContactData["style"], ContactData> = {
    "contact-1": defaultContactData,
    "contact-2": defaultContactData2,
    "contact-3": defaultContactData3,
    "contact-4": defaultContactData4,
    "contact-5": defaultContactData5,
    "contact-6": defaultContactData6,
    "contact-7": defaultContactData7,
    "contact-8": defaultContactData8,
    "contact-9": defaultContactData9,
  };

  const handleContactTemplateSelect = async (
    template: ContactData["style"]
  ) => {
    const contactData = defaultContactMap[template];

    await createComponentWithIndex("contact", contactData, pendingInsertIndex);
  };

  const handleTeamTemplateSelect = async (
    template: "team-1" | "team-2" | "team-3" | "team-4" | "team-5" | "team-6"
  ) => {
    const teamData: ComponentTypeMap["team"] = {
      ...defaultTeamData,
      style: template as ComponentTypeMap["team"]["style"],
    };

    await createComponentWithIndex("team", teamData, pendingInsertIndex);
  };
  const handleAppointmentTemplateSelect = async (
    template: "appointment-1" | "appointment-2" | "appointment-3"
  ) => {
    const appointmentData: ComponentTypeMap["appointment"] = {
      ...defaultAppointmentData,
      style: template as ComponentTypeMap["appointment"]["style"],
    };

    await createComponentWithIndex(
      "appointment",
      appointmentData,
      pendingInsertIndex
    );
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
      | "testimonial-9"
      | "testimonial-10"
  ) => {
    const testimonialsData = { ...defaultTestimonialsData, style: template };

    await createComponentWithIndex(
      "testimonials",
      testimonialsData,
      pendingInsertIndex
    );
  };

  const handleFAQTemplateSelect = async (
    template:
      | "faq-1"
      | "faq-2"
      | "faq-3"
      | "faq-4"
      | "faq-5"
      | "faq-6"
      | "faq-7"
  ) => {
    const faqData = { ...defaultFAQData, style: template };

    await createComponentWithIndex("faq", faqData, pendingInsertIndex);
  };

  const handlePortfolioTemplateSelect = async (
    template: "portfolio-1" | "portfolio-2" | "portfolio-3" | "portfolio-4"
  ) => {
    const portfolioData = { ...defaultPortfolioData, style: template };

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

    await createComponentWithIndex("banner", bannerData, pendingInsertIndex);
  };

  const handleNewsletterTemplateSelect = async (
    template: "newsletter-1" | "newsletter-2" | "newsletter-3"
  ) => {
    const newsletterData = { ...defaultNewsletterData, style: template };

    await createComponentWithIndex(
      "newsletter",
      newsletterData,
      pendingInsertIndex
    );
  };

  const handlevideosTemplateSelect = async (
    template: "videos-1" | "videos-2" | "videos-3"
  ) => {
    const videosData = { ...defaultVideosData, style: template };

    await createComponentWithIndex("videos", videosData, pendingInsertIndex);
  };

  const handleGalleryTemplateSelect = async (
    template:
      | "gallery-1"
      | "gallery-2"
      | "gallery-3"
      | "gallery-4"
      | "gallery-5"
      | "gallery-6"
  ) => {
    const galleryData = { ...defaultGalleryData, template: template };

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

    await createComponentWithIndex("policies", policyData, pendingInsertIndex);
  };

  const handleTextEditorTemplateSelect = async () => {
    await createComponentWithIndex(
      "text_editor",
      defaultTextEditorData,
      pendingInsertIndex
    );
  };

  const handlePricingTemplateSelect = async (
    template: "pricing-1" | "pricing-2" | "pricing-3"
  ) => {
    const pricingData = { ...defaultPricingData, style: template };

    await createComponentWithIndex("pricing", pricingData, pendingInsertIndex);
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

  // Component click handler for Add Section Dialog
  const handleComponentClick = (componentId: string, template?: string) => {
    if (componentId === "page-templates") {
      setIsPageTemplateDialogOpen(true);
    } else if (componentId === "hero-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleHeroTemplateSelect(template as any);
      }
    } else if (componentId === "others-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleOthersTemplateSelect(template as any);
      }
    } else if (componentId === "about-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleAboutUsTemplateSelect(template as any);
      }
    } else if (componentId === "cta-sections") {
      if (template) {
        handleCTATemplateSelect(template as CTAData["template"]);
      }
    } else if (componentId === "pricing-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handlePricingTemplateSelect(template as any);
      }
    } else if (componentId === "products-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleProductsTemplateSelect(template as any);
      }
    } else if (componentId === "categories-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleCategoryTemplateSelect(template as any);
      }
    } else if (componentId === "subcategories-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleSubCategoryTemplateSelect(template as any);
      }
    } else if (componentId === "services-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleServicesTemplateSelect(template as any);
      }
    } else if (componentId === "our-clients-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleOurClientsTemplateSelect(template as any);
      }
    } else if (componentId === "contact-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleContactTemplateSelect(template as any);
      }
    } else if (componentId === "appointment-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleAppointmentTemplateSelect(template as any);
      }
    } else if (componentId === "team-members-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleTeamTemplateSelect(template as any);
      }
    } else if (componentId === "testimonials-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleTestimonialsTemplateSelect(template as any);
      }
    } else if (componentId === "gallery-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleGalleryTemplateSelect(template as any);
      }
    } else if (componentId === "blog-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleBlogTemplateSelect(template as any);
      }
    } else if (componentId === "faq-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleFAQTemplateSelect(template as any);
      }
    } else if (componentId === "portfolio-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handlePortfolioTemplateSelect(template as any);
      }
    } else if (componentId === "banner-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleBannerTemplateSelect(template as any);
      }
    } else if (componentId === "videos-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handlevideosTemplateSelect(template as any);
      }
    } else if (componentId === "newsletter-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleNewsletterTemplateSelect(template as any);
      }
    } else if (componentId === "policies-sections") {
      if (template) {
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        handlePoliciesTemplateSelect(template as any);
      }
    } else if (componentId === "text-editor-sections") {
      if (template) {
        handleTextEditorTemplateSelect();
      }
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
