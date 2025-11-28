import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ProductsData } from "@/types/owner-site/components/products";
import { useCategories } from "@/hooks/owner-site/admin/use-category";
import { useSubCategories } from "@/hooks/owner-site/admin/use-subcategory";

interface ProductsFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSelection: Partial<ProductsData>;
  onSave: (newSelection: Partial<ProductsData>) => void;
}

export const ProductsFilterDialog: React.FC<ProductsFilterDialogProps> = ({
  open,
  onOpenChange,
  currentSelection,
  onSave,
}) => {
  const [selectionType, setSelectionType] = useState<
    "all" | "featured" | "popular" | "category" | "subcategory" | "custom"
  >("all");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [subCategoryId, setSubCategoryId] = useState<number | undefined>(
    undefined
  );
  const [limit, setLimit] = useState<number>(8);

  // Fetch categories and subcategories
  const { data: categoriesData } = useCategories({ page_size: 100 });
  const { data: subCategoriesData } = useSubCategories({ page_size: 100 });

  const categories = categoriesData?.results || [];
  const subCategories = subCategoriesData?.results || [];

  // Initialize state from currentSelection when dialog opens
  useEffect(() => {
    if (open) {
      setCategoryId(currentSelection.categoryId);
      setSubCategoryId(currentSelection.subCategoryId);
    }
  }, [open, currentSelection]);

  const handleSave = () => {
    onSave({
      categoryId: selectionType === "category" ? categoryId : undefined,
      subCategoryId:
        selectionType === "subcategory" ? subCategoryId : undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filter Products</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="selection-type">Show Products</Label>
            <Select
              value={selectionType}
              //   eslint-disable-next-line @typescript-eslint/no-explicit-any
              onValueChange={(value: any) => setSelectionType(value)}
            >
              <SelectTrigger id="selection-type">
                <SelectValue placeholder="Select what to show" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="featured">Featured Products</SelectItem>
                <SelectItem value="popular">Popular Products</SelectItem>
                <SelectItem value="category">By Category</SelectItem>
                <SelectItem value="subcategory">By Sub-category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectionType === "category" && (
            <div className="grid gap-2">
              <Label htmlFor="category">Select Category</Label>
              <Select
                value={categoryId?.toString()}
                onValueChange={value => setCategoryId(parseInt(value))}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectionType === "subcategory" && (
            <div className="grid gap-2">
              <Label htmlFor="subcategory">Select Sub-category</Label>
              <Select
                value={subCategoryId?.toString()}
                onValueChange={value => setSubCategoryId(parseInt(value))}
              >
                <SelectTrigger id="subcategory">
                  <SelectValue placeholder="Select a sub-category" />
                </SelectTrigger>
                <SelectContent>
                  {subCategories.map(subCategory => (
                    <SelectItem
                      key={subCategory.id}
                      value={subCategory.id.toString()}
                    >
                      {subCategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="limit">Number of Products</Label>
            <Input
              id="limit"
              type="number"
              min={1}
              max={50}
              value={limit}
              onChange={e => setLimit(parseInt(e.target.value) || 8)}
              placeholder="Enter number of products to show"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
