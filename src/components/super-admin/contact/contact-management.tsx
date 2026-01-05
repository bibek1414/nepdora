import React, { useState } from "react";
import {
  useSuperAdminContactMessages,
  useSuperAdminDeleteContactMessage,
} from "@/hooks/super-admin/use-contact";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SimplePagination } from "@/components/ui/simple-pagination";
import { Search, Mail, Phone, Calendar, User, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ContactDetailsDialog from "./contact-details-dialog";

export default function ContactManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const pageSize = 10;

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(
    null
  );

  const { data, isLoading, error } = useSuperAdminContactMessages(
    page,
    pageSize,
    search
  );

  const { mutate: deleteMessage, isPending: isDeleting } =
    useSuperAdminDeleteContactMessage();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      deleteMessage(id, {
        onSuccess: () => {
          toast.success("Message deleted successfully");
          if (selectedContactId === id) {
            setIsDialogOpen(false);
            setSelectedContactId(null);
          }
        },
        onError: () => {
          toast.error("Failed to delete message");
        },
      });
    }
  };

  const handleViewDetails = (id: number) => {
    setSelectedContactId(id);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedContactId(null);
  };

  const handleContactChange = (contactId: number) => {
    setSelectedContactId(contactId);
  };

  const totalPages = data ? Math.ceil(data.count / pageSize) : 0;

  if (error) {
    return <div className="text-red-500">Error loading contact messages</div>;
  }

  return (
    <div className="mx-auto mt-12 mb-40 min-h-screen max-w-6xl space-y-6 px-6 md:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Contact Messages
          </h1>
        </div>
      </div>

      <Card className="border-none shadow-none">
        <CardContent>
          <div className="rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : data?.results.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No messages found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.results.map(item => (
                    <TableRow
                      key={item.id}
                      className="hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleViewDetails(item.id)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="text-muted-foreground h-4 w-4" />
                          {item.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="text-muted-foreground h-3 w-3" />
                            {item.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="text-muted-foreground h-3 w-3" />
                            {item.phone_number}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell
                        className="max-w-md truncate"
                        title={item.message}
                      >
                        {item.message}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(item.created_at), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-red-500"
                            onClick={e => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4">
            <SimplePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Render the details dialog */}
      {data && (
        <ContactDetailsDialog
          contacts={data.results}
          currentContactId={selectedContactId}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onContactChange={handleContactChange}
        />
      )}
    </div>
  );
}
