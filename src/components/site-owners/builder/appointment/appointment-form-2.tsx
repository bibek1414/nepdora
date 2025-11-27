import React, { useState } from "react";
import { Button } from "@/components/ui/site-owners/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { AppointmentFormData } from "@/types/owner-site/admin/appointment";
import { AppointmentData } from "@/types/owner-site/components/appointment";
import {
  useSubmitAppointmentForm,
  useGetAppointmentReasons,
} from "@/hooks/owner-site/admin/use-appointment";
import { EditableText } from "@/components/ui/editable-text";

interface AppointmentForm2Props {
  data: AppointmentData;
  siteUser?: string;
  isPreview?: boolean;
  isEditable?: boolean;
  onDataChange?: (data: AppointmentData) => void;
}

export const AppointmentForm2: React.FC<AppointmentForm2Props> = ({
  data,
  siteUser,
  isPreview = false,
  isEditable = false,
  onDataChange,
}) => {
  const [formData, setFormData] = useState<AppointmentFormData>({
    full_name: "",
    email: "",
    phone: "",
    message: "",
    date: "",
    time: "",
    reason_id: undefined,
  });

  const { data: themeResponse } = useThemeQuery();
  const { data: reasonsData } = useGetAppointmentReasons();
  const submitAppointment = useSubmitAppointmentForm(siteUser || "preview");

  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      background: "#FFFFFF",
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPreview && siteUser) {
      submitAppointment.mutate(formData, {
        onSuccess: () => {
          setFormData({
            full_name: "",
            email: "",
            phone: "",
            message: "",
            date: "",
            time: "",
            reason_id: undefined,
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

  const handleSelectChange = (name: string, value: string) => {
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

  const daysOfWeek = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Side - Contact Info */}
        <div className="space-y-6">
          <Card className="bg-white shadow-lg">
            <CardContent className="p-8">
              <h3 className="mb-6 text-2xl font-bold text-gray-900">
                Contact Information
              </h3>

              <div className="space-y-4">
                {data.contact_info?.email && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      {isEditable ? (
                        <EditableText
                          value={data.contact_info.email}
                          onChange={value => updateContactInfo("email", value)}
                          as="p"
                          className="text-gray-900"
                          isEditable={true}
                          placeholder="email@example.com"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {data.contact_info.email}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {data.contact_info?.phone && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Phone</p>
                      {isEditable ? (
                        <EditableText
                          value={data.contact_info.phone}
                          onChange={value => updateContactInfo("phone", value)}
                          as="p"
                          className="text-gray-900"
                          isEditable={true}
                          placeholder="+1 (555) 123-4567"
                        />
                      ) : (
                        <p className="text-gray-900">
                          {data.contact_info.phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {data.contact_info?.address && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Address
                      </p>
                      {isEditable ? (
                        <EditableText
                          value={data.contact_info.address}
                          onChange={value =>
                            updateContactInfo("address", value)
                          }
                          as="p"
                          className="text-gray-900"
                          isEditable={true}
                          placeholder="123 Business St, City, State"
                          multiline={true}
                        />
                      ) : (
                        <p className="text-gray-900">
                          {data.contact_info.address}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Business Hours */}
          {data.business_hours && (
            <Card className="bg-white shadow-lg">
              <CardContent className="p-8">
                <h3 className="mb-6 text-2xl font-bold text-gray-900">
                  Business Hours
                </h3>
                <div className="space-y-3">
                  {daysOfWeek.map(({ key, label }) => {
                    const hours =
                      data.business_hours?.[
                        key as keyof typeof data.business_hours
                      ];
                    if (!hours) return null;

                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between border-b pb-2"
                      >
                        <span className="font-medium text-gray-700">
                          {label}
                        </span>
                        <span className="text-gray-600">{hours}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Side - Form */}
        <Card className="bg-white shadow-lg">
          <CardContent className="p-8">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">
              Book Your Appointment
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <Label htmlFor="full_name" className="text-sm font-medium">
                  Full Name{" "}
                  {data.required_fields.full_name && (
                    <span className="text-red-500">*</span>
                  )}
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  required={data.required_fields.full_name}
                  className="mt-1"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
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
                  placeholder="john@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone{" "}
                  {data.required_fields.phone && (
                    <span className="text-red-500">*</span>
                  )}
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required={data.required_fields.phone}
                  className="mt-1"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Date & Time */}
              <div className="grid gap-4 md:grid-cols-2">
                {data.showDate && (
                  <div>
                    <Label htmlFor="date" className="text-sm font-medium">
                      Date{" "}
                      {data.required_fields.date && (
                        <span className="text-red-500">*</span>
                      )}
                    </Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required={data.required_fields.date}
                      className="mt-1"
                    />
                  </div>
                )}

                {data.showTime && (
                  <div>
                    <Label htmlFor="time" className="text-sm font-medium">
                      Time{" "}
                      {data.required_fields.time && (
                        <span className="text-red-500">*</span>
                      )}
                    </Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required={data.required_fields.time}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>

              {/* Reason */}
              {data.showReason && reasonsData && reasonsData.length > 0 && (
                <div>
                  <Label htmlFor="reason" className="text-sm font-medium">
                    Reason{" "}
                    {data.required_fields.reason && (
                      <span className="text-red-500">*</span>
                    )}
                  </Label>
                  <Select
                    value={formData.reason_id?.toString() || ""}
                    onValueChange={value =>
                      handleSelectChange("reason_id", value)
                    }
                    required={data.required_fields.reason}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {reasonsData.map(reason => (
                        <SelectItem
                          key={reason.id}
                          value={reason.id.toString()}
                        >
                          {reason.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Message */}
              <div>
                <Label htmlFor="message" className="text-sm font-medium">
                  Additional Notes{" "}
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
                  className="mt-1 min-h-[80px]"
                  placeholder="Any additional information..."
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="default"
                disabled={submitAppointment.isPending || isPreview}
                className="w-full"
              >
                {submitAppointment.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Appointment
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
