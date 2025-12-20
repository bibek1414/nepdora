"use client";

import { useState } from "react";
import { Plus, Search, Filter, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  useCollection,
  useCollectionData,
  useDeleteCollectionData,
} from "@/hooks/owner-site/admin/use-collections";
import { Skeleton } from "@/components/ui/skeleton";
import { CollectionData } from "@/types/owner-site/admin/collection";
import { CollectionDataDialog } from "./collection-data-dialog";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface CollectionDataManagementProps {
  slug: string;
}

export function CollectionDataManagement({
  slug,
}: CollectionDataManagementProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showDataDialog, setShowDataDialog] = useState(false);
  const [editingData, setEditingData] = useState<CollectionData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState<CollectionData | null>(null);

  const { data: collection, isLoading: collectionLoading } =
    useCollection(slug);
  const { data: collectionDataResponse, isLoading: dataLoading } =
    useCollectionData(slug, {
      ...filters,
      ...(searchQuery && { search: searchQuery }),
    });
  const deleteDataMutation = useDeleteCollectionData();

  const handleDelete = async () => {
    if (!dataToDelete) return;

    try {
      await deleteDataMutation.mutateAsync({
        slug,
        id: dataToDelete.id,
      });
      toast.success("Data deleted successfully");
      setDeleteDialogOpen(false);
      setDataToDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete data"
      );
    }
  };

  const confirmDelete = (data: CollectionData) => {
    setDataToDelete(data);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (data: CollectionData) => {
    setEditingData(data);
    setShowDataDialog(true);
  };

  const handleCreateNew = () => {
    setEditingData(null);
    setShowDataDialog(true);
  };
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatCellValue = (value: any, type: string) => {
    if (value === null || value === undefined) return "-";
    if (type === "boolean") return value ? "Yes" : "No";
    if (type === "date") return new Date(value).toLocaleDateString();
    return String(value);
  };

  // Get image field (first field that is type 'image' or contains 'image' in name)
  const getImageField = () => {
    if (!collection) return null;
    return collection.all_fields.find(
      f => f.type === "image" || f.name.toLowerCase().includes("image")
    );
  };
  // Get name field (field named 'name' or 'title' or first text field)
  const getNameField = () => {
    if (!collection) return null;
    const nameField = collection.all_fields.find(
      f => f.name.toLowerCase() === "name" || f.name.toLowerCase() === "title"
    );
    if (nameField) return nameField;
    return collection.all_fields.find(f => f.type === "text");
  };

  // Get 2-3 additional important fields (excluding image and name)
  const getDisplayFields = () => {
    if (!collection) return [];
    const imageField = getImageField();
    const nameField = getNameField();

    const excludeNames = [imageField?.name, nameField?.name].filter(Boolean);

    return collection.all_fields
      .filter(f => !excludeNames.includes(f.name))
      .slice(0, 2);
  };

  const showFifteenWordsHTML = (text: string) => {
    if (!text) return "";

    const words = text.split(" ");
    const truncated =
      words.length > 10 ? words.slice(0, 10).join(" ") + "..." : text;

    return truncated;
  };

  if (collectionLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!collection) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-muted-foreground">Collection not found</p>
        </CardContent>
      </Card>
    );
  }

  const imageField = getImageField();
  const nameField = getNameField();
  const displayFields = getDisplayFields();
  const filterableFields = collection.all_fields.filter(f => f.filterable);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/admin/collections")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Collections
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{collection.name}</h1>
          <p className="text-muted-foreground mt-1">
            Manage data for this collection
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Data
        </Button>
      </div>

      <CardContent className="gap-0 px-0 py-0">
        <div className="mb-6 flex w-full sm:w-64">
          <div className="relative w-full">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-black/40" />
            <Input
              placeholder="Search..."
              className="h-9 bg-black/5 pl-9 text-sm placeholder:text-black/40 focus:bg-white focus:shadow-sm focus:outline-none"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </CardContent>

      {dataLoading ? (
        <Card>
          <CardContent className="py-8">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      ) : !collectionDataResponse ||
        collectionDataResponse.results.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground mb-4">No data yet</p>
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Entry
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {imageField && <TableHead>Image</TableHead>}
                  {nameField && <TableHead>{nameField.name}</TableHead>}
                  {displayFields.map(field => (
                    <TableHead key={field.name}>{field.name}</TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collectionDataResponse.results.map(data => (
                  <TableRow key={data.id}>
                    {imageField && (
                      <TableCell>
                        {data.data[imageField.name] ? (
                          <img
                            src={data.data[imageField.name]}
                            alt="Preview"
                            className="h-12 w-12 rounded object-cover"
                          />
                        ) : (
                          <div className="bg-muted text-muted-foreground flex h-12 w-12 items-center justify-center rounded text-xs">
                            No image
                          </div>
                        )}
                      </TableCell>
                    )}
                    {nameField && (
                      <TableCell className="font-medium">
                        {formatCellValue(
                          data.data[nameField.name],
                          nameField.type
                        )}
                      </TableCell>
                    )}
                    {displayFields.map(field => (
                      <TableCell
                        key={field.name}
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleEdit(data)}
                      >
                        <div
                          dangerouslySetInnerHTML={{
                            __html: showFifteenWordsHTML(
                              formatCellValue(data.data[field.name], field.type)
                            ),
                          }}
                        />
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(data)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => confirmDelete(data)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <CollectionDataDialog
        open={showDataDialog}
        onOpenChange={setShowDataDialog}
        collection={collection}
        editingData={editingData}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this data entry. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
