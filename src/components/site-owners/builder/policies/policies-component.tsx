"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/site-owners/button";
import { Button as CButton } from "@/components/ui/button";
import { Trash2, Calendar, Save } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  PolicyData,
  PolicyComponentData,
} from "@/types/owner-site/components/policies";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import ReusableQuill from "@/components/ui/tip-tap";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { EditableText } from "@/components/ui/editable-text";
import { sanitizeContent } from "@/utils/html-sanitizer";

interface PolicyComponentProps {
  component: PolicyComponentData;
  isEditable?: boolean;
  pageSlug: string;
  siteUser: string;
}

export const PolicyComponent: React.FC<PolicyComponentProps> = ({
  component,
  isEditable = false,
  pageSlug,
  siteUser,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [data, setData] = useState(component.data);
  const [hasContentChanges, setHasContentChanges] = useState(false);
  const [originalContent, setOriginalContent] = useState(
    component.data.content
  );
  const [isSaving, setIsSaving] = useState(false);

  const deletePolicyMutation = useDeleteComponentMutation(pageSlug, "policies");
  const updatePolicyMutation = useUpdateComponentMutation(pageSlug, "policies");

  // Ref to store the timeout ID for debouncing
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track content changes only (not title)
  useEffect(() => {
    const hasModifications = data.content !== originalContent;
    setHasContentChanges(hasModifications);
  }, [data.content, originalContent]);

  // Auto-save effect with 2-second debounce
  useEffect(() => {
    // Only auto-save if in edit mode and there are changes
    if (!isEditable || !hasContentChanges) {
      return;
    }

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for 2 seconds
    autoSaveTimeoutRef.current = setTimeout(() => {
      handleAutoSave();
    }, 2000);

    // Cleanup function
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [data.content, hasContentChanges, isEditable]);

  // Sanitize content for preview mode
  const sanitizedContent = useMemo(() => {
    if (isEditable || !data.content) {
      return data.content;
    }
    return sanitizeContent(data.content);
  }, [data.content, isEditable]);

  // Auto-save function
  const handleAutoSave = () => {
    const componentId = component.component_id || component.id.toString();

    setIsSaving(true);

    const updatedData = {
      ...data,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    updatePolicyMutation.mutate(
      {
        componentId,
        data: updatedData,
      },
      {
        onSuccess: () => {
          setOriginalContent(data.content);
          setHasContentChanges(false);
          setIsSaving(false);
        },
        onError: error => {
          setIsSaving(false);
          toast.error("Auto-save failed", {
            description:
              error instanceof Error ? error.message : "Please try again",
          });
        },
      }
    );
  };

  // Handle title change with auto-save
  const handleTitleChange = (value: string) => {
    const componentId = component.component_id || component.id.toString();

    // Update local state immediately
    setData(prev => ({ ...prev, title: value }));

    // Auto-save title
    const updatedData = {
      ...data,
      title: value,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    updatePolicyMutation.mutate(
      {
        componentId,
        data: updatedData,
      },
      {
        onError: error => {
          toast.error("Failed to update title", {
            description:
              error instanceof Error ? error.message : "Please try again",
          });
          // Revert on error
          setData(prev => ({ ...prev, title: data.title }));
        },
      }
    );
  };

  // Handle content change (local state only)
  const handleContentChange = (value: string) => {
    setData(prev => ({ ...prev, content: value }));
  };

  // Manual save content changes
  const handleSaveChanges = () => {
    // Clear any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    handleAutoSave();
  };

  // Discard content changes only
  const handleDiscardChanges = () => {
    // Clear any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    setData(prev => ({ ...prev, content: originalContent }));
    setHasContentChanges(false);
    toast.info("Changes discarded");
  };

  const handleDelete = () => {
    const componentId = component.component_id || component.id.toString();

    const loadingToast = toast.loading("Deleting policy...");

    deletePolicyMutation.mutate(componentId, {
      onSuccess: () => {
        toast.dismiss(loadingToast);
        setIsDeleteDialogOpen(false);
      },
      onError: error => {
        toast.dismiss(loadingToast);
        toast.error("Failed to delete policy", {
          description:
            error instanceof Error ? error.message : "Please try again",
        });
      },
    });
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const imageUrl = await uploadToCloudinary(file, {
        folder: "policies",
        resourceType: "image",
      });
      return imageUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("Failed to upload image");
    }
  };

  return (
    <div className="group relative">
      {/* Action Buttons */}
      {isEditable && (
        <>
          {/* Auto-save indicator */}
          {(isSaving || hasContentChanges) && (
            <div className="bg-background/95 fixed top-18 left-1/2 z-50 flex -translate-x-1/2 transform items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 backdrop-blur-sm">
              {isSaving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                  <span className="text-sm text-gray-600">Saving...</span>
                </>
              ) : (
                <>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
                  <span className="text-sm text-gray-600">Unsaved changes</span>
                  <div className="ml-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDiscardChanges}
                      disabled={updatePolicyMutation.isPending}
                    >
                      Discard
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={handleSaveChanges}
                      disabled={updatePolicyMutation.isPending}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Now
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Delete Button */}
          <div className="bg-background/80 absolute top-4 -right-45 z-30 flex gap-2 rounded-lg p-1 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <CButton
              size="sm"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={deletePolicyMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
            </CButton>
          </div>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Policy</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this policy? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deletePolicyMutation.isPending}
                >
                  {deletePolicyMutation.isPending ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      {/* Policy Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white">
          {/* Header */}
          <div className="border-b border-gray-200 px-8 py-6">
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div>
                <EditableText
                  value={data.title}
                  onChange={handleTitleChange}
                  as="h1"
                  className="text-5xl font-bold text-gray-900"
                  isEditable={isEditable}
                  placeholder="Enter policy title..."
                  multiline={false}
                />
                {/* <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Last Updated:{" "}
                    {data.lastUpdated || new Date().toLocaleDateString()}
                  </span>
                </div> */}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {isEditable ? (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Policy Content (Auto-saves 2 seconds after you stop typing)
                </label>
                <ReusableQuill
                  value={data.content}
                  onChange={handleContentChange}
                  placeholder="Enter policy content..."
                  height="500px"
                  toolbar="advanced"
                  onImageUpload={handleImageUpload}
                  maxImageSize={5}
                />
              </div>
            ) : (
              <div
                className="prose prose-lg prose-headings:font-semibold prose-h2:mb-4 prose-h2:mt-8 prose-h2:text-2xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:text-xl prose-p:mb-4 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-ul:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:my-4 prose-ol:list-decimal prose-ol:pl-6 prose-li:mb-2 prose-strong:font-semibold prose-table:my-6 prose-table:w-full prose-table:border-collapse prose-thead:bg-gray-50 prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2 max-w-none"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
