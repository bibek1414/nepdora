import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  ExternalLink,
  Settings,
  X,
} from "lucide-react";
import { EditableText } from "@/components/ui/editable-text";

import {
  ContactData,
  ContactFormSubmission,
} from "@/types/owner-site/components/contact";

import { useSubmitContactForm } from "@/hooks/owner-site/use-contact";

interface ContactForm4Props {
  data: ContactData;
  siteId?: string;
  isPreview?: boolean;
  isEditable?: boolean;
  onDataChange?: (data: ContactData) => void;
}

export const ContactForm4: React.FC<ContactForm4Props> = ({
  data,
  siteId,
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

  const [mapUrl, setMapUrl] = useState<string>(
    data.map_embed_url ||
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.1523989318835!2d85.32596447536811!3d27.681684276197256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb192d0f057801%3A0x59809dfba777fb99!2sBaliyo%20Ventures!5e0!3m2!1sen!2snp!4v1757234557232!5m2!1sen!2snp"
  );

  const [showMapSettings, setShowMapSettings] = useState<boolean>(false);

  const submitContactForm = useSubmitContactForm(siteId || "preview");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPreview && siteId) {
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

  const updateMapUrl = (value: string) => {
    setMapUrl(value);
    if (onDataChange) {
      onDataChange({
        ...data,
        map_embed_url: value,
      });
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          {/* Contact Form */}
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                  Send us a Message
                </h3>
                <p className="text-gray-600">
                  Fill out the form and we&apos;ll get back to you as soon as
                  possible
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
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

                  {data.showEmail && (
                    <div>
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
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
                        className="text-sm font-medium text-gray-700"
                      >
                        Phone Number{" "}
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

                  <div>
                    <Label
                      htmlFor="message"
                      className="text-sm font-medium text-gray-700"
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

        {/* Right Side - Map */}
        <div className="space-y-4">
          {/* Map Settings Panel - Only show when showMapSettings is true and isEditable */}
          {isEditable && showMapSettings && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">
                    Google Maps Configuration
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMapSettings(false)}
                    className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  <div>
                    <Label
                      htmlFor="map-url"
                      className="mb-2 block text-sm font-medium text-gray-600"
                    >
                      Embed URL
                    </Label>
                    <Textarea
                      id="map-url"
                      value={mapUrl}
                      onChange={e => updateMapUrl(e.target.value)}
                      className="h-24 text-xs"
                      placeholder="Paste your Google Maps embed URL here..."
                    />
                  </div>

                  <div className="rounded-md p-3">
                    <p className="text-primary text-xs">
                      <strong>How to get embed URL:</strong>
                      <br />
                      1. Go to Google Maps
                      <br />
                      2. Search for your location
                      <br />
                      3. Click &apos;Share&apos; → &apos;Embed a map&apos;
                      <br />
                      4. Copy the URL from the iframe src attribute
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-white shadow-lg">
            <CardContent className="relative p-0">
              {/* Settings Button - Only show when isEditable */}
              {isEditable && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowMapSettings(!showMapSettings)}
                  className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full border bg-white/90 p-0 shadow-md hover:bg-white"
                >
                  <Settings className="h-4 w-4 text-gray-600" />
                </Button>
              )}

              <div className="aspect-square w-full overflow-hidden rounded-lg lg:aspect-auto lg:h-[600px]">
                {mapUrl ? (
                  <iframe
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full"
                    title="Location Map"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gray-100 text-gray-500">
                    <div className="text-center">
                      <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                      <p className="text-lg font-medium">No map configured</p>
                      <p className="text-sm">
                        {isEditable
                          ? "Click the settings button to add a map"
                          : "Map will be displayed when configured"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
