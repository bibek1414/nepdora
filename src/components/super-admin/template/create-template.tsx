"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useTemplateApi } from "@/services/api/super-admin/template";
import { useRouter } from "next/navigation";

type TemplateItem = {
  id: number | string;
  name: string;
  created_at?: string;
  updated_at?: string;
};

export default function CreateTemplateDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editTarget, setEditTarget] = useState<TemplateItem | null>(null);
  const [deletingId, setDeletingId] = useState<number | string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TemplateItem | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const items = await useTemplateApi.getTemplates();
      setTemplates(items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      setSubmitting(true);
      setError(null);
      const created = await useTemplateApi.createTemplate({
        name: name.trim(),
      });
      const payload = created.data;
      const newItem: TemplateItem = {
        id: payload.id ?? Date.now(),
        name: payload.name ?? name.trim(),
      };
      setTemplates(prev => [newItem, ...prev]);
      setName("");
      setOpen(false);
      // Refresh list from server to ensure consistency
      fetchTemplates();
      // Navigate to builder with the newly created template ID
      if (payload.id) {
        router.push(`/superadmin/template/builder?templateId=${payload.id}`);
      }
    } finally {
      setSubmitting(false);
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
      setSubmitting(true);
      setError(null);
      const res = await useTemplateApi.updateTemplate(editTarget.id, {
        name: editName.trim(),
      });
      const updated = res.data;
      setTemplates(prev =>
        prev.map(item =>
          item.id === editTarget.id ? { ...item, name: updated.name } : item
        )
      );
      setEditOpen(false);
      setEditTarget(null);
      setEditName("");
    } finally {
      setSubmitting(false);
    }
  };

  const openDelete = (t: TemplateItem) => {
    setDeleteTarget(t);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeletingId(deleteTarget.id);
      setError(null);
      await useTemplateApi.deleteTemplate(deleteTarget.id);
      setTemplates(prev => prev.filter(t => t.id !== deleteTarget.id));
      setDeleteOpen(false);
      setDeleteTarget(null);
    } finally {
      setDeletingId(null);
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
            onClick={fetchTemplates}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        {error ? (
          <div className="px-4 py-6 text-sm text-red-600">{error}</div>
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
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(
                        `/superadmin/template/builder?templateId=${t.id}`
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
                    disabled={deletingId === t.id}
                  >
                    {deletingId === t.id ? "Deleting..." : "Delete"}
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
              disabled={deletingId !== null}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deletingId !== null}
            >
              {deletingId !== null ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
