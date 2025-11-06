import React, { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

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
  const [optionForms, setOptionForms] = useState<OptionFormData[]>([]);
  const [groupBy, setGroupBy] = useState<string>("");
  const [groupImages, setGroupImages] = useState<
    Record<string, File | string | null>
  >({});

  useEffect(() => {
    if (options.length > 0) {
      generateVariants();
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

      // Find existing variant with the exact same options
      const existingVariant = variants.find(v => {
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
        price: variants.length > 0 ? variants[0].price : "0.00", // Use existing price if available
        stock: trackStock ? 0 : productStock,
        image: null,
      };
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
              onClick={() => {
                const newForm: OptionFormData = {
                  id: Date.now().toString(),
                  name: "Size",
                  values: [{ id: Date.now().toString(), value: "" }],
                  editingOption: null,
                };
                setOptionForms([...optionForms, newForm]);
              }}
              className="rounded-full border-blue-200 bg-blue-50 px-4 text-blue-600 hover:bg-blue-100"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Size Variants
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const newForm: OptionFormData = {
                  id: Date.now().toString(),
                  name: "Color",
                  values: [{ id: Date.now().toString(), value: "" }],
                  editingOption: null,
                };
                setOptionForms([...optionForms, newForm]);
              }}
              className="rounded-full border-blue-200 bg-blue-50 px-4 text-blue-600 hover:bg-blue-100"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Color Variants
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddOptionForm}
              className="rounded-full border-blue-200 bg-blue-50 px-4 text-blue-600 hover:bg-blue-100"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Custom Variants
            </Button>
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

        {/* Add Another Option Button */}
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
    </div>
  );
};

export default InventoryVariants;
