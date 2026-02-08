export const generateLinkHref = (
  originalHref: string,
  siteUser: string | undefined,
  pathname: string | null,
  isEditable: boolean = false,
  disableClicks: boolean = false
) => {
  if (isEditable || disableClicks) return "#";

  if (originalHref.startsWith("http") || originalHref.startsWith("mailto:")) {
    return originalHref;
  }

  const cleanHref = originalHref.replace(/^[#/]+/, "");
  const isHomePage =
    !cleanHref ||
    cleanHref === "/" ||
    cleanHref === "#" ||
    cleanHref === "home";

  // Check if we are in preview or publish mode based on the current URL
  const isPreviewMode = pathname?.includes("/preview/");
  const isPublishMode = pathname?.includes("/publish/");

  // Try to recover siteUser from pathname if not provided
  if (!siteUser && pathname && (isPreviewMode || isPublishMode)) {
    const parts = pathname.split("/");
    // parts[0] is empty, parts[1] is 'preview' or 'publish', parts[2] is siteUser
    if (parts.length >= 3) {
      siteUser = parts[2];
    }
  }

  if (isPreviewMode && siteUser) {
    return isHomePage
      ? `/preview/${siteUser}`
      : `/preview/${siteUser}/${cleanHref}`;
  }

  if (isPublishMode && siteUser) {
    return isHomePage ? `` : `${cleanHref}`;
  }

  // Published mode on custom domain or fallback
  return isHomePage ? "/" : `/${cleanHref}`;
};

export const getLinkPrefix = (
  siteUser: string | undefined,
  pathname: string | null
) => {
  // Try to recover siteUser from pathname if not provided
  if (
    !siteUser &&
    pathname &&
    (pathname.includes("/preview/") || pathname.includes("/publish/"))
  ) {
    const parts = pathname.split("/");
    if (parts.length >= 3) {
      siteUser = parts[2];
    }
  }

  if (!siteUser) return "";
  if (pathname?.includes("/preview/")) return `/preview/${siteUser}`;
  if (pathname?.includes("/publish/")) return ``;
  return "";
};
