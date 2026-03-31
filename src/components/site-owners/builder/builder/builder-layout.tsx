"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useRouter } from "next/navigation";
import { CanvasArea } from "@/components/site-owners/builder/builder/canvas-area";
import { TopNavigation } from "@/components/site-owners/builder/builder/top-navigation";
import { PageManagementSidebar } from "@/components/site-owners/builder/builder/page-management-sidebar";
import { AddSectionDialog } from "@/components/site-owners/builder/builder/add-section-dialog";
import {
  useNavbarQuery,
  useCreateNavbarMutation,
  useReplaceNavbarMutation,
} from "@/hooks/owner-site/components/use-navbar";
import { NavbarData } from "@/types/owner-site/components/navbar";
import {
  usePages,
  useCreatePage,
  useDeletePage,
} from "@/hooks/owner-site/use-page";
import { Page } from "@/types/owner-site/components/page";
import {
  useFooterQuery,
  useCreateFooterMutation,
  useReplaceFooterMutation,
} from "@/hooks/owner-site/components/use-footer";
import { FooterData } from "@/types/owner-site/components/footer";
import { ComponentOutlineSidebar } from "@/components/site-owners/builder/builder/component-outline-sidebar";
import { toast } from "sonner";
import {
  ComponentResponse,
  ComponentTypeMap,
} from "@/types/owner-site/components/components";
import {
  usePageComponentsQuery,
  useCreateComponentMutation,
  useGenericReplaceComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import { useResetUi } from "@/hooks/owner-site/components/use-reset-ui";
import { TextSelectionProvider } from "@/contexts/text-selection-context";
import { StickyFormattingToolbar } from "./sticky-formatting-toolbar";
import BuilderSkeleton from "./builder-skeleton";
import { useAuth } from "@/hooks/use-auth";
import { COMPONENT_REGISTRY } from "@/types/owner-site/components/registry";
import { DEFAULT_PRODUCT_DETAILS_MAP } from "@/types/owner-site/components/product-details-map";
import { DEFAULT_BLOG_DETAILS_MAP } from "@/types/owner-site/components/blog-details-map";
import { DEFAULT_PORTFOLIO_DETAILS_MAP } from "@/types/owner-site/components/portfolio-details-map";
import { DEFAULT_SERVICE_DETAILS_MAP } from "@/types/owner-site/components/service-details-map";
import { DEFAULT_CHECKOUT_MAP } from "@/types/owner-site/components/checkout-map";
import { DEFAULT_ORDER_CONFIRMATION_MAP } from "@/types/owner-site/components/order-confirmation-map";
import {
  DEFAULT_LOGIN_MAP,
  DEFAULT_SIGNUP_MAP,
} from "@/types/owner-site/components/auth-form-map";
import { DEFAULT_COUNTRY_DETAILS_MAP } from "@/types/owner-site/components/countries";
import { MetaBar } from "./meta-bar";
import { SEOModal } from "./seo-modal";
import { PublishModal } from "./publish-modal";
import { LiveSiteModal } from "./live-site-modal";
import { ResetConfirmationModal } from "./reset-confirmation-modal";
import { usePublishSite } from "@/hooks/owner-site/components/use-publish";

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
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">(
    "desktop"
  );
  const [hasChanges, setHasChanges] = useState(false);
  const [isSEOModalOpen, setIsSEOModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isLiveSiteModalOpen, setIsLiveSiteModalOpen] = useState(false);
  const [isResetConfirmationModalOpen, setIsResetConfirmationModalOpen] =
    useState(false);

  // SEO state
  const [seoMetadata, setSeoMetadata] = useState({
    title: "Premium Eyewear Made for Nepal",
    description:
      "Thoughtfully designed eyewear that blends comfort, clarity, and modern style for everyday life.",
    slug: "/" + pageSlug,
    isIndexed: true,
  });
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

  const { mutate: resetUi, isPending: isResetUiPending } = useResetUi();
  const { mutate: publish, isPending: isPublishPending } = usePublishSite();

  const { data: pagesData = [], isLoading: isPagesLoading } = usePages();
  const createPageMutation = useCreatePage();
  const createProductDetailsPageMutation = useCreatePage();
  const createBlogDetailsPageMutation = useCreatePage();
  const createPortfolioDetailsPageMutation = useCreatePage();
  const createServiceDetailsPageMutation = useCreatePage();
  const createCheckoutPageMutation = useCreatePage();
  const createOrderConfirmationPageMutation = useCreatePage();
  const createLoginPageMutation = useCreatePage();
  const createSignupPageMutation = useCreatePage();
  const createCountryDetailsPageMutation = useCreatePage();
  const deletePageMutation = useDeletePage();
  const [isCreatingHomePage, setIsCreatingHomePage] = useState(false);
  const [isCreatingLoginPage, setIsCreatingLoginPage] = useState(false);
  const [isCreatingSignupPage, setIsCreatingSignupPage] = useState(false);
  const {
    data: pageComponentsResponse,
    isLoading: isPageComponentsLoading,
    error: pageComponentsError,
  } = usePageComponentsQuery(pageSlug);

  // Persistence logic: Detect unpublished changes on mount
  useEffect(() => {
    if (pageComponentsResponse && Array.isArray(pageComponentsResponse)) {
      const hasDrafts = pageComponentsResponse.some(
        (comp: any) =>
          comp.status === "draft" ||
          comp.status === "modified" ||
          comp.is_draft === true
      );
      if (hasDrafts) {
        setHasChanges(true);
      }
    }
  }, [pageComponentsResponse]);

  const handleSaveSEO = (data: typeof seoMetadata) => {
    setSeoMetadata(data);
    setHasChanges(true);
    toast.success("SEO metadata updated locally");
  };

  const handlePublish = async () => {
    publish(undefined, {
      onSuccess: () => {
        setHasChanges(false);
        setIsPublishModalOpen(false);
        setIsLiveSiteModalOpen(true);
      },
    });
  };

  const handleUndo = () => {
    if (!hasChanges) return;
    setIsResetConfirmationModalOpen(true);
  };

  const handleConfirmReset = () => {
    resetUi(undefined, {
      onSuccess: () => {
        setHasChanges(false);
        setIsResetConfirmationModalOpen(false);
        toast.success("Site reset successfully");
      },
      onError: () => {
        setIsResetConfirmationModalOpen(false);
      },
    });
  };

  const [droppedComponents, setDroppedComponents] = useState<
    ComponentResponse[]
  >([]);

  const currentPage = pageSlug;

  // Mutations
  const createComponentMutation = useCreateComponentMutation(pageSlug);
  const replaceComponentMutation = useGenericReplaceComponentMutation(pageSlug);

  // Wrap mutations to track changes
  const createComponent = async (args: any) => {
    const res = await createComponentMutation.mutateAsync(args);
    setHasChanges(true);
    return res;
  };

  const replaceComponent = async (args: any) => {
    const res = await replaceComponentMutation.mutateAsync(args);
    setHasChanges(true);
    return res;
  };
  const createProductDetailsComponentMutation =
    useCreateComponentMutation("product-details");
  const createBlogDetailsComponentMutation =
    useCreateComponentMutation("blog-details");
  const createPortfolioDetailsComponentMutation =
    useCreateComponentMutation("portfolio-details");
  const createServiceDetailsComponentMutation =
    useCreateComponentMutation("service-details");
  const createCheckoutComponentMutation =
    useCreateComponentMutation("checkout");
  const createOrderConfirmationComponentMutation =
    useCreateComponentMutation("order-confirmation");
  const createCountryDetailsComponentMutation =
    useCreateComponentMutation("country-details");

  // Process page components
  const pageComponents = React.useMemo(() => {
    if (!pageComponentsResponse) return [];

    const components = Array.isArray(pageComponentsResponse)
      ? (pageComponentsResponse as unknown as ComponentResponse[])
      : [];

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

    setIsAddSectionDialogOpen(false);
    const replaceId = pendingReplaceId;
    setPendingReplaceId(null);
    setPendingInsertIndex(undefined);

    let componentId = "";

    try {
      if (mode === "replace" && replaceId) {
        const result = await replaceComponent({
          componentId: replaceId,
          componentType,
          data,
          order:
            pageComponents.find(c => c.component_id === replaceId)?.order ?? 0,
        });
        componentId = result.component_id;
      } else {
        const result = await createComponent({
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

      // Auto-create product details page when adding a products section
      if (componentType === "products") {
        ensureProductDetailsPageExists();
        ensureCheckoutPageExists();
        ensureOrderConfirmationPageExists();
      }
      if (componentType === "blog") {
        ensureBlogDetailsPageExists();
      }
      if (componentType === "portfolio") {
        ensurePortfolioDetailsPageExists();
      }
      if (componentType === "services") {
        ensureServiceDetailsPageExists();
      }
      if (componentType === "countries") {
        ensureCountryDetailsPageExists();
      }
    } catch (error) {
      console.error(`Failed to ${mode} ${componentType} component:`, error);
      // Toast is handled by the mutation hook
    }
  };

  // Auto-create home page
  const hasAttemptedCreateHome = useRef(false);
  useEffect(() => {
    if (
      !isPagesLoading &&
      pagesData &&
      pagesData.length === 0 &&
      !isCreatingHomePage &&
      !hasAttemptedCreateHome.current
    ) {
      hasAttemptedCreateHome.current = true;
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
            hasAttemptedCreateHome.current = false;
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

  // Auto-create details page templates if missing
  const [isCreatingProductPage, setIsCreatingProductPage] = useState(false);
  const [isCreatingBlogPage, setIsCreatingBlogPage] = useState(false);
  const [isCreatingPortfolioPage, setIsCreatingPortfolioPage] = useState(false);
  const [isCreatingServicePage, setIsCreatingServicePage] = useState(false);
  const [isCreatingCheckoutPage, setIsCreatingCheckoutPage] = useState(false);
  const [isCreatingOrderConfirmationPage, setIsCreatingOrderConfirmationPage] =
    useState(false);
  const [isCreatingCountryPage, setIsCreatingCountryPage] = useState(false);

  const hasAttemptedCreateProduct = useRef(false);
  const ensureProductDetailsPageExists = useCallback(() => {
    if (
      !isPagesLoading &&
      pagesData &&
      !pagesData.find(
        p => p.slug === "product-details" || p.slug === "product-details-draft"
      ) &&
      !isCreatingProductPage &&
      !hasAttemptedCreateProduct.current
    ) {
      hasAttemptedCreateProduct.current = true;
      setIsCreatingProductPage(true);
      createProductDetailsPageMutation.mutate(
        { title: "Product Details" }, // The backend slugifies this to product-details
        {
          onSuccess: (data: Page) => {
            // Add a default product_details component after page creation
            const defaultData =
              DEFAULT_PRODUCT_DETAILS_MAP["product-details-style-1"];
            createProductDetailsComponentMutation.mutate({
              componentType: "product_details",
              data: defaultData,
              silent: true,
              pageSlug: data.slug,
            });
            setIsCreatingProductPage(false);
          },
          onError: () => {
            setIsCreatingProductPage(false);
            hasAttemptedCreateProduct.current = false;
          },
        }
      );
    }
  }, [
    isPagesLoading,
    pagesData,
    isCreatingProductPage,
    createProductDetailsPageMutation,
    createProductDetailsComponentMutation,
  ]);

  const hasAttemptedCreateBlog = useRef(false);
  const ensureBlogDetailsPageExists = useCallback(() => {
    if (
      !isPagesLoading &&
      pagesData &&
      !pagesData.find(
        p => p.slug === "blog-details" || p.slug === "blog-details-draft"
      ) &&
      !isCreatingBlogPage &&
      !hasAttemptedCreateBlog.current
    ) {
      hasAttemptedCreateBlog.current = true;
      setIsCreatingBlogPage(true);
      createBlogDetailsPageMutation.mutate(
        { title: "Blog Details" },
        {
          onSuccess: (data: Page) => {
            const defaultData =
              DEFAULT_BLOG_DETAILS_MAP["blog-details-style-1"];
            createBlogDetailsComponentMutation.mutate({
              componentType: "blog_details",
              data: defaultData,
              silent: true,
              pageSlug: data.slug,
            });
            setIsCreatingBlogPage(false);
          },
          onError: () => {
            setIsCreatingBlogPage(false);
            hasAttemptedCreateBlog.current = false;
          },
        }
      );
    }
  }, [
    isPagesLoading,
    pagesData,
    isCreatingBlogPage,
    createBlogDetailsPageMutation,
    createBlogDetailsComponentMutation,
  ]);

  const hasAttemptedCreatePortfolio = useRef(false);
  const ensurePortfolioDetailsPageExists = useCallback(() => {
    if (
      !isPagesLoading &&
      pagesData &&
      !pagesData.find(
        p =>
          p.slug === "portfolio-details" || p.slug === "portfolio-details-draft"
      ) &&
      !isCreatingPortfolioPage &&
      !hasAttemptedCreatePortfolio.current
    ) {
      hasAttemptedCreatePortfolio.current = true;
      setIsCreatingPortfolioPage(true);
      createPortfolioDetailsPageMutation.mutate(
        { title: "Portfolio Details" },
        {
          onSuccess: (data: Page) => {
            const defaultData =
              DEFAULT_PORTFOLIO_DETAILS_MAP["portfolio-details-style-1"];
            createPortfolioDetailsComponentMutation.mutate({
              componentType: "portfolio_details",
              data: defaultData,
              silent: true,
              pageSlug: data.slug,
            });
            setIsCreatingPortfolioPage(false);
          },
          onError: () => {
            setIsCreatingPortfolioPage(false);
            hasAttemptedCreatePortfolio.current = false;
          },
        }
      );
    }
  }, [
    isPagesLoading,
    pagesData,
    isCreatingPortfolioPage,
    createPortfolioDetailsPageMutation,
    createPortfolioDetailsComponentMutation,
  ]);

  const hasAttemptedCreateService = useRef(false);
  const ensureServiceDetailsPageExists = useCallback(() => {
    if (
      !isPagesLoading &&
      pagesData &&
      !pagesData.find(
        p => p.slug === "service-details" || p.slug === "service-details-draft"
      ) &&
      !isCreatingServicePage &&
      !hasAttemptedCreateService.current
    ) {
      hasAttemptedCreateService.current = true;
      setIsCreatingServicePage(true);
      createServiceDetailsPageMutation.mutate(
        { title: "Service Details" },
        {
          onSuccess: (data: Page) => {
            const defaultData =
              DEFAULT_SERVICE_DETAILS_MAP["service-details-style-1"];
            createServiceDetailsComponentMutation.mutate({
              componentType: "service_details",
              data: defaultData,
              silent: true,
              pageSlug: data.slug,
            });
            setIsCreatingServicePage(false);
          },
          onError: () => {
            setIsCreatingServicePage(false);
            hasAttemptedCreateService.current = false;
          },
        }
      );
    }
  }, [
    isPagesLoading,
    pagesData,
    isCreatingServicePage,
    createServiceDetailsPageMutation,
    createServiceDetailsComponentMutation,
  ]);

  const hasAttemptedCreateCheckout = useRef(false);
  const ensureCheckoutPageExists = useCallback(() => {
    if (
      !isPagesLoading &&
      pagesData &&
      !pagesData.find(
        p => p.slug === "checkout" || p.slug === "checkout-draft"
      ) &&
      !isCreatingCheckoutPage &&
      !hasAttemptedCreateCheckout.current
    ) {
      hasAttemptedCreateCheckout.current = true;
      setIsCreatingCheckoutPage(true);
      createCheckoutPageMutation.mutate(
        { title: "Checkout" },
        {
          onSuccess: (data: Page) => {
            const defaultData = DEFAULT_CHECKOUT_MAP["checkout-style-1"];
            createCheckoutComponentMutation.mutate({
              componentType: "checkout",
              data: defaultData,
              silent: true,
              pageSlug: data.slug,
            });
            setIsCreatingCheckoutPage(false);
          },
          onError: () => {
            setIsCreatingCheckoutPage(false);
            hasAttemptedCreateCheckout.current = false;
          },
        }
      );
    }
  }, [
    isPagesLoading,
    pagesData,
    isCreatingCheckoutPage,
    createCheckoutPageMutation,
    createCheckoutComponentMutation,
  ]);

  const hasAttemptedCreateOrderConfirmation = useRef(false);
  const ensureOrderConfirmationPageExists = useCallback(() => {
    if (
      !isPagesLoading &&
      pagesData &&
      !pagesData.find(
        p =>
          p.slug === "order-confirmation" ||
          p.slug === "order-confirmation-draft"
      ) &&
      !isCreatingOrderConfirmationPage &&
      !hasAttemptedCreateOrderConfirmation.current
    ) {
      hasAttemptedCreateOrderConfirmation.current = true;
      setIsCreatingOrderConfirmationPage(true);
      createOrderConfirmationPageMutation.mutate(
        { title: "Order Confirmation" },
        {
          onSuccess: (data: Page) => {
            const defaultData =
              DEFAULT_ORDER_CONFIRMATION_MAP["order-confirmation-style-1"];
            createOrderConfirmationComponentMutation.mutate({
              componentType: "order_confirmation",
              data: defaultData,
              silent: true,
              pageSlug: data.slug,
            });
            setIsCreatingOrderConfirmationPage(false);
          },
          onError: () => {
            setIsCreatingOrderConfirmationPage(false);
            hasAttemptedCreateOrderConfirmation.current = false;
          },
        }
      );
    }
  }, [
    isPagesLoading,
    pagesData,
    isCreatingOrderConfirmationPage,
    createOrderConfirmationPageMutation,
    createOrderConfirmationComponentMutation,
  ]);

  const hasAttemptedCreateCountry = useRef(false);
  const ensureCountryDetailsPageExists = useCallback(() => {
    if (
      !isPagesLoading &&
      pagesData &&
      !pagesData.find(
        p => p.slug === "country-details" || p.slug === "country-details-draft"
      ) &&
      !isCreatingCountryPage &&
      !hasAttemptedCreateCountry.current
    ) {
      hasAttemptedCreateCountry.current = true;
      setIsCreatingCountryPage(true);
      createCountryDetailsPageMutation.mutate(
        { title: "Country Details" },
        {
          onSuccess: (data: Page) => {
            const defaultData =
              DEFAULT_COUNTRY_DETAILS_MAP["country-details-style-1"];
            createCountryDetailsComponentMutation.mutate({
              componentType: "country_details",
              data: defaultData,
              silent: true,
              pageSlug: data.slug,
            });
            setIsCreatingCountryPage(false);
          },
          onError: () => {
            setIsCreatingCountryPage(false);
            hasAttemptedCreateCountry.current = false;
          },
        }
      );
    }
  }, [
    isPagesLoading,
    pagesData,
    isCreatingCountryPage,
    createCountryDetailsPageMutation,
    createCountryDetailsComponentMutation,
  ]);

  const hasAttemptedCreateLogin = useRef(false);
  const ensureLoginPageExists = useCallback(() => {
    if (
      !isPagesLoading &&
      pagesData &&
      !pagesData.find(p => p.slug === "login" || p.slug === "login-draft") &&
      !isCreatingLoginPage &&
      !hasAttemptedCreateLogin.current
    ) {
      hasAttemptedCreateLogin.current = true;
      setIsCreatingLoginPage(true);
      createLoginPageMutation.mutate(
        { title: "Login" },
        {
          onSuccess: (data: Page) => {
            const defaultData = DEFAULT_LOGIN_MAP["style-1"];
            createComponentMutation.mutate({
              componentType: "login_form",
              data: defaultData,
              silent: true,
              pageSlug: data.slug,
            });
            setIsCreatingLoginPage(false);
          },
          onError: () => {
            setIsCreatingLoginPage(false);
            hasAttemptedCreateLogin.current = false;
          },
        }
      );
    }
  }, [
    isPagesLoading,
    pagesData,
    isCreatingLoginPage,
    createLoginPageMutation,
    createComponentMutation,
  ]);

  const hasAttemptedCreateSignup = useRef(false);
  const ensureSignupPageExists = useCallback(() => {
    if (
      !isPagesLoading &&
      pagesData &&
      !pagesData.find(p => p.slug === "signup" || p.slug === "signup-draft") &&
      !isCreatingSignupPage &&
      !hasAttemptedCreateSignup.current
    ) {
      hasAttemptedCreateSignup.current = true;
      setIsCreatingSignupPage(true);
      createSignupPageMutation.mutate(
        { title: "Signup" },
        {
          onSuccess: (data: Page) => {
            const defaultData = DEFAULT_SIGNUP_MAP["style-1"];
            createComponentMutation.mutate({
              componentType: "signup_form",
              data: defaultData,
              silent: true,
              pageSlug: data.slug,
            });
            setIsCreatingSignupPage(false);
          },
          onError: () => {
            setIsCreatingSignupPage(false);
            hasAttemptedCreateSignup.current = false;
          },
        }
      );
    }
  }, [
    isPagesLoading,
    pagesData,
    isCreatingSignupPage,
    createSignupPageMutation,
    createComponentMutation,
  ]);

  const hasAttemptedDeleteLogin = useRef(false);
  const hasAttemptedDeleteSignup = useRef(false);

  const deleteAuthPages = useCallback(() => {
    const loginPage = pagesData?.find(
      p => p.slug === "login" || p.slug === "login-draft"
    );
    const signupPage = pagesData?.find(
      p => p.slug === "signup" || p.slug === "signup-draft"
    );

    if (loginPage && !hasAttemptedDeleteLogin.current) {
      hasAttemptedDeleteLogin.current = true;
      deletePageMutation.mutate(loginPage.slug, {
        onError: () => {
          hasAttemptedDeleteLogin.current = false;
        },
      });
    }
    if (signupPage && !hasAttemptedDeleteSignup.current) {
      hasAttemptedDeleteSignup.current = true;
      deletePageMutation.mutate(signupPage.slug, {
        onError: () => {
          hasAttemptedDeleteSignup.current = false;
        },
      });
    }
  }, [pagesData, deletePageMutation]);

  useEffect(() => {
    if (pageSlug === "product-details") {
      ensureProductDetailsPageExists();
    }
    if (pageSlug === "blog-details") {
      ensureBlogDetailsPageExists();
    }
    if (pageSlug === "portfolio-details") {
      ensurePortfolioDetailsPageExists();
    }
    if (pageSlug === "service-details") {
      ensureServiceDetailsPageExists();
    }
    if (pageSlug === "checkout-draft") {
      ensureCheckoutPageExists();
    }
    if (pageSlug === "order-confirmation-draft") {
      ensureOrderConfirmationPageExists();
    }
  }, [
    pageSlug,
    ensureProductDetailsPageExists,
    ensureBlogDetailsPageExists,
    ensurePortfolioDetailsPageExists,
    ensureServiceDetailsPageExists,
    ensureCheckoutPageExists,
    ensureOrderConfirmationPageExists,
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
    setHasChanges(true);
    router.push(`/builder/${siteUser}/${page.slug}`);
  };

  const handlePageDeleted = (deletedSlug: string) => {
    setHasChanges(true);
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
    const isReplacing = pendingCategoryFilter === "navbar-sections";
    const currentData = navbarResponse?.data?.data;

    let finalData = navbarData;
    if (isReplacing && currentData) {
      finalData = {
        ...navbarData, // Start with new template's base structure
        // Preserve user's content and settings
        links:
          currentData.links && currentData.links.length > 0
            ? currentData.links
            : navbarData.links,
        buttons:
          currentData.buttons && currentData.buttons.length > 0
            ? currentData.buttons
            : navbarData.buttons,
        logoText: currentData.logoText || navbarData.logoText,
        logoType: currentData.logoType || navbarData.logoType,
        logoImage:
          currentData.logoImage !== undefined
            ? currentData.logoImage
            : navbarData.logoImage,
        showCart: currentData.showCart ?? navbarData.showCart,
        enableLogin: currentData.enableLogin ?? navbarData.enableLogin,
        bannerText: currentData.bannerText || navbarData.bannerText,
        topBarItems:
          currentData.topBarItems && currentData.topBarItems.length > 0
            ? currentData.topBarItems
            : navbarData.topBarItems,
      };
    }

    const payload = {
      content: "navbar content",
      data: finalData,
      component_id: `nav-${Date.now()}`,
    };

    const toastId = "navbar-create";

    if (pendingCategoryFilter === "navbar-sections") {
      replaceNavbarMutation.mutate(payload, {
        onSuccess: () => {
          setHasChanges(true);
          setPendingCategoryFilter(undefined);
          setPendingReplaceId(null);
          // Auto-create service details page if Navbar Style 14 is selected
          if (finalData.style === "style-14") {
            ensureServiceDetailsPageExists();
          }
        },
        onError: error => {
          toast.error("Failed to replace navbar", { id: toastId });
        },
      });
    } else {
      createNavbarMutation.mutate(payload, {
        onSuccess: () => {
          setHasChanges(true);
          // Auto-create service details page if Navbar Style 14 is selected
          if (finalData.style === "style-14") {
            ensureServiceDetailsPageExists();
          }
        },
        onError: error => {
          toast.error("Failed to create navbar", { id: toastId });
        },
      });
    }
  };

  // Centralized Auth Page Management Effect
  useEffect(() => {
    if (!navbarResponse?.data?.data) return;

    const { enableLogin } = navbarResponse.data.data;

    if (enableLogin) {
      // If enabled, ensure pages exist
      ensureLoginPageExists();
      ensureSignupPageExists();
      // Reset deletion refs so we can delete again if disabled later
      hasAttemptedDeleteLogin.current = false;
      hasAttemptedDeleteSignup.current = false;
    } else {
      // If disabled, delete pages
      deleteAuthPages();
      // Reset creation refs so we can create again if enabled later
      hasAttemptedCreateLogin.current = false;
      hasAttemptedCreateSignup.current = false;
    }
  }, [
    navbarResponse?.data?.data?.enableLogin,
    ensureLoginPageExists,
    ensureSignupPageExists,
    deleteAuthPages,
  ]);

  const handleFooterSelectFromDialog = (footerData: FooterData) => {
    const payload = {
      content: "footer content",
      data: footerData,
      component_id: `footer-${Date.now()}`,
    };

    const toastId = "footer-replace";

    if (pendingCategoryFilter === "footer-sections") {
      replaceFooterMutation.mutate(payload, {
        onSuccess: () => {
          setHasChanges(true);
          setPendingCategoryFilter(undefined);
          setPendingReplaceId(null);
          if (footerData.style === "style-12") {
            ensureServiceDetailsPageExists();
          }
        },
        onError: error => {
          toast.error("Failed to replace footer", { id: toastId });
        },
      });
    } else {
      createFooterMutation.mutate(payload, {
        onSuccess: () => {
          setHasChanges(true);
          // Auto-create service details page if Navbar Style 14 is selected
          if (footerData.style === "style-12") {
            ensureServiceDetailsPageExists();
          }
          toast.success("Footer added successfully!", { id: toastId });
        },
        onError: error => {
          toast.error("Failed to create footer", { id: toastId });
        },
      });
    }
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
      "product-details-sections": "product_details",
      "blog-details-sections": "blog_details",
      "portfolio-details-sections": "portfolio_details",
      "service-details-sections": "service_details",
      "checkout-sections": "checkout",
      "order-confirmation-sections": "order_confirmation",
      "login-sections": "login_form",
      "signup-sections": "signup_form",
      "collections-sections": "collections",
      "skills-sections": "skills",
      "experience-sections": "experience",
      "socials-sections": "socials",
      "tours-sections": "tours",
      "countries-sections": "countries",
      "country-details-sections": "country_details",
    };

    const type = sectionToType[sectionId];
    if (type && template) {
      handleTemplateSelect(type, template);
    }
  };

  const isInitialLoading =
    isNavbarLoading || isFooterLoading || isPagesLoading || isCreatingHomePage;

  if (isInitialLoading) {
    return <BuilderSkeleton isCreatingHomePage={isCreatingHomePage} />;
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

        {/* Top Navigation */}
        <TopNavigation
          hasChanges={hasChanges}
          onUndo={handleUndo}
          isUndoPending={isResetUiPending}
          onPublish={() => setIsPublishModalOpen(true)}
          onOpenTheme={() => {}}
          onOpenLiveSite={() => setIsLiveSiteModalOpen(true)}
          onOpenPreview={() => setIsPublishModalOpen(true)}
          liveSiteUrl={
            siteUser
              ? `https://${siteUser}.${process.env.NEXT_PUBLIC_BASE_DOMAIN}`
              : "/"
          }
        />
        {/* MetaBar moved to CanvasArea */}
        <SEOModal
          open={isSEOModalOpen}
          onOpenChange={setIsSEOModalOpen}
          pageTitle={pagesData.find(p => p.slug === pageSlug)?.title || "Page"}
          initialData={seoMetadata}
          onSave={handleSaveSEO}
        />

        <PublishModal
          open={isPublishModalOpen}
          onOpenChange={setIsPublishModalOpen}
          onPublish={handlePublish}
          isPublishing={isPublishPending}
          previewUrl={`/preview/${siteUser}/${pageSlug}`}
          publishStatus={{
            reviewed: true,
            seoSet: true,
            ready: true,
          }}
        />

        <ResetConfirmationModal
          open={isResetConfirmationModalOpen}
          onOpenChange={setIsResetConfirmationModalOpen}
          onConfirm={handleConfirmReset}
          isReseting={isResetUiPending}
        />

        <LiveSiteModal
          open={isLiveSiteModalOpen}
          onOpenChange={setIsLiveSiteModalOpen}
          siteUrl={
            siteUser
              ? `https://${siteUser}.${process.env.NEXT_PUBLIC_BASE_DOMAIN}`
              : "https://yourdomain.com"
          }
        />
        {/* Sticky Formatting Toolbar */}
        <StickyFormattingToolbar />

        {/* Main Layout */}
        <div className="bg-background flex min-h-screen flex-col">
          <div className="flex flex-1">
            <PageManagementSidebar
              pages={pagesData}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              onPageCreated={handlePageCreated}
              onPageDeleted={handlePageDeleted}
              siteUser={siteUser}
            />

            <div className="flex flex-1 flex-col">
              <div className="mt-10 flex-1 overflow-auto bg-gray-200 p-6">
                <div className="mx-auto max-w-7xl origin-top scale-75">
                  <div className="py-4"></div>

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
                    onOrderChange={() => setHasChanges(true)}
                    onProductClick={() => {
                      router.push(`/builder/${siteUser}/product-details`);
                    }}
                    onBlogClick={() => {
                      router.push(`/builder/${siteUser}/blog-details`);
                    }}
                    onPortfolioClick={() => {
                      router.push(`/builder/${siteUser}/portfolio-details`);
                    }}
                    onServiceClick={() => {
                      router.push(`/builder/${siteUser}/service-details`);
                    }}
                    seoMetadata={seoMetadata}
                    onEditSEO={() => setIsSEOModalOpen(true)}
                  />
                </div>
              </div>
            </div>

            <ComponentOutlineSidebar
              currentPageSlug={currentPage}
              components={pageComponents}
              isLoading={isPageComponentsLoading}
            />
          </div>
        </div>
      </DndProvider>
    </TextSelectionProvider>
  );
};
