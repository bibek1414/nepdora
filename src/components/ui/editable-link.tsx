"use client";
import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, X, ExternalLink, Plus } from "lucide-react";
import { usePages, useCreatePage } from "@/hooks/owner-site/use-page";
import { Page } from "@/types/owner-site/components/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button as SOButton } from "@/components/ui/site-owners/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { generateLinkHref } from "@/lib/link-utils";
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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const { data: pages = [], isLoading } = usePages();
  const createPageMutation = useCreatePage();

  // Filter pages based on search term
  const filteredPages = pages.filter(
    (page: Page) =>
      page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Update slug when title changes
  useEffect(() => {
    if (newPageTitle) {
      // We don't need to set slug since the API will generate it
    }
  }, [newPageTitle]);

  // Handle page selection
  const handlePageSelect = (page: Page) => {
    onSelect(`/${page.slug}`, page.title);
  };

  // Handle external URL selection
  const handleExternalUrl = () => {
    const url = prompt("Enter external URL (including https://):");
    if (url) {
      onSelect(url, url);
    }
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
      setShowCreateForm(false);
    } catch (error) {
      console.error("Failed to create page:", error);
      alert("Failed to create page. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const positionClass =
    dropdownPosition === "bottom" ? "top-full mt-1" : "bottom-full mb-1";

  return (
    <Card
      className={`absolute ${positionClass} left-0 z-[9999] w-80 bg-white py-0 shadow-xl`}
    >
      <CardContent className="p-0">
        {/* Existing Pages - Fixed ScrollArea */}
        <ScrollArea className="max-h-60 overflow-y-auto">
          {isLoading ? (
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

        <Separator />

        <div className="bg-white p-2">
          {!showCreateForm ? (
            <Button
              onClick={() => setShowCreateForm(true)}
              variant="ghost"
              className="w-full justify-start bg-white text-green-700 hover:bg-green-50 hover:text-green-700"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Page</span>
            </Button>
          ) : (
            <div className="space-y-3 rounded bg-white p-2">
              <div className="text-sm font-medium">Create New Page</div>

              <Input
                type="text"
                placeholder="Page title..."
                value={newPageTitle}
                onChange={e => setNewPageTitle(e.target.value)}
                className="bg-white"
              />

              <div className="flex gap-2">
                <SOButton
                  onClick={handleCreatePage}
                  variant="default"
                  disabled={!newPageTitle.trim() || isCreating}
                  className="flex-1"
                  size="sm"
                >
                  {isCreating ? "Creating..." : "Create & Link"}
                </SOButton>
                <Button
                  onClick={() => {
                    setShowCreateForm(false);
                    setNewPageTitle("");
                  }}
                  variant="outline"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Footer - Fixed Background */}
        <div className="bg-muted/30 p-2">
          <Button
            onClick={onCancel}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground w-full bg-white"
            size="sm"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
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
