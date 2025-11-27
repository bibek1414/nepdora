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
import { Calendar, Clock, Mail, Phone, Loader2 } from "lucide-react";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { AppointmentFormData } from "@/types/owner-site/admin/appointment";
import { AppointmentData } from "@/types/owner-site/components/appointment";
import {
  useSubmitAppointmentForm,
  useGetAppointmentReasons,
} from "@/hooks/owner-site/admin/use-appointment";

interface AppointmentForm1Props {
  data: AppointmentData;
  siteUser?: string;
  isPreview?: boolean;
  isEditable?: boolean;
  onDataChange?: (data: AppointmentData) => void;
}

export const AppointmentForm1: React.FC<AppointmentForm1Props> = ({
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
    fonts: {
      body: "Inter",
      heading: "Poppins",
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

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="bg-white shadow-lg">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Email & Phone Row */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="email" className="text-sm font-medium">
                  Email{" "}
                  {data.required_fields.email && (
                    <span className="text-red-500">*</span>
                  )}
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required={data.required_fields.email}
                    className="pl-10"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone{" "}
                  {data.required_fields.phone && (
                    <span className="text-red-500">*</span>
                  )}
                </Label>
                <div className="relative mt-1">
                  <Phone className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required={data.required_fields.phone}
                    className="pl-10"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Date & Time Row */}
            {(data.showDate || data.showTime) && (
              <div className="grid gap-4 md:grid-cols-2">
                {data.showDate && (
                  <div>
                    <Label htmlFor="date" className="text-sm font-medium">
                      Preferred Date{" "}
                      {data.required_fields.date && (
                        <span className="text-red-500">*</span>
                      )}
                    </Label>
                    <div className="relative mt-1">
                      <Calendar className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required={data.required_fields.date}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}

                {data.showTime && (
                  <div>
                    <Label htmlFor="time" className="text-sm font-medium">
                      Preferred Time{" "}
                      {data.required_fields.time && (
                        <span className="text-red-500">*</span>
                      )}
                    </Label>
                    <div className="relative mt-1">
                      <Clock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required={data.required_fields.time}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Reason */}
            {data.showReason && reasonsData && reasonsData.length > 0 && (
              <div>
                <Label htmlFor="reason" className="text-sm font-medium">
                  Reason for Appointment{" "}
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
                      <SelectItem key={reason.id} value={reason.id.toString()}>
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
                className="mt-1 min-h-[100px]"
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
                "Book Appointment"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
