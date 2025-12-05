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
} from "@/hooks/owner-site/admin/use-collections";
import {
  Collection,
  CollectionData,
} from "@/types/owner-site/admin/collection";
import { Badge } from "@/components/ui/badge";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { Loader2, Upload, X } from "lucide-react";
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

  const createDataMutation = useCreateCollectionData();
  const updateDataMutation = useUpdateCollectionData();

  useEffect(() => {
    if (editingData) {
      setFormData(editingData.data);
    } else {
      // Initialize with empty values based on field types
      //eslint-disable-next-line @typescript-eslint/no-explicit-any
      const initialData: Record<string, any> = {};
      collection.all_fields.forEach(field => {
        if (field.type === "boolean") {
          initialData[field.name] = false;
        } else {
          initialData[field.name] = "";
        }
      });
      setFormData(initialData);
    }
  }, [editingData, collection, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const missingFields = collection.all_fields
      .filter(f => f.required && !formData[f.name])
      .map(f => f.name);

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    try {
      if (editingData) {
        await updateDataMutation.mutateAsync({
          slug: collection.slug,
          id: editingData.id,
          dataInput: { data: formData },
        });
        toast.success("Data updated successfully");
      } else {
        await createDataMutation.mutateAsync({
          slug: collection.slug,
          dataInput: { data: formData },
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
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingFields(prev => ({ ...prev, [fieldName]: true }));
      const imageUrl = await uploadToCloudinary(file);
      updateFieldValue(fieldName, imageUrl);
      toast.success("Image uploaded successfully");
    } catch (error) {
      toast.error("Failed to upload image");
      console.error(error);
    } finally {
      setUploadingFields(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const removeImage = (fieldName: string) => {
    updateFieldValue(fieldName, "");
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
        return (
          <Input
            type={field.type === "email" ? "email" : "text"}
            value={fieldValue || ""}
            onChange={e => updateFieldValue(field.name, e.target.value)}
            required={field.required}
          />
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
        return (
          <div className="space-y-3">
            {fieldValue ? (
              <div className="relative h-40 w-full overflow-hidden rounded-md border">
                <Image
                  src={fieldValue}
                  alt={field.name}
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => removeImage(field.name)}
                >
                  <X className="h-4 w-4" />
                </Button>
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
                      Upload Image
                    </>
                  )}
                </Button>
                <Input
                  id={`file-upload-${field.name}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => handleImageUpload(field.name, e)}
                  disabled={uploadingFields[field.name]}
                />
              </div>
            )}
            <Input
              type="hidden"
              value={fieldValue || ""}
              required={field.required}
            />
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
