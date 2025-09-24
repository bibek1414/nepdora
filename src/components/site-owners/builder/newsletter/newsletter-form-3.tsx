import React, { useState } from "react";
import { Button } from "@/components/ui/site-owners/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Send,
  Loader2,
  CheckCircle,
  TrendingUp,
  Users,
  BookOpen,
} from "lucide-react";
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
      <div className="rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-100 p-12">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col items-center gap-8 lg:flex-row">
            <div className="flex-1 text-center lg:text-left">
              <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-600 lg:mx-0" />
              <h3 className="mb-4 text-3xl font-bold text-gray-900">
                You&apos;re all set!
              </h3>
              <p className="text-lg text-gray-600">
                Welcome to our community of professionals. You&apos;ll receive
                valuable insights directly to your inbox.
              </p>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <Users className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                  <div className="text-2xl font-bold text-gray-900">10K+</div>
                  <div className="text-sm text-gray-600">Subscribers</div>
                </div>
                <div>
                  <BookOpen className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                  <div className="text-2xl font-bold text-gray-900">Weekly</div>
                  <div className="text-sm text-gray-600">Insights</div>
                </div>
                <div>
                  <TrendingUp className="mx-auto mb-2 h-8 w-8 text-blue-600" />
                  <div className="text-2xl font-bold text-gray-900">Expert</div>
                  <div className="text-sm text-gray-600">Tips</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-100 p-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          {/* Left Content */}
          <div className="flex-1">
            <div className="mb-8">
              {isEditable ? (
                <EditableText
                  value={data.title}
                  onChange={value => updateData("title", value)}
                  as="h2"
                  className="mb-4 text-4xl font-bold text-gray-900"
                  isEditable={true}
                  placeholder="Enter title..."
                />
              ) : (
                <h2 className="mb-4 text-4xl font-bold text-gray-900">
                  {data.title}
                </h2>
              )}

              {data.subtitle &&
                (isEditable ? (
                  <EditableText
                    value={data.subtitle}
                    onChange={value => updateData("subtitle", value)}
                    as="p"
                    className="mb-6 text-xl text-gray-600"
                    isEditable={true}
                    placeholder="Enter subtitle..."
                  />
                ) : (
                  <p className="mb-6 text-xl text-gray-600">{data.subtitle}</p>
                ))}

              {data.description &&
                (isEditable ? (
                  <EditableText
                    value={data.description}
                    onChange={value => updateData("description", value)}
                    as="p"
                    className="mb-8 text-lg text-gray-600"
                    isEditable={true}
                    placeholder="Enter description..."
                    multiline={true}
                  />
                ) : (
                  <p className="mb-8 text-lg text-gray-600">
                    {data.description}
                  </p>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={
                    data.placeholder_text || "Enter your email address"
                  }
                  required
                  className="h-12 flex-1 border-gray-200 bg-white text-base shadow-sm"
                  disabled={createNewsletter.isPending || isPreview}
                />
                <Button
                  type="submit"
                  disabled={
                    createNewsletter.isPending || isPreview || !formData.email
                  }
                  variant="default"
                  className="h-12 bg-blue-600 px-8 text-base font-semibold hover:bg-blue-700"
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
                <p className="text-sm text-gray-500">{data.privacy_note}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
