"use client";
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Check,
  X,
  ExternalLink,
  Plus,
  ArrowLeft,
  Link as LinkIcon,
} from "lucide-react";
import { usePages, useCreatePage } from "@/hooks/owner-site/use-page";
import { Page } from "@/types/owner-site/components/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button as SOButton } from "@/components/ui/site-owners/button";
import { NewPageDialog } from "../site-owners/builder/new-page/new-page-dialog";
import { NewExternalLinkDialog } from "../site-owners/builder/new-page/new-external-link-dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
import { useProducts } from "@/hooks/owner-site/admin/use-product";
import { useBlogs } from "@/hooks/owner-site/admin/use-blogs";
import { useServices } from "@/hooks/owner-site/admin/use-services";
import { usePortfolios } from "@/hooks/owner-site/admin/use-portfolio";

interface EditableLinkProps {
  text: string;
  href: string;
  onChange: (text: string, href: string) => void;
  className?: string;
  style?: React.CSSProperties;
  isEditable?: boolean;
  textPlaceholder?: string;
  hrefPlaceholder?: string;
  children?: React.ReactNode;
  siteUser?: string;
  target?: "_blank" | "_self";
  showExternalIcon?: boolean;
  dropdownPosition?: "top" | "bottom";
}

interface PageSelectorProps {
  onSelect: (href: string, text?: string) => void;
  onCancel: () => void;
  currentHref: string;
  dropdownPosition?: "top" | "bottom";
}

const PageSelector: React.FC<PageSelectorProps> = ({
  onSelect,
  onCancel,
  currentHref,
  dropdownPosition = "top",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newPageTitle, setNewPageTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [open, setOpen] = useState(false);
  const [showNewPageDialog, setShowNewPageDialog] = useState(false);
  const [showExternalLinkDialog, setShowExternalLinkDialog] = useState(false);

  const [selectionType, setSelectionType] = useState<
    "page" | "product" | "blog" | "service" | "portfolio"
  >("page");
  const [basePageSlug, setBasePageSlug] = useState<string>("");
  const [basePageTitle, setBasePageTitle] = useState<string>("");

  const { data: pages = [], isLoading } = usePages();
  const createPageMutation = useCreatePage();

  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    page_size: 50,
  });
  const { data: blogsData, isLoading: isLoadingBlogs } = useBlogs({
    page_size: 50,
  });
  const { data: servicesData, isLoading: isLoadingServices } = useServices({
    page_size: 50,
  });
  const { data: portfoliosData, isLoading: isLoadingPortfolios } =
    usePortfolios({ page_size: 50 });

  // Filter pages based on search term
  const filteredPages = pages.filter(
    (page: Page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filterItems = (items: any[]) => {
    return (
      items?.filter(item =>
        (item.name || item.title || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) || []
    );
  };

  // Update slug when title changes
  useEffect(() => {
    if (newPageTitle) {
      // We don't need to set slug since the API will generate it
    }
  }, [newPageTitle]);

  // Handle page selection
  const handlePageSelect = (page: Page) => {
    const isProductDetail =
      page.slug === "product-details" || page.slug === "product-details-draft";
    const isBlogDetail =
      page.slug === "blog-details" || page.slug === "blog-details-draft";
    const isServiceDetail =
      page.slug === "service-details" || page.slug === "service-details-draft";
    const isPortfolioDetail =
      page.slug === "portfolio-details" ||
      page.slug === "portfolio-details-draft";

    if (isProductDetail) {
      setSelectionType("product");
      setBasePageSlug(page.slug);
      setBasePageTitle(page.title);
      setSearchTerm("");
      return;
    }
    if (isBlogDetail) {
      setSelectionType("blog");
      setBasePageSlug(page.slug);
      setBasePageTitle(page.title);
      setSearchTerm("");
      return;
    }
    if (isServiceDetail) {
      setSelectionType("service");
      setBasePageSlug(page.slug);
      setBasePageTitle(page.title);
      setSearchTerm("");
      return;
    }
    if (isPortfolioDetail) {
      setSelectionType("portfolio");
      setBasePageSlug(page.slug);
      setBasePageTitle(page.title);
      setSearchTerm("");
      return;
    }

    onSelect(`/${page.slug}`, page.title);
  };

  const handleItemSelect = (itemSlug: string, itemName: string) => {
    onSelect(`/${basePageSlug}/${itemSlug}`, `${basePageTitle}: ${itemName}`);
  };

  // Handle external URL selection submission
  const handleAddExternalUrl = (url: string) => {
    onSelect(url, url);
  };

  // Handle new page creation
  const handleCreatePage = async () => {
    if (!newPageTitle.trim()) return;

    setIsCreating(true);
    try {
      const pageData = {
        title: newPageTitle.trim(),
      };

      const newPage = await createPageMutation.mutateAsync(pageData);
      onSelect(`/${newPage.slug}`, newPage.title);

      // Reset form
      setNewPageTitle("");
    } catch (error) {
      console.error("Failed to create page:", error);
      alert("Failed to create page. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const positionClass =
    dropdownPosition === "bottom" ? "top-full mt-1" : "bottom-full mb-1";

  const renderItemsList = () => {
    let items: any[] = [];
    let loading = false;
    let fallbackMsg = "";

    if (selectionType === "product") {
      items = filterItems(productsData?.results || []);
      loading = isLoadingProducts;
      fallbackMsg = "No products found.";
    } else if (selectionType === "blog") {
      items = filterItems(blogsData?.results || []);
      loading = isLoadingBlogs;
      fallbackMsg = "No blogs found.";
    } else if (selectionType === "service") {
      items = filterItems(servicesData?.results || []);
      loading = isLoadingServices;
      fallbackMsg = "No services found.";
    } else if (selectionType === "portfolio") {
      items = filterItems(portfoliosData?.results || []);
      loading = isLoadingPortfolios;
      fallbackMsg = "No portfolios found.";
    }

    if (loading) {
      return (
        <div className="text-muted-foreground p-4 text-center">Loading...</div>
      );
    }

    if (items.length === 0) {
      return (
        <div className="text-muted-foreground p-4 text-center">
          {searchTerm ? `No matches for "${searchTerm}"` : fallbackMsg}
        </div>
      );
    }

    return (
      <div className="p-2">
        {items.map((item: any) => {
          const name = item.name || item.title || "Untitled";
          console.log("item", item);
          const image = item.thumbnail_image || "/fallback/image-not-found.png";
          const itemHref = `/${basePageSlug}/${item.slug}`;
          return (
            <Button
              key={item.id}
              onClick={() => handleItemSelect(item.slug, name)}
              variant={currentHref === itemHref ? "secondary" : "ghost"}
              className={cn(
                "h-auto w-full justify-between p-3",
                currentHref === itemHref && "bg-primary/10 text-primary"
              )}
            >
              <div className="flex items-center gap-2 text-left">
                <img src={image} alt={name} className="h-8 w-8 rounded-md" />
                <div className="font-medium capitalize">{name}</div>
              </div>
            </Button>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Card
        className={`absolute ${positionClass} left-0 z-[9999] w-80 bg-white py-0 shadow-xl`}
      >
        <CardContent className="flex max-h-[400px] flex-col p-0">
          {selectionType !== "page" ? (
            <div className="bg-muted/30 flex items-center gap-2 border-b p-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setSelectionType("page");
                  setSearchTerm("");
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-sm font-medium">
                Select {selectionType}
              </div>
            </div>
          ) : null}

          {/* Existing Pages or Items - Fixed ScrollArea */}
          <ScrollArea
            className="flex-1 overflow-y-auto"
            style={{ maxHeight: "240px" }}
          >
            {selectionType !== "page" ? (
              renderItemsList()
            ) : isLoading ? (
              <div className="text-muted-foreground p-4 text-center">
                Loading pages...
              </div>
            ) : filteredPages.length > 0 ? (
              <div className="p-2">
                {filteredPages.map((page: Page) => (
                  <Button
                    key={page.id}
                    onClick={() => handlePageSelect(page)}
                    variant={
                      currentHref === `/${page.slug}` ? "secondary" : "ghost"
                    }
                    className={cn(
                      "h-auto w-full justify-between p-3",
                      currentHref === `/${page.slug}` &&
                        "bg-primary/10 text-primary"
                    )}
                  >
                    <div className="flex-1 text-left">
                      <div className="font-medium capitalize">{page.title}</div>
                      <div className="text-muted-foreground text-sm">
                        /{page.slug}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : searchTerm && !isLoading ? (
              <div className="text-muted-foreground p-4 text-center">
                No pages found matching &quot;{searchTerm}&quot;
              </div>
            ) : null}
          </ScrollArea>

          {selectionType === "page" && (
            <>
              <Separator />
              <div className="flex flex-col gap-1 bg-white p-2">
                <Button
                  onClick={() => setShowExternalLinkDialog(true)}
                  variant="ghost"
                  className="h-8 w-full justify-start text-green-600 hover:bg-blue-50 hover:text-green-700"
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  <span>Add External URL</span>
                </Button>
                <Button
                  onClick={() => {
                    setNewPageTitle("");
                    setShowNewPageDialog(true);
                  }}
                  variant="ghost"
                  className="h-8 w-full justify-start text-green-700 hover:bg-green-50 hover:text-green-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Create New Page</span>
                </Button>
              </div>
            </>
          )}

          <Separator />

          {/* Footer - Fixed Background */}
          <div className="bg-muted/30 shrink-0 p-2">
            <Button
              onClick={onCancel}
              variant="ghost"
              className="text-muted-foreground hover:text-foreground h-8 w-full bg-white"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

      <NewPageDialog
        open={showNewPageDialog}
        onOpenChange={setShowNewPageDialog}
        onPageCreated={page => {
          onSelect(`/${page.slug}`, `${page.title}-draft`);
        }}
      />

      <NewExternalLinkDialog
        open={showExternalLinkDialog}
        onOpenChange={setShowExternalLinkDialog}
        onLinkCreated={handleAddExternalUrl}
      />
    </>
  );
};

export const EditableLink: React.FC<EditableLinkProps> = ({
  text,
  href,
  onChange,
  className,
  style,
  isEditable = false,
  textPlaceholder = "Link text...",
  hrefPlaceholder = "Enter URL...",
  children,
  siteUser,
  target = "_self",
  showExternalIcon = false,
  dropdownPosition = "top",
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPageSelector, setShowPageSelector] = useState(false);
  const [editText, setEditText] = useState(text);
  const [editHref, setEditHref] = useState(href);
  const textInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  // Generate the actual href for navigation
  const finalHref = generateLinkHref(
    href,
    siteUser,
    pathname,
    isEditable,
    false
  );

  // Handle page selection from dropdown
  const handlePageSelect = (selectedHref: string, selectedText?: string) => {
    setEditHref(selectedHref);
    if (selectedText && (!editText || editText === textPlaceholder)) {
      setEditText(selectedText);
    }
    setShowPageSelector(false);
    setIsEditing(true);
  };

  // Handle saving changes
  const handleSave = () => {
    onChange(editText, editHref);
    setIsEditing(false);
  };

  // Handle canceling changes
  const handleCancel = () => {
    setEditText(text);
    setEditHref(href);
    setIsEditing(false);
    setShowPageSelector(false);
  };

  // Handle link click when not in edit mode
  const handleLinkClick = (e: React.MouseEvent) => {
    if (isEditable) {
      e.preventDefault();
      e.stopPropagation();
      setShowPageSelector(true);
    }
  };

  // Focus text input when entering edit mode
  useEffect(() => {
    if (isEditing && textInputRef.current) {
      textInputRef.current.focus();
      textInputRef.current.select();
    }
  }, [isEditing]);

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  // Update local state when props change
  useEffect(() => {
    setEditText(text);
    setEditHref(href);
  }, [text, href]);

  // Close page selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is inside a dialog (e.g. the link or create page dialogs)
      const dialogElement = document.querySelector('[role="dialog"]');
      if (dialogElement && dialogElement.contains(event.target as Node)) {
        return; // Ignore clicks inside the dialog
      }

      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowPageSelector(false);
        if (!isEditing) {
          handleCancel();
        }
      }
    };

    if (showPageSelector) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showPageSelector, isEditing]);

  // If in edit mode, show inline editing
  if (isEditing && isEditable) {
    return (
      <Card className="relative z-9998 inline-block py-0">
        <CardContent className="space-y-2 p-3">
          <Input
            ref={textInputRef}
            type="text"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={textPlaceholder}
            className="text-sm"
          />

          <div className="flex items-center gap-1">
            <Input
              type="text"
              value={editHref}
              onChange={e => setEditHref(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={hrefPlaceholder}
              className="flex-1 text-sm"
            />
          </div>

          <div className="flex gap-1">
            <Button onClick={handleSave} size="sm" className="px-2">
              <Check className="h-3 w-3" />
            </Button>
            <Button
              onClick={handleCancel}
              size="sm"
              variant="outline"
              className="px-2"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Regular link display
  const displayText = text || textPlaceholder;
  const isEmpty = !text || !href;
  const isExternal =
    typeof href === "string" &&
    (href.startsWith("http") || href.startsWith("mailto:"));

  return (
    <div className="group relative inline-block" ref={containerRef}>
      <Link
        href={finalHref}
        target={isExternal ? "_blank" : target}
        style={style}
        className={cn(
          "inline-flex items-center gap-1 transition-all duration-200",
          // Default styles that apply to both modes unless overridden
          !className?.includes("h-") && "h-16",
          !className?.includes("cursor-") && "cursor-pointer",
          !className?.includes("px-") && "px-4",
          !className?.includes("py-") && "py-2",
          !className?.includes("rounded") && "rounded",
          className,
          isEditable && [
            "hover:bg-primary/10",
            isEmpty && "text-muted-foreground italic",
          ]
        )}
        onClick={handleLinkClick}
        {...(isEditable && { "data-editable-link": "true" })}
      >
        {children || (
          <>
            {displayText}
            {showExternalIcon && isExternal && (
              <ExternalLink className="ml-1 h-3 w-3" />
            )}
          </>
        )}
      </Link>

      {/* Page Selector Dropdown */}
      {showPageSelector && isEditable && (
        <PageSelector
          onSelect={handlePageSelect}
          onCancel={() => setShowPageSelector(false)}
          currentHref={href}
          dropdownPosition={dropdownPosition}
        />
      )}
    </div>
  );
};
