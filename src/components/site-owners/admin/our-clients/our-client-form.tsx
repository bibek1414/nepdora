"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "@/components/ui/image-uploader";
import { OurClient } from "@/types/owner-site/admin/our-client";
import {
  useCreateOurClient,
  useUpdateOurClient,
} from "@/hooks/owner-site/admin/use-our-client";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL").optional().or(z.literal("")),
  logo: z.any().optional(), // File validation can be complex, keeping it simple for now
});

interface OurClientFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: OurClient | null;
}

export function OurClientForm({
  open,
  onOpenChange,
  client,
}: OurClientFormProps) {
  const createMutation = useCreateOurClient();
  const updateMutation = useUpdateOurClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: "",
      logo: undefined,
    },
  });

  useEffect(() => {
    if (client) {
      form.reset({
        name: client.name,
        url: client.url || "",
        logo: client.logo || undefined,
      });
    } else {
      form.reset({
        name: "",
        url: "",
        logo: undefined,
      });
    }
  }, [client, form, open]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (client) {
        await updateMutation.mutateAsync({
          id: client.id,
          data: {
            name: values.name,
            url: values.url || undefined,
            logo: values.logo instanceof File ? values.logo : undefined,
          },
        });
      } else {
        if (!values.logo) {
          form.setError("logo", { message: "Logo is required" });
          return;
        }
        await createMutation.mutateAsync({
          name: values.name,
          url: values.url || undefined,
          logo: values.logo,
        });
      }
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to save client:", error);
      if (error?.fieldErrors) {
        Object.keys(error.fieldErrors).forEach(key => {
          form.setError(key as any, {
            type: "server",
            message: error.fieldErrors[key].join(", "),
          });
        });
      }
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{client ? "Edit Client" : "Add New Client"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Client Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logo"
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  <FormControl>
                    <ImageUploader
                      value={value}
                      onChange={onChange}
                      multiple={false}
                    />
                  </FormControl>
                  {client && (
                    <p className="text-muted-foreground text-xs">
                      Leave empty to keep existing logo
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {client ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
