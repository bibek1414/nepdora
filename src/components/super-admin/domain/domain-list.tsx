"use client";

import { useState } from "react";
import DomainTable from "@/components/super-admin/domain/domaintable";
import DomainForm from "@/components/super-admin/domain/domainform";
import Pagination from "@/components/ui/pagination";
import { useDomains } from "@/hooks/superadmin/use-domain";
import { Domain, Tenant } from "@/types/super-admin/domain";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function DomainsPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const { data, isLoading, isError, error, refetch } = useDomains(
    page,
    pageSize
  );
  const [editing, setEditing] = useState<Domain | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (domain: Domain) => {
    setEditing(domain);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    alert(`Deleted domain with ID ${id} (implement API call)`);
    refetch();
  };

  const handleSubmit = (data: {
    id?: number;
    domain: string;
    tenant: Tenant;
    is_primary: boolean;
  }) => {
    alert(data.id ? `Updated domain ID ${data.id}` : "Created new domain");
    setShowForm(false);
    setEditing(null);
    refetch();
  };

  const handleFrontendUrlClick = (tenantSchemaName: string) => {
    console.log(`Frontend URL clicked for tenant: ${tenantSchemaName}`);
  };

  const handleAddNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
  };

  if (isLoading) return <p>Loading domains...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  const totalPages = Math.ceil((data?.count || 0) / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Domains</h1>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus size={16} />
          Add Domain
        </Button>
      </div>

      {showForm && (
        <DomainForm
          initialData={editing || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}

      <DomainTable
        domains={data?.results || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onFrontendUrlClick={handleFrontendUrlClick}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
