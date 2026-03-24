import { getServerApiBaseUrl } from "@/config/server-site";
import { siteConfig } from "@/config/site";
import { handleApiError } from "@/utils/api-error";
import { Page } from "@/types/owner-site/components/page";
import { ComponentResponse } from "@/types/owner-site/components/components";
import { GetNavbarResponse } from "@/types/owner-site/components/navbar";
import { GetFooterResponse } from "@/types/owner-site/components/footer";
import { GetThemeResponse } from "@/types/owner-site/components/theme";

const PAGE_REVALIDATE_SECONDS = 300;
const LAYOUT_REVALIDATE_SECONDS = 300;

type PublishFetchOptions = {
  revalidate?: number;
  tags: string[];
};

type PublishPagePayload = {
  currentPageSlug: string;
  targetSlug: string;
  contentSlug?: string;
  pageComponents: ComponentResponse[];
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
  const data = await fetchPublishedResource<any>(
    siteUser,
    `/api/pages/${pageSlug}/components/`,
    {
      revalidate: PAGE_REVALIDATE_SECONDS,
      tags: [`tenant:${siteUser}:page:${pageSlug}`],
    }
  );

  if (Array.isArray(data)) {
    return data;
  }

  return data?.data || data?.components || [];
}

async function getPublishedNavbar(
  siteUser: string
): Promise<GetNavbarResponse | null> {
  const data = await fetchPublishedResource<any>(siteUser, "/api/navbar/", {
    revalidate: LAYOUT_REVALIDATE_SECONDS,
    tags: [`tenant:${siteUser}:navbar`],
  });

  return {
    data: data || null,
    message: data ? "Navbar retrieved successfully" : "No navbar found",
  };
}

async function getPublishedFooter(
  siteUser: string
): Promise<GetFooterResponse | null> {
  const data = await fetchPublishedResource<any>(siteUser, "/api/footer/", {
    revalidate: LAYOUT_REVALIDATE_SECONDS,
    tags: [`tenant:${siteUser}:footer`],
  });

  return {
    data: data || null,
    message: data ? "Footer retrieved successfully" : "No footer found",
  };
}

async function getPublishedTheme(
  siteUser: string
): Promise<GetThemeResponse | null> {
  const data = await fetchPublishedResource<any>(siteUser, "/api/theme/", {
    revalidate: LAYOUT_REVALIDATE_SECONDS,
    tags: [`tenant:${siteUser}:theme`],
  });

  return {
    data: data || [],
    message:
      data?.length > 0 ? "Themes retrieved successfully" : "No themes found",
  };
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

export async function getPublishedPagePayload(
  siteUser: string,
  currentPageSlug: string,
  contentSlug?: string
): Promise<PublishPagePayload> {
  const pages = await getPublishedPages(siteUser);
  const targetSlug = resolveTargetSlug(pages, currentPageSlug);
  const pageComponents = await getPublishedPageComponents(siteUser, targetSlug);

  return {
    currentPageSlug,
    targetSlug,
    contentSlug,
    pageComponents,
  };
}

export async function getPublishedHomePagePayload(
  siteUser: string
): Promise<PublishPagePayload> {
  const pages = await getPublishedPages(siteUser);
  const targetSlug = resolveHomePageSlug(pages);
  const pageComponents = await getPublishedPageComponents(siteUser, targetSlug);

  return {
    currentPageSlug: targetSlug,
    targetSlug,
    pageComponents,
  };
}

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
