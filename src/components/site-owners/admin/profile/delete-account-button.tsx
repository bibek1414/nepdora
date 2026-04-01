"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSoftDeleteUser } from "@/hooks/use-user";
import { useAuth } from "@/hooks/use-auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function DeleteAccountButton() {
  const { user } = useAuth();
  const { mutate: softDelete, isPending } = useSoftDeleteUser();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    if (!user?.id && !user?.user_id) {
      toast.error("User ID not found");
      return;
    }

    const userId = (user.user_id || user.id) as number;

    softDelete(userId, {
      onSuccess: () => {
        toast.success("Account deleted successfully", {
          description:
            "Your account has been deleted. You will be logged out now.",
        });
        setOpen(false);
      },
      onError: (error: any) => {
        toast.error("Failed to delete account", {
          description: error.message || "An unexpected error occurred.",
        });
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="font-600 rounded-full border border-[#ffcdc7] bg-[#fee9e6] px-6 text-[13px] text-[#c2410c] shadow-none hover:bg-[#ffded8]"
        >
          Delete Account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-[20px] border-[#eef2f6]">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-800 text-[18px] text-[#0d1117]">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-[#5b6e8c]">
            This action will delete your account. Your data will be
            preserved but you will no longer be able to log in unless you
            recover your account.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="font-600 rounded-full border-[#eef2f6] text-[13px]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={e => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isPending}
            className="font-600 rounded-full border-none bg-red-600 px-6 text-[13px] text-white hover:bg-red-700"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Yes, Delete Account"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
