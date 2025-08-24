import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { useCreatePage } from "@/hooks/owner-site/use-page";
import { Page } from "@/types/owner-site/components/page";

interface NewPageDialogProps {
  onPageCreated?: (page: Page) => void;
}

export const NewPageDialog: React.FC<NewPageDialogProps> = ({
  onPageCreated,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("");
  const [error, setError] = useState("");

  const createPageMutation = useCreatePage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pageTitle.trim()) {
      setError("Page title is required");
      return;
    }

    // Basic validation for page title
    if (pageTitle.trim().length < 2) {
      setError("Page title must be at least 2 characters long");
      return;
    }

    createPageMutation.mutate(
      { title: pageTitle.trim() },
      {
        onSuccess: (data: Page) => {
          console.log("Page created successfully:", data);
          setIsOpen(false);
          setPageTitle("");
          setError("");
          onPageCreated?.(data);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          console.error("Failed to create page:", error);

          // Handle different error types
          if (error?.response?.data?.title) {
            setError(error.response.data.title[0] || "Title validation failed");
          } else if (error?.response?.data?.slug) {
            setError("A page with this name already exists");
          } else {
            setError("Failed to create page. Please try again.");
          }
        },
      }
    );
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setPageTitle("");
      setError("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:border-primary border-2 border-dashed transition-colors"
        >
          <Plus className="mr-1 h-4 w-4" />
          New Page
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Page</DialogTitle>
          <DialogDescription>
            Enter a title for your new page. The slug will be automatically
            generated from the title.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pageTitle">Page Title</Label>
            <Input
              id="pageTitle"
              placeholder="e.g., About Us, Contact, Services"
              value={pageTitle}
              onChange={e => {
                setPageTitle(e.target.value);
                if (error) setError("");
              }}
              disabled={createPageMutation.isPending}
              autoFocus
            />
            {pageTitle && (
              <p className="text-muted-foreground text-xs">
                URL: /
                {pageTitle
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/g, "")}
              </p>
            )}
            {error && <p className="text-destructive text-sm">{error}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={createPageMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createPageMutation.isPending || !pageTitle.trim()}
            >
              {createPageMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Page
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
