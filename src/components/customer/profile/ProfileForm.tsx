"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileSchema,
  ProfileFormValues,
} from "@/schemas/customer/profile.form";
import {
  useProfile,
  useUpdateProfile,
} from "@/hooks/customer/use-customer-profile";
import { Button } from "@/components/ui/site-owners/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

export const ProfileForm = () => {
  const { data: profile, isLoading: isFetching } = useProfile();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { data: themeResponse } = useThemeQuery();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    values: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
    },
  });
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
    },
  };
  const onSubmit = (data: ProfileFormValues) => {
    updateProfile(data);
  };

  if (isFetching) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-11 w-32" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <Label
            htmlFor="first_name"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <User
              style={{
                color: theme.colors.primary,
              }}
              className="h-4 w-4"
            />
            First Name
          </Label>
          <Input
            id="first_name"
            {...register("first_name")}
            value={profile?.first_name || ""}
            placeholder="Enter your first name"
            className={`border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all ${
              errors.first_name
                ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                : ""
            }`}
          />
          {errors.first_name && (
            <p className="text-destructive mt-1 text-xs font-medium">
              {errors.first_name.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <Label
            htmlFor="last_name"
            className="flex items-center gap-2 text-sm font-semibold"
          >
            <User
              className="h-4 w-4"
              style={{
                color: theme.colors.primary,
              }}
            />
            Last Name
          </Label>
          <Input
            id="last_name"
            {...register("last_name")}
            value={profile?.last_name || ""}
            placeholder="Enter your last name"
            className={`border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all ${
              errors.last_name
                ? "border-destructive focus:border-destructive focus:ring-destructive/20"
                : ""
            }`}
          />
          {errors.last_name && (
            <p className="text-destructive mt-1 text-xs font-medium">
              {errors.last_name.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Label
          htmlFor="email"
          className="flex items-center gap-2 text-sm font-semibold"
        >
          <Mail
            className="h-4 w-4"
            style={{
              color: theme.colors.primary,
            }}
          />
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          value={profile?.email || ""}
          placeholder="Enter your email address"
          disabled // Email usually shouldn't be changeable without verification
          className="border-border/50 bg-secondary/30 cursor-not-allowed rounded-xl opacity-70"
        />
        {errors.email && (
          <p className="text-destructive mt-1 text-xs font-medium">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <Label
          htmlFor="phone"
          className="flex items-center gap-2 text-sm font-semibold"
        >
          <Phone
            className="h-4 w-4"
            style={{
              color: theme.colors.primary,
            }}
          />
          Phone Number
        </Label>
        <Input
          id="phone"
          {...register("phone")}
          value={profile?.phone || ""}
          placeholder="Enter your phone number"
          className={`border-border/50 focus:border-primary/50 focus:ring-primary/20 rounded-xl transition-all ${
            errors.phone
              ? "border-destructive focus:border-destructive focus:ring-destructive/20"
              : ""
          }`}
        />
        {errors.phone && (
          <p className="text-destructive mt-1 text-xs font-medium">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <Label
          htmlFor="address"
          className="flex items-center gap-2 text-sm font-semibold"
        >
          <MapPin
            className="h-4 w-4"
            style={{
              color: theme.colors.primary,
            }}
          />
          Address
        </Label>
        <textarea
          id="address"
          {...register("address")}
          placeholder="Enter your full address"
          rows={3}
          className={`border-border/50 bg-background focus:border-primary/50 focus:ring-primary/20 w-full resize-none rounded-xl border px-4 py-2 text-sm transition-all focus:ring-2 focus:outline-none ${
            errors.address
              ? "border-destructive focus:border-destructive focus:ring-destructive/20"
              : ""
          }`}
        />
        {errors.address && (
          <p className="text-destructive mt-1 text-xs font-medium">
            {errors.address.message}
          </p>
        )}
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          variant="default"
          disabled={isUpdating || !isDirty}
          className="rounded-xl px-8 py-6 text-lg font-bold shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isUpdating ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
};
