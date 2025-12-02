import React, { useState } from "react";
import { Button } from "@/components/ui/site-owners/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FloatingLabelInput,
  FloatingLabelTextarea,
} from "@/components/ui/floating-label-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, Mail, Phone, Loader2 } from "lucide-react";
import { AppointmentFormData } from "@/types/owner-site/admin/appointment";
import { AppointmentData } from "@/types/owner-site/components/appointment";
import {
  useSubmitAppointmentForm,
  useGetAppointmentReasons,
} from "@/hooks/owner-site/admin/use-appointment";

interface AppointmentFormProps {
  data: AppointmentData;
  siteUser?: string;
  isPreview?: boolean;
  isEditable?: boolean;
  onDataChange?: (data: AppointmentData) => void;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  data,
  siteUser,
  isPreview = false,
  isEditable = false,
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

  const { data: reasonsData } = useGetAppointmentReasons();
  const submitAppointment = useSubmitAppointmentForm(siteUser || "preview");

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

  const getLabel = (text: string, isRequired?: boolean) => (
    <span>
      {text} {isRequired && <span className="text-red-500">*</span>}
    </span>
  );

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="gap-0 border-none bg-white py-2">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <FloatingLabelInput
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleInputChange}
                required={data.required_fields.full_name}
                label={getLabel("Full Name", data.required_fields.full_name)}
              />
            </div>

            {/* Email & Phone Row */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FloatingLabelInput
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required={data.required_fields.email}
                  label={getLabel("Email", data.required_fields.email)}
                  startIcon={<Mail className="h-4 w-4" />}
                />
              </div>

              <div>
                <FloatingLabelInput
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required={data.required_fields.phone}
                  label={getLabel("Phone", data.required_fields.phone)}
                  startIcon={<Phone className="h-4 w-4" />}
                />
              </div>
            </div>

            {/* Date & Time Row */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FloatingLabelInput
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required={data.required_fields.date}
                  label={getLabel("Preferred Date", data.required_fields.date)}
                  startIcon={<Calendar className="h-4 w-4" />}
                />
              </div>

              <div>
                <FloatingLabelInput
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required={data.required_fields.time}
                  label={getLabel("Preferred Time", data.required_fields.time)}
                  startIcon={<Clock className="h-4 w-4" />}
                />
              </div>
            </div>

            {/* Reason */}
            {reasonsData && reasonsData.length > 0 && (
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
              <FloatingLabelTextarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required={data.required_fields.message}
                className="mt-1"
                label={getLabel(
                  "Additional Notes",
                  data.required_fields.message
                )}
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
