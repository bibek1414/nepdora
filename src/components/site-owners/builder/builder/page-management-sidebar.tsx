import React from "react";
import { Page } from "@/types/owner-site/components/page";
import { NewPageDialog } from "@/components/site-owners/builder/new-page/new-page-dialog";
import { DeletePageDialog } from "@/components/site-owners/builder/new-page/delete-page-dialog";
import { 
  FileText, 
  Home, 
  File, 
  ShoppingCart, 
  Lock, 
  Settings, 
  Copy, 
  Plus,
  ChevronRight
} from "lucide-react";
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
  const detailsPages = pages.filter(page =>
    page.slug.includes("-details-draft")
  );
  const storePages = pages.filter(
    page =>
      page.slug.includes("checkout-draft") ||
      page.slug.includes("order-confirmation-draft")
  );
  const authPages = pages.filter(
    page =>
      page.slug.includes("login-draft") || page.slug.includes("signup-draft")
  );
  const mainPages = pages.filter(
    page =>
      !page.slug.includes("-details-draft") &&
      !page.slug.includes("checkout-draft") &&
      !page.slug.includes("order-confirmation-draft") &&
      !page.slug.includes("login-draft") &&
      !page.slug.includes("signup-draft")
  );

  const getPageIcon = (slug: string) => {
    if (slug === 'home') return <Home className="h-3.5 w-3.5" />;
    if (slug.includes('product')) return <ShoppingCart className="h-3.5 w-3.5" />;
    if (slug.includes('login') || slug.includes('signup')) return <Lock className="h-3.5 w-3.5" />;
    return <FileText className="h-3.5 w-3.5" />;
  };

  const renderPageList = (title: string, list: Page[]) => {
    if (list.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="px-4 py-2 text-[10px] font-bold tracking-widest text-builder-text-muted uppercase">
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
              <div className="flex items-center gap-2.5 truncate flex-1">
                <div className={cn(
                  "shrink-0 transition-colors",
                  currentPage === page.slug ? "text-builder-accent" : "text-builder-text-muted group-hover:text-builder-text-secondary"
                )}>
                  {getPageIcon(page.slug)}
                </div>
                <span className="truncate capitalize tracking-tight font-medium">{page.title}</span>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 rounded-md hover:bg-builder-border text-builder-text-muted hover:text-builder-text-primary" title="Settings">
                  <Settings className="h-3 w-3" />
                </button>
                {pages.length > 1 &&
                  !page.slug.includes("-details-draft") &&
                  !page.slug.includes("checkout-draft") &&
                  !page.slug.includes("login-draft") &&
                  !page.slug.includes("signup-draft") &&
                  !page.slug.includes("order-confirmation-draft") && (
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

  return (
    <aside className="w-[220px] shrink-0 border-r bg-white flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto pt-4 pb-12 scrollbar-hide">
        {renderPageList("Main Pages", mainPages)}
        {renderPageList("Detail Pages", detailsPages)}
        {renderPageList("Store", storePages)}
        {renderPageList("Authentication", authPages)}

        <div className="px-3 mt-2">
          <NewPageDialog onPageCreated={onPageCreated} />
        </div>
      </div>
    </aside>
  );
};
