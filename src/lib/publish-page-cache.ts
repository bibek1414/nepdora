import { getServerApiBaseUrl } from "@/config/server-site";
import { siteConfig } from "@/config/site";
import { handleApiError } from "@/utils/api-error";
import { Page } from "@/types/owner-site/components/page";
import { ComponentResponse } from "@/types/owner-site/components/components";
import {
  GetNavbarResponse,
  Navbar,
} from "@/types/owner-site/components/navbar";
import {
  Footer,
  GetFooterResponse,
} from "@/types/owner-site/components/footer";
import { GetThemeResponse, Theme } from "@/types/owner-site/components/theme";
import { cache } from "react";

const PAGE_REVALIDATE_SECONDS = 300;
const LAYOUT_REVALIDATE_SECONDS = 300;

type PublishFetchOptions = {
  revalidate?: number;
  tags: string[];
};

export type EntityMetadata = {
  title?: string | null;
  description?: string | null;
  image?: string | null;
};

type PublishPagePayload = {
  currentPageSlug: string;
  targetSlug: string;
  pageTitle: string;
  contentSlug?: string;
  pageComponents: ComponentResponse[];
  entityMetadata?: EntityMetadata;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

type PublishLayoutPayload = {
  navbarResponse: GetNavbarResponse | null;
  footerResponse: GetFooterResponse | null;
  themeResponse: GetThemeResponse | null;
};

function getTenantDomain(siteUser: string) {
  return `${siteUser}.${siteConfig.baseDomain}`;
}

function getTenantSiteTag(siteUser: string) {
  return `tenant:${siteUser}:site`;
}

async function fetchPublishedResource<T>(
  siteUser: string,
  endpoint: string,
  options: PublishFetchOptions
): Promise<T> {
  const baseUrl = await getServerApiBaseUrl();
  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-Domain": getTenantDomain(siteUser),
    },
    next: {
      revalidate: options.revalidate ?? PAGE_REVALIDATE_SECONDS,
      tags: [getTenantSiteTag(siteUser), ...options.tags],
    },
  });

  await handleApiError(response);
  return response.json();
}

async function getPublishedPages(siteUser: string): Promise<Page[]> {
  return fetchPublishedResource<Page[]>(
    siteUser,
    "/api/pages/?status=published",
    {
      revalidate: PAGE_REVALIDATE_SECONDS,
      tags: [`tenant:${siteUser}:pages`],
    }
  );
}

async function getPublishedPageComponents(
  siteUser: string,
  pageSlug: string
): Promise<ComponentResponse[]> {
  const data = await fetchPublishedResource<
    | ComponentResponse[]
    | {
        data?: ComponentResponse[];
        components?: ComponentResponse[];
      }
  >(siteUser, `/api/pages/${pageSlug}/components/`, {
    revalidate: PAGE_REVALIDATE_SECONDS,
    tags: [`tenant:${siteUser}:page:${pageSlug}`],
  });

  if (Array.isArray(data)) {
    return data;
  }

  return data?.data || data?.components || [];
}

async function getPublishedNavbar(
  siteUser: string
): Promise<GetNavbarResponse | null> {
  const data = await fetchPublishedResource<Navbar | null>(
    siteUser,
    "/api/navbar/",
    {
      revalidate: LAYOUT_REVALIDATE_SECONDS,
      tags: [`tenant:${siteUser}:navbar`],
    }
  );

  return {
    data: data || null,
    message: data ? "Navbar retrieved successfully" : "No navbar found",
  };
}

async function getPublishedFooter(
  siteUser: string
): Promise<GetFooterResponse | null> {
  const data = await fetchPublishedResource<Footer | null>(
    siteUser,
    "/api/footer/",
    {
      revalidate: LAYOUT_REVALIDATE_SECONDS,
      tags: [`tenant:${siteUser}:footer`],
    }
  );

  return {
    data: data || null,
    message: data ? "Footer retrieved successfully" : "No footer found",
  };
}

async function getPublishedTheme(
  siteUser: string
): Promise<GetThemeResponse | null> {
  const data = await fetchPublishedResource<Theme[]>(siteUser, "/api/theme/", {
    revalidate: LAYOUT_REVALIDATE_SECONDS,
    tags: [`tenant:${siteUser}:theme`],
  });

  return {
    data: data || [],
    message:
      data?.length > 0 ? "Themes retrieved successfully" : "No themes found",
  };
}

async function getPublishedProduct(
  siteUser: string,
  slug: string
): Promise<EntityMetadata | null> {
  try {
    const data = await fetchPublishedResource<any>(
      siteUser,
      `/api/product/${slug}/`,
      {
        revalidate: PAGE_REVALIDATE_SECONDS,
        tags: [`tenant:${siteUser}:product:${slug}`],
      }
    );
    return {
      title: data.meta_title || data.name,
      description: data.meta_description || data.description,
      image: data.thumbnail_image,
    };
  } catch (error) {
    console.error(`Failed to fetch published product ${slug}:`, error);
    return null;
  }
}

async function getPublishedBlog(
  siteUser: string,
  slug: string
): Promise<EntityMetadata | null> {
  try {
    const data = await fetchPublishedResource<any>(
      siteUser,
      `/api/blogs/${slug}/`,
      {
        revalidate: PAGE_REVALIDATE_SECONDS,
        tags: [`tenant:${siteUser}:blog:${slug}`],
      }
    );
    return {
      title: data.meta_title || data.title,
      description: data.meta_description || data.content,
      image: data.thumbnail_image,
    };
  } catch (error) {
    console.error(`Failed to fetch published blog ${slug}:`, error);
    return null;
  }
}

async function getPublishedService(
  siteUser: string,
  slug: string
): Promise<EntityMetadata | null> {
  try {
    const data = await fetchPublishedResource<any>(
      siteUser,
      `/api/services/${slug}/`,
      {
        revalidate: PAGE_REVALIDATE_SECONDS,
        tags: [`tenant:${siteUser}:service:${slug}`],
      }
    );
    return {
      title: data.meta_title || data.title,
      description: data.meta_description || data.description,
      image: data.thumbnail_image,
    };
  } catch (error) {
    console.error(`Failed to fetch published service ${slug}:`, error);
    return null;
  }
}

async function getPublishedPortfolio(
  siteUser: string,
  slug: string
): Promise<EntityMetadata | null> {
  try {
    const data = await fetchPublishedResource<any>(
      siteUser,
      `/api/portfolio/${slug}/`,
      {
        revalidate: PAGE_REVALIDATE_SECONDS,
        tags: [`tenant:${siteUser}:portfolio:${slug}`],
      }
    );
    return {
      title: data.meta_title || data.title,
      description: data.meta_description || data.content,
      image: data.thumbnail_image,
    };
  } catch (error) {
    console.error(`Failed to fetch published portfolio ${slug}:`, error);
    return null;
  }
}

function resolveTargetSlug(pages: Page[], currentPageSlug: string) {
  const matchingPage = pages.find(
    page =>
      page.slug === currentPageSlug || page.slug === `${currentPageSlug}-draft`
  );

  return matchingPage?.slug || currentPageSlug;
}

function resolveHomePageSlug(pages: Page[]) {
  const homePage =
    pages.find(page => page.title?.trim().toLowerCase() === "home") ?? pages[0];

  return homePage?.slug || "home";
}

export const getPublishedPagePayload = cache(
  async (
    siteUser: string,
    currentPageSlug: string,
    contentSlug?: string
  ): Promise<PublishPagePayload> => {
    const pages = await getPublishedPages(siteUser);
    const targetSlug = resolveTargetSlug(pages, currentPageSlug);
    const currentPage =
      pages.find(page => page.slug === targetSlug) ??
      pages.find(page => page.slug === currentPageSlug);
    const pageComponents = await getPublishedPageComponents(
      siteUser,
      targetSlug
    );

    let entityMetadata: EntityMetadata | undefined;

    if (contentSlug) {
      if (currentPageSlug === "product-details") {
        entityMetadata =
          (await getPublishedProduct(siteUser, contentSlug)) || undefined;
      } else if (currentPageSlug === "blog-details") {
        entityMetadata =
          (await getPublishedBlog(siteUser, contentSlug)) || undefined;
      } else if (currentPageSlug === "service-details") {
        entityMetadata =
          (await getPublishedService(siteUser, contentSlug)) || undefined;
      } else if (currentPageSlug === "portfolio-details") {
        entityMetadata =
          (await getPublishedPortfolio(siteUser, contentSlug)) || undefined;
      }
    }

    return {
      currentPageSlug,
      targetSlug,
      pageTitle: currentPage?.title || currentPageSlug,
      contentSlug,
      pageComponents,
      entityMetadata,
      metaTitle: currentPage?.meta_title,
      metaDescription: currentPage?.meta_description,
    };
  }
);

export const getPublishedHomePagePayload = cache(
  async (siteUser: string): Promise<PublishPagePayload> => {
    const pages = await getPublishedPages(siteUser);
    const targetSlug = resolveHomePageSlug(pages);
    const homePage = pages.find(page => page.slug === targetSlug);
    const pageComponents = await getPublishedPageComponents(
      siteUser,
      targetSlug
    );

    return {
      currentPageSlug: targetSlug,
      targetSlug,
      pageTitle: homePage?.title || "Home",
      pageComponents,
      metaTitle: homePage?.meta_title,
      metaDescription: homePage?.meta_description,
    };
  }
);

export async function getPublishedLayoutPayload(
  siteUser: string
): Promise<PublishLayoutPayload> {
  const [navbarResponse, footerResponse, themeResponse] = await Promise.all([
    getPublishedNavbar(siteUser).catch(() => null),
    getPublishedFooter(siteUser).catch(() => null),
    getPublishedTheme(siteUser).catch(() => null),
  ]);

  return {
    navbarResponse,
    footerResponse,
    themeResponse,
  };
}

export function getPublishSiteTag(siteUser: string) {
  return getTenantSiteTag(siteUser);
}
