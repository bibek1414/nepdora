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
      <div className="rounded-3xl border border-neutral-200 bg-white p-12 shadow-sm">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="mb-3 text-3xl font-semibold tracking-tight text-neutral-900">
            You’re subscribed
          </h3>
          <p className="text-base leading-relaxed text-neutral-600">
            Thanks for joining. We’ll send occasional, thoughtful updates — no
            spam, ever.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 p-10 sm:p-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            {isEditable ? (
              <EditableText
                value={data.title}
                onChange={value => updateData("title", value)}
                as="h2"
                className="mb-2 text-5xl font-black tracking-tight text-neutral-900 sm:text-6xl"
                isEditable={true}
                placeholder="Enter title..."
              />
            ) : (
              <h2 className="mb-2 text-5xl font-black tracking-tight text-neutral-900 sm:text-6xl">
                {data.title}
              </h2>
            )}
          </div>

          <div>
            <form
              onSubmit={handleSubmit}
              className="w-full space-y-3"
              aria-label="Newsletter subscription form"
            >
              <div className="flex w-full overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-neutral-200 ring-inset">
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={data.placeholder_text || "Your email address"}
                    aria-label="Email address"
                    required
                    className="h-14 w-full rounded-l-full rounded-r-none border-0 bg-transparent pr-4 pl-12 text-base placeholder:text-neutral-400 focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                    disabled={createNewsletter.isPending || isPreview}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={
                    createNewsletter.isPending || isPreview || !formData.email
                  }
                  variant="default"
                  className="bg-primary h-14 shrink-0 rounded-l-none rounded-r-full px-6 text-base font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {createNewsletter.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Subscribing
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {data.button_text}
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
