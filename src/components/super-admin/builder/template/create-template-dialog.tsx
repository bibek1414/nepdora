"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import {
  useTemplates,
  useDeleteTemplate,
} from "@/hooks/super-admin/components/use-templates";
import { useTemplateToken } from "@/hooks/super-admin/components/use-template-token";
import { CreateTemplateAccountForm } from "@/components/auth/template/create-template-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { siteConfig } from "@/config/site";

type TemplateItem = {
  id: number | string;
  name: string;
  slug: string;
  schema_name?: string;
  owner_id: number; // Make sure owner_id is included
  created_at?: string;
  updated_at?: string;
};

export default function CreateTemplateDialog() {
  const router = useRouter();

  // State
  const [open, setOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TemplateItem | null>(null);
  const [loggingInTemplateId, setLoggingInTemplateId] = useState<
    number | string | null
  >(null);

  // TanStack Query hooks
  const {
    data: templates = [],
    isLoading: loading,
    error,
    refetch: fetchTemplates,
  } = useTemplates();

  const deleteTemplateMutation = useDeleteTemplate();
  const templateTokenMutation = useTemplateToken();

  // Track which template is being deleted
  const [deletingOwnerId, setDeletingOwnerId] = useState<number | null>(null);

  const handleTemplateCreated = () => {
    setOpen(false);
    fetchTemplates();
  };

  const openDelete = (t: TemplateItem) => {
    setDeleteTarget(t);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      setDeletingOwnerId(deleteTarget.owner_id);
      await deleteTemplateMutation.mutateAsync(deleteTarget.owner_id); // Use owner_id here
      setDeleteOpen(false);
      setDeleteTarget(null);
      setDeletingOwnerId(null);
      toast.success("Template deleted successfully");
    } catch (error) {
      console.error("Failed to delete template:", error);
      toast.error("Failed to delete template");
      setDeletingOwnerId(null);
    }
  };

  // Rest of your existing functions (setCrossDomainCookie, handleTemplateLogin, etc.)
  const setCrossDomainCookie = (
    name: string,
    value: string,
    days: number = 7
  ) => {
    const baseDomain = siteConfig.baseDomain;
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`;

    document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; domain=.${baseDomain}; path=/; SameSite=Lax${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`;
  };

  const handleTemplateLogin = async (template: TemplateItem) => {
    try {
      setLoggingInTemplateId(template.id);

      const response = await templateTokenMutation.mutateAsync({
        client_id: template.id,
      });

      const userData = {
        user_id: response.owner.id,
        id: response.owner.id,
        email: response.owner.email,
        role: response.owner.role,
        sub_domain: response.client.schema_name,
        domain: response.client.domain,
        store_name: response.client.name,
        has_profile: true,
        has_profile_completed: true,
      };

      localStorage.setItem("authToken", response.access_token);
      localStorage.setItem("refreshToken", response.refresh_token);
      localStorage.setItem(
        "authTokens",
        JSON.stringify({
          access_token: response.access_token,
          refresh_token: response.refresh_token,
        })
      );
      localStorage.setItem("authUser", JSON.stringify(userData));

      setCrossDomainCookie("authToken", response.access_token);
      setCrossDomainCookie("refreshToken", response.refresh_token);
      setCrossDomainCookie("authUser", JSON.stringify(userData));

      toast.success(`Logging into ${template.name}...`);

      const isLocalhost = window.location.hostname.includes("localhost");
      let templateUrl: string;

      if (isLocalhost) {
        const port = window.location.port || "3000";
        templateUrl = `http://${response.client.schema_name}.localhost:${port}/admin`;
      } else {
        templateUrl = `https://${response.client.schema_name}.${siteConfig.baseDomain}/admin`;
      }

      const separator = templateUrl.includes("?") ? "&" : "?";
      const finalUrl = `${templateUrl}${separator}auth_token=${encodeURIComponent(
        response.access_token
      )}&refresh_token=${encodeURIComponent(response.refresh_token)}`;

      window.location.href = finalUrl;
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to login to template:", error);
      toast.error(
        error?.response?.data?.error?.message ||
          error?.message ||
          "Failed to login to template"
      );
      setLoggingInTemplateId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Templates</h1>
        <Button onClick={() => setOpen(true)}>Create Template</Button>
      </div>

      {/* Templates List */}
      <div className="rounded-md border bg-white">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="text-sm font-medium text-gray-700">
            Saved Templates
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchTemplates()}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        {error ? (
          <div className="px-4 py-6 text-sm text-red-600">
            Error: {(error as Error).message}
          </div>
        ) : templates.length === 0 && !loading ? (
          <div className="px-4 py-6 text-sm text-gray-500">
            No templates found
          </div>
        ) : (
          <ul className="divide-y">
            {templates.map(t => (
              <li
                key={t.id}
                className="flex items-center justify-between px-4 py-3 transition-colors hover:bg-gray-50"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-gray-900">
                    {t.name}
                  </div>
                  {t.slug && (
                    <div className="text-xs text-gray-500">Slug: {t.slug}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleTemplateLogin(t)}
                    disabled={loggingInTemplateId !== null}
                  >
                    {loggingInTemplateId === t.id ? (
                      <>
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Open Template"
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDelete(t)}
                    disabled={
                      deleteTemplateMutation.isPending &&
                      deletingOwnerId === t.owner_id
                    }
                  >
                    {deleteTemplateMutation.isPending &&
                    deletingOwnerId === t.owner_id
                      ? "Deleting..."
                      : "Delete"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Create Template Account Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Template</DialogTitle>
            <DialogDescription>
              Create a complete template account with store setup. This will
              generate a full account that can be used as a template.
            </DialogDescription>
          </DialogHeader>

          <CreateTemplateAccountForm onSuccess={handleTemplateCreated} />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;?
              This action cannot be undone and will delete the template account
              completely.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleteTemplateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteTemplateMutation.isPending}
            >
              {deleteTemplateMutation.isPending
                ? "Deleting..."
                : "Delete Account"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
