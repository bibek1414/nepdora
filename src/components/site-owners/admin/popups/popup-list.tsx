"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
  TableWrapper,
  TableActionButtons,
  TableUserCell,
} from "@/components/ui/custom-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Image as ImageIcon,
  AlertCircle,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";

import PopupForm from "./popup-form";
import {
  usePopups,
  useDeletePopup,
  useUpdatePopup,
} from "@/hooks/owner-site/admin/use-popup";
import { PopUp } from "@/types/owner-site/admin/popup";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

const PopupListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<PopUp | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data: popups, isLoading, isError, error } = usePopups();
  const deletePopupMutation = useDeletePopup();
  const updatePopupMutation = useUpdatePopup();

  const handleOpenAddModal = () => {
    setEditingPopup(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (popup: PopUp) => {
    setEditingPopup(popup);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPopup(null);
  };

  const handleDelete = (id: number) => {
    deletePopupMutation.mutate(id);
  };

  const handleStatusToggle = (popup: PopUp, isActive: boolean) => {
    const formData = new FormData();
    formData.append("title", popup.title);
    formData.append("disclaimer", popup.disclaimer);
    formData.append("enabled_fields", JSON.stringify(popup.enabled_fields));
    formData.append("is_active", String(isActive));

    updatePopupMutation.mutate({
      id: popup.id!,
      data: formData,
    });
  };

  const formatFieldName = (field: string) => {
    return field.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  const getFieldIcon = (field: string) => {
    switch (field) {
      case "name":
        return "👤";
      case "phone_number":
        return "📞";
      case "email":
        return "📧";
      case "address":
        return "📍";
      default:
        return "📝";
    }
  };

  const filteredPopups = (popups || []).filter(
    popup =>
      popup.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      popup.disclaimer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedPopups = filteredPopups.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredPopups.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
        {/* Header Section */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-[#003d79]">Popups</h1>
        </div>

        {/* Search and Add Button */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40" />
            <Input
              placeholder="Search popups..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="h-9 bg-black/5 pl-9 text-sm placeholder:text-black/40 focus:bg-white focus:shadow-sm focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-black/40 transition hover:text-black/60"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleOpenAddModal}
                className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Popup
              </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden">
              <DialogHeader>
                <DialogTitle>
                  {editingPopup ? "Edit Popup" : "Create New Popup"}
                </DialogTitle>
                <DialogDescription>
                  {editingPopup
                    ? "Update your popup configuration and settings."
                    : "Set up a new popup to engage with your website visitors."}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[75vh] pr-4">
                <PopupForm
                  initialData={editingPopup}
                  onSubmitSuccess={handleCloseModal}
                />
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Content */}
        <div className="rounded-lg bg-white">
          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3">
                <RefreshCw className="h-8 w-8 animate-spin text-black/20" />
                <p className="text-xs text-black/40">Loading popups...</p>
              </div>
            ) : isError ? (
              <div className="p-6 text-center">
                <AlertCircle className="mx-auto mb-4 h-12 w-12 text-black/20" />
                <p className="mb-2 text-sm font-medium text-red-600">
                  {error?.message || "Failed to load popups. Please try again."}
                </p>
              </div>
            ) : filteredPopups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-black/5">
                  <ImageIcon className="h-6 w-6 text-black/20" />
                </div>
                <h3 className="text-sm font-medium text-black">
                  No popups found
                </h3>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-black/5">
                      <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                        Popup Info
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                        Enabled Fields
                      </TableHead>
                      <TableHead className="px-6 py-3 text-xs font-normal text-black/60">
                        Status
                      </TableHead>
                      <TableHead className="px-6 py-3 text-right text-xs font-normal text-black/60">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedPopups.map(popup => (
                      <TableRow
                        key={popup.id}
                        className="group border-b border-black/5 transition-colors hover:bg-black/2"
                      >
                        <TableCell className="px-6 py-4">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-normal text-black">
                              {popup.title}
                            </span>
                            <span className="max-w-[200px] truncate text-xs text-black/50">
                              {popup.disclaimer}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {popup.enabled_fields.length > 0 ? (
                              popup.enabled_fields.slice(0, 3).map(field => (
                                <span
                                  key={field}
                                  className="inline-flex items-center rounded bg-black/5 px-2 py-0.5 text-[10px] font-normal text-black/60"
                                >
                                  {getFieldIcon(field)} {formatFieldName(field)}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-black/40 italic">
                                No fields
                              </span>
                            )}
                            {popup.enabled_fields.length > 3 && (
                              <span className="text-[10px] text-black/40">
                                +{popup.enabled_fields.length - 3} more
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Switch
                            checked={popup.is_active}
                            onCheckedChange={checked =>
                              handleStatusToggle(popup, checked)
                            }
                            disabled={updatePopupMutation.isPending}
                            className="scale-90"
                          />
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <TableActionButtons
                            onEdit={() => handleOpenEditModal(popup)}
                            onDelete={() => handleDelete(popup.id!)}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <SimplePagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupListPage;
