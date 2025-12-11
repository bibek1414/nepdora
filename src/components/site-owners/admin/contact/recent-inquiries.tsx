"use client";

import { useState } from "react";
import { useGetContacts } from "@/hooks/owner-site/admin/use-contact";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, MessageSquare, ChevronRight } from "lucide-react";
import { Contact } from "@/types/owner-site/admin/contact";
import Link from "next/link";
import ContactDetailsDialog from "./contact-details-dialog";

export default function RecentInquiries() {
  const [selectedContactId, setSelectedContactId] = useState<number | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: contactsData,
    isLoading,
    error,
  } = useGetContacts({
    page: 1,
    page_size: 8,
  });

  const handleRowClick = (contactId: number) => {
    setSelectedContactId(contactId);
    setIsDialogOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Recent Inquiries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error loading recent inquiries.</AlertDescription>
      </Alert>
    );
  }

  if (
    !contactsData ||
    !contactsData.results ||
    contactsData.results.length === 0
  ) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Recent Inquiries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No inquiries found
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Recent inquiries will appear here.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Recent Inquiries
          </CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/inquiries" className="flex items-center gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contactsData.results.map((contact: Contact) => (
                  <TableRow
                    key={contact.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleRowClick(contact.id)}
                  >
                    <TableCell className="font-medium capitalize">
                      {contact.name}
                    </TableCell>
                    <TableCell>
                      {contact.email || (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <div className="truncate text-sm" title={contact.message}>
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

      <ContactDetailsDialog
        contacts={contactsData.results}
        currentContactId={selectedContactId}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onContactChange={setSelectedContactId}
      />
    </>
  );
}
