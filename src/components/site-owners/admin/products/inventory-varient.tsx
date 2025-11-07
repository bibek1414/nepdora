import React, { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
} from "@/components/ui/alert-dialog";

interface OptionValue {
  id: string;
  value: string;
}

interface ProductOption {
  id: string;
  name: string;
  values: OptionValue[];
}

interface Variant {
  id: string;
  options: Record<string, string>;
  price: string;
  stock: number;
  image: File | string | null;
}

interface InventoryVariantsProps {
  trackStock: boolean;
  onTrackStockChange: (value: boolean) => void;
  variants: Variant[];
  onVariantsChange: (variants: Variant[]) => void;
  options: ProductOption[];
  onOptionsChange: (options: ProductOption[]) => void;
  isEditing?: boolean;
  productStock?: number; // Single stock value when trackStock is false
  onProductStockChange?: (stock: number) => void; // Callback for single stock value
}

interface OptionFormData {
  id: string;
  name: string;
  values: OptionValue[];
  editingOption: ProductOption | null;
}

const InventoryVariants: React.FC<InventoryVariantsProps> = ({
  trackStock,
  onTrackStockChange,
  variants,
  onVariantsChange,
  options,
  onOptionsChange,
  isEditing = false,
  productStock = 0,
  onProductStockChange,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentForm, setCurrentForm] = useState<OptionFormData | null>(null);
  const [deleteOptionId, setDeleteOptionId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [groupBy, setGroupBy] = useState<string>("");
  const [groupImages, setGroupImages] = useState<
    Record<string, File | string | null>
  >({});

  useEffect(() => {
    generateVariants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  const generateVariants = () => {
    if (options.length === 0) {
      onVariantsChange([]);
      return;
    }

    const cartesianProduct = (arrays: string[][]): string[][] => {
      if (arrays.length === 0) return [];
      return arrays.reduce(
        (acc, curr) => acc.flatMap(a => curr.map(b => [...a, b])),
        [[]] as string[][]
      );
    };

    // Get current option names set for quick lookup
    const currentOptionNames = new Set(options.map(opt => opt.name));

    // Filter out variants that reference deleted options before processing
    const validVariants = variants.filter(v => {
      const variantOptionNames = Object.keys(v.options);
      // Only keep variants where all option names still exist
      return variantOptionNames.every(name => currentOptionNames.has(name));
    });

    const optionValueArrays = options.map(opt => opt.values.map(v => v.value));
    const combinations = cartesianProduct(optionValueArrays);

    const newVariants: Variant[] = combinations.map((combo, index) => {
      const variantOptions: Record<string, string> = {};
      options.forEach((opt, i) => {
        variantOptions[opt.name] = combo[i];
      });

      // Find existing variant with the exact same options (only from valid variants)
      const existingVariant = validVariants.find(v => {
        const existingOptions = Object.entries(v.options).sort();
        const newOptions = Object.entries(variantOptions).sort();
        return JSON.stringify(existingOptions) === JSON.stringify(newOptions);
      });

      if (existingVariant) {
        // Preserve ALL existing variant data including price, stock, and image
        return {
          ...existingVariant,
          options: variantOptions, // Use the new options structure but keep all other data
        };
      }

      // Create new variant only if it doesn't exist
      return {
        id: `variant-${Date.now()}-${index}`,
        options: variantOptions,
        price: validVariants.length > 0 ? validVariants[0].price : "0.00",
        stock: trackStock ? 0 : productStock,
        image: null,
      };
    });

    onVariantsChange(newVariants);
  };

  const handleOpenDialog = (optionName?: string) => {
    const newForm: OptionFormData = {
      id: Date.now().toString(),
      name: optionName || "",
      values: [{ id: Date.now().toString(), value: "" }],
      editingOption: null,
    };
    setCurrentForm(newForm);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentForm(null);
  };

  const handleSaveOption = () => {
    if (!currentForm) return;

    const validValues = currentForm.values.filter(v => v.value.trim() !== "");

    if (!currentForm.name.trim() || validValues.length === 0) {
      return;
    }

    if (currentForm.editingOption) {
      const updatedOptions = options.map(opt =>
        opt.id === currentForm.editingOption!.id
          ? { ...opt, name: currentForm.name, values: validValues }
          : opt
      );
      onOptionsChange(updatedOptions);
    } else {
      const newOption: ProductOption = {
        id: Date.now().toString(),
        name: currentForm.name,
        values: validValues,
      };
      onOptionsChange([...options, newOption]);
    }

    handleCloseDialog();
  };

  const handleDeleteOption = (optionId: string) => {
    setDeleteOptionId(optionId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteOptionId) {
      onOptionsChange(options.filter(opt => opt.id !== deleteOptionId));
      setDeleteOptionId(null);
    }
    setIsDeleteDialogOpen(false);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeleteOptionId(null);
  };

  const handleAddOptionValue = () => {
    if (!currentForm) return;
    setCurrentForm({
      ...currentForm,
      values: [...currentForm.values, { id: Date.now().toString(), value: "" }],
    });
  };

  const handleOptionNameChange = (name: string) => {
    if (!currentForm) return;
    setCurrentForm({ ...currentForm, name });
  };

  const handleOptionValueChange = (valueId: string, value: string) => {
    if (!currentForm) return;
    setCurrentForm({
      ...currentForm,
      values: currentForm.values.map(ov =>
        ov.id === valueId ? { ...ov, value } : ov
      ),
    });
  };

  const handleRemoveOptionValue = (valueId: string) => {
    if (!currentForm) return;
    if (currentForm.values.length <= 1) return; // Keep at least one value
    setCurrentForm({
      ...currentForm,
      values: currentForm.values.filter(ov => ov.id !== valueId),
    });
  };

  const handleVariantChange = (
    variantId: string,
    field: "price" | "stock",
    value: string | number
  ) => {
    onVariantsChange(
      variants.map(v =>
        v.id === variantId
          ? { ...v, [field]: field === "stock" ? Number(value) : value }
          : v
      )
    );
  };

  const handleVariantImageChange = (variantId: string, file: File | null) => {
    onVariantsChange(
      variants.map(v => {
        if (v.id === variantId) {
          // If file is null, check if there was an existing URL
          // If so, keep it; otherwise set to null
          if (file === null) {
            // User clicked "Remove" - set to null
            return { ...v, image: null };
          }
          // New file selected
          return { ...v, image: file };
        }
        return v;
      })
    );
  };

  const handleGroupImageChange = (groupName: string, file: File | null) => {
    // Update group image state
    setGroupImages(prev => ({
      ...prev,
      [groupName]: file,
    }));

    // Apply image to all variants in this group
    if (file) {
      const updatedVariants = variants.map(variant => {
        if (variant.options[groupBy] === groupName) {
          return { ...variant, image: file };
        }
        return variant;
      });
      onVariantsChange(updatedVariants);
    }
  };

  const getGroupedVariants = () => {
    if (!groupBy || options.length === 0) {
      return variants;
    }

    const groups: Record<string, Variant[]> = {};
    variants.forEach(variant => {
      const groupValue = variant.options[groupBy] || "Other";
      if (!groups[groupValue]) {
        groups[groupValue] = [];
      }
      groups[groupValue].push(variant);
    });

    return groups;
  };

  const renderVariantsList = () => {
    return variants.map(variant => renderVariantRow(variant, false));
  };

  const renderVariantRow = (variant: Variant, isGrouped: boolean) => {
    const optionNames = Object.keys(variant.options);
    const optionValues = Object.values(variant.options);

    return (
      <div
        key={variant.id}
        className={`flex items-center gap-4 px-4 py-3 ${
          isGrouped ? "bg-white" : ""
        }`}
      >
        <div className="w-12 text-sm text-gray-600">
          {optionNames.length > 0 ? optionNames[0] : ""}
        </div>
        <div className="flex-1">
          <Input
            type="text"
            value={optionValues.length > 0 ? optionValues[0] : ""}
            onChange={e => {
              const newOptions = { ...variant.options };
              if (optionNames.length > 0) {
                newOptions[optionNames[0]] = e.target.value;
              }
              onVariantsChange(
                variants.map(v =>
                  v.id === variant.id ? { ...v, options: newOptions } : v
                )
              );
            }}
            className="h-9"
            placeholder="Value"
          />
        </div>
        {/* Image upload (optional) - minimal UI, no header change */}
        <div className="flex w-28 items-center gap-2">
          {variant.image ? (
            typeof variant.image === "string" ? (
              <img
                src={variant.image}
                alt="variant"
                className="h-8 w-8 rounded object-cover"
              />
            ) : (
              <img
                src={URL.createObjectURL(variant.image)}
                alt="variant"
                className="h-8 w-8 rounded object-cover"
              />
            )
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-200">
              <ImageIcon className="h-4 w-4 text-gray-400" />
            </div>
          )}
          <div>
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              id={`variant-image-${variant.id}`}
              onChange={e => {
                const file = e.target.files?.[0] || null;
                handleVariantImageChange(variant.id, file);
              }}
            />
            <label
              htmlFor={`variant-image-${variant.id}`}
              className="cursor-pointer text-xs text-blue-600 hover:text-blue-700"
            >
              {variant.image ? "Change" : "Add"}
            </label>
            {variant.image && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleVariantImageChange(variant.id, null)}
                className="h-6 p-0 text-xs text-red-600"
              >
                Remove
              </Button>
            )}
          </div>
        </div>
        <div className="w-32">
          <Input
            type="number"
            placeholder="Stock"
            value={variant.stock}
            onChange={e =>
              handleVariantChange(variant.id, "stock", e.target.value)
            }
            className="h-9"
          />
        </div>
        <div className="w-32">
          <Input
            type="number"
            step="0.01"
            placeholder="Price"
            value={variant.price}
            onChange={e =>
              handleVariantChange(variant.id, "price", e.target.value)
            }
            className="h-9"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5 rounded-2xl border bg-white p-4">
      <div className="flex items-center gap-3">
        <h3 className="text-base font-semibold">Inventory</h3>
      </div>

      {/* Inventory Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Stock Quantity</Label>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-700">Track Inventory</span>
            <Switch checked={trackStock} onCheckedChange={onTrackStockChange} />
          </div>
        </div>
        <Input
          type="number"
          min="0"
          placeholder=""
          className="h-10 rounded-xl"
          value={productStock}
          onChange={e => onProductStockChange?.(parseInt(e.target.value) || 0)}
        />
      </div>

      {/* Variants Section */}
      <div className="space-y-3">
        <div>
          <Label className="text-sm font-semibold">Variants</Label>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenDialog("Size")}
              className="rounded-full border-blue-200 bg-blue-50 px-4 text-blue-600 hover:bg-blue-100"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Size Variants
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenDialog("Color")}
              className="rounded-full border-blue-200 bg-blue-50 px-4 text-blue-600 hover:bg-blue-100"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Color Variants
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenDialog()}
              className="rounded-full border-blue-200 bg-blue-50 px-4 text-blue-600 hover:bg-blue-100"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Custom Variants
            </Button>
          </div>
        </div>

        {/* Display Added Options */}
        {options.length > 0 && (
          <div className="space-y-2">
            {options.map(option => (
              <div
                key={option.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="text-sm font-medium">{option.name}</p>
                  <p className="text-xs text-gray-500">
                    {option.values.map(v => v.value).join(", ")}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteOption(option.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Variants List */}
        {variants.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border">
              <div className="flex items-center gap-3 border-b bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-900">
                <div className="w-20">Option</div>
                <div className="flex-1">Value</div>
                <div className="w-32">Stock (Optional)</div>
                <div className="w-32">Price (Optional)</div>
              </div>

              <div className="divide-y">{renderVariantsList()}</div>
            </div>
          </div>
        )}
      </div>

      {/* Add Variant Dialog */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={open => {
          if (!open) {
            handleCloseDialog();
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Variant Option</DialogTitle>
            <DialogDescription>
              Create a new variant option with multiple values.
            </DialogDescription>
          </DialogHeader>

          {currentForm && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="option-name">Option name</Label>
                <Input
                  id="option-name"
                  placeholder="e.g., Size, Color, Material"
                  value={currentForm.name}
                  onChange={e => handleOptionNameChange(e.target.value)}
                  className="placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label>Option values</Label>
                {currentForm.values.map((ov, index) => (
                  <div key={ov.id} className="flex items-center gap-2">
                    <Input
                      placeholder={`Value ${index + 1}`}
                      value={ov.value}
                      onChange={e =>
                        handleOptionValueChange(ov.id, e.target.value)
                      }
                      className="placeholder:text-gray-500"
                    />
                    {currentForm.values.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveOptionValue(ov.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleAddOptionValue}
                  className="text-primary hover:text-primary/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add another value
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveOption}
              className="bg-gray-900 hover:bg-gray-800"
            >
              Save Option
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Variant Option?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this variant option? This action
              cannot be undone and will remove all associated variants.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
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

export default InventoryVariants;
