"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Plus, Image as ImageIcon, AlertCircle, RefreshCw } from "lucide-react";
import PopupForm from "./popup-form";
import {
  usePopups,
  useDeletePopup,
  useUpdatePopup,
} from "@/hooks/owner-site/admin/use-popup";
import { PopUp } from "@/types/owner-site/admin/popup";
import { Alert, AlertDescription } from "@/components/ui/alert";

const PopupListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<PopUp | null>(null);

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

  return (
    <div className="animate-in fade-in min-h-screen bg-white duration-700">
      <div className="mx-auto max-w-7xl space-y-4 p-4 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Popups
            </h1>
            <p className="text-sm text-slate-500">
              Create, edit, and manage all your popup forms in one place.
            </p>
          </div>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleOpenAddModal}
                className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Popup
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
        <TableWrapper>
          <div className="min-h-[400px]">
            {isLoading ? (
              <div className="flex h-64 flex-col items-center justify-center gap-3">
                <RefreshCw className="h-8 w-8 animate-spin text-slate-500" />
                <p className="animate-pulse text-sm text-slate-400">
                  Loading popups...
                </p>
              </div>
            ) : isError ? (
              <div className="p-6">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error?.message ||
                      "Failed to load popups. Please try again."}
                  </AlertDescription>
                </Alert>
              </div>
            ) : popups?.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <ImageIcon className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-sm font-medium text-slate-900">
                  No popups found
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Get started by creating your first popup to engage with your
                  website visitors.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-100 hover:bg-transparent">
                    <TableHead className="px-6 py-4 font-semibold text-slate-700">
                      Popup Info
                    </TableHead>
                    <TableHead className="px-6 py-4 font-semibold text-slate-700">
                      Enabled Fields
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
                  {popups?.map(popup => (
                    <TableRow
                      key={popup.id}
                      className="group border-b border-slate-50 transition-colors hover:bg-slate-50/50"
                    >
                      <TableCell className="px-6 py-4">
                        <TableUserCell
                          imageSrc={popup.image as string}
                          fallback={popup.title.substring(0, 2).toUpperCase()}
                          title={popup.title}
                          subtitle={popup.disclaimer}
                        />
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {popup.enabled_fields.length > 0 ? (
                            popup.enabled_fields.slice(0, 3).map(field => (
                              <Badge
                                key={field}
                                variant="secondary"
                                className="bg-slate-100 text-[10px] font-medium text-slate-600 hover:bg-slate-200"
                              >
                                {getFieldIcon(field)} {formatFieldName(field)}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              No fields
                            </Badge>
                          )}
                          {popup.enabled_fields.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{popup.enabled_fields.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={popup.is_active}
                            onCheckedChange={checked =>
                              handleStatusToggle(popup, checked)
                            }
                            disabled={updatePopupMutation.isPending}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <TableActionButtons
                            onEdit={() => handleOpenEditModal(popup)}
                            onDelete={() => handleDelete(popup.id!)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TableWrapper>
      </div>
    </div>
  );
};

export default PopupListPage;
