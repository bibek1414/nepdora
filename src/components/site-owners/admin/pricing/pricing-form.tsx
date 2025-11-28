"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useCreatePricing,
  useUpdatePricing,
} from "@/hooks/owner-site/admin/use-pricing";
import { Pricing } from "@/types/owner-site/admin/pricing";
import { Plus, X, GripVertical } from "lucide-react";

const PricingFeatureSchema = z.object({
  feature: z.string().min(1, "Feature is required"),
  order: z.number().min(1),
});

const CreatePricingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.string().min(1, "Price is required"),
  description: z.string().min(1, "Description is required"),
  is_popular: z.boolean(),
  features: z
    .array(PricingFeatureSchema)
    .min(1, "At least one feature is required"),
});

type PricingFormData = z.infer<typeof CreatePricingSchema>;

interface PricingFormProps {
  pricing?: Pricing | null;
  onClose: () => void;
}

export const PricingForm: React.FC<PricingFormProps> = ({
  pricing,
  onClose,
}) => {
  const isEditing = !!pricing;
  const createPricingMutation = useCreatePricing();
  const updatePricingMutation = useUpdatePricing();

  const originalValues = React.useMemo(
    () => ({
      name: pricing?.name || "",
      price: pricing?.price.toString() || "",
      description: pricing?.description || "",
      is_popular: pricing?.is_popular || false,
      features: pricing?.features.map((f, index) => ({
        feature: f.feature,
        order: f.order || index + 1,
      })) || [{ feature: "", order: 1 }],
    }),
    [pricing]
  );

  const form = useForm<PricingFormData>({
    resolver: zodResolver(CreatePricingSchema),
    defaultValues: originalValues,
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "features",
  });

  const onSubmit = async (data: PricingFormData) => {
    try {
      const featuresWithOrder = data.features.map((feature, index) => ({
        feature: feature.feature,
        order: index + 1,
      }));

      if (isEditing && pricing) {
        const changedFields: Partial<PricingFormData> = {};

        if (data.name !== originalValues.name) {
          changedFields.name = data.name;
        }
        if (data.price !== originalValues.price) {
          changedFields.price = data.price;
        }
        if (data.description !== originalValues.description) {
          changedFields.description = data.description;
        }
        if (data.is_popular !== originalValues.is_popular) {
          changedFields.is_popular = data.is_popular;
        }

        // Check if features changed
        const featuresChanged =
          JSON.stringify(featuresWithOrder) !==
          JSON.stringify(originalValues.features);

        if (featuresChanged) {
          changedFields.features = featuresWithOrder;
        }

        if (Object.keys(changedFields).length === 0) {
          onClose();
          return;
        }

        await updatePricingMutation.mutateAsync({
          id: pricing.id,
          data: changedFields,
        });
      } else {
        await createPricingMutation.mutateAsync({
          ...data,
          features: featuresWithOrder,
        });
      }
      onClose();
    } catch (error) {
      // Error handling is in the hooks
    }
  };

  const isLoading =
    createPricingMutation.isPending || updatePricingMutation.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 p-0 sm:max-w-[600px]">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>
            {isEditing ? "Edit Pricing Plan" : "Create New Pricing Plan"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the pricing plan information."
              : "Fill in the details to create a new pricing plan."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="flex-1 space-y-4 overflow-y-auto p-6 pt-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Basic, Pro, Enterprise"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="29.99"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormDescription>Price per month in NPR</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of this plan"
                        className="resize-none"
                        rows={3}
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_popular"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Mark as Popular</FormLabel>
                      <FormDescription>
                        This plan will be highlighted on the pricing page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <FormLabel>Features</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({ feature: "", order: fields.length + 1 })
                    }
                    disabled={isLoading}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Add Feature
                  </Button>
                </div>

                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <GripVertical className="text-muted-foreground h-5 w-5 flex-shrink-0" />
                      <FormField
                        control={form.control}
                        name={`features.${index}.feature`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input
                                placeholder="Enter feature"
                                {...field}
                                disabled={isLoading}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        disabled={isLoading || fields.length === 1}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-background flex justify-end space-x-2 border-t p-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                    ? "Update Plan"
                    : "Create Plan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
