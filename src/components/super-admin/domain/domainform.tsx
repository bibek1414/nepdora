import { Domain, Tenant } from "@/types/super-admin/domain";
import { useState, useEffect } from "react";

interface DomainFormProps {
  initialData?: Domain;
  onSubmit: (data: {
    id?: number;
    domain: string;
    tenant: Tenant;
    is_primary: boolean;
  }) => void;
  onCancel: () => void;
}

export default function DomainForm({
  initialData,
  onSubmit,
  onCancel,
}: DomainFormProps) {
  const [domain, setDomain] = useState("");
  const [tenant, setTenant] = useState<Tenant | null>(null); // store full tenant object
  const [isPrimary, setIsPrimary] = useState(false);

  useEffect(() => {
    if (initialData) {
      setDomain(initialData.domain);
      setTenant(initialData.tenant);
      setIsPrimary(initialData.is_primary);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenant) return; // ensure tenant is selected
    onSubmit({ id: initialData?.id, domain, tenant, is_primary: isPrimary });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded bg-white p-4 shadow"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Domain
        </label>
        <input
          type="text"
          value={domain}
          onChange={e => setDomain(e.target.value)}
          className="mt-1 block w-full rounded border px-3 py-2 focus:ring focus:ring-blue-200"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tenant
        </label>
        {/* For now, just show the tenant name in input */}
        <input
          type="text"
          value={tenant?.name || ""}
          onChange={e =>
            setTenant({ ...tenant!, name: e.target.value } as Tenant)
          } // simple edit, you can replace with a dropdown later
          className="mt-1 block w-full rounded border px-3 py-2 focus:ring focus:ring-blue-200"
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isPrimary}
          onChange={e => setIsPrimary(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-blue-600"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Primary Domain
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-primary hover:bg-primary rounded px-4 py-2 text-white"
        >
          {initialData ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
