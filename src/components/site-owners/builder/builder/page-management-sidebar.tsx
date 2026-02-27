import React from "react";
import { Page } from "@/types/owner-site/components/page";
import { NewPageDialog } from "@/components/site-owners/builder/new-page/new-page-dialog";
import { DeletePageDialog } from "@/components/site-owners/builder/new-page/delete-page-dialog";
import { FileText } from "lucide-react";

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
  return (
    <aside className="sticky top-16 left-0 flex h-[calc(100vh-4rem)] w-56 shrink-0 flex-col overflow-y-auto border-r bg-white">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="text-sm font-semibold text-gray-700">Pages</span>
        <NewPageDialog onPageCreated={onPageCreated} />
      </div>
      <div className="flex-1 space-y-1 p-2">
        {pages.map(page => (
          <div
            key={page.slug}
            className={`group flex cursor-pointer items-center justify-between gap-2 rounded-md px-2 py-2 text-xs transition-colors ${
              currentPage === page.slug
                ? "bg-gray-100 font-medium text-gray-900"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
            onClick={() => onPageChange(page.slug)}
          >
            <div className="flex items-center gap-2 truncate">
              <FileText className="h-4 w-4 shrink-0 text-gray-400" />
              <span className="truncate capitalize">{page.title}</span>
            </div>

            {pages.length > 1 && !page.slug.includes("-details-draft") && (
              <div className="flex shrink-0" onClick={e => e.stopPropagation()}>
                <DeletePageDialog page={page} onPageDeleted={onPageDeleted} />
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};
