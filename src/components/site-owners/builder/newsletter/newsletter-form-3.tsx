"use client";

import React, { useState } from "react";
import { Loader2, CheckCircle, Zap, Mail } from "lucide-react";
import { useCreateNewsletter } from "@/hooks/owner-site/admin/use-newsletter";
import { toast } from "sonner";
import { EditableText } from "@/components/ui/editable-text";
import {
  NewsletterData,
  NewsletterFormSubmission,
} from "@/types/owner-site/components/newsletter";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { hexToRgba } from "@/lib/utils";
import { Button } from "@/components/ui/site-owners/button";
import { Input } from "@/components/ui/input";

interface NewsletterForm3Props {
  data: NewsletterData;
  siteUser?: string;
  isPreview?: boolean;
  isEditable?: boolean;
  onDataChange?: (data: NewsletterData) => void;
}

export const NewsletterForm3: React.FC<NewsletterForm3Props> = ({
  data,
  siteUser,
  isPreview = false,
  isEditable = false,
  onDataChange,
}) => {
  const { data: themeResponse } = useThemeQuery();
  const theme = themeResponse?.data?.[0]?.data?.theme;
  const [formData, setFormData] = useState<NewsletterFormSubmission>({
    email: "",
    is_subscribed: true,
  });
  const [isSubscribed, setIsSubscribed] = useState(false);

  const createNewsletter = useCreateNewsletter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({ email: value, is_subscribed: true });
  };

  const updateData = (field: string, value: string) => {
    if (onDataChange) {
      onDataChange({
        ...data,
        [field]: value,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      toast.error("Please enter your email");
      return;
    }

    if (!isPreview && siteUser && formData.email) {
      createNewsletter.mutate(formData, {
        onSuccess: () => {
          setIsSubscribed(true);
          setFormData({ email: "", is_subscribed: true });
          setTimeout(() => setIsSubscribed(false), 3000);
          toast.success("Successfully subscribed to our newsletter!");
        },
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          if (error?.status === 409) {
            toast.error("This email is already subscribed to the newsletter.");
          } else {
            toast.error("Something went wrong. Please try again.");
          }
        },
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="flex items-center gap-2 rounded-full px-3 py-1 text-sm transition-colors"
        style={{
          background: theme?.colors.primary,
          color: theme?.colors.primaryForeground,
        }}
      >
        <EditableText
          value={data.badge || "Simple Process"}
          onChange={val => updateData("badge", val)}
          isEditable={isEditable}
          as="span"
          placeholder="Badge text..."
        />
      </div>

      <EditableText
        value={data.title}
        onChange={val => updateData("title", val)}
        isEditable={isEditable}
        as="h1"
        className="mt-4 text-center text-4xl font-semibold text-gray-900 md:text-6xl"
        placeholder="Enter title..."
        multiline
      />

      <EditableText
        value={data.description || ""}
        onChange={val => updateData("description", val)}
        isEditable={isEditable}
        as="p"
        className="mx-auto mt-6 max-w-2xl text-center"
        placeholder="Enter description..."
        multiline
      />
      <form
        onSubmit={handleSubmit}
        className="focus-within:border-primary/50 focus-within:ring-primary/10 relative mt-8 flex w-full max-w-md items-center rounded-lg border border-slate-200 p-1.5 transition-all duration-300 focus-within:ring-4"
      >
        <Mail className="absolute left-4 size-5 text-slate-400" />

        <Input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder={data.placeholder_text || "Enter your email"}
          className="h-auto w-full flex-1 border-none bg-transparent py-4 pl-12 text-sm shadow-none focus-visible:ring-0"
          disabled={createNewsletter.isPending || isPreview}
          required
        />

        <Button
          type="submit"
          disabled={createNewsletter.isPending || isPreview || !formData.email}
          className="ml-auto h-auto rounded-md px-6 py-4 text-sm font-semibold transition-all duration-300 hover:brightness-110 active:scale-95"
          variant="default"
        >
          {createNewsletter.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <EditableText
              value={data.button_text}
              onChange={val => updateData("button_text", val)}
              isEditable={isEditable}
              as="span"
              placeholder="Button text..."
            />
          )}
        </Button>
      </form>

      {data.show_privacy_note && data.privacy_note && (
        <p className="mt-4 text-center text-xs text-slate-400">
          {data.privacy_note}
        </p>
      )}
    </div>
  );
};
