"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Edit,
  ArrowUpRight,
  Search,
  Layers,
  Calendar,
  Grid3x3,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  useCollections,
  useDeleteCollection,
} from "@/hooks/owner-site/admin/use-collections";
import { CreateCollectionDialog } from "./create-collection-dialog";
import { Collection } from "@/types/owner-site/admin/collection";

export function CollectionsList() {
  const router = useRouter();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] =
    useState<Collection | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: collections, isLoading } = useCollections();
  const deleteCollectionMutation = useDeleteCollection();

  const filteredCollections = collections?.filter(
    collection =>
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <div className="h-10 w-48 animate-pulse rounded-lg bg-white/60 shadow-sm" />
              <div className="h-5 w-80 animate-pulse rounded-lg bg-white/40" />
            </div>
            <div className="h-11 w-44 animate-pulse rounded-xl bg-white/60 shadow-sm" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-2xl bg-white/60 shadow-sm"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                <Layers className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Collections
                </h1>
                <p className="text-sm text-slate-500">
                  {collections?.length || 0} collection
                  {collections?.length !== 1 ? "s" : ""} • Dynamic content
                  management
                </p>
              </div>
            </div>
          </div>
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 sm:w-auto"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="mr-2 h-5 w-5" />
            New Collection
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search collections..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="h-12 rounded-xl border-slate-200/60 bg-white/80 pl-12 text-base shadow-sm backdrop-blur-sm transition-all placeholder:text-slate-400 focus:bg-white focus:shadow-md"
          />
        </div>

        {/* Empty State */}
        {!collections || (collections.length === 0 && searchQuery === "") ? (
          <Card className="border-0 bg-white/60 shadow-xl backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100">
                <BookOpen className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-slate-900">
                No collections yet
              </h3>
              <p className="mb-6 max-w-sm text-center text-slate-500">
                Create your first collection to start organizing and managing
                your dynamic content
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Collection
              </Button>
            </CardContent>
          </Card>
        ) : filteredCollections?.length === 0 ? (
          <div className="rounded-2xl bg-white/60 py-16 text-center shadow-lg backdrop-blur-sm">
            <p className="text-slate-500">
              No collections found for &quot;{searchQuery}&quot;
            </p>
          </div>
        ) : (
          /* Collections Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCollections?.map((collection, index) => (
              <div
                key={collection.id}
                onClick={() =>
                  router.push(`/admin/collections/${collection.slug}`)
                }
                className="group relative cursor-pointer"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-blue-200/60 hover:bg-white hover:shadow-xl hover:shadow-blue-500/10">
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        router.push(
                          `/admin/collections/${collection.slug}/edit`
                        );
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-all hover:bg-blue-100 hover:text-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        confirmDelete(collection);
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-all hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex h-full flex-col">
                    {/* Icon */}
                    <div className="mb-5">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-500/40">
                        <BookOpen className="h-7 w-7 text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mb-5 flex-1">
                      <h3 className="mb-2 text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                        {collection.name}
                      </h3>
                      <div className="mb-3 flex items-center gap-2">
                        <div className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          /{collection.slug}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Grid3x3 className="h-4 w-4 text-slate-400" />
                        <span className="font-medium">
                          {collection.all_fields?.length || 0}
                        </span>
                        <span className="text-slate-400">fields</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-400">Updated</span>
                        <span className="font-medium">
                          {new Date(collection.updated_at).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <div className="absolute right-6 bottom-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 transition-all duration-300 group-hover:bg-blue-100">
                        <ArrowUpRight className="h-5 w-5 text-slate-600 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Dialog */}
        <CreateCollectionDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />

        {/* Delete Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="max-w-md rounded-2xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-semibold">
                Delete Collection
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500">
                This will permanently delete &quot;{collectionToDelete?.name}
                &quot; and all its data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0">
              <AlertDialogCancel className="rounded-xl">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                Delete Collection
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
