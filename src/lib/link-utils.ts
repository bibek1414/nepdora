export const generateLinkHref = (
  originalHref: string,
  siteUser: string | undefined,
  pathname: string | null,
  isEditable: boolean = false,
  disableClicks: boolean = false
) => {
  if (isEditable || disableClicks || !originalHref) return "#";

  if (originalHref.startsWith("http") || originalHref.startsWith("mailto:")) {
    return originalHref;
  }

  const cleanHref = originalHref.replace(/^[#/]+/, "");
  const isHomePage =
    !cleanHref ||
    cleanHref === "/" ||
    cleanHref === "#" ||
    cleanHref === "home";

  // Check if we are in preview, publish or builder mode based on the current URL
  const isPreviewMode = pathname?.includes("/preview/");
  const isPublishMode = pathname?.includes("/publish/");
  const isBuilderMode = pathname?.includes("/builder/");

  // Try to recover siteUser (or siteId) from pathname if not provided
  if (
    !siteUser &&
    pathname &&
    (isPreviewMode || isPublishMode || isBuilderMode)
  ) {
    const parts = pathname.split("/");
    // For /preview/{siteUser}... parts[2] is siteUser
    // For /builder/{siteId}... parts[2] is siteId
    if (parts.length >= 3) {
      siteUser = parts[2];
    }
  }

  // Handle special page mappings in builder
  let builderSlug = cleanHref;
  if (isBuilderMode) {
    if (cleanHref === "login") builderSlug = "login-draft";
    if (cleanHref === "signup") builderSlug = "signup-draft";
    if (cleanHref === "checkout") builderSlug = "checkout-draft";
    if (cleanHref === "order-confirmation")
      builderSlug = "order-confirmation-draft";
  }

  // Handle preview slugs
  let previewSlug = cleanHref;
  if (isPreviewMode) {
    if (isHomePage) previewSlug = "home-draft";
    if (cleanHref === "login") previewSlug = "login-draft";
    if (cleanHref === "signup") previewSlug = "signup-draft";
    if (cleanHref === "checkout") previewSlug = "checkout-draft";
    if (cleanHref === "order-confirmation")
      previewSlug = "order-confirmation-draft";
  }

  let finalHref = "";
  if (isBuilderMode && siteUser) {
    // In builder, we stay in builder but switch page slug
    finalHref = isHomePage
      ? `/builder/${siteUser}` // Note: usually builder home is just the site editor
      : `/builder/${siteUser}/${builderSlug}`;
  } else if (isPreviewMode && siteUser) {
    finalHref = `/preview/${siteUser}/${previewSlug}`;
  } else if (isPublishMode && siteUser) {
    finalHref = isHomePage ? `/` : `/${cleanHref}`;
  } else {
    finalHref = isHomePage ? "/" : `/${cleanHref}`;
  }

  // Relax the '#' check for builder/preview navigation if desired
  // But usually we want links to be disabled only when explicitly editing the link itself
  if ((isEditable || disableClicks) && !isBuilderMode) return "#";
  // For builder mode, we might want to allow the Cart Icon to navigate even if navbar is technically "editable"
  // but let's keep it safe for now and only return if NOT editable, OR we let the caller decide.
  if (
    (isEditable || disableClicks) &&
    isBuilderMode &&
    cleanHref !== "checkout"
  )
    return "#";

  // Add redirect parameter for login links
  if (cleanHref === "login" && pathname) {
    const pathSegments = pathname.split("/").filter(Boolean);
    let slug = "";

    if (isPreviewMode) {
      // Expected pathname: /preview/{siteUser}/{slug}
      // pathSegments: ['preview', siteUser, ...slugParts]
      slug = pathSegments.slice(2).join("/") || "home";
    } else if (isPublishMode) {
      // Expected pathname: /{slug}
      slug = pathSegments.join("/") || "home";
    }

    if (slug && slug !== "login" && slug !== "signup") {
      const separator = finalHref.includes("?") ? "&" : "?";
      finalHref = `${finalHref}${separator}redirect=${encodeURIComponent(slug)}`;
    }
  }

  return finalHref;
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
