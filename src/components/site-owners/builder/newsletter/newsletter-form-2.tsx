import React, { useState } from "react";
import { Button } from "@/components/ui/site-owners/button";
import { Input } from "@/components/ui/input";
import { Mail, Send, Loader2, CheckCircle, Sparkles } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { toast } from "sonner";
import {
  NewsletterData,
  NewsletterFormSubmission,
} from "@/types/owner-site/components/newsletter";
import { useCreateNewsletter } from "@/hooks/owner-site/admin/use-newsletter";

interface NewsletterForm2Props {
  data: NewsletterData;
  siteUser?: string;
  isPreview?: boolean;
  isEditable?: boolean;
  onDataChange?: (data: NewsletterData) => void;
}

export const NewsletterForm2: React.FC<NewsletterForm2Props> = ({
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPreview && siteUser && formData.email) {
      createNewsletter.mutate(formData, {
        onSuccess: () => {
          setIsSubscribed(true);
          setFormData({ email: "", is_subscribed: true });
          setTimeout(() => setIsSubscribed(false), 3000);
          toast.success("Successfully subscribed to newsletter!");
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

  // Success state
  if (isSubscribed && !isEditable) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-slate-800 p-4 sm:rounded-2xl sm:p-6 md:p-8 lg:p-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
            <Sparkles className="h-4 w-4 text-slate-50 sm:h-5 sm:w-5 md:h-6 md:w-6" />
          </div>
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
            <Mail className="h-5 w-5 text-slate-50 sm:h-6 sm:w-6 md:h-8 md:w-8" />
          </div>
          <div className="absolute bottom-3 left-6 sm:bottom-6 sm:left-12">
            <Sparkles className="h-3 w-3 text-slate-50 sm:h-4 sm:w-4" />
          </div>
        </div>

        <div className="relative z-10 text-center">
          <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-400 sm:mb-4 sm:h-14 sm:w-14 md:h-16 md:w-16" />
          <h3 className="mb-2 text-lg font-bold text-slate-50 sm:mb-3 sm:text-xl md:text-2xl">
            Welcome to our community!
          </h3>
          <p className="text-sm text-slate-50 opacity-80 sm:text-base">
            Thank you for subscribing. You&apos;ll receive amazing content soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-slate-800 p-4 sm:rounded-2xl sm:p-6 md:p-8 lg:p-12">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
          <Sparkles className="h-4 w-4 text-slate-50 sm:h-5 sm:w-5 md:h-6 md:w-6" />
        </div>
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8">
          <Mail className="h-5 w-5 text-slate-50 sm:h-6 sm:w-6 md:h-8 md:w-8" />
        </div>
        <div className="absolute bottom-3 left-6 sm:bottom-6 sm:left-12">
          <Sparkles className="h-3 w-3 text-slate-50 sm:h-4 sm:w-4" />
        </div>
        <div className="absolute right-3 bottom-6 sm:right-6 sm:bottom-12">
          <Mail className="h-4 w-4 text-slate-50 sm:h-5 sm:w-5" />
        </div>
      </div>

      <div className="relative z-10">
        <div className="mb-4 text-center sm:mb-6 md:mb-8">
          {isEditable ? (
            <EditableText
              value={data.title}
              onChange={value => updateData("title", value)}
              as="h2"
              className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl"
              isEditable={true}
              placeholder="Enter title..."
            />
          ) : (
            <h2 className="mb-3 text-2xl font-bold text-slate-50 sm:mb-4 sm:text-3xl md:text-4xl">
              {data.title}
            </h2>
          )}

          {data.subtitle &&
            (isEditable ? (
              <EditableText
                value={data.subtitle}
                onChange={value => updateData("subtitle", value)}
                as="p"
                className="mb-4 text-base sm:mb-6 sm:text-lg md:text-xl"
                isEditable={true}
                placeholder="Enter subtitle..."
              />
            ) : (
              <p className="mb-4 text-base text-slate-50 opacity-90 sm:mb-6 sm:text-lg md:text-xl">
                {data.subtitle}
              </p>
            ))}

          {data.description &&
            (isEditable ? (
              <EditableText
                value={data.description}
                onChange={value => updateData("description", value)}
                as="p"
                className="mx-auto max-w-2xl text-sm sm:text-base md:text-lg"
                isEditable={true}
                placeholder="Enter description..."
                multiline={true}
              />
            ) : (
              <p className="mx-auto max-w-2xl text-sm text-slate-50 opacity-80 sm:text-base md:text-lg">
                {data.description}
              </p>
            ))}
        </div>

        <form onSubmit={handleSubmit} className="mx-auto max-w-md">
          <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:grid sm:grid-cols-2">
            <Input
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={data.placeholder_text || "Enter your email address"}
              required
              className="w-full border-gray-200 bg-white/10 text-sm text-gray-600 placeholder:text-gray-600 focus:bg-white/20 sm:text-base"
              disabled={createNewsletter.isPending || isPreview}
            />
            <Button
              type="submit"
              variant="default"
              disabled={
                createNewsletter.isPending || isPreview || !formData.email
              }
              className="bg-primary w-full px-4 text-sm font-semibold text-white hover:bg-white/90 sm:w-auto sm:px-6 sm:text-base md:px-8"
            >
              {createNewsletter.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin sm:h-4 sm:w-4" />
              ) : (
                <span className="truncate">{data.button_text}</span>
              )}
            </Button>
          </div>

          {data.show_privacy_note && data.privacy_note && (
            <p className="text-center text-xs text-slate-50 opacity-70 sm:text-sm">
              {data.privacy_note}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
