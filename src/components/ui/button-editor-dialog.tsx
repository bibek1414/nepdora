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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NavbarButton } from "@/types/owner-site/components/navbar";

const buttonSchema = z.object({
  text: z.string().min(1, "Button text is required."),
  href: z.string().min(1, "URL is required."),
  variant: z.enum(["primary", "secondary", "outline"]),
});

interface ButtonEditorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (buttonData: Omit<NavbarButton, "id">) => void;
  button?: NavbarButton | null;
}

export const ButtonEditorDialog: React.FC<ButtonEditorDialogProps> = ({
  isOpen,
  onClose,
  onSave,
  button,
}) => {
  const form = useForm<z.infer<typeof buttonSchema>>({
    resolver: zodResolver(buttonSchema),
    defaultValues: {
      text: button?.text || "",
      href: button?.href || "#",
      variant: button?.variant || "primary",
    },
  });

  React.useEffect(() => {
    form.reset({
      text: button?.text || "",
      href: button?.href || "#",
      variant: button?.variant || "primary",
    });
  }, [button, isOpen, form]);

  const handleSubmit = (values: z.infer<typeof buttonSchema>) => {
    onSave(values);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{button ? "Edit Button" : "Add New Button"}</DialogTitle>
          <DialogDescription>
            Configure the text, style, and destination for your action button.
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
                  <FormLabel>Button Text</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Get Started" {...field} />
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
                    <Input placeholder="e.g., /contact" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="variant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Style</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="outline">Outline</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {button ? "Save Changes" : "Add Button"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
