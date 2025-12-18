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
                className="h-64 animate-pulse rounded-2xl bg-white/60 shadow-sm"
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
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                <Layers className="h-7 w-7 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                  Collections
                </h1>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  {collections?.length || 0} collection
                  {collections?.length !== 1 ? "s" : ""} • Dynamic content
                  management
                </p>
              </div>
            </div>
          </div>
          <Button
            size="lg"
            className="group w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 sm:w-auto"
            onClick={() => setShowCreateDialog(true)}
          >
            <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
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
            className="h-12 rounded-xl border-slate-200/60 bg-white/80 pl-12 text-base shadow-sm backdrop-blur-sm transition-all placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:shadow-md focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Empty State */}
        {!collections || (collections.length === 0 && searchQuery === "") ? (
          <Card className="border-0 bg-white/70 shadow-xl backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-24">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-100 to-indigo-100">
                <BookOpen className="h-12 w-12 text-blue-600" strokeWidth={2} />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-slate-900">
                No collections yet
              </h3>
              <p className="mb-8 max-w-sm text-center text-slate-600">
                Create your first collection to start organizing and managing
                your dynamic content
              </p>
              <Button
                size="lg"
                className="group bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
                onClick={() => setShowCreateDialog(true)}
              >
                <Plus className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
                Create Collection
              </Button>
            </CardContent>
          </Card>
        ) : filteredCollections?.length === 0 ? (
          <div className="rounded-2xl bg-white/70 py-20 text-center shadow-lg backdrop-blur-sm">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
            </div>
            <p className="text-lg font-medium text-slate-600">
              No collections found for &quot;{searchQuery}&quot;
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try a different search term
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
                <div className="relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white/90 p-7 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-blue-200 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10">
                  {/* Decorative gradient background */}
                  <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/10 to-indigo-400/10 blur-3xl transition-all duration-500 group-hover:scale-150" />

                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        router.push(
                          `/admin/collections/${collection.slug}/edit`
                        );
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-600 shadow-md transition-all hover:bg-blue-50 hover:text-blue-600 hover:shadow-lg"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        confirmDelete(collection);
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-600 shadow-md transition-all hover:bg-red-50 hover:text-red-600 hover:shadow-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="relative flex h-full flex-col">
                    {/* Icon */}
                    <div className="mb-6">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-500/40">
                        <BookOpen
                          className="h-8 w-8 text-white"
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="mb-6 flex-1">
                      <h3 className="mb-3 text-2xl font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                        {collection.name}
                      </h3>
                      <div className="mb-4 flex items-center gap-2">
                        <div className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                          /{collection.slug}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5 text-sm">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition-colors group-hover:bg-blue-50">
                          <Grid3x3 className="h-4 w-4 text-slate-500 transition-colors group-hover:text-blue-600" />
                        </div>
                        <span className="font-semibold text-slate-900">
                          {collection.all_fields?.length || 0}
                        </span>
                        <span className="text-slate-500">fields</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-sm">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 transition-colors group-hover:bg-blue-50">
                          <Calendar className="h-4 w-4 text-slate-500 transition-colors group-hover:text-blue-600" />
                        </div>
                        <span className="text-slate-500">Updated</span>
                        <span className="font-semibold text-slate-900">
                          {new Date(collection.updated_at).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Arrow Icon */}
                    <div className="absolute right-0 bottom-0">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 transition-all duration-300 group-hover:bg-blue-600 group-hover:shadow-lg">
                        <ArrowUpRight className="h-5 w-5 text-slate-600 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
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
              <AlertDialogTitle className="text-xl font-bold">
                Delete Collection
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-600">
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
