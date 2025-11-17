"use client";

import { useState } from "react";
import { Template } from "@/types/owner-site/admin/template";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Download, Loader2 } from "lucide-react";
import {
  useImportTemplate,
  usePreviewTemplate,
} from "@/hooks/owner-site/admin/use-template";
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

interface TemplateCardProps {
  template: Template;
}

const TemplateCard = ({ template }: TemplateCardProps) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { mutate: importTemplate, isPending } = useImportTemplate();
  const { openPreview } = usePreviewTemplate();

  const handlePreview = () => {
    openPreview(template.schema_name);
  };

  const handleUseTemplate = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmImport = () => {
    importTemplate(template.id, {
      onSuccess: () => {
        setShowConfirmDialog(false);
      },
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  return (
    <>
      <Card className="gap-0 overflow-hidden py-0 transition-all hover:shadow-lg">
        <CardHeader className="">
          {template.template_image ? (
            <div className="aspect-video w-full overflow-hidden bg-gray-100">
              <img
                src={template.template_image}
                alt={template.name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100">
              <Badge variant="secondary" className="text-lg">
                Featured
              </Badge>
            </div>
          )}
        </CardHeader>

        <div className="my-3 ml-6 space-y-2 font-bold capitalize">
          {template.name.replace(/-/g, " ")}
        </div>

        <CardFooter className="flex gap-2 p-6 pt-0">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handlePreview}
            disabled={isPending}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            className="flex-1"
            onClick={handleUseTemplate}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Use Template
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Import Template</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Are you sure you want to import the{" "}
                <span className="font-semibold">
                  {template.name.replace(/-/g, " ")}
                </span>{" "}
                template?
              </p>
              <p className="font-medium text-red-600">
                Warning: This will erase all your current data and replace it
                with the template content.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmImport}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
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

export default TemplateCard;
