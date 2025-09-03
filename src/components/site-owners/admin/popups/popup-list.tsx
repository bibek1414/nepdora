"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  AlertCircle,
  Settings,
  Eye,
  EyeOff,
  MoreVertical,
} from "lucide-react";
import PopupForm from "./popup-form";
import {
  usePopups,
  useDeletePopup,
  useUpdatePopup,
} from "@/hooks/owner-site/use-popup";
import { PopUp } from "@/types/owner-site/popup";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <div className="container mx-auto space-y-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Popup Management
          </h1>
          <p className="text-muted-foreground">
            Create, edit, and manage all your popup forms in one place.
          </p>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={handleOpenAddModal}
              size="lg"
              className="bg-gray-200 text-gray-800 hover:bg-gray-200 hover:text-gray-900"
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
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="space-y-2 text-center">
                <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
                <p className="text-muted-foreground">Loading popups...</p>
              </div>
            </div>
          ) : isError ? (
            <div className="p-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error?.message || "Failed to load popups. Please try again."}
                </AlertDescription>
              </Alert>
            </div>
          ) : popups?.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-4 p-12 text-center">
              <div className="bg-muted rounded-full p-3">
                <Settings className="text-muted-foreground h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No popups found</h3>
                <p className="text-muted-foreground max-w-sm">
                  Get started by creating your first popup to engage with your
                  website visitors.
                </p>
              </div>
              <Button onClick={handleOpenAddModal}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Popup
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Fields</TableHead>
                      <TableHead className="">Status</TableHead>
                      <TableHead className="w-[120px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {popups?.map(popup => (
                      <TableRow key={popup.id}>
                        <TableCell>
                          <Avatar className="h-12 w-12">
                            <AvatarImage
                              src={popup.image as string}
                              alt={popup.title}
                              className="object-cover"
                            />
                            <AvatarFallback className="bg-muted">
                              <ImageIcon className="text-muted-foreground h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="space-y-1">
                            <div className="font-semibold">{popup.title}</div>
                            {popup.disclaimer && (
                              <div className="text-muted-foreground line-clamp-1 text-sm">
                                {popup.disclaimer.length > 50
                                  ? `${popup.disclaimer.substring(0, 50)}...`
                                  : popup.disclaimer}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {popup.enabled_fields.length > 0 ? (
                              popup.enabled_fields.slice(0, 3).map(field => (
                                <Badge
                                  key={field}
                                  variant="secondary"
                                  className="text-xs"
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
                        <TableCell>
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
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenEditModal(popup)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the popup &apos;
                                    {popup.title}&apos; and remove all
                                    associated data.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(popup.id!)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PopupListPage;
