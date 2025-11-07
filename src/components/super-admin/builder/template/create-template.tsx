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
  useCreateTemplate,
  useUpdateTemplate,
  useDeleteTemplate,
} from "@/hooks/super-admin/components/use-templates";

type TemplateItem = {
  id: number | string;
  name: string;
  slug: string;
  created_at?: string;
  updated_at?: string;
};

export default function CreateTemplateDialog() {
  const router = useRouter();

  // State
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editTarget, setEditTarget] = useState<TemplateItem | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TemplateItem | null>(null);

  // TanStack Query hooks
  const {
    data: templates = [],
    isLoading: loading,
    error,
    refetch: fetchTemplates,
  } = useTemplates();

  const createTemplateMutation = useCreateTemplate();
  const updateTemplateMutation = useUpdateTemplate();
  const deleteTemplateMutation = useDeleteTemplate();

  // Derived states
  const submitting =
    createTemplateMutation.isPending || updateTemplateMutation.isPending;

  const deletingId = deleteTemplateMutation.variables;

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      const result = await createTemplateMutation.mutateAsync({
        name: name.trim(),
      });

      const payload = result.data;
      setName("");
      setOpen(false);

      // ✅ Navigate to the correct builder route with templateSlug and default 'home' page
      const templateSlug = payload.slug || payload.id;
      router.push(`/superadmin/builder/${templateSlug}/home`);
    } catch (error) {
      console.error("Failed to create template:", error);
    }
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
    } catch (error) {
      console.error("Failed to update template:", error);
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
    } catch (error) {
      console.error("Failed to delete template:", error);
    }
  };

  const getTemplateSlug = (template: TemplateItem) => {
    return template.slug || template.id;
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
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-gray-900">
                    {t.name}
                  </div>
                  {t.slug && (
                    <div className="text-xs text-gray-500">Slug: {t.slug}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(
                        `/superadmin/builder/${getTemplateSlug(t)}/home`
                      )
                    }
                  >
                    Build Template
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

      {/* Create Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Template</DialogTitle>
            <DialogDescription>
              Enter a name for the new template.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Template Name
            </label>
            <Input
              placeholder="e.g. Summer Campaign"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreate();
                }
              }}
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!name.trim() || submitting}
            >
              {submitting ? "Creating..." : "Create"}
            </Button>
          </div>
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
