import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  Package,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
}) => {
  const [optionForms, setOptionForms] = useState<OptionFormData[]>([]);
  const [groupBy, setGroupBy] = useState<string>("");
  const [groupImages, setGroupImages] = useState<
    Record<string, File | string | null>
  >({});

  // Generate variants when options change
  useEffect(() => {
    if (options.length > 0) {
      generateVariants();
    } else {
      // Clear variants if no options exist
      onVariantsChange([]);
    }
  }, [options]);

  const generateVariants = () => {
    if (options.length === 0) {
      onVariantsChange([]);
      return;
    }

    const cartesianProduct = (arrays: string[][]): string[][] => {
      return arrays.reduce(
        (acc, curr) => acc.flatMap(a => curr.map(b => [...a, b])),
        [[]] as string[][]
      );
    };

    const optionValueArrays = options.map(opt => opt.values.map(v => v.value));
    const combinations = cartesianProduct(optionValueArrays);

    const newVariants: Variant[] = combinations.map((combo, index) => {
      const variantOptions: Record<string, string> = {};
      options.forEach((opt, i) => {
        variantOptions[opt.name] = combo[i];
      });

      // Check if variant already exists
      const existing = variants.find(
        v => JSON.stringify(v.options) === JSON.stringify(variantOptions)
      );

      return (
        existing || {
          id: `variant-${Date.now()}-${index}`,
          options: variantOptions,
          price: "0.00",
          stock: 0,
          image: null,
        }
      );
    });

    onVariantsChange(newVariants);
  };

  const handleAddOptionForm = () => {
    const newForm: OptionFormData = {
      id: Date.now().toString(),
      name: "",
      values: [{ id: Date.now().toString(), value: "" }],
      editingOption: null,
    };
    setOptionForms([...optionForms, newForm]);
  };

  const handleSaveOption = (formId: string) => {
    const form = optionForms.find(f => f.id === formId);
    if (!form) return;

    const validValues = form.values.filter(v => v.value.trim() !== "");

    if (!form.name.trim() || validValues.length === 0) {
      return;
    }

    if (form.editingOption) {
      const updatedOptions = options.map(opt =>
        opt.id === form.editingOption!.id
          ? { ...opt, name: form.name, values: validValues }
          : opt
      );
      onOptionsChange(updatedOptions);
    } else {
      const newOption: ProductOption = {
        id: Date.now().toString(),
        name: form.name,
        values: validValues,
      };
      onOptionsChange([...options, newOption]);
    }

    // Remove the form after saving
    setOptionForms(optionForms.filter(f => f.id !== formId));
  };

  const handleCancelOption = (formId: string) => {
    setOptionForms(optionForms.filter(f => f.id !== formId));
  };

  const handleDeleteOption = (optionId: string) => {
    onOptionsChange(options.filter(opt => opt.id !== optionId));
  };

  const handleAddOptionValue = (formId: string) => {
    setOptionForms(
      optionForms.map(form =>
        form.id === formId
          ? {
              ...form,
              values: [
                ...form.values,
                { id: Date.now().toString(), value: "" },
              ],
            }
          : form
      )
    );
  };

  const handleOptionNameChange = (formId: string, name: string) => {
    setOptionForms(
      optionForms.map(form => (form.id === formId ? { ...form, name } : form))
    );
  };

  const handleOptionValueChange = (
    formId: string,
    valueId: string,
    value: string
  ) => {
    setOptionForms(
      optionForms.map(form =>
        form.id === formId
          ? {
              ...form,
              values: form.values.map(ov =>
                ov.id === valueId ? { ...ov, value } : ov
              ),
            }
          : form
      )
    );
  };

  const handleRemoveOptionValue = (formId: string, valueId: string) => {
    setOptionForms(
      optionForms.map(form =>
        form.id === formId
          ? {
              ...form,
              values: form.values.filter(ov => ov.id !== valueId),
            }
          : form
      )
    );
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
      variants.map(v => (v.id === variantId ? { ...v, image: file } : v))
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
    if (groupBy && options.length > 0) {
      const grouped = getGroupedVariants() as Record<string, Variant[]>;
      return Object.entries(grouped).map(([groupName, groupVariants]) => (
        <div key={groupName} className="space-y-2">
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium">{groupName}</h4>
                <p className="text-xs text-gray-500">
                  {groupVariants.length} variants
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    handleGroupImageChange(groupName, file || null);
                  }}
                  className="hidden"
                  id={`group-image-${groupName}`}
                />
                <label
                  htmlFor={`group-image-${groupName}`}
                  className="cursor-pointer text-xs text-blue-600 hover:text-blue-700"
                >
                  {groupImages[groupName]
                    ? "Change group image"
                    : "Add group image"}
                </label>
                {groupImages[groupName] && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGroupImageChange(groupName, null)}
                    className="h-6 text-xs text-red-600"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>
            {groupImages[groupName] && (
              <div className="mt-2 flex items-center gap-2">
                <img
                  src={
                    typeof groupImages[groupName] === "string"
                      ? groupImages[groupName]
                      : URL.createObjectURL(groupImages[groupName] as File)
                  }
                  alt={`${groupName} group`}
                  className="h-8 w-8 rounded object-cover"
                />
                <span className="text-xs text-gray-600">
                  Group image applied to all variants
                </span>
              </div>
            )}
          </div>
          {groupVariants.map(variant => renderVariantRow(variant, true))}
        </div>
      ));
    }

    return variants.map(variant => renderVariantRow(variant, false));
  };

  const renderVariantRow = (variant: Variant, isGrouped: boolean) => {
    const variantLabel = Object.entries(variant.options)
      .filter(([key]) => !groupBy || key !== groupBy)
      .map(([, value]) => value)
      .join(" / ");

    const isAvailable = trackStock ? variant.stock > 0 : true;

    // Check if this variant's group has a group image
    const groupImage = groupBy ? groupImages[variant.options[groupBy]] : null;

    return (
      <div
        key={variant.id}
        className={`flex items-center gap-4 rounded-lg border p-3 ${
          isGrouped ? "ml-4 bg-white" : "bg-gray-50"
        }`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            {variant.image ? (
              <img
                src={
                  typeof variant.image === "string"
                    ? variant.image
                    : URL.createObjectURL(variant.image)
                }
                alt={variantLabel}
                className="h-10 w-10 rounded object-cover"
              />
            ) : groupImage ? (
              <div className="relative">
                <img
                  src={
                    typeof groupImage === "string"
                      ? groupImage
                      : URL.createObjectURL(groupImage)
                  }
                  alt={variantLabel}
                  className="h-10 w-10 rounded object-cover"
                />
                <div className="absolute -top-1 -right-1 rounded-full bg-blue-500 px-1 text-xs text-white">
                  G
                </div>
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-200">
                <ImageIcon className="h-5 w-5 text-gray-400" />
              </div>
            )}
            <div>
              <span className="truncate text-sm font-medium">
                {variantLabel}
              </span>
              {trackStock && (
                <p className="text-xs text-gray-500">
                  {isAvailable ? (
                    <span className="text-green-600">
                      Available ({variant.stock})
                    </span>
                  ) : (
                    <span className="text-red-600">Out of stock</span>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-32">
            <Input
              type="file"
              accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0];
                handleVariantImageChange(variant.id, file || null);
              }}
              className="hidden"
              id={`image-${variant.id}`}
            />
            <label
              htmlFor={`image-${variant.id}`}
              className="cursor-pointer text-xs text-blue-600 hover:text-blue-700"
            >
              {variant.image
                ? "Change image"
                : groupImage
                  ? "Override image"
                  : "Add image"}
            </label>
            {variant.image && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleVariantImageChange(variant.id, null)}
                className="mt-1 h-6 text-xs text-red-600"
              >
                Remove
              </Button>
            )}
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

          {trackStock && (
            <div className="w-24">
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
          )}
        </div>
      </div>
    );
  };

  const renderOptionForm = (form: OptionFormData) => (
    <Card key={form.id} className="mb-4 space-y-4 p-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 space-y-3">
          <div>
            <Label className="text-sm">Option name</Label>
            <Input
              placeholder="e.g., Size, Color, Material"
              value={form.name}
              onChange={e => handleOptionNameChange(form.id, e.target.value)}
              className="mt-1 placeholder:text-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Option values</Label>
            {form.values.map((ov, index) => (
              <div key={ov.id} className="flex items-center gap-2">
                <Input
                  placeholder={`Value ${index + 1}`}
                  value={ov.value}
                  onChange={e =>
                    handleOptionValueChange(form.id, ov.id, e.target.value)
                  }
                  className="mt-1 placeholder:text-gray-500"
                />
                {form.values.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveOptionValue(form.id, ov.id)}
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
              onClick={() => handleAddOptionValue(form.id)}
              className="text-primary hover:text-primary/90"
            >
              Add another value
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-between border-t pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleCancelOption(form.id)}
        >
          Cancel
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => handleSaveOption(form.id)}
          className="bg-gray-900 hover:bg-gray-800"
        >
          Done
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 border-b pb-2">
        <Package className="text-muted-foreground h-5 w-5" />
        <h3 className="text-lg font-semibold">Inventory & Variants</h3>
      </div>

      {/* Track Stock Toggle - Independent of variant options */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <Label className="text-sm font-medium">Track Inventory</Label>
          <p className="mt-1 text-xs text-gray-500">
            Enable stock tracking to show availability status
          </p>
        </div>
        <Switch checked={trackStock} onCheckedChange={onTrackStockChange} />
      </div>

      {/* Variants Section - Always available, independent of track stock */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-sm font-medium">Product Variants</Label>
            <div
              onClick={handleAddOptionForm}
              className="mt-3 flex cursor-pointer items-center gap-1 text-xs text-gray-500 hover:underline"
            >
              <PlusCircle className="h-3 w-4" />
              <span>Add options like size, color, or material</span>
            </div>
          </div>
        </div>

        {/* Render all active option forms */}
        {optionForms.map(renderOptionForm)}

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

        {/* Add Another Option Button - Show when there are active forms */}
        {optionForms.length > 0 && (
          <div
            onClick={handleAddOptionForm}
            className="flex cursor-pointer items-center gap-1 text-xs text-gray-700 hover:underline"
          >
            <PlusCircle className="h-3 w-4" />
            <span>Add another option</span>
          </div>
        )}

        {/* Variants List */}
        {variants.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                Variants ({variants.length})
              </Label>
              {options.length > 0 && (
                <Select value={groupBy} onValueChange={setGroupBy}>
                  <SelectTrigger className="h-9 w-40">
                    <SelectValue placeholder="Group by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No grouping</SelectItem>
                    {options.map(opt => (
                      <SelectItem key={opt.id} value={opt.name}>
                        {opt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2 rounded-lg border p-4">
              <div className="flex items-center gap-4 border-b px-3 pb-2 text-xs font-medium text-gray-500">
                <div className="w-6"></div>
                <div className="flex-1">Variant</div>
                <div className="w-32">Image</div>
                <div className="w-32">Price</div>
                {trackStock && <div className="w-24">Stock</div>}
              </div>

              <div className="space-y-2">{renderVariantsList()}</div>

              {trackStock && (
                <div className="border-t pt-4">
                  <p className="text-sm text-gray-600">
                    Total inventory:{" "}
                    <span className="font-medium">
                      {variants.reduce((sum, v) => sum + v.stock, 0)} available
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryVariants;
