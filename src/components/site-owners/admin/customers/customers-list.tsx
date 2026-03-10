"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetRegisteredCustomers } from "@/hooks/owner-site/admin/use-customers";
import Pagination from "@/components/ui/pagination";
import useDebouncer from "@/hooks/use-debouncer";

export function CustomersList() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncer(searchQuery, 500);

  const pageSize = 10;

  // Reset to first page on new search
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const {
    data: paginatedData,
    isLoading,
    isFetching,
    isError,
  } = useGetRegisteredCustomers({
    page,
    page_size: pageSize,
    search: debouncedSearch,
  });

  const customers = paginatedData?.results || [];
  const totalCount = paginatedData?.count || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  if (isError) {
    return (
      <div className="min-h-screen bg-white p-8 sm:p-12">
        <div className="mx-auto max-w-7xl text-center text-red-500">
          <p>Failed to load customers. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in min-h-screen bg-white p-8 duration-700 sm:p-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Registered Customers
              </h1>
            </div>
          </div>
        </div>

        <div className="relative mb-4 max-w-xs">
          <Search className="absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="h-11 rounded-lg border-slate-200 bg-slate-50 pl-10 placeholder:text-slate-500 focus:bg-white"
          />
        </div>

        <div className="rounded-lg bg-white">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-black/5">
                <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                  Name
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                  Email
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                  Phone
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                  Address
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading || isFetching ? (
                [...Array(pageSize)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={4} className="px-6 py-4">
                      <div className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
                    </TableCell>
                  </TableRow>
                ))
              ) : customers.length > 0 ? (
                customers.map(customer => (
                   <TableRow
                    key={customer.id}
                    className="group cursor-pointer border-b border-black/5 transition-colors hover:bg-black/2"
                  >
                    <TableCell className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {customer.first_name} {customer.last_name}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 font-medium text-gray-900">
                      {customer.email || "-"}
                    </TableCell>
                    <TableCell className="px-6 py-4 font-medium text-gray-900">
                      {customer.phone || "-"}
                    </TableCell>
                    <TableCell className="px-6 py-4 font-medium text-gray-900">
                      {customer.address || "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-32 text-center text-slate-500"
                  >
                    No customers found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
