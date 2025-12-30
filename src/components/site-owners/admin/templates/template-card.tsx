"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Eye, Loader2 } from "lucide-react";
import {
  useImportTemplate,
  usePreviewTemplate,
} from "@/hooks/owner-site/admin/use-template";
import { Template } from "@/types/owner-site/admin/template";
import { useAuth } from "@/hooks/use-auth";
import { LoadingScreen } from "@/components/on-boarding/loading-screen/loading-screen";

// Template Card Component
interface TemplateCardProps {
  template: Template;
}

export const TemplateCard = ({ template }: TemplateCardProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { mutate: importTemplate, isPending } = useImportTemplate();
  const { openPreview } = usePreviewTemplate();

  const handlePreview = () => {
    if (template.preview_url) {
      window.open(template.preview_url, "_blank", "noopener,noreferrer");
    } else {
      openPreview(template.schema_name);
    }
  };

  const handleUseTemplate = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmImport = () => {
    importTemplate(template.id, {
      onSuccess: () => {
        setShowConfirmDialog(false);
        setShowLoadingScreen(true);

        // Navigate to builder after 5 seconds
        setTimeout(() => {
          // Use user.subDomain to navigate to builder
          if (user?.sub_domain) {
            router.push(`/builder/${user.sub_domain}`);
          } else {
            // Fallback to /builder if subDomain is not available
            router.push("/builder");
          }
        }, 5000);
      },
      onError: error => {
        console.error("Import failed:", error);
        setShowConfirmDialog(false);
        setShowLoadingScreen(false);
      },
    });
  };

  return (
    <>
      {/* Loading Screen */}
      <LoadingScreen isVisible={showLoadingScreen} />

      <div className="group">
        <Card className="gap-0 overflow-hidden border-gray-200 py-0 transition-all duration-300 hover:border-blue-300">
          <div
            className="relative aspect-[4/3] overflow-hidden bg-gray-100"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {template.template_image ? (
              <img
                src={template.template_image}
                alt={template.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <span className="text-4xl text-gray-400">📄</span>
              </div>
            )}

            {/* Hover Overlay with Preview Button */}
            <div
              className={`absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <Button
                onClick={handlePreview}
                variant="secondary"
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            </div>
          </div>

          <CardContent className="p-4">
            <h3 className="mb-1 text-lg font-semibold text-gray-900 capitalize">
              {template.name.replace(/-/g, " ")}
            </h3>
            {template.description && (
              <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                {template.description}
              </p>
            )}
          </CardContent>

          <div className="px-4 pb-4">
            <Button
              onClick={handleUseTemplate}
              disabled={isPending}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                "Use Template"
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to import the{" "}
              <span className="font-semibold capitalize">
                {template.name.replace(/-/g, " ")}
              </span>{" "}
              template?
              <br />
              <br />
              <span className="font-medium text-red-600">
                Warning: This will erase all your current data and replace it
                with the template content.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmImport}
              disabled={isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                "Yes, Import Template"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
