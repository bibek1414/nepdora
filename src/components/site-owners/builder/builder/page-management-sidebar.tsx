import React, { useState } from "react";
import { Page } from "@/types/owner-site/components/page";
import { NewPageDialog } from "@/components/site-owners/builder/new-page/new-page-dialog";
import { DeletePageDialog } from "@/components/site-owners/builder/new-page/delete-page-dialog";
import { FileText, Home, ShoppingCart, Lock, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import "./builder.css";

interface PageManagementSidebarProps {
  pages: Page[];
  currentPage: string;
  onPageChange: (pageSlug: string) => void;
  onPageCreated: (page: Page) => void;
  onPageDeleted: (deletedSlug: string) => void;
  siteUser: string;
}

export const PageManagementSidebar: React.FC<PageManagementSidebarProps> = ({
  pages,
  currentPage,
  onPageChange,
  onPageCreated,
  onPageDeleted,
}) => {
  const [search, setSearch] = useState("");

  const filterBySearch = (list: Page[]) =>
    list.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  const detailsPages = filterBySearch(
    pages.filter(page => page.slug.includes("-details-draft"))
  );
  const storePages = filterBySearch(
    pages.filter(
      page =>
        page.slug.includes("checkout-draft") ||
        page.slug.includes("order-confirmation-draft")
    )
  );
  const authPages = filterBySearch(
    pages.filter(
      page =>
        page.slug.includes("login-draft") || page.slug.includes("signup-draft")
    )
  );
  const mainPages = filterBySearch(
    pages.filter(
      page =>
        !page.slug.includes("-details-draft") &&
        !page.slug.includes("checkout-draft") &&
        !page.slug.includes("order-confirmation-draft") &&
        !page.slug.includes("login-draft") &&
        !page.slug.includes("signup-draft")
    )
  );

  const getPageIcon = (slug: string) => {
    if (slug === "home") return <Home className="h-3.5 w-3.5" />;
    if (slug.includes("product"))
      return <ShoppingCart className="h-3.5 w-3.5" />;
    if (slug.includes("login") || slug.includes("signup"))
      return <Lock className="h-3.5 w-3.5" />;
    return <FileText className="h-3.5 w-3.5" />;
  };

  const canDelete = (slug: string) =>
    pages.length > 1 &&
    !slug.includes("-details-draft") &&
    !slug.includes("checkout-draft") &&
    !slug.includes("login-draft") &&
    !slug.includes("signup-draft") &&
    !slug.includes("order-confirmation-draft");

  const renderPageList = (title: string, list: Page[]) => {
    if (list.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="text-builder-text-muted px-4 py-2 text-[10px] font-bold tracking-widest uppercase">
          {title}
        </div>
        <div className="flex flex-col gap-0.5">
          {list.map(page => (
            <div
              key={page.slug}
              className={cn(
                "builder-nav-item group",
                currentPage === page.slug && "active"
              )}
              onClick={() => onPageChange(page.slug)}
            >
              <div className="flex flex-1 items-center gap-2.5 truncate">
                <div
                  className={cn(
                    "shrink-0 transition-colors",
                    currentPage === page.slug
                      ? "text-builder-accent"
                      : "text-builder-text-muted group-hover:text-builder-text-secondary"
                  )}
                >
                  {getPageIcon(page.slug)}
                </div>
                <span className="truncate font-medium tracking-tight capitalize">
                  {page.title}
                </span>
              </div>

              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                {canDelete(page.slug) && (
                  <div onClick={e => e.stopPropagation()}>
                    <DeletePageDialog
                      page={page}
                      onPageDeleted={onPageDeleted}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const noResults =
    search.length > 0 &&
    mainPages.length === 0 &&
    detailsPages.length === 0 &&
    storePages.length === 0 &&
    authPages.length === 0;

  return (
    <aside className="sticky top-16 flex h-[calc(100vh-64px)] w-[220px] shrink-0 flex-col overflow-hidden overflow-y-auto border-r bg-white">
      {/* Header: Pages title + New Page button */}
      <div className="border-builder-border flex items-center justify-between border-b px-4 py-3">
        <span className="text-builder-text-primary text-xs font-semibold tracking-tight">
          Pages
        </span>
        <NewPageDialog onPageCreated={onPageCreated} />
      </div>

      {/* Search bar */}
      <div className="border-builder-border border-b px-3 py-2">
        <div className="border-builder-border bg-builder-bg flex items-center gap-2 rounded-md border px-2.5 py-1.5">
          <Search className="text-builder-text-muted h-3.5 w-3.5 shrink-0" />
          <input
            type="text"
            placeholder="Search pages..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="text-builder-text-primary placeholder-builder-text-muted w-full bg-transparent text-[11px] outline-none"
          />
        </div>
      </div>

      {/* Page lists */}
      <div className="scrollbar-hide flex-1 overflow-y-auto pt-4 pb-4">
        {noResults ? (
          <p className="text-builder-text-muted px-4 py-6 text-center text-[11px]">
            No pages match "{search}"
          </p>
        ) : (
          <>
            {renderPageList("Main Pages", mainPages)}
            {renderPageList("Detail Pages", detailsPages)}
            {renderPageList("Store", storePages)}
            {renderPageList("Authentication", authPages)}
          </>
        )}
      </div>
    </aside>
  );
};
