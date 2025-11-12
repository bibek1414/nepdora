"use client";

import { useState, useTransition } from "react";
import {
  deleteFacebookIntegration,
  toggleFacebookIntegration,
} from "@/lib/actions/facebook-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { Loader2, Trash2, Facebook } from "lucide-react";
import { FacebookIntegration } from "@/types/owner-site/admin/facebook";
import { useFacebook } from "@/contexts/FacebookContext";
import { toast } from "sonner";

interface Props {
  initialPages: FacebookIntegration[];
}

function sanitizePage(page: FacebookIntegration) {
  return {
    id: page.id,
    page_name: page.page_name,
    page_id: page.page_id,
    app_id: page.app_id,
    is_enabled: page.is_enabled,
  };
}

export default function FacebookPagesManagement({ initialPages }: Props) {
  const { connectFacebook, isLoading: isConnecting } = useFacebook();
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPageId, setSelectedPageId] = useState<number | null>(null);

  const sanitizedPages = initialPages.map(sanitizePage);

  const showEmptyState = !initialPages || initialPages.length === 0;

  const handleDeleteClick = (id: number) => {
    setSelectedPageId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedPageId) return;

    startTransition(async () => {
      const result = await deleteFacebookIntegration(selectedPageId);

      if (result.success) {
        toast.success(result.message);
        setDeleteDialogOpen(false);
        setSelectedPageId(null);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleToggle = (id: number, currentStatus: boolean) => {
    startTransition(async () => {
      const result = await toggleFacebookIntegration(id, !currentStatus);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleConnectNewPage = async () => {
    try {
      await connectFacebook();
    } catch (error) {
      console.error("Error connecting Facebook page:", error);
      toast.error("Failed to connect Facebook page");
    }
  };

  if (initialPages.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Facebook Pages</h1>
            <p className="text-muted-foreground mt-2">
              Manage your connected Facebook pages
            </p>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Facebook className="text-muted-foreground mb-4 h-12 w-12" />
            <h3 className="mb-2 text-lg font-semibold">
              No Facebook Pages Connected
            </h3>
            <p className="text-muted-foreground mb-4 text-center">
              Connect your Facebook page to start managing your social media
              presence
            </p>
            <Button
              onClick={handleConnectNewPage}
              disabled={isConnecting}
              className="flex items-center gap-2"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Facebook className="h-4 w-4" />
                  Connect Facebook Page
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Facebook Pages</h1>
          <p className="text-muted-foreground mt-2">
            Manage your connected Facebook pages
          </p>
        </div>
        <Button
          onClick={handleConnectNewPage}
          disabled={isConnecting}
          className="flex items-center gap-2"
        >
          {isConnecting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Facebook className="h-4 w-4" />
              Connect New Page
            </>
          )}
        </Button>
      </div>

      {/* Pages List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sanitizedPages.map(page => (
          <Card key={page.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Facebook className="h-5 w-5 text-[#1877F2]" />
                  <CardTitle className="text-lg">{page.page_name}</CardTitle>
                </div>
                <Badge variant={page.is_enabled ? "default" : "secondary"}>
                  {page.is_enabled ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Page ID:</span>
                  <span className="font-mono text-xs">{page.page_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">App ID:</span>
                  <span className="font-mono text-xs">{page.app_id}</span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={page.is_enabled}
                    onCheckedChange={() =>
                      handleToggle(page.id!, page.is_enabled)
                    }
                    disabled={isPending}
                  />
                  <span className="text-sm font-medium">
                    {page.is_enabled ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClick(page.id!)}
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              Facebook page connection from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
