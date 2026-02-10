"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { Loader2 } from "lucide-react";
import {
  useImportTemplate,
  usePreviewTemplate,
} from "@/hooks/owner-site/admin/use-template";
import { Template } from "@/types/owner-site/admin/template";
import { useAuth } from "@/hooks/use-auth";
import { LoadingScreen } from "@/components/on-boarding/loading-screen/loading-screen";
import { motion } from "framer-motion";

// Template Card Component
interface TemplateCardProps {
  template: Template;
}

const formatTemplateName = (name: string): string => {
  return name
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const TemplateCard = ({ template }: TemplateCardProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const { mutate: importTemplate, isPending } = useImportTemplate();
  const { openPreview } = usePreviewTemplate();

  const formattedName = formatTemplateName(template.name);

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (template.preview_url) {
      window.open(template.preview_url, "_blank", "noopener,noreferrer");
    } else {
      openPreview(template.schema_name);
    }
  };

  const handleUseTemplate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      <LoadingScreen isVisible={showLoadingScreen} />

      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="group"
      >
        <div
          className={`mb-4 cursor-pointer overflow-hidden rounded-xl border border-slate-200/60 bg-white transition-all duration-300`}
        >
          {/* Thumbnail */}
          <div className="relative aspect-4/3 overflow-hidden">
            {template.template_image ? (
              <img
                src={template.template_image}
                alt={formattedName}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-100">
                <span className="text-4xl text-gray-400">📄</span>
              </div>
            )}
            {/* Image overlay */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1/2 bg-linear-to-br from-blue-900/20 via-transparent to-transparent" />
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-slate-900">
              {formattedName}
            </h3>
          </div>

          {/* Buttons */}
          <div className="flex shrink-0 gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handlePreview}
              rounded={true}
            >
              Preview
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleUseTemplate}
              disabled={isPending}
              rounded={true}
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Use"}
            </Button>
          </div>
        </div>
      </motion.div>

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
              className="bg-primary hover:bg-primary"
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
