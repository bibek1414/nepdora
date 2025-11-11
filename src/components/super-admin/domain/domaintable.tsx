import { Domain } from "@/types/super-admin/domain";
import { Edit2, Trash2, ExternalLink } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DomainTableProps {
  domains: Domain[];
  onEdit: (domain: Domain) => void;
  onDelete: (id: number) => void;
  onFrontendUrlClick: (tenantSchemaName: string) => void;
}

export default function DomainTable({
  domains,
  onEdit,
  onDelete,
  onFrontendUrlClick,
}: DomainTableProps) {
  const handleFrontendUrlClick = (
    tenantSchemaName: string,
    domainId: number
  ) => {
    const url = `https://${tenantSchemaName}.rugkala.com`;
    window.open(url, "_blank", "noopener,noreferrer");
    onFrontendUrlClick(tenantSchemaName);
  };

  return (
    <div className="rounded-lg bg-white shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Domain</TableHead>
            <TableHead>Frontend URL</TableHead>
            <TableHead>Tenant</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Created On</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {domains.length > 0 ? (
            domains.map(domain => {
              const frontendUrl = `${domain.tenant.schema_name}.rugkala.com`;

              return (
                <TableRow
                  key={domain.tenant.owner.id}
                  className="hover:bg-gray-50"
                >
                  <TableCell className="font-medium">{domain.domain}</TableCell>
                  <TableCell>
                    <Button
                      variant="link"
                      className="h-auto p-0 text-blue-600 hover:text-blue-800"
                      onClick={e => {
                        e.stopPropagation();
                        handleFrontendUrlClick(
                          domain.tenant.schema_name,
                          domain.tenant.owner.id
                        );
                      }}
                    >
                      <span className="flex items-center gap-1">
                        {frontendUrl}
                        <ExternalLink size={14} />
                      </span>
                    </Button>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {domain.tenant.name}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {domain.tenant.owner.email}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(domain.tenant.created_on).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          onEdit(domain);
                        }}
                        className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          onDelete(domain.tenant.owner.id);
                        }}
                        className="h-8 w-8 p-0 text-red-600 hover:bg-red-100 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                No domains available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
