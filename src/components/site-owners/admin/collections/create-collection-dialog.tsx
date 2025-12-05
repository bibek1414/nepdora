"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useCreateCollection } from "@/hooks/owner-site/admin/use-collections";
import { FieldType } from "@/types/owner-site/admin/collection";

interface FieldInput {
  name: string;
  type: FieldType;
  required: boolean;
  filterable: boolean;
  searchable: boolean;
}

interface CreateCollectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateCollectionDialog({
  open,
  onOpenChange,
}: CreateCollectionDialogProps) {
  const router = useRouter();
  const [collectionName, setCollectionName] = useState("");
  const [fields, setFields] = useState<FieldInput[]>([]);

  const createCollectionMutation = useCreateCollection();

  const addField = () => {
    setFields([
      ...fields,
      {
        name: "",
        type: "text",
        required: false,
        filterable: false,
        searchable: false,
      },
    ]);
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const updateField = (index: number, updates: Partial<FieldInput>) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], ...updates };
    setFields(newFields);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!collectionName.trim()) {
      toast.error("Collection name is required");
      return;
    }

    // Validate field names
    const invalidFields = fields.filter(f => !f.name.trim());
    if (invalidFields.length > 0) {
      toast.error("All fields must have a name");
      return;
    }

    try {
      const result = await createCollectionMutation.mutateAsync({
        name: collectionName,
        fields: fields.map(f => ({
          name: f.name,
          type: f.type,
          required: f.required,
          filterable: f.filterable,
          searchable: f.searchable,
        })),
      });

      toast.success("Collection created successfully");

      // Reset form
      setCollectionName("");
      setFields([]);
      onOpenChange(false);

      // Navigate to the collection data page
      router.push(`/admin/collections/${result.slug}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create collection"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogDescription>
            Define your collection structure with custom fields. Default fields
            (name, slug, content) are automatically included.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Collection Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Products, Blog Posts, Testimonials"
                value={collectionName}
                onChange={e => setCollectionName(e.target.value)}
                required
              />
              <p className="text-muted-foreground text-sm">
                Slug will be auto-generated from the name
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Custom Fields</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addField}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Field
                </Button>
              </div>

              {fields.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed py-8 text-center">
                  <p className="text-muted-foreground">
                    No custom fields yet. Click &quot;Add Field&quot; to create
                    one.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div
                      key={index}
                      className="bg-muted/50 space-y-4 rounded-lg border p-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Field {index + 1}</h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeField(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Field Name *</Label>
                          <Input
                            placeholder="e.g., price, author, category"
                            value={field.name}
                            onChange={e =>
                              updateField(index, { name: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Field Type *</Label>
                          <Select
                            value={field.type}
                            onValueChange={(value: FieldType) =>
                              updateField(index, { type: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Text</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="date">Date</SelectItem>
                              <SelectItem value="boolean">Boolean</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="image">Image</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`required-${index}`}
                            checked={field.required}
                            onCheckedChange={checked =>
                              updateField(index, {
                                required: checked as boolean,
                              })
                            }
                          />
                          <Label
                            htmlFor={`required-${index}`}
                            className="cursor-pointer font-normal"
                          >
                            Required
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`filterable-${index}`}
                            checked={field.filterable}
                            onCheckedChange={checked =>
                              updateField(index, {
                                filterable: checked as boolean,
                              })
                            }
                          />
                          <Label
                            htmlFor={`filterable-${index}`}
                            className="cursor-pointer font-normal"
                          >
                            Filterable
                          </Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`searchable-${index}`}
                            checked={field.searchable}
                            onCheckedChange={checked =>
                              updateField(index, {
                                searchable: checked as boolean,
                              })
                            }
                          />
                          <Label
                            htmlFor={`searchable-${index}`}
                            className="cursor-pointer font-normal"
                          >
                            Searchable
                          </Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createCollectionMutation.isPending}>
              {createCollectionMutation.isPending
                ? "Creating..."
                : "Create Collection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
