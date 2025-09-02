"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  count?: number;
  pageSize?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
  onPageSizeChange?: (size: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 7,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    onPageChange(1);
  };

  const handleLast = () => {
    onPageChange(totalPages);
  };

  // Calculate which page numbers to show
  const getVisiblePages = () => {
    const delta = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - delta);
    let end = Math.min(totalPages, currentPage + delta);

    // Adjust if we're near the beginning or end
    if (end - start + 1 < maxVisiblePages) {
      if (start === 1) {
        end = Math.min(totalPages, start + maxVisiblePages - 1);
      } else if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = visiblePages[0] > 2;
  const showEndEllipsis =
    visiblePages[visiblePages.length - 1] < totalPages - 1;

  const buttonClass = (isActive: boolean, isDisabled: boolean = false) =>
    `inline-flex items-center justify-center w-10 h-10 text-sm font-medium transition-all duration-200 border rounded-lg ${
      isDisabled
        ? "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed"
        : isActive
          ? "text-white bg-primary"
          : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:"
    }`;

  const navButtonClass = (isDisabled: boolean) =>
    `inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 border rounded-lg ${
      isDisabled
        ? "text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed"
        : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:"
    }`;

  return (
    <div className="mt-20 flex flex-col items-center gap-4">
      {/* Pagination controls */}
      <div className="flex items-center gap-2">
        {/* First page button */}
        {showFirstLast && currentPage > 1 && (
          <button
            onClick={handleFirst}
            className={navButtonClass(false)}
            title="Go to first page"
          >
            First
          </button>
        )}

        {/* Previous button */}
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={navButtonClass(currentPage === 1)}
          title="Go to previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page 1 */}
        {!visiblePages.includes(1) && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={buttonClass(currentPage === 1)}
            >
              1
            </button>
            {showStartEllipsis && (
              <div className="flex h-10 w-10 items-center justify-center">
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </>
        )}

        {/* Visible page numbers */}
        {visiblePages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={buttonClass(currentPage === page)}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ))}

        {/* Last page */}
        {!visiblePages.includes(totalPages) && (
          <>
            {showEndEllipsis && (
              <div className="flex h-10 w-10 items-center justify-center">
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </div>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className={buttonClass(currentPage === totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={navButtonClass(currentPage === totalPages)}
          title="Go to next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Last page button */}
        {showFirstLast && currentPage < totalPages && (
          <button
            onClick={handleLast}
            className={navButtonClass(false)}
            title="Go to last page"
          >
            Last
          </button>
        )}
      </div>

      {/* Mobile-friendly quick jump */}
      <div className="flex items-center gap-2 text-xs text-gray-500 sm:hidden">
        <span>Jump to:</span>
        <select
          value={currentPage}
          onChange={e => onPageChange(Number(e.target.value))}
          className="rounded border border-gray-300 bg-white px-2 py-1 text-xs"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <option key={page} value={page}>
              Page {page}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Pagination;
