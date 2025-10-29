"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  useCreatePromoCode,
  useUpdatePromoCode,
} from "@/hooks/owner-site/admin/use-promocode";
import {
  CreatePromoCodeRequest,
  PromoCode,
} from "@/types/owner-site/admin/promo-code";
import { CreatePromoCodeSchema } from "@/schemas/promocode.form";

interface PromoCodeFormProps {
  promoCode?: PromoCode | null;
  onClose: () => void;
}

export const PromoCodeForm: React.FC<PromoCodeFormProps> = ({
  promoCode,
  onClose,
}) => {
  const isEditing = !!promoCode;
  const createPromoCodeMutation = useCreatePromoCode();
  const updatePromoCodeMutation = useUpdatePromoCode();

  const form = useForm<CreatePromoCodeRequest>({
    resolver: zodResolver(CreatePromoCodeSchema),
    defaultValues: {
      code: promoCode?.code || "",
      discount_percentage: promoCode?.discount_percentage
        ? parseFloat(promoCode.discount_percentage)
        : 0,
      valid_from: promoCode?.valid_from
        ? new Date(promoCode.valid_from).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      valid_to: promoCode?.valid_to
        ? new Date(promoCode.valid_to).toISOString().split("T")[0]
        : "",
      max_uses: promoCode?.max_uses || null,
      is_active: promoCode?.is_active ?? true,
    },
  });

  const onSubmit = async (data: CreatePromoCodeRequest) => {
    try {
      if (isEditing && promoCode) {
        await updatePromoCodeMutation.mutateAsync({
          id: promoCode.id,
          data,
        });
      } else {
        await createPromoCodeMutation.mutateAsync(data);
      }
      onClose();
    } catch (error) {
      // Error handling is in the hooks
    }
  };

  const isLoading =
    createPromoCodeMutation.isPending || updatePromoCodeMutation.isPending;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Promo Code" : "Create New Promo Code"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the promo code information."
              : "Fill in the details to create a new promo code."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promo Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., SAVE20"
                      {...field}
                      disabled={isLoading}
                      className="uppercase"
                      onChange={e =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Uppercase letters and numbers only (max 10 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="discount_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Percentage</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="10"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                      disabled={isLoading}
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a value between 0 and 100
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="valid_from"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valid From</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="valid_to"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valid To</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="max_uses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Uses (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Leave empty for unlimited"
                      {...field}
                      value={field.value ?? ""}
                      onChange={e =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : null
                        )
                      }
                      disabled={isLoading}
                      min="1"
                    />
                  </FormControl>
                  <FormDescription>
                    Leave empty for unlimited uses
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Enable or disable this promo code
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
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
                    ? "Update Promo Code"
                    : "Create Promo Code"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
