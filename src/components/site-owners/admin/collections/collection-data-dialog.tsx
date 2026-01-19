"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  useCreateCollectionData,
  useUpdateCollectionData,
  useCollectionData,
  useCollections,
} from "@/hooks/owner-site/admin/use-collections";
import {
  Collection,
  CollectionData,
} from "@/types/owner-site/admin/collection";
import { Badge } from "@/components/ui/badge";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { Loader2, Upload, X, Plus } from "lucide-react";
import Image from "next/image";
import Tiptap from "@/components/ui/tip-tap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CollectionDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collection: Collection;
  editingData: CollectionData | null;
}

export function CollectionDataDialog({
  open,
  onOpenChange,
  collection,
  editingData,
}: CollectionDataDialogProps) {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [uploadingFields, setUploadingFields] = useState<
    Record<string, boolean>
  >({});
  const [jsonErrors, setJsonErrors] = useState<Record<string, string | null>>(
    {}
  );

  const createDataMutation = useCreateCollectionData();
  const updateDataMutation = useUpdateCollectionData();

  useEffect(() => {
    if (editingData) {
      // Parse stringified arrays for text/email fields and JSON for json fields
      const parsedData = { ...editingData.data };
      collection.all_fields.forEach(field => {
        if (
          (field.type === "text" || field.type === "email") &&
          typeof parsedData[field.name] === "string"
        ) {
          try {
            // Try to parse JSON stringified arrays
            const parsed = JSON.parse(parsedData[field.name]);
            if (Array.isArray(parsed)) {
              parsedData[field.name] = parsed;
            }
          } catch {
            // Not JSON, keep as string
          }
        }
        // Parse JSON fields - if it's a string, try to parse it
        // Keep as JSON string (will be handled in renderFieldInput)
        if (
          field.type === "json" &&
          typeof parsedData[field.name] === "string"
        ) {
          try {
            const parsed = JSON.parse(parsedData[field.name]);
            // Keep as minified JSON string (will be parsed in renderFieldInput)
            parsedData[field.name] = JSON.stringify(parsed);
          } catch {
            // Invalid JSON, keep as string
          }
        }
      });
      setFormData(parsedData);
    } else {
      // Initialize with empty values based on field types
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const initialData: Record<string, any> = {};
      collection.all_fields.forEach(field => {
        if (field.type === "boolean") {
          initialData[field.name] = false;
        } else if (field.type === "json") {
          // Initialize as array with one empty object for sub-fields support
          initialData[field.name] = "[{}]";
        } else if (field.type === "model") {
          // Initialize model field as empty string (will be converted to number when selected)
          initialData[field.name] = "";
        } else {
          initialData[field.name] = "";
        }
      });
      setFormData(initialData);
    }
    // Reset JSON errors when dialog opens/closes
    setJsonErrors({});
  }, [editingData, collection, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields and JSON format
    const missingFields: string[] = [];
    const invalidJsonFields: string[] = [];

    collection.all_fields.forEach(f => {
      if (!f.required) return;
      const value = formData[f.name];

      // Handle image fields that can be string or array
      if (f.type === "image") {
        if (Array.isArray(value)) {
          if (value.length === 0) missingFields.push(f.name);
        } else if (!value || value === "") {
          missingFields.push(f.name);
        }
        return;
      }

      // Handle text/email fields that can be string or array
      if (f.type === "text" || f.type === "email") {
        if (Array.isArray(value)) {
          if (
            value.length === 0 ||
            value.every((v: string) => !v || v.trim() === "")
          ) {
            missingFields.push(f.name);
          }
        } else if (!value || value === "") {
          missingFields.push(f.name);
        }
        return;
      }

      // Handle JSON fields - validate JSON format
      if (f.type === "json") {
        if (
          !value ||
          value.trim() === "" ||
          value === "{}" ||
          value === "[]" ||
          value === "[{}]"
        ) {
          if (f.required) {
            missingFields.push(f.name);
          }
        } else {
          try {
            const parsed = JSON.parse(value);
            // Check if parsed JSON has at least one non-empty value when required
            if (f.required && typeof parsed === "object" && parsed !== null) {
              if (Array.isArray(parsed)) {
                // For arrays, check if at least one entry has non-empty values
                const hasValue = parsed.some((item: any) => {
                  if (typeof item === "object" && item !== null) {
                    return Object.values(item).some(
                      v => v !== null && v !== undefined && v !== ""
                    );
                  }
                  return false;
                });
                if (!hasValue) {
                  missingFields.push(f.name);
                }
              } else {
                // Single object
                const hasValue = Object.values(parsed).some(
                  v => v !== null && v !== undefined && v !== ""
                );
                if (!hasValue) {
                  missingFields.push(f.name);
                }
              }
            }
          } catch {
            invalidJsonFields.push(f.name);
          }
        }
        return;
      }

      // Handle model fields - validate that a collection data ID is selected
      if (f.type === "model") {
        if (!value || value === "" || value === null || value === undefined) {
          if (f.required) {
            missingFields.push(f.name);
          }
        }
        return;
      }

      if (!value) {
        missingFields.push(f.name);
      }
    });

    if (invalidJsonFields.length > 0) {
      toast.error(
        `Invalid JSON format in field(s): ${invalidJsonFields.join(", ")}`
      );
      return;
    }

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    try {
      // Process formData: stringify arrays for text/email fields and validate JSON fields
      const processedData = { ...formData };
      collection.all_fields.forEach(field => {
        if (
          (field.type === "text" || field.type === "email") &&
          Array.isArray(processedData[field.name])
        ) {
          // Stringify array values for text fields
          processedData[field.name] = JSON.stringify(processedData[field.name]);
        }
        // Validate and minify JSON fields
        if (field.type === "json" && processedData[field.name]) {
          try {
            const parsed = JSON.parse(processedData[field.name]);
            // Store as minified JSON string
            processedData[field.name] = JSON.stringify(parsed);
          } catch (error) {
            throw new Error(`Invalid JSON in field "${field.name}"`);
          }
        }
        // Model fields store the name as string (no conversion needed)
      });

      if (editingData) {
        await updateDataMutation.mutateAsync({
          slug: collection.slug,
          id: editingData.id,
          dataInput: { data: processedData },
        });
        toast.success("Data updated successfully");
      } else {
        await createDataMutation.mutateAsync({
          slug: collection.slug,
          dataInput: { data: processedData },
        });
        toast.success("Data created successfully");
      }

      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${editingData ? "update" : "create"} data`
      );
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateFieldValue = (fieldName: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [fieldName]: value };

      if (fieldName === "name") {
        newData.slug = generateSlug(value);
      }

      return newData;
    });
  };

  const handleImageUpload = async (
    fieldName: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingFields(prev => ({ ...prev, [fieldName]: true }));

      const currentValue = formData[fieldName];
      const isArray = Array.isArray(currentValue);
      const existingImages = isArray
        ? currentValue
        : currentValue
          ? [currentValue]
          : [];

      // Upload all selected files
      const uploadPromises = Array.from(files).map(file =>
        uploadToCloudinary(file)
      );
      const uploadedUrls = await Promise.all(uploadPromises);

      // Combine existing images with new ones
      const allImages = [...existingImages, ...uploadedUrls];

      // If multiple images, store as array; if single, store as string
      const newValue = allImages.length > 1 ? allImages : allImages[0] || "";
      updateFieldValue(fieldName, newValue);

      toast.success(
        uploadedUrls.length > 1
          ? `${uploadedUrls.length} images uploaded successfully`
          : "Image uploaded successfully"
      );
    } catch (error) {
      toast.error("Failed to upload image(s)");
      console.error(error);
    } finally {
      setUploadingFields(prev => ({ ...prev, [fieldName]: false }));
      // Reset file input
      e.target.value = "";
    }
  };

  const removeImage = (fieldName: string, index?: number) => {
    const currentValue = formData[fieldName];

    if (Array.isArray(currentValue)) {
      // Remove specific image from array
      if (index !== undefined) {
        const newArray = currentValue.filter((_, i) => i !== index);
        // If only one image left, convert to string
        updateFieldValue(
          fieldName,
          newArray.length === 1 ? newArray[0] : newArray
        );
      } else {
        // Remove all images
        updateFieldValue(fieldName, "");
      }
    } else {
      // Single image - remove it
      updateFieldValue(fieldName, "");
    }
  };

  const handleRichTextImageUpload = async (file: File): Promise<string> => {
    try {
      const imageUrl = await uploadToCloudinary(file);
      return imageUrl;
    } catch (error) {
      console.error("Image upload failed:", error);
      throw new Error("Failed to upload image");
    }
  };
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderFieldInput = (field: any) => {
    const fieldValue = formData[field.name];

    if (field.name === "content") {
      return (
        <Tiptap
          value={fieldValue || ""}
          onChange={content => updateFieldValue(field.name, content)}
          placeholder="Enter content..."
          height="500px"
          toolbar="advanced"
          onImageUpload={handleRichTextImageUpload}
          maxImageSize={5}
        />
      );
    }

    // Make slug field read-only/disabled
    if (field.name === "slug") {
      return (
        <Input
          value={fieldValue || ""}
          readOnly
          disabled
          className="bg-muted"
        />
      );
    }

    switch (field.type) {
      case "text":
      case "email":
        const isArrayValue = Array.isArray(fieldValue);
        const textArray = isArrayValue
          ? fieldValue
          : fieldValue
            ? [fieldValue]
            : [""];

        return (
          <div className="space-y-2">
            {textArray.map((textValue: string, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  type={field.type === "email" ? "email" : "text"}
                  value={textValue || ""}
                  onChange={e => {
                    const newArray = [...textArray];
                    newArray[index] = e.target.value;
                    // If it was already an array or has multiple items, keep as array
                    // Otherwise, store as string
                    const newValue =
                      isArrayValue || newArray.length > 1
                        ? newArray
                        : newArray[0] || "";
                    updateFieldValue(field.name, newValue);
                  }}
                  placeholder={
                    field.type === "email"
                      ? "Enter email address"
                      : `Enter ${field.name}`
                  }
                  required={field.required && index === 0}
                  className="flex-1"
                />
                {isArrayValue && textArray.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newArray = textArray.filter((_, i) => i !== index);
                      // If only one value left, convert to string
                      updateFieldValue(
                        field.name,
                        newArray.length === 1 ? newArray[0] : newArray
                      );
                    }}
                    className="h-10 w-10 shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                // Convert to array if not already, then add empty string
                const currentArray = isArrayValue
                  ? fieldValue
                  : fieldValue
                    ? [fieldValue]
                    : [""];
                const newArray = [...currentArray, ""];
                updateFieldValue(field.name, newArray);
              }}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add {field.name}
            </Button>
          </div>
        );

      case "number":
        return (
          <Input
            type="number"
            step="any"
            value={fieldValue || ""}
            onChange={e =>
              updateFieldValue(
                field.name,
                e.target.value ? parseFloat(e.target.value) : ""
              )
            }
            required={field.required}
          />
        );

      case "date":
        return (
          <Input
            type="date"
            value={fieldValue || ""}
            onChange={e => updateFieldValue(field.name, e.target.value)}
            required={field.required}
          />
        );

      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`field-${field.name}`}
              checked={fieldValue || false}
              onCheckedChange={checked => updateFieldValue(field.name, checked)}
            />
            <Label
              htmlFor={`field-${field.name}`}
              className="cursor-pointer font-normal"
            >
              {fieldValue ? "Yes" : "No"}
            </Label>
          </div>
        );

      case "image":
        const imagesArray = Array.isArray(fieldValue)
          ? fieldValue
          : fieldValue
            ? [fieldValue]
            : [];
        const hasImages = imagesArray.length > 0;

        return (
          <div className="space-y-3">
            {hasImages ? (
              <div className="space-y-3">
                <div
                  className={`grid gap-3 ${
                    imagesArray.length === 1
                      ? "grid-cols-1"
                      : imagesArray.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-3"
                  }`}
                >
                  {imagesArray.map((imageUrl: string, index: number) => (
                    <div
                      key={index}
                      className="relative aspect-square w-full overflow-hidden rounded-md border"
                    >
                      <Image
                        src={imageUrl}
                        alt={`${field.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => removeImage(field.name, index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={uploadingFields[field.name]}
                  onClick={() =>
                    document
                      .getElementById(`file-upload-${field.name}`)
                      ?.click()
                  }
                >
                  {uploadingFields[field.name] ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Add More Images
                    </>
                  )}
                </Button>
                <Input
                  id={`file-upload-${field.name}`}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => handleImageUpload(field.name, e)}
                  disabled={uploadingFields[field.name]}
                />
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={uploadingFields[field.name]}
                  onClick={() =>
                    document
                      .getElementById(`file-upload-${field.name}`)
                      ?.click()
                  }
                >
                  {uploadingFields[field.name] ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Image(s)
                    </>
                  )}
                </Button>
                <Input
                  id={`file-upload-${field.name}`}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={e => handleImageUpload(field.name, e)}
                  disabled={uploadingFields[field.name]}
                />
              </div>
            )}
            <Input
              type="hidden"
              value={
                Array.isArray(fieldValue)
                  ? JSON.stringify(fieldValue)
                  : fieldValue || ""
              }
              required={field.required}
            />
          </div>
        );

      case "json":
        // Parse field name to extract sub-fields: "price(min, max, person)" -> ["min", "max", "person"]
        const parseJsonFieldName = (fieldName: string) => {
          const match = fieldName.match(/^(.+?)\((.+)\)$/);
          if (match) {
            const subFields = match[2]
              .split(",")
              .map(f => f.trim())
              .filter(f => f.length > 0);
            return subFields;
          }
          return [];
        };

        const subFields = parseJsonFieldName(field.name);

        // If field name has sub-fields format, render separate inputs
        if (subFields.length > 0) {
          // Parse existing JSON value - support both single object and array of objects
          const currentJsonValue = formData[field.name];
          let jsonArray: Record<string, any>[] = [];

          if (currentJsonValue) {
            try {
              const parsed =
                typeof currentJsonValue === "string"
                  ? JSON.parse(currentJsonValue)
                  : currentJsonValue;

              if (Array.isArray(parsed)) {
                // Already an array
                jsonArray = parsed.filter(
                  item =>
                    typeof item === "object" &&
                    item !== null &&
                    !Array.isArray(item)
                );
              } else if (typeof parsed === "object" && parsed !== null) {
                // Single object, convert to array
                jsonArray = [parsed];
              }
            } catch {
              // Invalid JSON, start fresh
            }
          }

          // If empty, initialize with one empty object
          if (jsonArray.length === 0) {
            jsonArray = [{}];
          }

          const handleSubFieldChange = (
            entryIndex: number,
            subFieldName: string,
            value: string
          ) => {
            const newArray = [...jsonArray];
            if (!newArray[entryIndex]) {
              newArray[entryIndex] = {};
            }
            newArray[entryIndex] = {
              ...newArray[entryIndex],
              [subFieldName]: value,
            };

            // Store as JSON string - if single entry, could be object or array
            // For consistency, always store as array
            updateFieldValue(field.name, JSON.stringify(newArray));
          };

          const removeJsonEntry = (index: number) => {
            const newArray = jsonArray.filter((_, i) => i !== index);
            if (newArray.length === 0) {
              // Keep at least one empty entry
              updateFieldValue(field.name, JSON.stringify([{}]));
            } else {
              updateFieldValue(field.name, JSON.stringify(newArray));
            }
          };

          const addJsonEntry = () => {
            const newArray = [...jsonArray, {}];
            updateFieldValue(field.name, JSON.stringify(newArray));
          };

          return (
            <div className="space-y-3">
              <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
                <p className="text-muted-foreground text-xs font-medium">
                  💡 JSON Format Hint: Use field name like{" "}
                  <code className="rounded bg-blue-100 px-1 py-0.5 text-xs">
                    fieldName(subField1, subField2)
                  </code>{" "}
                  to create separate inputs for each sub-field.
                </p>
              </div>

              {jsonArray.map((jsonEntry, entryIndex) => (
                <div
                  key={entryIndex}
                  className="space-y-3 rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Entry {entryIndex + 1}
                    </Label>
                    {jsonArray.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeJsonEntry(entryIndex)}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-3">
                    {subFields.map(subField => (
                      <div key={subField} className="space-y-1">
                        <Label
                          htmlFor={`${field.name}-${entryIndex}-${subField}`}
                          className="text-sm"
                        >
                          {subField}
                        </Label>
                        <Input
                          id={`${field.name}-${entryIndex}-${subField}`}
                          type="text"
                          value={jsonEntry[subField] || ""}
                          onChange={e =>
                            handleSubFieldChange(
                              entryIndex,
                              subField,
                              e.target.value
                            )
                          }
                          placeholder={`Enter ${subField}`}
                          required={field.required && entryIndex === 0}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addJsonEntry}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add {field.name}
              </Button>
            </div>
          );
        }

        // Fallback: if no sub-fields format detected, show hint only
        return (
          <div className="space-y-2">
            <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
              <p className="text-muted-foreground text-xs font-medium">
                💡 JSON Format Hint: Name your field like{" "}
                <code className="rounded bg-blue-100 px-1 py-0.5 text-xs">
                  price(min, max, person)
                </code>{" "}
                to create separate inputs. Example:{" "}
                <code className="rounded bg-blue-100 px-1 py-0.5 text-xs">
                  price(min, max, person)
                </code>{" "}
                will create inputs for min, max, and person.
              </p>
            </div>
            <div className="rounded-md border border-dashed p-4 text-center">
              <p className="text-muted-foreground text-sm">
                Please use the format{" "}
                <code className="bg-muted rounded px-1 py-0.5 text-xs">
                  fieldName(subField1, subField2)
                </code>{" "}
                when creating this field in the collection settings.
              </p>
            </div>
          </div>
        );

      case "model":
        // Render model field dropdown
        return (
          <ModelFieldInput
            field={field}
            value={fieldValue}
            onChange={value => updateFieldValue(field.name, value)}
          />
        );

      default:
        return (
          <Input
            value={fieldValue || ""}
            onChange={e => updateFieldValue(field.name, e.target.value)}
            required={field.required}
          />
        );
    }
  };

  // Helper component for model field input
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ModelFieldInput = ({
    field,
    value,
    onChange,
  }: {
    field: any;
    value: any;
    onChange: (value: number | string) => void;
  }) => {
    const { data: collections } = useCollections();

    // Get model collection ID from field.model or field.model_collection_id (for backward compatibility)
    const modelCollectionId = (field as any).model || field.model_collection_id;

    if (!modelCollectionId) {
      return (
        <div className="rounded-md border border-dashed p-4 text-center">
          <p className="text-muted-foreground text-sm">
            Please configure this model field with a collection reference.
          </p>
        </div>
      );
    }

    // Find the referenced collection by ID
    const referencedCollection = collections?.find(
      c => c.id === modelCollectionId
    );

    const { data: collectionDataResponse, isLoading } = useCollectionData(
      referencedCollection?.slug || "",
      {}
    );

    // Get name field for display
    const getNameField = () => {
      if (!referencedCollection) return null;
      const nameField = referencedCollection.all_fields.find(
        f => f.name.toLowerCase() === "name" || f.name.toLowerCase() === "title"
      );
      if (nameField) return nameField;
      return referencedCollection.all_fields.find(f => f.type === "text");
    };

    const nameField = getNameField();

    // Format display value for dropdown
    const formatDisplayValue = (data: CollectionData) => {
      if (nameField && data.data[nameField.name]) {
        return String(data.data[nameField.name]);
      }
      return `Item #${data.id}`;
    };

    if (isLoading) {
      return (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-muted-foreground text-sm">
            Loading options...
          </span>
        </div>
      );
    }

    const options = collectionDataResponse?.results || [];

    // Handle value conversion: if value is a number (ID), convert to name
    // If value is already a string (name), use it as-is
    let selectedValue = "";
    if (value !== null && value !== undefined && value !== "") {
      if (
        typeof value === "number" ||
        (typeof value === "string" &&
          !isNaN(Number(value)) &&
          value.trim() !== "")
      ) {
        // Value is an ID, find the item and get its name
        const itemId = typeof value === "number" ? value : parseInt(value, 10);
        const item = options.find(opt => opt.id === itemId);
        if (item) {
          selectedValue = formatDisplayValue(item);
        }
      } else {
        // Value is already a name (string)
        selectedValue = value.toString();
      }
    }

    return (
      <Select
        value={selectedValue}
        onValueChange={onChange}
        required={field.required}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an item" />
        </SelectTrigger>
        <SelectContent>
          {options.length === 0 ? (
            <SelectItem value="" disabled>
              No items available
            </SelectItem>
          ) : (
            options.map(item => {
              const displayValue = formatDisplayValue(item);
              return (
                <SelectItem key={item.id} value={displayValue}>
                  {displayValue}
                </SelectItem>
              );
            })
          )}
        </SelectContent>
      </Select>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingData ? "Edit Data" : "Add New Data"}
          </DialogTitle>
          <DialogDescription>
            Fill in the fields for {collection.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4 capitalize">
            {collection.all_fields.map(field => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>
                  {field.name}
                  {field.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                  {field.is_default && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Default
                    </Badge>
                  )}
                </Label>
                {renderFieldInput(field)}
                <p className="text-muted-foreground text-xs">
                  Type: {field.type}
                  {field.filterable && " • Filterable"}
                  {field.searchable && " • Searchable"}
                </p>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                createDataMutation.isPending ||
                updateDataMutation.isPending ||
                Object.values(uploadingFields).some(Boolean)
              }
            >
              {createDataMutation.isPending || updateDataMutation.isPending
                ? editingData
                  ? "Updating..."
                  : "Creating..."
                : editingData
                  ? "Update"
                  : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
