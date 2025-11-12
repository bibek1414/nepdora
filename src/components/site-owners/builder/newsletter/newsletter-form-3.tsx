import React, { useState } from "react";
import { Button } from "@/components/ui/site-owners/button";
import { Input } from "@/components/ui/input";
import { Mail, Send, Loader2, CheckCircle } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { toast } from "sonner";
import {
  NewsletterData,
  NewsletterFormSubmission,
} from "@/types/owner-site/components/newsletter";
import { useCreateNewsletter } from "@/hooks/owner-site/admin/use-newsletter";

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
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:rounded-3xl sm:p-8 md:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 sm:mb-4 sm:h-16 sm:w-16">
            <CheckCircle className="h-6 w-6 text-green-600 sm:h-8 sm:w-8 md:h-10 md:w-10" />
          </div>
          <h3 className="mb-2 text-xl font-semibold tracking-tight text-neutral-900 sm:mb-3 sm:text-2xl md:text-3xl">
            You&apos;re subscribed
          </h3>
          <p className="text-sm leading-relaxed text-neutral-600 sm:text-base">
            Thanks for joining. We&apos;ll send occasional, thoughtful updates —
            no spam, ever.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-4 sm:rounded-3xl sm:p-6 md:p-8 lg:p-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-6 sm:gap-8 md:grid md:grid-cols-2 md:items-center md:gap-8 lg:gap-12">
          {/* Title Section */}
          <div className="w-full text-center md:text-left">
            {isEditable ? (
              <EditableText
                value={data.title}
                onChange={value => updateData("title", value)}
                as="h2"
                className="mb-0 text-2xl leading-tight font-black tracking-tight text-neutral-900 sm:text-3xl md:text-4xl lg:text-5xl"
                isEditable={true}
                placeholder="Enter title..."
              />
            ) : (
              <h2 className="mb-0 text-2xl leading-tight font-black tracking-tight text-neutral-900 sm:text-3xl md:text-4xl lg:text-5xl">
                {data.title}
              </h2>
            )}
          </div>

          {/* Form Section */}
          <div className="w-full">
            <form
              onSubmit={handleSubmit}
              className="w-full"
              aria-label="Newsletter subscription form"
            >
              <div className="flex w-full flex-col gap-3 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-neutral-200 ring-inset sm:flex-row sm:gap-0 sm:rounded-full">
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-neutral-400 sm:h-5 sm:w-5" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={data.placeholder_text || "Your email address"}
                    aria-label="Email address"
                    required
                    className="h-12 w-full rounded-2xl border-0 bg-transparent pr-4 pl-11 text-sm placeholder:text-neutral-400 focus:ring-2 focus:ring-blue-500 focus:ring-inset sm:h-14 sm:rounded-l-full sm:rounded-r-none sm:pl-12 sm:text-base"
                    disabled={createNewsletter.isPending || isPreview}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={
                    createNewsletter.isPending || isPreview || !formData.email
                  }
                  variant="default"
                  className="bg-primary h-12 w-full shrink-0 rounded-2xl px-5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70 sm:h-14 sm:w-auto sm:rounded-l-none sm:rounded-r-full sm:px-6 sm:text-base"
                >
                  {createNewsletter.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">Subscribing</span>
                      <span className="sm:hidden">Sub...</span>
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      <span className="truncate">{data.button_text}</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
