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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  useCreateCollectionData,
  useUpdateCollectionData,
} from "@/hooks/owner-site/admin/use-collections";
import {
  Collection,
  CollectionData,
} from "@/types/owner-site/admin/collection";
import { Badge } from "@/components/ui/badge";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { Loader2, Upload, X, Plus } from "lucide-react";
import Image from "next/image";
import ReusableQuill from "@/components/ui/tip-tap";

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
        // Parse JSON fields - if it's a string, try to parse and format it
        if (
          field.type === "json" &&
          typeof parsedData[field.name] === "string"
        ) {
          try {
            const parsed = JSON.parse(parsedData[field.name]);
            parsedData[field.name] = JSON.stringify(parsed, null, 2);
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
          initialData[field.name] = "{}";
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
        if (!value || value.trim() === "" || value === "{}" || value === "[]") {
          missingFields.push(f.name);
        } else {
          try {
            JSON.parse(value);
          } catch {
            invalidJsonFields.push(f.name);
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
        <ReusableQuill
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
        const jsonValue = typeof fieldValue === "string" ? fieldValue : "";
        const jsonError = jsonErrors[field.name] || null;

        const handleJsonChange = (value: string) => {
          setJsonErrors(prev => ({ ...prev, [field.name]: null }));
          updateFieldValue(field.name, value);

          // Validate JSON on change (but don't block input)
          if (value.trim() && value !== "{}" && value !== "[]") {
            try {
              JSON.parse(value);
            } catch (error) {
              setJsonErrors(prev => ({
                ...prev,
                [field.name]: "Invalid JSON format",
              }));
            }
          }
        };

        return (
          <div className="space-y-2">
            <Textarea
              value={jsonValue}
              onChange={e => handleJsonChange(e.target.value)}
              placeholder='{"key": "value"}'
              required={field.required}
              className="min-h-[200px] font-mono text-sm"
            />
            {jsonError && (
              <p className="text-destructive text-sm">{jsonError}</p>
            )}
            {!jsonError &&
              jsonValue.trim() &&
              jsonValue !== "{}" &&
              jsonValue !== "[]" && (
                <p className="text-muted-foreground text-xs">✓ Valid JSON</p>
              )}
          </div>
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
