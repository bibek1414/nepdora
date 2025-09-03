"use client";

import { useState } from "react";
import { useGetContacts } from "@/hooks/owner-site/use-contact";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, Phone, MessageSquare, Calendar } from "lucide-react";
import { format } from "date-fns";
import Pagination from "@/components/ui/pagination";
import { ContactFilters } from "@/types/owner-site/contact";
const ContactDetails = () => {
  const [filters, setFilters] = useState<ContactFilters>({
    page: 1,
    page_size: 10,
  });

  const { data: contactsData, isLoading, error } = useGetContacts(filters);

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setFilters(prev => ({ ...prev, page_size: newPageSize, page: 1 }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading contacts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">
          Error loading contacts. Please try again.
        </p>
      </div>
    );
  }

  if (
    !contactsData ||
    !contactsData.results ||
    contactsData.results.length === 0
  ) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No contacts found.</p>
      </div>
    );
  }

  const { results: contacts, count } = contactsData;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold">Contact Messages</h2>
        <div className="flex items-center gap-4">
          <Badge variant="secondary">{count} total</Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {contacts.map(contact => (
          <Card key={contact.id} className="w-full">
            <CardHeader className="p-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg capitalize">
                  {contact.name}
                </CardTitle>
                <Badge variant="outline">
                  {format(new Date(contact.created_at), "MMM dd, yyyy")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                {contact.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">{contact.email}</span>
                  </div>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm">{contact.phone}</span>
                  </div>
                )}
              </div>

              {contact.message && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="text-muted-foreground h-4 w-4" />
                    <span className="text-sm font-medium">Message:</span>
                  </div>
                  <p className="text-muted-foreground bg-muted/50 rounded-md p-3 pl-6 text-sm">
                    {contact.message}
                  </p>
                </div>
              )}

              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <Calendar className="h-3 w-3" />
                <span>
                  Created: {format(new Date(contact.created_at), "PPp")}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Pagination
          currentPage={filters.page || 1}
          totalPages={Math.ceil(count / (filters.page_size || 10))}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ContactDetails;
