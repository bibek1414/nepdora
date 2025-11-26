"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, User, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FloatingInput,
  FloatingLabel,
} from "@/components/ui/floating-label-input";
import { storeNameSchema, phoneNumberSchema } from "@/schemas/signup.form";
import { signIn } from "next-auth/react";

export type GoogleWebsiteType = "ecommerce" | "service";

interface GoogleSignupDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialStoreName?: string;
  initialPhone?: string;
}

export function GoogleSignupDialog({
  isOpen,
  onOpenChange,
  initialStoreName = "",
  initialPhone = "",
}: GoogleSignupDialogProps) {
  const [googleStoreName, setGoogleStoreName] = useState(initialStoreName);
  const [googleStoreError, setGoogleStoreError] = useState<string | null>(null);
  const [googlePhone, setGooglePhone] = useState(initialPhone);
  const [googlePhoneError, setGooglePhoneError] = useState<string | null>(null);
  const [googleWebsiteType, setGoogleWebsiteType] =
    useState<GoogleWebsiteType>("ecommerce");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const websiteTypeOptions: { value: GoogleWebsiteType; label: string }[] = [
    { value: "ecommerce", label: "E-commerce" },
    { value: "service", label: "Service" },
  ];

  const handleOpenChange = (open: boolean) => {
    if (isSubmitting) {
      return;
    }
    if (!open) {
      setGoogleStoreError(null);
      setGooglePhoneError(null);
    }
    onOpenChange(open);
  };

  const handleStoreNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (googleStoreError) {
      setGoogleStoreError(null);
    }
    setGoogleStoreName(event.target.value);
  };

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (googlePhoneError) {
      setGooglePhoneError(null);
    }
    setGooglePhone(event.target.value);
  };

  const persistGoogleSignupMetadata = (
    storeName: string,
    phone?: string,
    websiteType: GoogleWebsiteType = googleWebsiteType
  ) => {
    if (typeof document === "undefined") {
      return;
    }

    const expires = new Date(Date.now() + 10 * 60 * 1000).toUTCString();
    document.cookie = `google_store_name=${encodeURIComponent(storeName)}; expires=${expires}; path=/; SameSite=Lax`;

    if (phone) {
      document.cookie = `google_phone_number=${encodeURIComponent(
        phone
      )}; expires=${expires}; path=/; SameSite=Lax`;
    } else {
      document.cookie = `google_phone_number=; expires=${new Date(
        0
      ).toUTCString()}; path=/; SameSite=Lax`;
    }

    document.cookie = `google_website_type=${encodeURIComponent(
      websiteType
    )}; expires=${expires}; path=/; SameSite=Lax`;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedStoreName = googleStoreName.trim();
    const validationResult = storeNameSchema.safeParse(trimmedStoreName);
    const trimmedPhone = googlePhone.trim();
    const phoneValidationResult = phoneNumberSchema.safeParse(trimmedPhone);

    if (!validationResult.success) {
      setGoogleStoreError(
        validationResult.error.issues[0]?.message || "Invalid store name."
      );
      return;
    }

    if (!phoneValidationResult.success) {
      setGooglePhoneError(
        phoneValidationResult.error.issues[0]?.message ||
          "Invalid phone number."
      );
      return;
    }

    setGoogleStoreError(null);
    setGooglePhoneError(null);
    setIsSubmitting(true);

    try {
      persistGoogleSignupMetadata(
        validationResult.data,
        trimmedPhone,
        googleWebsiteType
      );
      await signIn("google", {
        callbackUrl: "/admin",
        store_name: validationResult.data,
      });
    } catch (error) {
      console.error("Google signup error:", error);
      setGoogleStoreError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeDialog = () => {
    if (isSubmitting) {
      return;
    }
    onOpenChange(false);
    setGoogleStoreError(null);
    setGooglePhoneError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="rounded-2xl bg-white p-6 shadow-2xl sm:max-w-lg sm:p-8"
        showCloseButton={!isSubmitting}
      >
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Add your store name
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            We use this to personalize your workspace before connecting your
            Google account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <FloatingInput
              id="google_store_name"
              type="text"
              value={googleStoreName}
              autoComplete="organization"
              disabled={isSubmitting}
              onChange={handleStoreNameChange}
              className={cn(
                "peer block w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none",
                googleStoreError &&
                  "border-red-300 focus:border-red-500 focus:ring-red-500"
              )}
            />
            <FloatingLabel htmlFor="google_store_name">
              <User className="mr-2 h-4 w-4" />
              Store Name
            </FloatingLabel>
            {googleStoreError && (
              <p className="mt-2 flex items-center text-sm font-medium text-red-500">
                <AlertCircle className="mr-1 h-4 w-4" />
                {googleStoreError}
              </p>
            )}
          </div>

          <div className="relative">
            <FloatingInput
              id="google_phone"
              type="tel"
              value={googlePhone}
              autoComplete="tel"
              disabled={isSubmitting}
              onChange={handlePhoneChange}
              className={cn(
                "peer block w-full rounded-lg border border-gray-300 bg-transparent px-4 py-3 text-sm transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none",
                googlePhoneError &&
                  "border-red-300 focus:border-red-500 focus:ring-red-500"
              )}
            />
            <FloatingLabel htmlFor="google_phone">
              <Phone className="mr-2 h-4 w-4" />
              Phone Number
            </FloatingLabel>
            {googlePhoneError && (
              <p className="mt-2 flex items-center text-sm font-medium text-red-500">
                <AlertCircle className="mr-1 h-4 w-4" />
                {googlePhoneError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-900">Website type</p>
            <p className="text-xs text-gray-500">
              Choose the experience that fits your business.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {websiteTypeOptions.map(option => {
                const isSelected = googleWebsiteType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={isSelected}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                      isSelected
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    )}
                    onClick={() => setGoogleWebsiteType(option.value)}
                    disabled={isSubmitting}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <DialogFooter className="gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={closeDialog}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={cn(
                "w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white transition-colors duration-200 hover:bg-gray-800 sm:w-auto",
                isSubmitting ? "cursor-not-allowed opacity-80" : ""
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Connecting...
                </div>
              ) : (
                "Continue with Google"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
