import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Send, Loader2, CheckCircle } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";
import { toast } from "sonner";
import {
  NewsletterData,
  NewsletterFormSubmission,
} from "@/types/owner-site/components/newsletter";
import { useCreateNewsletter } from "@/hooks/owner-site/admin/use-newsletter";

interface NewsletterForm1Props {
  data: NewsletterData;
  siteUser?: string;
  isPreview?: boolean;
  isEditable?: boolean;
  onDataChange?: (data: NewsletterData) => void;
}

export const NewsletterForm1: React.FC<NewsletterForm1Props> = ({
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
      <Card className="mx-auto max-w-md border-green-200 bg-green-50 shadow-lg">
        <CardContent className="p-8 text-center">
          <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-600" />
          <h3 className="mb-2 text-xl font-semibold text-green-800">
            Thank you for subscribing!
          </h3>
          <p className="text-green-600">
            You&apos;ll receive our newsletter updates soon.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-md bg-white">
      <div className="p-8">
        <div className="mb-6 text-center">
          <Mail className="mx-auto mb-4 h-12 w-12 text-blue-600" />

          {data.subtitle &&
            (isEditable ? (
              <EditableText
                value={data.subtitle}
                onChange={value => updateData("subtitle", value)}
                as="h1"
                className="mb-4 text-lg text-gray-600"
                isEditable={true}
                placeholder="Enter subtitle..."
              />
            ) : (
              <p className="mb-4 text-lg text-gray-600">{data.subtitle}</p>
            ))}

          {data.description &&
            (isEditable ? (
              <EditableText
                value={data.description}
                onChange={value => updateData("description", value)}
                as="p"
                className="text-gray-500"
                isEditable={true}
                placeholder="Enter description..."
                multiline={true}
              />
            ) : (
              <p className="text-gray-500">{data.description}</p>
            ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder={data.placeholder_text || "Enter your email address"}
              required
              className="w-full border-gray-600 bg-white text-base shadow-sm placeholder:text-gray-500"
              disabled={createNewsletter.isPending || isPreview}
            />
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={
                createNewsletter.isPending || isPreview || !formData.email
              }
              className="w-fit"
            >
              {createNewsletter.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {data.button_text}
                </>
              )}
            </Button>
          </div>

          {data.show_privacy_note && data.privacy_note && (
            <p className="mt-3 text-center text-xs text-gray-500">
              {data.privacy_note}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
