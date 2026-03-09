"use client";

import React, { useState } from "react";
import { Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetRegisteredCustomers } from "@/hooks/owner-site/admin/use-customers";

export function CustomersList() {
  const { data: customers, isLoading, isError } = useGetRegisteredCustomers();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers =
    customers?.filter(c => {
      const searchStr =
        `${c.first_name} ${c.last_name} ${c.email} ${c.phone}`.toLowerCase();
      return searchStr.includes(searchQuery.toLowerCase());
    }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-8 sm:p-12">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-10 w-64 rounded-lg bg-slate-200" />
          <div className="h-12 w-full rounded-lg bg-slate-200" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 w-full rounded-lg bg-slate-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

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

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="px-6 py-4 font-semibold text-slate-700">
                    Name
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-slate-700">
                    Email
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-slate-700">
                    Phone
                  </TableHead>
                  <TableHead className="px-6 py-4 font-semibold text-slate-700">
                    Address
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map(customer => (
                    <TableRow
                      key={customer.id}
                      className="transition-colors hover:bg-slate-50"
                    >
                      <TableCell className="px-6 py-4">
                        <div className="font-medium text-slate-900">
                          {customer.first_name} {customer.last_name}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-slate-600">
                        {customer.email || "-"}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-slate-600">
                        {customer.phone || "-"}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-slate-600">
                        {customer.address || "-"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-32 text-center text-slate-500"
                    >
                      No customers found matching &quot;{searchQuery}&quot;
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
