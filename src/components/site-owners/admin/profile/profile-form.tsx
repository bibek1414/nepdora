"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Mail,
  Phone,
  Calendar,
  Loader2,
  User,
  Smartphone,
  CheckCircle,
} from "lucide-react";
import { useUserProfile, useUpdateUserProfile } from "@/hooks/use-user";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone_number: z.string().min(10, "Phone number must be at least 10 digits"),
  website_type: z.enum(["ecommerce", "service"]),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfileForm = () => {
  const { data: profile, isLoading, isError } = useUserProfile();
  const updateProfile = useUpdateUserProfile();
  const { logout } = useAuth();
  const router = useRouter();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone_number: "",
      website_type: "ecommerce", // Default value to avoid controlled/uncontrolled warning
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone_number: profile.phone_number || "",
        website_type:
          (profile.website_type as "ecommerce" | "service") || "ecommerce",
      });
    }
  }, [profile, form]);

  const onSubmit = (values: ProfileFormValues) => {
    updateProfile.mutate(values, {
      onSuccess: () => {
        toast.success("Profile updated successfully", {
          icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        });

        if (
          profile?.website_type &&
          values.website_type !== profile.website_type
        ) {
          toast.info("Website type changed! Redirecting to login...", {
            duration: 2000,
          });

          // Small delay to let the toast show
          setTimeout(() => {
            // Logout and redirect to main admin login
            logout("/admin/login");
          }, 1500);
        }
      },
      onError: error => {
        toast.error(error.message || "Failed to update profile");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <span className="text-lg font-semibold text-red-600">!</span>
        </div>
        <p className="text-red-600">
          Failed to load profile. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[12px] font-bold text-[#2c3e50] uppercase tracking-tight">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your first name"
                        {...field}
                        className="h-11 rounded-[12px] border-[#e2e8f0] bg-white px-4 text-[13px] transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 focus:outline-none"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[12px] font-bold text-[#2c3e50] uppercase tracking-tight">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your last name"
                        {...field}
                        className="h-11 rounded-[12px] border-[#e2e8f0] bg-white px-4 text-[13px] transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 focus:outline-none"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />

              <div className="space-y-1.5">
                <FormLabel className="text-[12px] font-bold text-[#2c3e50] uppercase tracking-tight">
                  Email Address
                </FormLabel>
                <Input
                  value={profile?.email || ""}
                  disabled
                  className="h-11 rounded-[12px] border-[#e2e8f0] bg-[#f8fafc] px-4 text-[13px] text-[#5b6e8c] cursor-not-allowed border-dashed focus-visible:ring-0"
                />
              </div>

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem className="space-y-1.5">
                    <FormLabel className="text-[12px] font-bold text-[#2c3e50] uppercase tracking-tight">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your phone number"
                        {...field}
                        className="h-11 rounded-[12px] border-[#e2e8f0] bg-white px-4 text-[13px] transition-all focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 focus:outline-none"
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 mt-1" />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="website_type"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-[12px] font-bold text-[#2c3e50] uppercase tracking-tight">
                        Website Type
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex flex-row gap-6 mt-1"
                        >
                          <FormItem className="flex items-center space-y-0 space-x-2">
                            <FormControl>
                              <RadioGroupItem value="ecommerce" className="border-blue-600 text-blue-600" />
                            </FormControl>
                            <FormLabel className="font-semibold text-sm text-[#0d1117] cursor-pointer">
                              E-commerce
                              {profile?.website_type === "ecommerce" && (
                                <span className="ml-2 bg-[#e8f5e9] text-[#2e7d32] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Default
                                </span>
                              )}
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-y-0 space-x-2">
                            <FormControl>
                              <RadioGroupItem value="service" className="border-blue-600 text-blue-600" />
                            </FormControl>
                            <FormLabel className="font-semibold text-sm text-[#0d1117] cursor-pointer">
                              Service
                              {profile?.website_type === "service" && (
                                <span className="ml-2 bg-[#e8f5e9] text-[#2e7d32] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  Default
                                </span>
                              )}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#f0f2f5]">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={!form.formState.isDirty || updateProfile.isPending}
                className="h-10 rounded-full border-[#e2e8f0] px-6 text-[13px] font-semibold text-[#1f2a48] hover:bg-[#f8fafc] hover:border-[#cbd5e1] shadow-none"
              >
                Discard
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isDirty || updateProfile.isPending}
                className="h-10 rounded-full bg-blue-600 px-8 text-[13px] font-semibold text-white shadow-sm hover:bg-blue-700 transition-all"
              >
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update account"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
