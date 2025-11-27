import React, { useState } from "react";
import { Button } from "@/components/ui/site-owners/button";
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
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MessageSquare,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";
import { AppointmentFormData } from "@/types/owner-site/admin/appointment";
import { AppointmentData } from "@/types/owner-site/components/appointment";
import {
  useSubmitAppointmentForm,
  useGetAppointmentReasons,
} from "@/hooks/owner-site/admin/use-appointment";

interface AppointmentForm3Props {
  data: AppointmentData;
  siteUser?: string;
  isPreview?: boolean;
  isEditable?: boolean;
  onDataChange?: (data: AppointmentData) => void;
}

export const AppointmentForm3: React.FC<AppointmentForm3Props> = ({
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

  return (
    <div className="mx-auto max-w-4xl">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-purple-50 p-1 shadow-2xl">
        <div className="relative rounded-2xl bg-white p-8 md:p-12">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 h-40 w-40 translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-40 w-40 -translate-x-16 translate-y-16 rounded-full bg-gradient-to-tr from-purple-400 to-pink-500 opacity-20 blur-3xl"></div>

          {/* Header */}
          <div className="relative mb-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-3">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
              Schedule Your Visit
            </h3>
            <p className="text-gray-600">
              Fill in your details and we&apos;ll get back to you shortly
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative space-y-6">
            {/* Full Name */}
            <div className="group">
              <Label
                htmlFor="full_name"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <User className="h-4 w-4 text-blue-500" />
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
                className="border-gray-200 transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                placeholder="John Doe"
              />
            </div>

            {/* Email & Phone Row */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="group">
                <Label
                  htmlFor="email"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <Mail className="h-4 w-4 text-blue-500" />
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
                  className="border-gray-200 transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  placeholder="john@example.com"
                />
              </div>

              <div className="group">
                <Label
                  htmlFor="phone"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <Phone className="h-4 w-4 text-blue-500" />
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
                  className="border-gray-200 transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* Date & Time Row */}
            {(data.showDate || data.showTime) && (
              <div className="grid gap-6 md:grid-cols-2">
                {data.showDate && (
                  <div className="group">
                    <Label
                      htmlFor="date"
                      className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
                    >
                      <Calendar className="h-4 w-4 text-purple-500" />
                      Preferred Date{" "}
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
                      className="border-gray-200 transition-all focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                )}

                {data.showTime && (
                  <div className="group">
                    <Label
                      htmlFor="time"
                      className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
                    >
                      <Clock className="h-4 w-4 text-purple-500" />
                      Preferred Time{" "}
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
                      className="border-gray-200 transition-all focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Reason */}
            {data.showReason && reasonsData && reasonsData.length > 0 && (
              <div className="group">
                <Label
                  htmlFor="reason"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
                >
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  Reason for Visit{" "}
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
                  <SelectTrigger className="border-gray-200 transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
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
            <div className="group">
              <Label
                htmlFor="message"
                className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <MessageSquare className="h-4 w-4 text-blue-500" />
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
                className="min-h-[100px] border-gray-200 transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                placeholder="Tell us anything else you'd like us to know..."
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={submitAppointment.isPending || isPreview}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-6 text-lg font-semibold shadow-lg transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
            >
              {submitAppointment.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Booking Your Appointment...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Your Appointment
                </>
              )}
            </Button>

            {/* Trust Badge */}
            <p className="text-center text-sm text-gray-500">
              🔒 Your information is secure and will never be shared
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
