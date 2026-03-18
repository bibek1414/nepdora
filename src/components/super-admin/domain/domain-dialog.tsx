"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Domain } from "@/types/super-admin/domain";
import { useCreateDomain, useUpdateDomain } from "@/hooks/super-admin/use-domain";
import { toast } from "sonner";

interface DomainDialogProps {
  open: boolean;
  domain?: Domain | null; // null/undefined = create mode, domain = edit mode
  onClose: () => void;
}

export default function DomainDialog({ open, domain, onClose }: DomainDialogProps) {
  const isEditing = !!domain;

  const [domainName, setDomainName] = useState("");
  const [isPrimary, setIsPrimary] = useState(false);

  const createMutation = useCreateDomain();
  const updateMutation = useUpdateDomain();

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Populate fields when editing
  useEffect(() => {
    if (domain) {
      setDomainName(domain.domain);
      setIsPrimary(domain.is_primary);
    } else {
      setDomainName("");
      setIsPrimary(false);
    }
  }, [domain, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!domainName.trim()) return;

    try {
      if (isEditing && domain) {
        await updateMutation.mutateAsync({
          id: domain.id,
          payload: {
            domain: domainName.trim(),
            is_primary: isPrimary,
          },
        });
        toast.success("Domain updated successfully");
      } else {
        // For create, tenant id would need to be selected; using a placeholder flow.
        // In a real environment you would have a tenant selector.
        toast.error("Create domain requires selecting a tenant. Contact your backend.");
        return;
      }
      onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={open ? onClose : undefined}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Domain" : "Add Domain"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Domain Name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Domain Name
            </label>
            <input
              type="text"
              value={domainName}
              onChange={e => setDomainName(e.target.value)}
              placeholder="e.g. example.com"
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Tenant info (read-only in edit) */}
          {isEditing && domain && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Tenant
              </label>
              <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
                <span className="font-medium">{domain.tenant.name}</span>
                <span className="ml-2 text-gray-400">
                  ({domain.tenant.schema_name})
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Tenant cannot be changed after creation.
              </p>
            </div>
          )}

          {/* Owner info (read-only in edit) */}
          {isEditing && domain && (
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">
                Owner
              </label>
              <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600">
                {domain.tenant.owner.email}
              </div>
            </div>
          )}

          {/* Is Primary */}
          <div className="flex items-center gap-2.5">
            <input
              id="is_primary"
              type="checkbox"
              checked={isPrimary}
              onChange={e => setIsPrimary(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_primary" className="text-sm font-medium text-gray-700">
              Set as Primary Domain
            </label>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Create Domain"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
