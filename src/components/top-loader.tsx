"use client";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";

NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3,
  speed: 500,
  easing: "ease",
});

export default function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    if (isNavigatingRef.current) {
      NProgress.done();
      isNavigatingRef.current = false;
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement;

      // First check: if it has a cart action data attribute, ignore it
      if (target.closest("[data-cart-action]")) {
        return;
      }

      // Second check: if it's a button that's not inside a link, ignore it
      if (target.tagName === "BUTTON" && !target.closest("a")) {
        return;
      }

      // Third check: if clicking on anything inside a button that's not a link, ignore it
      if (target.closest("button") && !target.closest("a")) {
        return;
      }

      // Fourth check: if it's inside a modal, ignore it
      if (
        target.closest('[class*="modal"]') ||
        target.closest('[class*="Modal"]')
      ) {
        return;
      }

      // Fifth check: if it's a wishlist button, ignore it
      if (
        target.closest("[data-wishlist]") ||
        target.closest('button[class*="wishlist"]')
      ) {
        return;
      }

      // NEW: Sixth check: if it's an editable link, ignore it
      if (target.closest("[data-editable-link]")) {
        return;
      }

      // Now check if it's actually a navigation link
      const link = target.closest("a");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href) return;

      // External links
      if (href.startsWith("http") && !href.startsWith(window.location.origin)) {
        return;
      }

      // Special links
      if (
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#")
      ) {
        return;
      }

      // New tab links
      if (link.target === "_blank") {
        return;
      }

      // Prevented default
      if (e.defaultPrevented) {
        return;
      }

      const currentPath = window.location.pathname + window.location.search;
      let targetPath: string;

      try {
        if (href.startsWith("/")) {
          targetPath = href;
        } else {
          const url = new URL(href, window.location.origin);
          targetPath = url.pathname + url.search;
        }
      } catch (error) {
        console.error("Error parsing URL:", href, error);
        return;
      }

      // Same page
      if (targetPath === currentPath) {
        return;
      }

      isNavigatingRef.current = true;
      NProgress.start();
    };

    // Capture phase to catch events before they bubble up
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
      NProgress.done();
    };
  }, []);

  useEffect(() => {
    return () => {
      NProgress.done();
    };
  }, []);

  return null;
}
