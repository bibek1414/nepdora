import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/site-owners/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send, Loader2 } from "lucide-react";

import {
  ContactData,
  ContactFormSubmission,
} from "@/types/owner-site/components/contact";

import { useSubmitContactForm } from "@/hooks/owner-site/admin/use-contact";

interface ContactForm3Props {
  data: ContactData;
  siteUser?: string;
  isPreview?: boolean;
}

export const ContactForm3: React.FC<ContactForm3Props> = ({
  data,
  siteUser,
  isPreview = false,
}) => {
  const [formData, setFormData] = useState<ContactFormSubmission>({
    name: "",
    email: "",
    phone_number: "",
    message: "",
  });

  const submitContactForm = useSubmitContactForm(siteUser || "preview");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPreview && siteUser) {
      submitContactForm.mutate(formData, {
        onSuccess: () => {
          setFormData({
            name: "",
            email: "",
            phone_number: "",
            message: "",
          });
        },
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="mx-auto max-w-xl border-0 bg-transparent shadow-none">
      <CardContent>
        <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-5">
          <div className="space-y-3">
            <div>
              <Label
                htmlFor="name"
                className="mb-1 text-sm font-medium text-neutral-500"
              >
                Name{" "}
                {data.required_fields.name && (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required={data.required_fields.name}
                className="h-12 rounded-md border border-neutral-300 bg-white px-4 text-base focus:border-neutral-900 focus:ring-0 focus:outline-none"
                placeholder="Your name"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label
                  htmlFor="email"
                  className="mb-1 text-sm font-medium text-neutral-500"
                >
                  Email{" "}
                  {data.required_fields.email && (
                    <span className="text-red-500">*</span>
                  )}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required={data.required_fields.email}
                  className="h-12 rounded-md border border-neutral-300 bg-white px-4 text-base focus:border-neutral-900 focus:ring-0 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <Label
                  htmlFor="phone_number"
                  className="mb-1 text-sm font-medium text-neutral-500"
                >
                  Phone{" "}
                  {data.required_fields.phone && (
                    <span className="text-red-500">*</span>
                  )}
                </Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  required={data.required_fields.phone}
                  className="h-12 rounded-md border border-neutral-300 bg-white px-4 text-base focus:border-neutral-900 focus:ring-0 focus:outline-none"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="message"
                className="mb-1 text-sm font-medium text-neutral-500"
              >
                Message{" "}
                {data.required_fields.message && (
                  <span className="text-red-500">*</span>
                )}
              </Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required={data.required_fields.message}
                className="min-h-[160px] rounded-md border border-neutral-300 bg-white px-4 py-3 text-base focus:border-neutral-900 focus:ring-0 focus:outline-none"
                placeholder="Tell us how we can help you..."
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="default"
            disabled={submitContactForm.isPending || isPreview}
            className="mx-auto block h-12 w-full max-w-md rounded-md text-base"
            size="default"
          >
            {submitContactForm.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <div className="flex items-center justify-center gap-2">
                Submit Message
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
