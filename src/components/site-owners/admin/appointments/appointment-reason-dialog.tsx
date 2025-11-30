"use client";

import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getApiBaseUrl } from "@/config/site";

interface CreateReasonDialogProps {
  children?: React.ReactNode;
}

export const CreateAppointmentReasonDialog: React.FC<
  CreateReasonDialogProps
> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reasonName, setReasonName] = useState("");
  const queryClient = useQueryClient();

  const createReason = useMutation({
    mutationFn: async (name: string) => {
      const BASE_API_URL = getApiBaseUrl();
      const response = await fetch(`${BASE_API_URL}/api/appointment-reasons/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Failed to create appointment reason"
        );
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Appointment reason created successfully!");
      queryClient.invalidateQueries({ queryKey: ["appointment-reasons"] });
      setReasonName("");
      setIsOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create appointment reason");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reasonName.trim()) {
      createReason.mutate(reasonName.trim());
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setReasonName("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Reason
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Appointment Reason</DialogTitle>
            <DialogDescription>
              Add a new reason that customers can select when booking
              appointments.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason-name">Reason Name</Label>
              <Input
                id="reason-name"
                placeholder="e.g., Consultation, Follow-up, New Patient"
                value={reasonName}
                onChange={e => setReasonName(e.target.value)}
                required
                autoFocus
              />
              <p className="text-xs text-gray-500">
                This will appear in the appointment booking form dropdown.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createReason.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createReason.isPending || !reasonName.trim()}
            >
              {createReason.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Reason
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
