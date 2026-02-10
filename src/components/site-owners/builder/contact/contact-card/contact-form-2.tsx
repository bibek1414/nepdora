import React, { useState } from "react";
import { Button } from "@/components/ui/site-owners/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, Loader2 } from "lucide-react";

// Import types
import {
  ContactData,
  ContactFormSubmission,
} from "@/types/owner-site/components/contact";

// Import the hook
import { useSubmitContactForm } from "@/hooks/owner-site/admin/use-contact";

interface ContactForm2Props {
  data: ContactData;
  siteUser?: string;
  isPreview?: boolean;
  isEditable?: boolean;
  onDataChange?: (newData: ContactData) => void;
}

export const ContactForm2: React.FC<ContactForm2Props> = ({
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

  return (
    <div className="from-primary/5 to-primary/10 mx-auto max-w-4xl rounded-2xl bg-gradient-to-br p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
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
              className="mt-1 bg-white"
              placeholder="Your full name"
            />
          </div>

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
              className="mt-1 bg-white"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

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
            className="mt-1 bg-white"
            placeholder="+1 (555) 123-4567"
          />
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
            className="mt-1 min-h-[120px] bg-white"
            placeholder="Tell us how we can help you..."
          />
        </div>

        <Button
          type="submit"
          disabled={submitContactForm.isPending || isPreview}
          variant="default"
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
    </div>
  );
};
