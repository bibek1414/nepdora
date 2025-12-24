"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  useCollection,
  useUpdateCollection,
  useCollections,
} from "@/hooks/owner-site/admin/use-collections";
import { Skeleton } from "@/components/ui/skeleton";
import { FieldType } from "@/types/owner-site/admin/collection";
import { Badge } from "@/components/ui/badge";

interface FieldInput {
  name: string;
  type: FieldType;
  required: boolean;
  filterable: boolean;
  searchable: boolean;
  model_collection_id?: number;
}

interface EditCollectionFormProps {
  slug: string;
}

export function EditCollectionForm({ slug }: EditCollectionFormProps) {
  const router = useRouter();
  const [collectionName, setCollectionName] = useState("");
  const [fields, setFields] = useState<FieldInput[]>([]);
  const [sendEmail, setSendEmail] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");

  const { data: collection, isLoading } = useCollection(slug);
  const updateCollectionMutation = useUpdateCollection();
  const { data: collections } = useCollections();

  useEffect(() => {
    if (collection) {
      setCollectionName(collection.name);
      setFields(
        collection.fields.map(f => ({
          name: f.name,
          type: f.type,
          required: f.required,
          filterable: f.filterable,
          searchable: f.searchable,
          model_collection_id: f.model_collection_id,
        }))
      );
      setSendEmail(collection.send_email ?? false);
      setAdminEmail(collection.admin_email ?? "");
    }
  }, [collection]);

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

    // Validate model fields have a collection selected
    const invalidModelFields = fields.filter(
      f => f.type === "model" && !f.model_collection_id
    );
    if (invalidModelFields.length > 0) {
      toast.error("Model fields must have a collection selected");
      return;
    }

    // Validate admin email if send_email is enabled
    if (sendEmail && !adminEmail.trim()) {
      toast.error(
        "Admin email is required when email notifications are enabled"
      );
      return;
    }

    // Validate email format if provided
    if (sendEmail && adminEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(adminEmail.trim())) {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    try {
      await updateCollectionMutation.mutateAsync({
        slug,
        collectionData: {
          name: collectionName,
          fields: fields.map(f => ({
            name: f.name,
            type: f.type,
            required: f.required,
            filterable: f.filterable,
            searchable: f.searchable,
            ...(f.type === "model" &&
              f.model_collection_id && {
                model_collection_id: f.model_collection_id,
              }),
          })),
          send_email: sendEmail,
          ...(sendEmail &&
            adminEmail.trim() && { admin_email: adminEmail.trim() }),
        },
      });

      toast.success("Collection updated successfully");

      router.push(`/admin/collections/${slug}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update collection"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!collection) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <p className="text-muted-foreground">Collection not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(`/admin/collections/${slug}`)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Collection
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Edit Collection</h1>
        <p className="text-muted-foreground mt-1">
          Update your collection structure and fields
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Collection Details</CardTitle>
            <CardDescription>
              Basic information about your collection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Collection Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Products, Blog Posts, Testimonials"
                value={collectionName}
                onChange={e => setCollectionName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Current Slug</Label>
              <Input value={collection.slug} disabled />
              <p className="text-muted-foreground text-sm">
                Slug cannot be changed after creation
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="send-email" className="cursor-pointer">
                    Send Email Notifications
                  </Label>
                  <p className="text-muted-foreground text-sm">
                    Enable email notifications for new collection data
                    submissions
                  </p>
                </div>
                <Switch
                  id="send-email"
                  checked={sendEmail}
                  onCheckedChange={setSendEmail}
                />
              </div>

              {sendEmail && (
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email *</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    required
                  />
                  <p className="text-muted-foreground text-sm">
                    Email address to receive notifications for new submissions
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Default Fields</CardTitle>
                <CardDescription>
                  These fields are automatically included
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {collection.all_fields
                .filter(f => f.is_default)
                .map(field => (
                  <div
                    key={field.name}
                    className="bg-muted/50 flex items-center justify-between rounded-lg border p-3"
                  >
                    <div>
                      <p className="font-medium">{field.name}</p>
                      <p className="text-muted-foreground text-sm">
                        Type: {field.type} •{" "}
                        {field.required ? "Required" : "Optional"}
                      </p>
                    </div>
                    <Badge variant="outline">Default</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Custom Fields</CardTitle>
                <CardDescription>
                  Add and manage custom fields for your collection
                </CardDescription>
              </div>
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
          </CardHeader>
          <CardContent>
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
                        {field.type === "json" && (
                          <div className="rounded-md border border-blue-200 bg-blue-50 p-2">
                            <p className="text-muted-foreground text-xs">
                              💡 <strong>JSON Format:</strong> Use format like{" "}
                              <code className="rounded bg-blue-100 px-1 py-0.5 text-xs">
                                price(min, max, person)
                              </code>{" "}
                              to create separate inputs for each sub-field.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Field Type *</Label>
                        <Select
                          value={field.type}
                          onValueChange={(value: FieldType) =>
                            updateField(index, {
                              type: value,
                              ...(value !== "model" && {
                                model_collection_id: undefined,
                              }),
                            })
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
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="model">Model</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {field.type === "model" && (
                      <div className="space-y-2">
                        <Label>Select Collection *</Label>
                        <Select
                          value={field.model_collection_id?.toString() || ""}
                          onValueChange={value =>
                            updateField(index, {
                              model_collection_id: parseInt(value, 10),
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a collection" />
                          </SelectTrigger>
                          <SelectContent>
                            {collections
                              ?.filter(c => c.slug !== slug) // Exclude current collection
                              .map(collection => (
                                <SelectItem
                                  key={collection.id}
                                  value={collection.id.toString()}
                                >
                                  {collection.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <p className="text-muted-foreground text-xs">
                          Select a collection to reference its data entries
                        </p>
                      </div>
                    )}

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
          </CardContent>
        </Card>

        <div className="mt-6 flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/admin/collections/${slug}`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={updateCollectionMutation.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {updateCollectionMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
