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
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  useTemplates,
  useUpdateTemplate,
  useDeleteTemplate,
} from "@/hooks/super-admin/components/use-templates";
import { useTemplateToken } from "@/hooks/super-admin/components/use-template-token";
import { CreateTemplateAccountForm } from "@/components/auth/template/create-template-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type TemplateItem = {
  id: number | string;
  name: string;
  slug: string;
  schema_name?: string;
  created_at?: string;
  updated_at?: string;
};

export default function CreateTemplateDialog() {
  const router = useRouter();

  // State
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editTarget, setEditTarget] = useState<TemplateItem | null>(null);
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

  const updateTemplateMutation = useUpdateTemplate();
  const deleteTemplateMutation = useDeleteTemplate();
  const templateTokenMutation = useTemplateToken();

  // Derived states
  const submitting = updateTemplateMutation.isPending;
  const deletingId = deleteTemplateMutation.variables;

  const handleTemplateCreated = () => {
    setOpen(false);
    fetchTemplates();
  };

  const openEdit = (t: TemplateItem) => {
    setEditTarget(t);
    setEditName(t.name);
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!editTarget || !editName.trim()) return;

    try {
      const slug = editTarget.slug || editTarget.id;
      await updateTemplateMutation.mutateAsync({
        slug,
        payload: {
          name: editName.trim(),
        },
      });

      setEditOpen(false);
      setEditTarget(null);
      setEditName("");
      toast.success("Template updated successfully");
    } catch (error) {
      console.error("Failed to update template:", error);
      toast.error("Failed to update template");
    }
  };

  const openDelete = (t: TemplateItem) => {
    setDeleteTarget(t);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    try {
      const slug = deleteTarget.slug || deleteTarget.id;
      await deleteTemplateMutation.mutateAsync(slug);
      setDeleteOpen(false);
      setDeleteTarget(null);
      toast.success("Template deleted successfully");
    } catch (error) {
      console.error("Failed to delete template:", error);
      toast.error("Failed to delete template");
    }
  };

  const getTemplateSlug = (template: TemplateItem) => {
    return template.slug || template.id;
  };

  /**
   * Handle template login - verify with API and redirect
   */
  const handleTemplateLogin = async (template: TemplateItem) => {
    try {
      setLoggingInTemplateId(template.id);

      // Call the template-tokens API to verify and get tokens
      const response = await templateTokenMutation.mutateAsync({
        client_id: template.id,
      });

      // Store tokens in localStorage (same as login flow)
      localStorage.setItem("authToken", response.access_token);
      localStorage.setItem("refreshToken", response.refresh_token);

      // Store user data
      const userData = {
        id: response.owner.id,
        email: response.owner.email,
        role: response.owner.role,
        sub_domain: response.client.domain,
      };
      localStorage.setItem("authUser", JSON.stringify(userData));

      // Also set cookies for middleware (same as login)
      document.cookie = `authToken=${response.access_token}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `authUser=${JSON.stringify(userData)}; path=/; max-age=86400; SameSite=Lax`;

      toast.success(`Logging into ${template.name}...`);

      // Build the subdomain URL
      const isLocalhost = window.location.hostname.includes("localhost");
      let templateUrl: string;

      if (isLocalhost) {
        // Local development: template-name.localhost:3000/admin
        const port = window.location.port || "3000";
        templateUrl = `http://${response.client.schema_name}.localhost:${port}/admin`;
      } else {
        // Production: template-name.nepdora.com/admin
        templateUrl = `https://${response.client.schema_name}.nepdora.com/admin`;
      }

      // Redirect to the template admin
      window.location.href = templateUrl;
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                  {t.schema_name && (
                    <div className="text-xs text-gray-400">
                      Schema: {t.schema_name}
                    </div>
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
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(t)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDelete(t)}
                    disabled={
                      deleteTemplateMutation.isPending &&
                      deletingId === getTemplateSlug(t)
                    }
                  >
                    {deleteTemplateMutation.isPending &&
                    deletingId === getTemplateSlug(t)
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

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>Rename this template.</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Template Name
            </label>
            <Input
              placeholder="Template name"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleEditSave();
                }
              }}
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditSave}
              disabled={!editName.trim() || submitting}
            >
              {submitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;?
              This action cannot be undone.
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
              {deleteTemplateMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
