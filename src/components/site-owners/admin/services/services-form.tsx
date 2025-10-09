import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ServicesPost } from "@/types/owner-site/admin/services";
import { servicesApi } from "@/services/api/owner-sites/admin/services";
import {
  servicesFormSchema,
  ServicesFormValues,
} from "@/schemas/services.form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import ReusableQuill from "@/components/ui/tip-tap";
import { toast } from "sonner";

interface ServicesFormProps {
  service?: ServicesPost | null;
  onSubmit: (data: ServicesFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ServicesForm: React.FC<ServicesFormProps> = ({
  service = null,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const isEditMode = Boolean(service);
  const [formInitialized, setFormInitialized] = useState(false);

  // Add state to track the selected file
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ServicesFormValues>({
    resolver: zodResolver(servicesFormSchema),
    defaultValues: {
      title: "",
      description: "",
      meta_title: "",
      meta_description: "",
      thumbnail_image: null,
      thumbnail_image_alt_description: "",
    },
  });

  useEffect(() => {
    if (isEditMode && service && !formInitialized) {
      form.reset({
        title: service.title || "",
        description: service.description || "",
        meta_title: service.meta_title || "",
        meta_description: service.meta_description || "",
        thumbnail_image_alt_description:
          service.thumbnail_image_alt_description || "",
      });

      setFormInitialized(true);
    }
  }, [service, isEditMode, form, formInitialized]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    // Update the form value directly
    form.setValue("thumbnail_image", file, { shouldValidate: true });
  };

  const handleSubmit = (data: ServicesFormValues) => {
    const transformedData = {
      ...data,
      // Ensure the selected file is included
      thumbnail_image: selectedFile || data.thumbnail_image,
    };

    onSubmit(transformedData);
  };

  return (
    <div className="mx-auto max-w-4xl rounded-lg bg-white p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter service title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description *</FormLabel>
                <FormControl>
                  <ReusableQuill
                    value={field.value || ""}
                    onChange={field.onChange}
                    placeholder="Write your service description here..."
                    height="250px"
                    toolbar="advanced"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4 rounded-md border p-4">
            <h3 className="text-lg font-medium">SEO Information</h3>
            <FormField
              control={form.control}
              name="meta_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Title</FormLabel>
                  <FormControl>
                    <Input placeholder="SEO friendly title" {...field} />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/60 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="meta_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meta Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="SEO friendly description"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/160 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 rounded-md border p-4">
            <h3 className="text-lg font-medium">Media</h3>
            <FormField
              control={form.control}
              name="thumbnail_image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thumbnail Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </FormControl>
                  <FormDescription>
                    {isEditMode && "Leave empty to keep current image."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isEditMode && service?.thumbnail_image && !selectedFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Current image:</p>
                <Image
                  src={service.thumbnail_image}
                  alt="Current thumbnail"
                  width={128}
                  height={128}
                  className="mt-1 rounded-md object-cover"
                />
              </div>
            )}
            {selectedFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">New image selected:</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">{selectedFile.name}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                      form.setValue("thumbnail_image", null);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}
            <FormField
              control={form.control}
              name="thumbnail_image_alt_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alt Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Image alt description for accessibility"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end space-x-4 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gray-600 text-white hover:bg-gray-700"
            >
              {isLoading
                ? "Saving..."
                : `${isEditMode ? "Update" : "Create"} Service`}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ServicesForm;
