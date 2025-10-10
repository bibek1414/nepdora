"use client";

import { useState, useEffect, useCallback } from "react";
import { useGetContacts } from "@/hooks/owner-site/admin/use-contact";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Pagination from "@/components/ui/pagination";
import ContactDetailsDialog from "./contact-details-dialog";
import {
  Loader2,
  Search,
  Mail,
  Phone,
  MessageSquare,
  Calendar,
  X,
  Eye,
} from "lucide-react";
import { ContactFilters, Contact } from "@/types/owner-site/admin/contact";

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ContactDetails = () => {
  const [filters, setFilters] = useState<ContactFilters>({
    page: 1,
    page_size: 10,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Update filters when debounced search term changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      page: 1, // Reset to first page when searching
      search: debouncedSearchTerm || undefined,
    }));
  }, [debouncedSearchTerm]);

  const { data: contactsData, isLoading, error } = useGetContacts(filters);

  const handlePageChange = useCallback((newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  }, []);

  const handlePageSizeChange = (newPageSize: string) => {
    setFilters(prev => ({
      ...prev,
      page_size: parseInt(newPageSize),
      page: 1,
    }));
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const handleViewDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedContact(null);
  };

  const handleContactChange = (contactId: number) => {
    if (contactsData?.results) {
      const contact = contactsData.results.find(
        (c: Contact) => c.id === contactId
      );
      setSelectedContact(contact || null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const totalPages = Math.ceil(
    (contactsData?.count || 0) / (filters.page_size || 10)
  );
  const currentPage = filters.page || 1;

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-64" />
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading contacts. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (
    !contactsData ||
    !contactsData.results ||
    contactsData.results.length === 0
  ) {
    return (
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="py-8 text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                {searchTerm
                  ? "No matching contacts found"
                  : "No contacts found"}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm
                  ? "Try adjusting your search criteria."
                  : "When customers submit inquiries, they will appear here."}
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={clearSearch}
                  className="mt-4"
                >
                  Clear Search
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-gray-900">
              Inquiries
            </h1>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <Badge variant="secondary" className="self-start sm:self-center">
              {contactsData.count} total inquiries
            </Badge>
            {searchTerm && (
              <div className="text-sm text-gray-500">
                Showing results for &apos;{searchTerm}&apos;
              </div>
            )}
          </div>
        </div>

        <div className="relative w-1/4">
          <Search className="absolute top-1/2 left-3 z-50 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by name, email, phone, or message..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pr-10 pl-10 placeholder:text-gray-400 focus:outline-none"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute top-1/2 right-2 h-6 w-6 -translate-y-1/2 p-0 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Table */}
        <Card className="border-none">
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contactsData.results.map((contact: Contact) => (
                    <TableRow
                      key={contact.id}
                      className="cursor-pointer transition-colors hover:bg-gray-50/50"
                      onClick={() => handleViewDetails(contact)}
                    >
                      <TableCell>
                        <div className="font-medium capitalize">
                          {contact.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="mt-1">
                          {contact.email && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <span className="max-w-[200px] truncate">
                                {contact.email}
                              </span>
                            </div>
                          )}

                          {!contact.email && !contact.phone_number && (
                            <span className="text-sm text-gray-400">
                              No contact info
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {contact.phone_number && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <span>{contact.phone_number}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <div
                          className="truncate text-sm"
                          title={contact.message}
                        >
                          {contact.message || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {formatDate(contact.created_at)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showFirstLast={true}
            maxVisiblePages={7}
          />
        )}

        {/* Results Summary */}
        {contactsData.results.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            Showing {(currentPage - 1) * (filters.page_size || 10) + 1} to{" "}
            {Math.min(
              currentPage * (filters.page_size || 10),
              contactsData.count
            )}{" "}
            of {contactsData.count} inquiries
            {searchTerm && ` matching "${searchTerm}"`}
          </div>
        )}

        {/* Contact Details Dialog */}
        <ContactDetailsDialog
          contacts={contactsData?.results || []}
          currentContactId={selectedContact?.id || null}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onContactChange={handleContactChange}
        />
      </div>
    </div>
  );
};

export default ContactDetails;
