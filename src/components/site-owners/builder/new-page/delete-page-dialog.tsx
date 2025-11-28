import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X, Loader2 } from "lucide-react";
import { useDeletePage } from "@/hooks/owner-site/use-page";
import { Page } from "@/types/owner-site/components/page";

interface DeletePageDialogProps {
  page: Page;
  onPageDeleted?: (deletedSlug: string) => void;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
}

export const DeletePageDialog: React.FC<DeletePageDialogProps> = ({
  page,
  onPageDeleted,
  disabled,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  showTrigger = true,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const setIsOpen = (open: boolean) => {
    if (controlledOnOpenChange) {
      controlledOnOpenChange(open);
    }
    if (!isControlled) {
      setInternalOpen(open);
    }
  };
  const deletePageMutation = useDeletePage();

  const handleDelete = () => {
    deletePageMutation.mutate(page.slug, {
      onSuccess: () => {
        console.log("Page deleted successfully:", page.slug);
        setIsOpen(false);
        onPageDeleted?.(page.slug);
      },
      onError: error => {
        console.error("Failed to delete page:", error);
        // Keep dialog open on error so user can try again or see erro  r
      },
    });
  };

  if (showTrigger && disabled) {
    return (
      <X className="text-muted-foreground/50 mr-1 h-4 w-4 cursor-not-allowed" />
    );
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {showTrigger && (
        <AlertDialogTrigger asChild>
          <X className="text-muted-foreground hover:text-destructive mr-1 h-4 w-4 cursor-pointer transition-colors" />
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Page</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the page &apos;{page.title}&apos;?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletePageMutation.isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deletePageMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deletePageMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Delete Page
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
