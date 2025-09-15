import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Send, Loader2 } from "lucide-react";

import {
  ContactData,
  ContactFormSubmission,
} from "@/types/owner-site/components/contact";

import { useSubmitContactForm } from "@/hooks/owner-site/use-contact";

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
    <Card className="border-primary/20 mx-auto max-w-2xl border-2 bg-white shadow-xl">
      <CardContent className="p-10">
        <div className="mb-8 text-center">
          <div className="bg-primary/10 mx-auto mb-4 w-fit rounded-full p-4">
            <Mail className="text-primary h-8 w-8" />
          </div>
          <h3 className="text-foreground mb-2 text-2xl font-bold">
            Send us a Message
          </h3>
          <p className="text-muted-foreground">
            {data.description || "We'll get back to you as soon as possible."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label
                htmlFor="name"
                className="text-foreground text-sm font-medium"
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
                className="mt-1"
                placeholder="Your full name"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {data.showEmail && (
                <div>
                  <Label
                    htmlFor="email"
                    className="text-foreground text-sm font-medium"
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
                    className="mt-1"
                    placeholder="your.email@example.com"
                  />
                </div>
              )}

              {data.showPhone && (
                <div>
                  <Label
                    htmlFor="phone_number"
                    className="text-foreground text-sm font-medium"
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
                    className="mt-1"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              )}
            </div>

            <div>
              <Label
                htmlFor="message"
                className="text-foreground text-sm font-medium"
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
                className="mt-1 min-h-[140px]"
                placeholder="Tell us how we can help you..."
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitContactForm.isPending || isPreview}
            className="w-full"
            size="lg"
          >
            {submitContactForm.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
