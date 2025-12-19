"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Mail,
  MessageSquare,
  Bell,
  Calendar,
  RefreshCw,
  MoreHorizontal,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  Inbox,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TableWrapper,
  TableUserCell,
  TableActionButtons,
} from "@/components/ui/custom-table";
import { cn } from "@/lib/utils";
import { Contact } from "@/types/owner-site/admin/contact";
import { Newsletter } from "@/types/owner-site/admin/newsletter";
import { Appointment } from "@/types/owner-site/admin/appointment";
import { PopUpForm } from "@/types/owner-site/admin/popup";

import { useGetContacts } from "@/hooks/owner-site/admin/use-contact";
import { usePopupForms } from "@/hooks/owner-site/admin/use-popup";
import { useNewsletters } from "@/hooks/owner-site/admin/use-newsletter";
import { useGetAppointments } from "@/hooks/owner-site/admin/use-appointment";

const ITEMS_PER_PAGE = 10;
type InquiryType = "contact" | "popup" | "newsletter" | "booking";

const SimplePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="h-8 w-8"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm text-slate-600">
        Page {currentPage} of {Math.max(1, totalPages)}
      </span>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="h-8 w-8"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface InquiriesClientProps {
  subDomain?: string;
}

export default function InquiriesClient({ subDomain }: InquiriesClientProps) {
  const [selectedView, setSelectedView] = useState<InquiryType>("contact");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState<
    Contact | PopUpForm | null
  >(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const isBatoma = subDomain === "batoma";

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset pagination when filter/search changes
  useEffect(() => {
    setPage(1);
  }, [selectedView, debouncedSearch]);

  // Hook Data Fetching
  const contactFilters =
    selectedView === "contact"
      ? { search: debouncedSearch, page, page_size: ITEMS_PER_PAGE }
      : { page_size: 1 };
  const popupFilters =
    selectedView === "popup"
      ? { search: debouncedSearch, page, page_size: ITEMS_PER_PAGE }
      : { page_size: 1 };
  const newsletterArgs: [number, number, string] =
    selectedView === "newsletter"
      ? [page, ITEMS_PER_PAGE, debouncedSearch]
      : [1, 1, ""];
  const bookingFilters =
    selectedView === "booking"
      ? { search: debouncedSearch, page, page_size: ITEMS_PER_PAGE }
      : { page_size: 1 };

  const { data: contactsData, isLoading: loadingContacts } =
    useGetContacts(contactFilters);
  const { data: popupsData, isLoading: loadingPopups } =
    usePopupForms(popupFilters);
  const { data: newslettersData, isLoading: loadingNewsletters } =
    useNewsletters(...newsletterArgs);
  const { data: bookingsData, isLoading: loadingBookings } =
    useGetAppointments(bookingFilters);

  const isLoading =
    (selectedView === "contact" && loadingContacts) ||
    (selectedView === "popup" && loadingPopups) ||
    (selectedView === "newsletter" && loadingNewsletters) ||
    (selectedView === "booking" && loadingBookings);

  const tabs = [
    {
      id: "contact" as InquiryType,
      label: "Messages",
      icon: Mail,
      count: contactsData?.count || 0,
    },
    {
      id: "popup" as InquiryType,
      label: "Popups",
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

  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      new: "bg-blue-50 text-blue-700 border-blue-200",
      read: "bg-slate-50 text-slate-600 border-slate-200",
      replied: "bg-green-50 text-green-700 border-green-200",
      active: "bg-green-50 text-green-700 border-green-200",
      unsubscribed: "bg-slate-50 text-slate-500 border-slate-200",
      completed: "bg-indigo-50 text-indigo-700 border-indigo-200",
      confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      cancelled: "bg-red-50 text-red-600 border-red-200",
    };

    const iconMap: Record<string, any> = {
      completed: CheckCircle2,
      confirmed: CheckCircle2,
      pending: Clock,
      cancelled: XCircle,
      new: Inbox,
    };

    const Icon = iconMap[status.toLowerCase()];

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
          styles[status.toLowerCase()] || styles.read
        )}
      >
        {Icon && <Icon className="h-3 w-3" />}
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const handleRowClick = (item: Contact | PopUpForm) => {
    if (selectedView === "contact" || selectedView === "popup") {
      setSelectedContact(item);
      setIsDialogOpen(true);
    }
  };

  // Get current data and counts
  const currentData = useMemo(() => {
    switch (selectedView) {
      case "contact":
        return contactsData?.results || [];
      case "popup":
        return popupsData?.results || [];
      case "newsletter":
        return newslettersData?.results || [];
      case "booking":
        return bookingsData?.results || [];
      default:
        return [];
    }
  }, [selectedView, contactsData, popupsData, newslettersData, bookingsData]);

  const totalCount = useMemo(() => {
    switch (selectedView) {
      case "contact":
        return contactsData?.count || 0;
      case "popup":
        return popupsData?.count || 0;
      case "newsletter":
        return newslettersData?.count || 0;
      case "booking":
        return bookingsData?.count || 0;
      default:
        return 0;
    }
  }, [selectedView, contactsData, popupsData, newslettersData, bookingsData]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="animate-pulse text-sm text-slate-400">
            Loading data...
          </p>
        </div>
      );
    }

    if (currentData.length === 0) return <EmptyState label={selectedView} />;

    if (selectedView === "contact") {
      return (
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-100 hover:bg-transparent">
              <TableHead className="px-6 py-4 font-semibold text-slate-700">
                Sender
              </TableHead>
              <TableHead className="px-6 py-4 font-semibold text-slate-700">
                Message
              </TableHead>
              <TableHead className="px-6 py-4 font-semibold text-slate-700">
                Date
              </TableHead>
              <TableHead className="px-6 py-4 text-right font-semibold text-slate-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(currentData as Contact[]).map((item, index) => (
              <TableRow
                key={item.id || index}
                className="group cursor-pointer border-b border-slate-50 transition-colors hover:bg-slate-50/50"
                onClick={() => handleRowClick(item)}
              >
                <TableCell className="px-6 py-4">
                  <TableUserCell
                    fallback={getInitials(item.name || "")}
                    title={item.name}
                    subtitle={item.email || undefined}
                  />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <p className="max-w-md truncate text-slate-600">
                    {item.message}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-slate-500">
                  {formatDate(item.created_at)}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <TableActionButtons onView={() => handleRowClick(item)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    if (selectedView === "newsletter") {
      return (
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-100 hover:bg-transparent">
              <TableHead className="px-6 py-4 font-semibold text-slate-700">
                Subscriber
              </TableHead>
              <TableHead className="px-6 py-4 font-semibold text-slate-700">
                Subscribed Date
              </TableHead>
              <TableHead className="px-6 py-4 font-semibold text-slate-700">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 text-right font-semibold text-slate-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(currentData as Newsletter[]).map(item => (
              <TableRow
                key={item.id}
                className="border-b border-slate-50 transition-colors hover:bg-slate-50/50"
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-100 bg-slate-50 text-slate-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="font-medium text-slate-900">
                      {item.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-slate-500">
                  {formatDate(item.created_at)}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <StatusBadge
                    status={item.is_subscribed ? "active" : "unsubscribed"}
                  />
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <TableActionButtons onDelete={() => {}} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    if (selectedView === "booking") {
      return (
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-100 hover:bg-transparent">
              <TableHead className="px-6 py-4 font-semibold text-slate-700">
                Customer
              </TableHead>
              <TableHead className="px-6 py-4 font-semibold text-slate-700">
                Date & Time
              </TableHead>
              <TableHead className="px-6 py-4 font-semibold text-slate-700">
                Reason
              </TableHead>
              <TableHead className="px-6 py-4 font-semibold text-slate-700">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 text-right font-semibold text-slate-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(currentData as Appointment[]).map((item, index) => (
              <TableRow
                key={item.id || index}
                className="border-b border-slate-50 transition-colors hover:bg-slate-50/50"
              >
                <TableCell className="px-6 py-4">
                  <TableUserCell
                    fallback={getInitials(item.full_name || "")}
                    title={item.full_name}
                    subtitle={item.email || undefined}
                  />
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">
                      {formatDate(item.date || "")}
                    </span>
                    <span className="text-xs font-normal text-slate-500">
                      {item.time || "-"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-slate-600">
                  <span className="inline-flex items-center rounded-md border border-slate-100 bg-slate-50/50 px-2 py-1 text-xs font-medium text-slate-600">
                    {item.reason?.name || "General"}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <StatusBadge status={item.status} />
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <TableActionButtons />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    // Popup View
    return (
      <Table>
        <TableHeader>
          <TableRow className="border-b border-slate-100 hover:bg-transparent">
            <TableHead className="px-6 py-4 font-semibold text-slate-700">
              Contact Info
            </TableHead>
            <TableHead className="px-6 py-4 font-semibold text-slate-700">
              Date
            </TableHead>
            <TableHead className="px-6 py-4 text-right font-semibold text-slate-700">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(currentData as PopUpForm[]).map((item, index) => (
            <TableRow
              key={item.id || index}
              className="group cursor-pointer border-b border-slate-50 transition-colors hover:bg-slate-50/50"
              onClick={() => handleRowClick(item)}
            >
              <TableCell className="px-6 py-4">
                <TableUserCell
                  fallback={getInitials(item.name || "UN")}
                  title={item.name || "Unknown"}
                  subtitle={item.email || item.phone_number || undefined}
                />
              </TableCell>
              <TableCell className="px-6 py-4 text-slate-500">
                {formatDate(item.created_at)}
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <TableActionButtons onView={() => handleRowClick(item)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const EmptyState = ({ label }: { label: string }) => (
    <div className="flex h-full min-h-[400px] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <Search className="h-6 w-6 text-slate-400" />
      </div>
      <h3 className="text-sm font-medium text-slate-900">No {label} found</h3>
      <p className="mt-1 text-sm text-slate-500">
        No results matching your current filters.
      </p>
    </div>
  );

  return (
    <div className="animate-in fade-in min-h-screen bg-white duration-500">
      <div className="mx-auto max-w-5xl space-y-4 p-4 sm:p-6">
        {/* Page Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Inbox
            </h1>
            <p className="text-sm text-slate-500">
              Manage your communications and bookings.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden items-center gap-2 border-slate-200 sm:flex"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            {/* Refresh is handled by state updates usually, but we can fake a re-fetch or invalidation if needed. For now just visual. */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {}}
              className="gap-2 border-slate-200"
            >
              <RefreshCw
                className={cn("h-4 w-4", isLoading && "animate-spin")}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col justify-between gap-4 pb-0.5 sm:flex-row sm:items-center">
          {/* Custom Tab List */}
          <div className="no-scrollbar -mb-px flex items-center gap-1 overflow-x-auto">
            {tabs.map(tab => {
              const isActive = selectedView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setSelectedView(tab.id);
                    setSearchTerm("");
                  }}
                  className={cn(
                    "group relative flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
                  )}
                >
                  <tab.icon
                    className={cn(
                      "h-4 w-4",
                      isActive
                        ? "text-blue-600"
                        : "text-slate-400 group-hover:text-slate-600"
                    )}
                  />
                  {tab.label}
                  {tab.count > 0 && (
                    <span
                      className={cn(
                        "ml-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px]",
                        isActive
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-600"
                      )}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative mb-2 w-full sm:mb-0 sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder={`Search ${selectedView}...`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="h-9 border-slate-200 bg-white pl-9 text-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Main Content Area */}
        <TableWrapper>
          <div className="min-h-[400px]">{renderTableContent()}</div>

          {/* Footer / Pagination */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
            <div className="text-xs font-medium text-slate-500">
              Showing{" "}
              <span className="text-slate-900">{currentData.length}</span>{" "}
              results
            </div>

            <SimplePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </TableWrapper>

        {/* Contact Details Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Message Details</DialogTitle>
              <DialogDescription>
                View the complete message content and details.
              </DialogDescription>
            </DialogHeader>
            {selectedContact && (
              <div className="mt-4 space-y-6">
                {/* Header Info */}
                <div className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-indigo-100 text-base font-bold text-indigo-700">
                      {getInitials(selectedContact.name || "?")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <h4 className="text-base font-semibold text-slate-900">
                      {selectedContact.name}
                    </h4>
                    <div className="flex flex-col gap-1 text-sm text-slate-500 sm:flex-row sm:items-center sm:gap-4">
                      <span className="flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5" />
                        {selectedContact.email}
                      </span>
                      {(selectedContact as any).phone_number && (
                        <span className="hidden text-slate-300 sm:inline">
                          •
                        </span>
                      )}
                      {(selectedContact as any).phone_number && (
                        <span>{(selectedContact as any).phone_number}</span>
                      )}
                    </div>
                  </div>
                  {/* Status badge omitted as no status field */}
                </div>

                {/* Message Body - PopupForm doesn't have explicit 'message' field in type, but Contact does. 
                        PopupForm has k-v pairs in a separate structure usually, or just fields. 
                        For now we display 'message' if it exists, or some fallback.
                     */}
                {"message" in selectedContact ? (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                      Message Content
                    </label>
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="leading-relaxed whitespace-pre-wrap text-slate-700">
                        {(selectedContact as any).message}
                      </p>
                    </div>
                    <p className="text-right text-xs text-slate-400">
                      Received on {formatDate(selectedContact.created_at)}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                      Form Data
                    </label>
                    {/* Fallback for Popup Form content logic would go here, omitting for now to match design snippet structure */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="leading-relaxed whitespace-pre-wrap text-slate-700">
                        {/* If it's a popup, we might want to show address etc. 
                                   But purely based on types, I'll allow address.
                                */}
                        {(selectedContact as any).address &&
                          `Address: ${(selectedContact as any).address}\n`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="secondary"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Close
                  </Button>
                  <Button className="gap-2">
                    <Mail className="h-4 w-4" />
                    Reply via Email
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
