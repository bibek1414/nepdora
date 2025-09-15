import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, Loader2, ExternalLink } from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";

import {
  ContactData,
  ContactFormSubmission,
} from "@/types/owner-site/components/contact";

import { useSubmitContactForm } from "@/hooks/owner-site/use-contact";

interface ContactForm1Props {
  data: ContactData;
  siteUser?: string;
  isPreview?: boolean;
  isEditable?: boolean;
  onDataChange?: (data: ContactData) => void;
}

export const ContactForm1: React.FC<ContactForm1Props> = ({
  data,
  siteUser,
  isPreview = false,
  isEditable = false,
  onDataChange,
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

  const updateContactInfo = (field: string, value: string) => {
    if (onDataChange) {
      onDataChange({
        ...data,
        contact_info: {
          ...data.contact_info,
          [field]: value,
        },
      });
    }
  };

  const updateTitle = (value: string) => {
    if (onDataChange) {
      onDataChange({
        ...data,
        title: value,
      });
    }
  };

  const updateDescription = (value: string) => {
    if (onDataChange) {
      onDataChange({
        ...data,
        description: value,
      });
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      {/* Contact Form */}
      <Card className="bg-white shadow-lg">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  label="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={data.required_fields.name}
                  className="mt-1"
                  placeholder="Your full name"
                />
              </div>

              {data.showEmail && (
                <div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
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
                  <Input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    label="Phone Number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    required={data.required_fields.phone}
                    className="mt-1"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              )}

              <div>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required={data.required_fields.message}
                  className="mt-1 min-h-[120px]"
                  placeholder="Tell us how we can help you..."
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitContactForm.isPending || isPreview}
              className="w-full"
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
    </div>
  );
};
