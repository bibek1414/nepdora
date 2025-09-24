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

  const backgroundColor = data.background_color || "#1e293b";
  const textColor = data.text_color || "#f8fafc";

  // Success state
  if (isSubscribed && !isEditable) {
    return (
      <div
        className="relative overflow-hidden rounded-2xl p-12"
        style={{ backgroundColor }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4">
            <Sparkles className="h-6 w-6" style={{ color: textColor }} />
          </div>
          <div className="absolute top-8 right-8">
            <Mail className="h-8 w-8" style={{ color: textColor }} />
          </div>
          <div className="absolute bottom-6 left-12">
            <Sparkles className="h-4 w-4" style={{ color: textColor }} />
          </div>
        </div>

        <div className="relative z-10 text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-400" />
          <h3 className="mb-3 text-2xl font-bold" style={{ color: textColor }}>
            Welcome to our community!
          </h3>
          <p style={{ color: textColor, opacity: 0.8 }}>
            Thank you for subscribing. You&apos;ll receive amazing content soon!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-12"
      style={{ backgroundColor }}
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 left-4">
          <Sparkles className="h-6 w-6" style={{ color: textColor }} />
        </div>
        <div className="absolute top-8 right-8">
          <Mail className="h-8 w-8" style={{ color: textColor }} />
        </div>
        <div className="absolute bottom-6 left-12">
          <Sparkles className="h-4 w-4" style={{ color: textColor }} />
        </div>
        <div className="absolute right-6 bottom-12">
          <Mail className="h-5 w-5" style={{ color: textColor }} />
        </div>
      </div>

      <div className="relative z-10">
        <div className="mb-8 text-center">
          {isEditable ? (
            <EditableText
              value={data.title}
              onChange={value => updateData("title", value)}
              as="h2"
              className="mb-4 text-4xl font-bold"
              isEditable={true}
              placeholder="Enter title..."
            />
          ) : (
            <h2
              className="mb-4 text-4xl font-bold"
              style={{ color: textColor }}
            >
              {data.title}
            </h2>
          )}

          {data.subtitle &&
            (isEditable ? (
              <EditableText
                value={data.subtitle}
                onChange={value => updateData("subtitle", value)}
                as="p"
                className="mb-6 text-xl"
                isEditable={true}
                placeholder="Enter subtitle..."
              />
            ) : (
              <p
                className="mb-6 text-xl"
                style={{ color: textColor, opacity: 0.9 }}
              >
                {data.subtitle}
              </p>
            ))}

          {data.description &&
            (isEditable ? (
              <EditableText
                value={data.description}
                onChange={value => updateData("description", value)}
                as="p"
                className="mx-auto max-w-2xl text-lg"
                isEditable={true}
                placeholder="Enter description..."
                multiline={true}
              />
            ) : (
              <p
                className="mx-auto max-w-2xl text-lg"
                style={{ color: textColor, opacity: 0.8 }}
              >
                {data.description}
              </p>
            ))}
        </div>

        <form onSubmit={handleSubmit} className="mx-auto max-w-md">
          <div className="mb-4 grid grid-cols-2 gap-2">
            <Input
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={data.placeholder_text || "Enter your email address"}
              required
              className="w-full border-gray-200 bg-white/10 text-gray-600 placeholder:text-gray-600 focus:bg-white/20"
              disabled={createNewsletter.isPending || isPreview}
            />
            <Button
              type="submit"
              variant="default"
              disabled={
                createNewsletter.isPending || isPreview || !formData.email
              }
              className="bg-primary px-8 font-semibold text-white hover:bg-white/90"
            >
              {createNewsletter.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                data.button_text
              )}
            </Button>
          </div>

          {data.show_privacy_note && data.privacy_note && (
            <p
              className="text-center text-sm"
              style={{ color: textColor, opacity: 0.7 }}
            >
              {data.privacy_note}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
