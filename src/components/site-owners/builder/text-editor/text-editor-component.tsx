"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Save } from "lucide-react";
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
import { TextEditorComponentData } from "@/types/owner-site/components/text-editor";
import {
  useDeleteComponentMutation,
  useUpdateComponentMutation,
} from "@/hooks/owner-site/components/use-unified";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { TextEditorStyle1 } from "./text-editor-style/text-editor-style-1";

interface TextEditorComponentProps {
  component: TextEditorComponentData;
  isEditable?: boolean;
  pageSlug: string;
  siteUser: string;
}

export const TextEditorComponent: React.FC<TextEditorComponentProps> = ({
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

  const deleteTextEditorMutation = useDeleteComponentMutation(
    pageSlug,
    "text_editor"
  );
  const updateTextEditorMutation = useUpdateComponentMutation(
    pageSlug,
    "text_editor"
  );

  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const hasModifications = data.content !== originalContent;
    setHasContentChanges(hasModifications);
  }, [data.content, originalContent]);

  useEffect(() => {
    if (!isEditable || !hasContentChanges) return;

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    autoSaveTimeoutRef.current = setTimeout(() => {
      handleAutoSave();
    }, 2000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [data.content, hasContentChanges, isEditable]);

  const handleAutoSave = () => {
    const componentId = component.component_id || component.id.toString();
    setIsSaving(true);

    const updatedData = {
      ...data,
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    updateTextEditorMutation.mutate(
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
        onError: () => {
          setIsSaving(false);
        },
      }
    );
  };

  const handleContentChange = (value: string) => {
    setData(prev => ({ ...prev, content: value }));
  };

  const handleSaveChanges = () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    handleAutoSave();
  };

  const handleDiscardChanges = () => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    setData(prev => ({ ...prev, content: originalContent }));
    setHasContentChanges(false);
  };

  const handleDelete = () => {
    const componentId = component.component_id || component.id.toString();
    deleteTextEditorMutation.mutate(componentId, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
      },
    });
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const imageUrl = await uploadToCloudinary(file, {
        folder: "text-editor",
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
      {isEditable && (
        <>
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
                    >
                      Discard
                    </Button>
                    <Button
                      size="sm"
                      variant="default"
                      onClick={handleSaveChanges}
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

          <div className="absolute -right-5 z-30 flex translate-x-full gap-2 rounded-lg p-1 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={deleteTextEditorMutation.isPending}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Text Editor</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this text editor? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleteTextEditorMutation.isPending}
                >
                  {deleteTextEditorMutation.isPending
                    ? "Deleting..."
                    : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}

      <TextEditorStyle1
        data={data}
        isEditable={isEditable}
        onContentChange={handleContentChange}
        onImageUpload={handleImageUpload}
      />
    </div>
  );
};
