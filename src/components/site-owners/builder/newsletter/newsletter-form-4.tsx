"use client";

import React, { useState } from "react";
import { Send, Loader2, CheckCircle } from "lucide-react";
import { useCreateNewsletter } from "@/hooks/owner-site/admin/use-newsletter";
import { toast } from "sonner";
import { EditableText } from "@/components/ui/editable-text";
import {
  NewsletterData,
  NewsletterFormSubmission,
} from "@/types/owner-site/components/newsletter";

interface NewsletterForm4Props {
  data: NewsletterData;
  siteUser?: string;
  isPreview?: boolean;
  isEditable?: boolean;
  onDataChange?: (data: NewsletterData) => void;
}

export const NewsletterForm4: React.FC<NewsletterForm4Props> = ({
  data,
  siteUser,
  isPreview = false,
  isEditable = false,
  onDataChange,
}) => {
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

  // Success state
  if (isSubscribed && !isEditable) {
    return (
      <div className="relative flex min-h-[400px] flex-col items-center justify-center gap-4 overflow-hidden rounded-[3rem] border border-gray-100 bg-gray-50 p-8 shadow-lg md:p-16">
        <CheckCircle className="z-10 h-16 w-16 text-green-600" />
        <h3 className="z-10 text-2xl font-semibold text-green-800">
          Thank you for subscribing!
        </h3>
        <p className="z-10 text-green-600">
          You&apos;ll receive our newsletter updates soon.
        </p>

        {/* Background Decor */}
        <div className="bg-brand-100/50 pointer-events-none absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-blue-100/50 blur-[100px]" />
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center gap-12 overflow-hidden rounded-[3rem] border border-gray-100 bg-gray-50 p-8 md:p-16 lg:flex-row">
      <div className="relative z-10 w-full flex-1">
        <EditableText
          value={data.title}
          onChange={value => updateData("title", value)}
          as="h2"
          className="text-navy-950 mb-6 text-3xl leading-tight font-semibold whitespace-pre-wrap md:text-5xl"
          isEditable={isEditable}
          placeholder="Enter title..."
          multiline={true}
        />

        <EditableText
          value={data.description || ""}
          onChange={value => updateData("description", value)}
          as="p"
          className="max-w-md font-medium text-slate-500"
          isEditable={isEditable}
          placeholder="Enter description..."
          multiline={true}
        />
      </div>

      <div className="relative z-10 w-full lg:w-[450px]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={data.placeholder_text || "Enter your executive email"}
            className="focus:ring-brand-500/20 focus:border-brand-500 grow rounded-2xl border border-gray-200 bg-white px-6 py-4 font-medium text-gray-900 transition-all outline-none placeholder:text-gray-500 focus:ring-2 disabled:opacity-50"
            disabled={createNewsletter.isPending || isPreview}
            required
          />
          <button
            type="submit"
            disabled={
              createNewsletter.isPending || isPreview || !formData.email
            }
            className="flex min-w-[120px] items-center justify-center gap-2 rounded-2xl bg-black px-8 py-4 text-xs font-semibold tracking-widest text-white shadow-xl transition-all disabled:cursor-not-allowed disabled:opacity-70"
          >
            {createNewsletter.isPending ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                {data.button_text} <Send size={16} />
              </>
            )}
          </button>
        </form>
        {data.show_privacy_note && data.privacy_note && (
          <p className="mt-4 text-[10px] leading-relaxed font-medium text-gray-400">
            {data.privacy_note}
          </p>
        )}
      </div>

      {/* Background Decor */}
      <div className="bg-brand-100/50 pointer-events-none absolute top-0 right-0 -mt-20 -mr-20 h-80 w-80 rounded-full blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 -mb-20 -ml-20 h-80 w-80 rounded-full bg-blue-100/50 blur-[100px]" />
    </div>
  );
};
