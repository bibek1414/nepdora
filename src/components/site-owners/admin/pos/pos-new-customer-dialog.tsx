"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterCustomer } from "@/hooks/owner-site/admin/use-customers";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

interface POSNewCustomerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (customer: any) => void;
  initialPhone?: string;
}

export default function POSNewCustomerDialog({
  open,
  onOpenChange,
  onSuccess,
  initialPhone = "",
}: POSNewCustomerDialogProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: initialPhone || "",
  });

  useEffect(() => {
    if (open) {
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: initialPhone || "",
      });
    }
  }, [open, initialPhone]);

  const registerMutation = useRegisterCustomer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.phone ||
      !formData.email
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const result = await registerMutation.mutateAsync({ ...formData });
      onSuccess(result);
      onOpenChange(false);
      setFormData({ first_name: "", last_name: "", email: "", phone: "" });
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader className="flex flex-row items-center gap-3 space-y-0 pb-1">
          <div className="bg-primary/10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
            <UserPlus className="text-primary h-4 w-4" />
          </div>
          <DialogTitle className="text-foreground text-base font-semibold">
            Register new customer
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="first_name"
                className="text-foreground text-xs font-medium"
              >
                First name
              </Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={e =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                placeholder="John"
                className="border-border bg-muted/40 placeholder:text-muted-foreground focus:bg-background h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="last_name"
                className="text-foreground text-xs font-medium"
              >
                Last name
              </Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={e =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                placeholder="Doe"
                className="border-border bg-muted/40 placeholder:text-muted-foreground focus:bg-background h-9 text-sm"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label
              htmlFor="phone"
              className="text-foreground text-xs font-medium"
            >
              Phone number
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={e =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="98XXXXXXXX"
              className="border-border bg-muted/40 placeholder:text-muted-foreground focus:bg-background h-9 text-sm"
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-foreground text-xs font-medium"
            >
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="john@example.com"
              className="border-border bg-muted/40 placeholder:text-muted-foreground focus:bg-background h-9 text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="border-border h-10 flex-1 text-sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 flex-1 text-sm active:scale-[0.98]"
            >
              {registerMutation.isPending
                ? "Registering…"
                : "Register customer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
