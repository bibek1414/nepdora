"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Mail,
  MessageSquare,
  Bell,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { Contact } from "@/types/owner-site/admin/contact";
import { Newsletter } from "@/types/owner-site/admin/newsletter";
import { PopUpForm } from "@/types/owner-site/admin/popup";

import { useGetContacts } from "@/hooks/owner-site/admin/use-contact";
import { usePopupForms } from "@/hooks/owner-site/admin/use-popup";
import { useNewsletters } from "@/hooks/owner-site/admin/use-newsletter";
import ContactDetailsDialog from "@/components/site-owners/admin/contact/contact-details-dialog";

const ITEMS_PER_PAGE = 10;
type InquiryType = "contact" | "popup" | "newsletter";

const SimplePagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-2 px-6 py-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className="h-8 w-8 rounded-md"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-xs text-black/60">
        Page {currentPage} of {Math.max(1, totalPages)}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className="h-8 w-8 rounded-md"
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
  const [selectedContactId, setSelectedContactId] = useState<number | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);

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

  const { data: contactsData, isLoading: loadingContacts } =
    useGetContacts(contactFilters);
  const { data: popupsData, isLoading: loadingPopups } =
    usePopupForms(popupFilters);
  const { data: newslettersData, isLoading: loadingNewsletters } =
    useNewsletters(...newsletterArgs);

  const isLoading =
    (selectedView === "contact" && loadingContacts) ||
    (selectedView === "popup" && loadingPopups) ||
    (selectedView === "newsletter" && loadingNewsletters);

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
  ];

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      : "—";

  const openDialog = (id: number) => {
    setSelectedContactId(id);
    setIsDialogOpen(true);
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
      default:
        return [];
    }
  }, [selectedView, contactsData, popupsData, newslettersData]);

  const totalCount = useMemo(() => {
    switch (selectedView) {
      case "contact":
        return contactsData?.count || 0;
      case "popup":
        return popupsData?.count || 0;
      case "newsletter":
        return newslettersData?.count || 0;
      default:
        return 0;
    }
  }, [selectedView, contactsData, popupsData, newslettersData]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const renderTableContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-64 flex-col items-center justify-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-black/40" />
          <p className="text-xs text-black/40">Loading data...</p>
        </div>
      );
    }

    if (currentData.length === 0) {
      return (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <p className="text-sm text-black/60">No {selectedView} found</p>
        </div>
      );
    }

    if (selectedView === "contact") {
      return (
        <Table>
          <TableHeader>
            <TableRow className="border-b border-black/5">
              <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                Name
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                Contact
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                Message
              </TableHead>
              <TableHead className="px-6 py-3 text-right text-xs font-normal text-black/60">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(currentData as Contact[]).map((item, index) => (
              <TableRow
                key={item.id || index}
                onClick={() => openDialog(item.id)}
                className="cursor-pointer border-b border-black/5 transition-colors hover:bg-black/2"
              >
                <TableCell className="px-6 py-4">
                  <span className="text-sm font-normal text-black capitalize">
                    {item.name}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex flex-col gap-0.5">
                    {item.email && (
                      <span className="text-xs text-black/50">
                        {item.email}
                      </span>
                    )}
                    {item.phone_number && (
                      <span className="text-xs text-black/50">
                        {item.phone_number}
                      </span>
                    )}
                    {!item.email && !item.phone_number && (
                      <span className="text-xs text-black/40">—</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <p className="max-w-md truncate text-xs text-black/50">
                    {item.message || "—"}
                  </p>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <span className="text-xs text-black/40">
                    {formatDate(item.created_at)}
                  </span>
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
            <TableRow className="border-b border-black/5">
              <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                Email
              </TableHead>
              <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                Status
              </TableHead>
              <TableHead className="px-6 py-3 text-right text-xs font-normal text-black/60">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(currentData as Newsletter[]).map(item => (
              <TableRow
                key={item.id}
                className="border-b border-black/5 transition-colors hover:bg-black/2"
              >
                <TableCell className="px-6 py-4">
                  <span className="text-sm font-normal text-black">
                    {item.email}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span
                    className={cn(
                      "text-xs",
                      item.is_subscribed ? "text-black/60" : "text-black/40"
                    )}
                  >
                    {item.is_subscribed ? "Subscribed" : "Unsubscribed"}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  <span className="text-xs text-black/40">
                    {formatDate(item.created_at)}
                  </span>
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
          <TableRow className="border-b border-black/5">
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Name
            </TableHead>
            <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
              Contact
            </TableHead>
            <TableHead className="px-6 py-3 text-right text-xs font-normal text-black/60">
              Date
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {(currentData as PopUpForm[]).map((item, index) => (
            <TableRow
              key={item.id || index}
              className="cursor-pointer border-b border-black/5 transition-colors hover:bg-black/2"
            >
              <TableCell className="px-6 py-4">
                <span className="text-sm font-normal text-black capitalize">
                  {item.name || "Unknown"}
                </span>
              </TableCell>
              <TableCell className="px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  {item.email && (
                    <span className="text-xs text-black/50">{item.email}</span>
                  )}
                  {item.phone_number && (
                    <span className="text-xs text-black/50">
                      {item.phone_number}
                    </span>
                  )}
                  {!item.email && !item.phone_number && (
                    <span className="text-xs text-black/40">—</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="px-6 py-4 text-right">
                <span className="text-xs text-black/40">
                  {formatDate(item.created_at)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const currentContacts = useMemo(() => {
    if (selectedView === "contact") {
      return (currentData as Contact[]) || [];
    }
    return [];
  }, [selectedView, currentData]);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
        {/* Page Title */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-[#003d79]">Inquiries</h1>
        </div>

        {/* Tabs and Search - Same Line */}
        <div className="mb-6 flex items-center justify-between gap-4">
          {/* Tabs - Rounded Pill Design */}
          <div className="inline-flex items-center gap-2 rounded-full bg-black/5 p-1.5">
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
                    "group relative flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out",
                    isActive
                      ? "bg-white text-[#003d79]"
                      : "text-black/60 hover:bg-white/50 hover:text-black"
                  )}
                >
                  <tab.icon
                    className={cn(
                      "h-4 w-4 transition-colors duration-200",
                      isActive
                        ? "text-[#003d79]"
                        : "text-black/50 group-hover:text-black/70"
                    )}
                  />
                  <span className="whitespace-nowrap">{tab.label}</span>
                  {tab.count > 0 && (
                    <span
                      className={cn(
                        "flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-medium transition-colors duration-200",
                        isActive
                          ? "bg-[#003d79]/10 text-[#003d79]"
                          : "bg-black/10 text-black/60 group-hover:bg-black/15"
                      )}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40" />
            <Input
              placeholder={`Search ${selectedView}...`}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="h-9 bg-black/5 pl-9 text-sm placeholder:text-black/40 focus:bg-white focus:shadow-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg bg-white">
          {renderTableContent()}
          {!isLoading && currentData.length > 0 && (
            <SimplePagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>

        {/* Contact Details Dialog */}
        {selectedView === "contact" && (
          <ContactDetailsDialog
            contacts={currentContacts}
            currentContactId={selectedContactId}
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onContactChange={setSelectedContactId}
          />
        )}
      </div>
    </div>
  );
}
