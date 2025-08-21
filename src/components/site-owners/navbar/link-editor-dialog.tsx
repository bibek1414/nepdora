"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { NavbarLink } from "@/types/owner-site/components/navbar";

const linkSchema = z.object({
  text: z.string().min(1, "Link text is required."),
  href: z.string().min(1, "URL is required."),
});

interface LinkEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (linkData: Omit<NavbarLink, "id">) => void;
  link?: NavbarLink | null; // Pass a link to edit, or null to create
}

export const LinkEditorDialog: React.FC<LinkEditorDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  link,
}) => {
  const form = useForm<z.infer<typeof linkSchema>>({
    resolver: zodResolver(linkSchema),
    defaultValues: {
      text: link?.text || "",
      href: link?.href || "#",
    },
  });

  React.useEffect(() => {
    // Reset form when the link to edit changes or when creating a new one
    form.reset({
      text: link?.text || "",
      href: link?.href || "#",
    });
  }, [link, isOpen, form]);

  const handleSubmit = (values: z.infer<typeof linkSchema>) => {
    onSave(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{link ? "Edit Link" : "Add New Link"}</DialogTitle>
          <DialogDescription>
            Configure the text and destination for your navigation link.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link Text</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Home, About Us" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="href"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL / Href</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., /about or #features" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {link ? "Save Changes" : "Add Link"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
