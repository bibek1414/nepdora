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
  const { clearAuthData } = useAuth();
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
            clearAuthData();
            router.push("/admin/login");
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
    <div className="max-w-2xl">
      {/* Profile Settings Form */}
      <div className="max-w-4xl">
        <Card className="border-none shadow-none">
          <CardContent className="pt-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-500 uppercase">
                      Personal Information
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                              <User className="h-4 w-4" />
                              <span>First Name</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your first name"
                                {...field}
                                className="focus:border-primary focus:ring-primary h-11 border-gray-300"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                              <User className="h-4 w-4" />
                              <span>Last Name</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your last name"
                                {...field}
                                className="focus:border-primary focus:ring-primary h-11 border-gray-300"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-500 uppercase">
                      Contact Information
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <FormLabel className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                          <Mail className="h-4 w-4" />
                          <span>Email Address</span>
                        </FormLabel>
                        <Input
                          value={profile?.email || ""}
                          disabled
                          className="h-11 cursor-not-allowed border-gray-300 bg-gray-50 text-gray-600"
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="phone_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                              <Smartphone className="h-4 w-4" />
                              <span>Phone Number</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your phone number"
                                {...field}
                                className="focus:border-primary focus:ring-primary h-11 border-gray-300"
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="mb-4 text-sm font-semibold tracking-wide text-gray-500 uppercase">
                      Website Configuration
                    </h3>
                    <FormField
                      control={form.control}
                      name="website_type"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Website Type
                          </FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-y-0 space-x-3">
                                <FormControl>
                                  <RadioGroupItem value="ecommerce" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  E-commerce
                                  {profile?.website_type === "ecommerce" && (
                                    <span className="ml-2 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                                      Currently Active
                                    </span>
                                  )}
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-y-0 space-x-3">
                                <FormControl>
                                  <RadioGroupItem value="service" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Service
                                  {profile?.website_type === "service" && (
                                    <span className="ml-2 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                                      Currently Active
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

                <div className="flex items-center justify-between border-t pt-6">
                  <div className="text-sm text-gray-500">
                    {form.formState.isDirty && (
                      <div className="flex items-center space-x-2">
                        <div className="bg-primary h-2 w-2 rounded-full"></div>
                        <span>You have unsaved changes</span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.reset()}
                      disabled={
                        !form.formState.isDirty || updateProfile.isPending
                      }
                      className="h-11 rounded-lg border-gray-300 px-6 font-medium"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={
                        !form.formState.isDirty || updateProfile.isPending
                      }
                      className="bg-primary hover:bg-primary/80 h-11 rounded-lg px-8 font-semibold text-white shadow-md transition-all"
                    >
                      {updateProfile.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
