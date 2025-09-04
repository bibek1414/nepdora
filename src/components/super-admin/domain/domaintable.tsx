// DomainTable.tsx
import { Domain } from "@/types/super-admin/domain";
import { Edit2, Trash2 } from "lucide-react";

interface DomainTableProps {
  domains: Domain[];
  onEdit: (domain: Domain) => void;
  onDelete: (id: number) => void;
}

export default function DomainTable({
  domains,
  onEdit,
  onDelete,
}: DomainTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Domain
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Tenant
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Owner
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Created On
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {domains.length > 0 ? (
            domains.map(domain => (
              <tr
                key={domain.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onEdit(domain)}
              >
                <td className="px-6 py-4 text-sm text-gray-900">
                  {domain.domain}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {domain.tenant.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {domain.tenant.owner.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {domain.tenant.created_on}
                </td>
                <td className="space-x-2 px-6 py-4 text-right">
                  {/* Edit icon button */}
                  <button
                    onClick={() => onEdit(domain)}
                    className="rounded p-2 text-blue-600 hover:bg-blue-100"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  {/* Delete icon button */}
                  <button
                    onClick={() => onDelete(domain.id)}
                    className="rounded p-2 text-red-600 hover:bg-red-100"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                No domains available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
