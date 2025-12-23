"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  Search,
  Layout,
  FileText,
  Image as ImageIcon,
  Users,
  Calendar,
  ShoppingBag,
  PenTool,
  Briefcase,
  Tag,
  Megaphone,
  LayoutTemplate,
  MessageCircle,
  Star,
  BookOpen,
  ArrowUpRight,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  useCollections,
  useDeleteCollection,
} from "@/hooks/owner-site/admin/use-collections";
import { CreateCollectionDialog } from "./create-collection-dialog";
import { toast } from "sonner";

// Smart mapping for Canva-like card styles
const getCollectionStyle = (name: string) => {
  const lower = name.toLowerCase();

  // Returns: bg (for container), color (for icon)
  if (
    lower.includes("blog") ||
    lower.includes("post") ||
    lower.includes("article")
  ) {
    return {
      bg: "bg-orange-50",
      color: "text-orange-600",
      shadowColor: "hover:border-orange-200",
      icon: PenTool,
    };
  }
  if (
    lower.includes("case") ||
    lower.includes("study") ||
    lower.includes("portfolio")
  ) {
    return {
      bg: "bg-blue-50",
      color: "text-blue-600",
      shadowColor: "hover:border-blue-200",
      icon: Briefcase,
    };
  }
  if (
    lower.includes("team") ||
    lower.includes("member") ||
    lower.includes("user") ||
    lower.includes("staff")
  ) {
    return {
      bg: "bg-cyan-50",
      color: "text-cyan-600",
      shadowColor: "hover:border-cyan-200",
      icon: Users,
    };
  }
  if (
    lower.includes("product") ||
    lower.includes("shop") ||
    lower.includes("store") ||
    lower.includes("item")
  ) {
    return {
      bg: "bg-emerald-50",
      color: "text-emerald-600",
      shadowColor: "hover:border-emerald-200",
      icon: ShoppingBag,
    };
  }
  if (
    lower.includes("event") ||
    lower.includes("date") ||
    lower.includes("schedule")
  ) {
    return {
      bg: "bg-rose-50",
      color: "text-rose-600",
      shadowColor: "hover:border-rose-200",
      icon: Calendar,
    };
  }
  if (
    lower.includes("image") ||
    lower.includes("photo") ||
    lower.includes("gallery") ||
    lower.includes("media")
  ) {
    return {
      bg: "bg-purple-50",
      color: "text-purple-600",
      shadowColor: "hover:border-purple-200",
      icon: ImageIcon,
    };
  }
  if (
    lower.includes("category") ||
    lower.includes("tag") ||
    lower.includes("meta")
  ) {
    return {
      bg: "bg-amber-50",
      color: "text-amber-600",
      shadowColor: "hover:border-amber-200",
      icon: Tag,
    };
  }
  if (
    lower.includes("review") ||
    lower.includes("testimonial") ||
    lower.includes("feedback")
  ) {
    return {
      bg: "bg-pink-50",
      color: "text-pink-600",
      shadowColor: "hover:border-pink-200",
      icon: MessageCircle,
    };
  }
  if (lower.includes("service") || lower.includes("offer")) {
    return {
      bg: "bg-indigo-50",
      color: "text-indigo-600",
      shadowColor: "hover:border-indigo-200",
      icon: Star,
    };
  }
  if (
    lower.includes("promotion") ||
    lower.includes("ad") ||
    lower.includes("campaign")
  ) {
    return {
      bg: "bg-red-50",
      color: "text-red-600",
      shadowColor: "hover:border-red-200",
      icon: Megaphone,
    };
  }

  // Fallback
  const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const fallbacks = [
    {
      bg: "bg-slate-50",
      color: "text-slate-600",
      shadowColor: "hover:border-slate-300",
      icon: LayoutTemplate,
    },
    {
      bg: "bg-violet-50",
      color: "text-violet-600",
      shadowColor: "hover:border-violet-200",
      icon: FileText,
    },
    {
      bg: "bg-lime-50",
      color: "text-lime-600",
      shadowColor: "hover:border-lime-200",
      icon: Layout,
    },
  ];
  return fallbacks[sum % fallbacks.length];
};

export function CollectionsList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Real Data Hooks
  const { data: collections, isLoading } = useCollections();
  const deleteCollectionMutation = useDeleteCollection();

  const filteredCollections =
    collections?.filter(
      c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.slug.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const handleDelete = async () => {
    if (!deleteId) return;

    // Find the collection slug to delete based on ID since mutation takes slug
    const collection = collections?.find(c => String(c.id) === deleteId);
    if (!collection) return;

    try {
      await deleteCollectionMutation.mutateAsync(collection.slug);
      toast.success("Collection deleted successfully");
      setDeleteId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white p-8 sm:p-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 space-y-3">
            <div className="h-9 w-56 animate-pulse rounded-lg bg-slate-200/70" />
            <div className="h-6 w-80 animate-pulse rounded-lg bg-slate-200/50" />
          </div>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-11 w-72 animate-pulse rounded-xl bg-slate-200/70" />
            <div className="h-11 w-40 animate-pulse rounded-xl bg-slate-200/70" />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className="h-[140px] animate-pulse rounded-2xl bg-slate-200/50"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in min-h-screen bg-white p-8 duration-700 sm:p-12">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="mb-12 space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Collections
          </h1>
          <p className="max-w-2xl text-lg text-slate-500">
            Structure and manage your dynamic content.{" "}
            <span className="font-semibold text-slate-700">
              {collections?.length || 0}
            </span>{" "}
            collection{collections?.length !== 1 ? "s" : ""} available.
          </p>
        </div>

        {/* Search and Create */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="group relative w-full sm:w-80">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-black/40" />
            <Input
              placeholder="Search collections..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-11 rounded-xl bg-black/5 pl-12 text-sm transition-all placeholder:text-black/40 focus:bg-white focus:shadow-sm focus:outline-none"
            />
          </div>

          <Button
            size="lg"
            onClick={() => setShowCreateDialog(true)}
            className="h-11 rounded-xl bg-slate-900 px-6 font-semibold text-white transition-all hover:bg-slate-800"
          >
            <Plus className="mr-2 h-5 w-5" />
            New Collection
          </Button>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* Empty State - No search results */}
          {filteredCollections.length === 0 && searchQuery && (
            <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-16 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white">
                  <Search className="h-7 w-7 text-slate-400" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                No collections found
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                No results for &quot;{searchQuery}&quot;. Try a different search
                term.
              </p>
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="mt-6 rounded-xl"
              >
                Clear Search
              </Button>
            </div>
          )}

          {/* Empty State - No collections at all */}
          {filteredCollections.length === 0 && !searchQuery && (
            <div className="col-span-full rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-20 text-center">
              <div className="mb-5 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white">
                  <BookOpen
                    className="h-8 w-8 text-slate-600"
                    strokeWidth={2}
                  />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                No collections yet
              </h3>
              <p className="mt-2 text-base text-slate-600">
                Create your first collection to start organizing your content.
              </p>
              <Button
                size="lg"
                onClick={() => setShowCreateDialog(true)}
                className="mt-6 rounded-xl bg-slate-900 hover:bg-slate-800"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Collection
              </Button>
            </div>
          )}

          {/* Collection Cards */}
          {filteredCollections.map((collection, idx) => {
            const style = getCollectionStyle(collection.name);
            const Icon = style.icon;

            return (
              <div
                key={collection.id}
                onClick={() =>
                  router.push(`/admin/collections/${collection.slug}`)
                }
                className="group relative block cursor-pointer outline-none"
                style={{
                  animationDelay: `${idx * 75}ms`,
                }}
              >
                <div
                  className={cn(
                    "relative h-full overflow-hidden rounded-2xl border border-transparent p-7 transition-all duration-500 ease-out hover:-translate-y-1.5",
                    style.bg,
                    style.shadowColor
                  )}
                >
                  {/* Action Buttons */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-2 opacity-0 transition-all group-hover:opacity-100">
                    <button
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white/50 text-slate-600 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-blue-600"
                      onClick={e => {
                        e.stopPropagation();
                        router.push(
                          `/admin/collections/${collection.slug}/edit`
                        );
                      }}
                      title="Edit collection"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white/50 text-slate-600 shadow-sm backdrop-blur-sm transition-all hover:bg-white hover:text-red-600"
                      onClick={e => {
                        e.stopPropagation();
                        setDeleteId(String(collection.id));
                      }}
                      title="Delete collection"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-1 flex-col gap-1">
                      <h3 className="line-clamp-2 text-xl font-bold text-slate-800 transition-colors group-hover:text-slate-900">
                        {collection.name}
                      </h3>
                      <p className="text-sm font-medium text-slate-500 transition-colors group-hover:text-slate-600">
                        {collection.all_fields?.length || 0} field
                        {collection.all_fields?.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={!!deleteId}
          onOpenChange={open => !open && setDeleteId(null)}
        >
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Delete Collection?
              </DialogTitle>
              <DialogDescription className="text-base text-slate-600">
                This action cannot be undone. This will permanently delete the
                collection and all its data.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setDeleteId(null)}
                className="cursor-pointer rounded-xl"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="cursor-pointer rounded-xl"
                disabled={deleteCollectionMutation.isPending}
              >
                {deleteCollectionMutation.isPending
                  ? "Deleting..."
                  : "Delete Collection"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Collection Dialog */}
        <CreateCollectionDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
        />
      </div>
    </div>
  );
}
