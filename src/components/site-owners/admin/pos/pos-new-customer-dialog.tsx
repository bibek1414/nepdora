"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegisterCustomer } from "@/hooks/owner-site/admin/use-customers";
import { toast } from "sonner";

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
      const result = await registerMutation.mutateAsync({
        ...formData,
      });
      onSuccess(result);
      onOpenChange(false);
      setFormData({ first_name: "", last_name: "", email: "", phone: "" });
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Register New Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={e =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={e =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                placeholder="Doe"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={e =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="98XXXXXXXX"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="john@example.com"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full"
            >
              {registerMutation.isPending
                ? "Registering..."
                : "Register Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
