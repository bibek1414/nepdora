"use client";

import { useState } from "react";
import DomainTable from "@/components/super-admin/domain/domaintable";
import DomainForm from "@/components/super-admin/domain/domainform";
import Pagination from "@/components/ui/pagination";
import { useDomains } from "@/hooks/superadmin/use-domain";
import { Domain, Tenant } from "@/types/super-admin/domain";

export default function DomainsPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // page size = 1
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
    refetch();
  };

  if (isLoading) return <p>Loading domains...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  const totalPages = Math.ceil((data?.count || 0) / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Domains</h1>
      </div>

      {showForm && (
        <DomainForm
          initialData={editing || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <DomainTable
        domains={data?.results || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
