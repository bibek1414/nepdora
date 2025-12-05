// components/site-owners/admin/collections/collections-list.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Database, Trash2, Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  useCollections,
  useDeleteCollection,
} from "@/hooks/owner-site/admin/use-collections";
import { CreateCollectionDialog } from "./create-collection-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Collection } from "@/types/owner-site/admin/collection";

export function CollectionsList() {
  const router = useRouter();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] =
    useState<Collection | null>(null);

  const { data: collections, isLoading } = useCollections();
  const deleteCollectionMutation = useDeleteCollection();

  const handleDelete = async () => {
    if (!collectionToDelete) return;

    try {
      await deleteCollectionMutation.mutateAsync(collectionToDelete.slug);
      toast.success("Collection deleted successfully");
      setDeleteDialogOpen(false);
      setCollectionToDelete(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete collection"
      );
    }
  };

  const confirmDelete = (collection: Collection) => {
    setCollectionToDelete(collection);
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Collections</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your dynamic content collections
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Collection
        </Button>
      </div>

      {!collections || collections.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Database className="text-muted-foreground mb-4 h-16 w-16" />
            <h3 className="mb-2 text-xl font-semibold">No collections yet</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Create your first collection to start managing dynamic content
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Collection
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {collections.map(collection => (
            <Card key={collection.id} className="cursor-pointer shadow-none">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      {collection.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Slug: {collection.slug}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-muted-foreground mb-2 text-sm">
                      Custom Fields
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {collection.fields.length === 0 ? (
                        <Badge variant="outline">No custom fields</Badge>
                      ) : (
                        collection.fields.map((field, idx) => (
                          <Badge key={idx} variant="secondary">
                            {field.name}
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        router.push(`/admin/collections/${collection.slug}`)
                      }
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Data
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/admin/collections/${collection.slug}/edit`
                        )
                      }
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => confirmDelete(collection)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CreateCollectionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the collection &quot;
              {collectionToDelete?.name}&quot; and all its data. This action
              cannot be undone.
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
