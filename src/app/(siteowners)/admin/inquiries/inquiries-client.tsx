"use client";

import React, { useState } from "react";
import { useGetContacts } from "@/hooks/owner-site/admin/use-contact";
import { usePopupForms } from "@/hooks/owner-site/admin/use-popup";
import { useNewsletters } from "@/hooks/owner-site/admin/use-newsletter";
import { useGetAppointments } from "@/hooks/owner-site/admin/use-appointment";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Mail,
  MessageSquare,
  Bell,
  Calendar,
  ChevronRight,
} from "lucide-react";
import Pagination from "@/components/ui/pagination";
import ContactDetailsDialog from "@/components/site-owners/admin/contact/contact-details-dialog";
import { Contact } from "@/types/owner-site/admin/contact";

type InquiryType = "contact" | "popup" | "newsletter" | "booking";

interface InquiriesClientProps {
  subDomain?: string;
}

export default function InquiriesClient({ subDomain }: InquiriesClientProps) {
  const [selectedView, setSelectedView] = useState<InquiryType>("contact");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isBatoma = subDomain === "batoma";

  // Fetch data for all tabs to get counts
  // We use page_size 1 for non-active tabs to minimize load, but for simplicity/caching we might just fetch standard
  // To implement search properly, we pass searchTerm ONLY to the active query?
  // But strictly, each tab needs its own search context? Or global search?
  // User design has one global search bar. It likely applies to the CURRENT view.

  const contactFilters =
    selectedView === "contact"
      ? { search: searchTerm, page, page_size: 10 }
      : { page_size: 1 };
  const popupFilters =
    selectedView === "popup"
      ? { search: searchTerm, page, page_size: 10 }
      : { page_size: 1 };
  // Newsletter hook args: page, pageSize, search
  const newsletterArgs =
    selectedView === "newsletter" ? [page, 10, searchTerm] : [1, 1, ""];
  const appointmentFilters =
    selectedView === "booking"
      ? { search: searchTerm, page, page_size: 10 }
      : { page_size: 1 };

  const { data: contactsData } = useGetContacts(contactFilters);
  const { data: popupsData } = usePopupForms(popupFilters);
  // @ts-ignore - Argument spread issue potentially, checking types carefully manually
  const { data: newslettersData } = useNewsletters(
    ...(newsletterArgs as [number, number, string])
  );
  const { data: bookingsData } = useGetAppointments(appointmentFilters);

  const tabs = [
    {
      id: "contact" as InquiryType,
      label: "Contact",
      icon: Mail,
      count: contactsData?.count || 0,
    },
    {
      id: "popup" as InquiryType,
      label: "Popup",
      icon: MessageSquare,
      count: popupsData?.count || 0,
    },
    {
      id: "newsletter" as InquiryType,
      label: "Newsletter",
      icon: Bell,
      count: newslettersData?.count || 0,
    },
    ...(isBatoma
      ? [
          {
            id: "booking" as InquiryType,
            label: "Bookings",
            icon: Calendar,
            count: bookingsData?.count || 0,
          },
        ]
      : []),
  ];

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: "bg-blue-50 text-blue-700 border-blue-200",
      read: "bg-gray-50 text-gray-600 border-gray-200",
      replied: "bg-green-50 text-green-700 border-green-200",
      active: "bg-green-50 text-green-700 border-green-200",
      unsubscribed: "bg-gray-50 text-gray-500 border-gray-200",
      completed: "bg-green-50 text-green-700 border-green-200",
      confirmed: "bg-green-50 text-green-700 border-green-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      cancelled: "bg-red-50 text-red-600 border-red-200",
    };
    return (
      <Badge
        variant="outline"
        className={`font-medium capitalize ${styles[status] || styles.read}`}
      >
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const handleViewContactDetails = (contact: Contact) => {
    setSelectedContact(contact);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedContact(null);
  };

  const handleContactChange = (contactId: number) => {
    if (contactsData?.results) {
      const contact = contactsData.results.find(c => c.id === contactId);
      setSelectedContact(contact || null);
    }
  };

  const renderContactTable = () => (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-100 hover:bg-transparent">
          <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Name
          </TableHead>
          <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Email
          </TableHead>
          <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Message
          </TableHead>
          <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Date
          </TableHead>
          <TableHead className="w-10"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contactsData?.results?.map(inquiry => (
          <TableRow
            key={inquiry.id}
            className="cursor-pointer border-gray-100 transition-colors hover:bg-gray-50/50"
            onClick={() => handleViewContactDetails(inquiry)}
          >
            <TableCell className="font-medium text-gray-900">
              {inquiry.name}
            </TableCell>
            <TableCell className="text-gray-600">
              {inquiry.email || "-"}
            </TableCell>
            <TableCell className="max-w-xs truncate text-gray-600">
              {inquiry.message}
            </TableCell>
            <TableCell className="text-gray-500">
              {formatDate(inquiry.created_at)}
            </TableCell>
          </TableRow>
        ))}
        {contactsData?.results?.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center text-gray-500">
              No contact inquiries found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  const renderPopupTable = () => (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-100 hover:bg-transparent">
          <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Name
          </TableHead>
          <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Email
          </TableHead>
          <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Phone
          </TableHead>
          <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Date
          </TableHead>
          <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Status
          </TableHead>
          <TableHead className="w-10"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {popupsData?.results?.map(inquiry => (
          <TableRow
            key={inquiry.id}
            className="cursor-pointer border-gray-100 transition-colors hover:bg-gray-50/50"
          >
            <TableCell className="font-medium text-gray-900">
              {inquiry.name || "-"}
            </TableCell>
            <TableCell className="text-gray-600">
              {inquiry.email || "-"}
            </TableCell>
            <TableCell className="text-gray-600">
              {inquiry.phone_number || "-"}
            </TableCell>
            <TableCell className="text-gray-500">
              {formatDate(inquiry.created_at)}
            </TableCell>
            <TableCell>{getStatusBadge("new")}</TableCell>
            <TableCell>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </TableCell>
          </TableRow>
        ))}
        {popupsData?.results?.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center text-gray-500">
              No popup submissions found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  const renderNewsletterTable = () => (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-100 hover:bg-transparent">
          <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Email
          </TableHead>
          <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Subscribed Date
          </TableHead>
          <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Status
          </TableHead>
          <TableHead className="w-10"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {newslettersData?.results?.map(sub => (
          <TableRow
            key={sub.id}
            className="cursor-pointer border-gray-100 transition-colors hover:bg-gray-50/50"
          >
            <TableCell className="font-medium text-gray-900">
              {sub.email}
            </TableCell>
            <TableCell className="text-gray-500">
              {formatDate(sub.created_at)}
            </TableCell>
            <TableCell>
              {getStatusBadge(sub.is_subscribed ? "active" : "unsubscribed")}
            </TableCell>
            <TableCell>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </TableCell>
          </TableRow>
        ))}
        {newslettersData?.results?.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center text-gray-500">
              No newsletter subscriptions found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  const renderBookingsTable = () => (
    <Table>
      <TableHeader>
        <TableRow className="border-gray-100 hover:bg-transparent">
          <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Name
          </TableHead>
          <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Email
          </TableHead>
          <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Date
          </TableHead>
          <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Time
          </TableHead>
          <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Reason
          </TableHead>
          <TableHead className="text-xs font-medium tracking-wide text-gray-500 uppercase">
            Status
          </TableHead>
          <TableHead className="w-10"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookingsData?.results?.map(booking => (
          <TableRow
            key={booking.id}
            className="cursor-pointer border-gray-100 transition-colors hover:bg-gray-50/50"
          >
            <TableCell className="font-medium text-gray-900">
              {booking.full_name}
            </TableCell>
            <TableCell className="text-gray-600">{booking.email}</TableCell>
            <TableCell className="text-gray-500">
              {formatDate(booking.date || "")}
            </TableCell>
            <TableCell className="text-gray-500">
              {booking.time || "-"}
            </TableCell>
            <TableCell className="text-gray-600">
              {booking.reason?.name || "-"}
            </TableCell>
            <TableCell>{getStatusBadge(booking.status)}</TableCell>
            <TableCell>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </TableCell>
          </TableRow>
        ))}
        {bookingsData?.results?.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center text-gray-500">
              No bookings found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

  const renderContent = () => {
    switch (selectedView) {
      case "contact":
        return renderContactTable();
      case "popup":
        return renderPopupTable();
      case "newsletter":
        return renderNewsletterTable();
      case "booking":
        return renderBookingsTable();
      default:
        return renderContactTable();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Inquiries
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all customer inquiries and communications
          </p>
        </div>

        {/* Search and Tabs */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-lg bg-gray-100/80 p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedView(tab.id);
                  setSearchTerm(""); // Reset search when switching tabs
                  setPage(1);
                }}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  selectedView === tab.id
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    selectedView === tab.id
                      ? "bg-gray-100 text-gray-700"
                      : "bg-gray-200/60 text-gray-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search inquiries..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="border-gray-200 bg-white pl-10 placeholder:text-gray-400 focus-visible:ring-gray-300"
            />
          </div>
        </div>

        {/* Table Card */}
        <div className="border-none shadow-none">
          <div className="p-0">{renderContent()}</div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-sm text-gray-500">
            Showing{" "}
            {selectedView === "contact"
              ? contactsData?.results?.length || 0
              : selectedView === "popup"
                ? popupsData?.results?.length || 0
                : selectedView === "newsletter"
                  ? newslettersData?.results?.length || 0
                  : bookingsData?.results?.length || 0}{" "}
            results
          </div>

          {(selectedView === "contact"
            ? (contactsData?.count || 0) > 10
            : selectedView === "popup"
              ? (popupsData?.count || 0) > 10
              : selectedView === "newsletter"
                ? (newslettersData?.count || 0) > 10
                : (bookingsData?.count || 0) > 10) && (
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(
                (selectedView === "contact"
                  ? contactsData?.count || 0
                  : selectedView === "popup"
                    ? popupsData?.count || 0
                    : selectedView === "newsletter"
                      ? newslettersData?.count || 0
                      : bookingsData?.count || 0) / 10
              )}
              onPageChange={setPage}
              showFirstLast={false}
              maxVisiblePages={5}
            />
          )}
        </div>

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
}
