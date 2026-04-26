"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  usePricingMetrics,
  useCreatePricingMetric,
  useUpdatePricingMetric,
  useDeletePricingMetric,
} from "@/hooks/owner-site/admin/use-pricing-metric";
import { Plus, Edit, Trash2, Search, X, Scale } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDebouncedCallback } from "use-debounce";
import { PricingMetric } from "@/types/owner-site/admin/pricing-metric";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

export const MetricList = () => {
  const [search, setSearch] = useState("");
  const [deleteMetric, setDeleteMetric] = useState<PricingMetric | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentMetric, setCurrentMetric] =
    useState<Partial<PricingMetric> | null>(null);

  // Debounced search
  const debouncedSearch = useDebouncedCallback(value => {
    setSearch(value);
  }, 500);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
  };

  const { data, isLoading, error } = usePricingMetrics({
    search,
  });

  const createMutation = useCreatePricingMetric();
  const updateMutation = useUpdatePricingMetric();
  const deleteMutation = useDeletePricingMetric();

  const handleDelete = (metric: PricingMetric) => {
    setDeleteMetric(metric);
  };

  const confirmDelete = async () => {
    if (deleteMetric) {
      try {
        await deleteMutation.mutateAsync(deleteMetric.id);
        setDeleteMetric(null);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleAdd = () => {
    setCurrentMetric({ name: "", price_per_unit: "", unit: "" });
    setIsEditDialogOpen(true);
  };

  const handleEdit = (metric: PricingMetric) => {
    setCurrentMetric(metric);
    setIsEditDialogOpen(true);
  };

  const handleSave = async () => {
    if (
      !currentMetric?.name ||
      !currentMetric?.price_per_unit ||
      !currentMetric?.unit
    ) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      if (currentMetric.id) {
        await updateMutation.mutateAsync({
          id: currentMetric.id,
          data: {
            name: currentMetric.name,
            price_per_unit: currentMetric.price_per_unit,
            unit: currentMetric.unit,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: currentMetric.name,
          price_per_unit: currentMetric.price_per_unit,
          unit: currentMetric.unit,
        });
      }
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const metrics = data?.results || [];

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">
            {error instanceof Error ? error.message : "Failed to load metrics"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-7xl px-6 md:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-[#003d79]" />
            <h1 className="text-xl font-bold text-[#003d79]">
              Pricing Metrics
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={handleAdd}
              className="h-9 rounded-lg bg-slate-900 px-4 font-semibold text-white transition-all hover:bg-slate-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Metric
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search metrics..."
              value={searchInput}
              onChange={handleSearchChange}
              className="focus:-sm placeholder: text-gray-500focus:bg-white h-9 bg-black/5 pl-9 text-sm focus:outline-none"
            />
            {searchInput && (
              <button
                onClick={clearSearch}
                className="text-gray-500hover:text-black/60 absolute top-1/2 right-3 -translate-y-1/2"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <Card className="-sm overflow-hidden border-black/5">
          <Table>
            <TableHeader className="bg-black/2">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[300px] text-xs font-semibold text-gray-500">
                  Name
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500">
                  Price Per Unit
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500">
                  Unit
                </TableHead>
                <TableHead className="text-xs font-semibold text-gray-500">
                  Last Updated
                </TableHead>
                <TableHead className="w-[100px] text-right text-xs font-semibold text-gray-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-5 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="ml-auto h-8 w-20" />
                    </TableCell>
                  </TableRow>
                ))
              ) : metrics.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-gray-500"
                  >
                    No metrics found.
                  </TableCell>
                </TableRow>
              ) : (
                metrics.map(metric => (
                  <TableRow
                    key={metric.id}
                    className="group cursor-pointer hover:bg-black/1"
                    onClick={() => handleEdit(metric)}
                  >
                    <TableCell className="font-medium text-black">
                      {metric.name}
                    </TableCell>
                    <TableCell className="text-black/60">
                      {Number(metric.price_per_unit).toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell className="text-black/60">
                      {metric.unit}
                    </TableCell>
                    <TableCell className="text-xs text-black/60">
                      {new Date(metric.last_updated).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={e => {
                            e.stopPropagation();
                            handleEdit(metric);
                          }}
                          className="h-8 w-8 text-gray-500 hover:bg-black/5 hover:text-black"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={e => {
                            e.stopPropagation();
                            handleDelete(metric);
                          }}
                          className="h-8 w-8 text-gray-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentMetric?.id ? "Edit Metric" : "Add New Metric"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={currentMetric?.name || ""}
                onChange={e =>
                  setCurrentMetric({ ...currentMetric, name: e.target.value })
                }
                className="placeholder:text-gray-400"
                placeholder="e.g. Gold 24K"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price Per Unit</Label>
              <Input
                id="price"
                type="number"
                value={currentMetric?.price_per_unit || ""}
                onChange={e =>
                  setCurrentMetric({
                    ...currentMetric,
                    price_per_unit: e.target.value,
                  })
                }
                className="placeholder:text-gray-400"
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="unit">Unit</Label>
              <Input
                id="unit"
                value={currentMetric?.unit || ""}
                onChange={e =>
                  setCurrentMetric({ ...currentMetric, unit: e.target.value })
                }
                className="placeholder:text-gray-400"
                placeholder="e.g. gram, carat"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {currentMetric?.id ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteMetric}
        onOpenChange={open => !open && setDeleteMetric(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              pricing metric "{deleteMetric?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
