"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FloatingLabelInput,
  FloatingLabelTextarea,
} from "@/components/ui/floating-label-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useSubmitNepdoraPopup } from "@/hooks/marketing/use-nepdora-popup";

const WEBSITE_TYPES = [
  "E-Commerce Store",
  "Portfolio Website",
  "Business Website",
  "Restaurant Website",
  "Medical Clinic",
  "Real Estate",
  "Educational Institution",
  "Travel & Tourism",
  "Personal Blog",
  "Other",
];

export function NepdoraPopup() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const submitMutation = useSubmitNepdoraPopup();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    message: "",
    website_type: "",
  });

  useEffect(() => {
    const hasSubmitted = localStorage.getItem("nepdora_popup_submitted");
    if (hasSubmitted) return;

    const lastShown = localStorage.getItem("nepdora_popup_last_shown");
    const now = Date.now();
    const twelveHours = 12 * 60 * 60 * 1000;

    if (!lastShown || now - parseInt(lastShown) > twelveHours) {
      const timer = setTimeout(() => {
        setOpen(true);
        localStorage.setItem("nepdora_popup_last_shown", now.toString());
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    try {
      await submitMutation.mutateAsync(formData);
      localStorage.setItem("nepdora_popup_submitted", "true");
      setStep("success");

      // Reset after 3 seconds
      setTimeout(() => {
        setOpen(false);
        setTimeout(() => setStep("form"), 300);
      }, 3000);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone_number: "",
      message: "",
      website_type: "",
    });
    setStep("form");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={newOpen => {
        setOpen(newOpen);
        if (!newOpen) resetForm();
      }}
    >
      <DialogContent className="overflow-hidden border-none bg-transparent p-0 shadow-none sm:max-w-[520px]">
        <AnimatePresence mode="wait">
          {step === "form" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-2xl bg-white shadow-xl"
            >
              {/* Close button */}

              <div className="px-6 pt-8 pb-8">
                {/* Icon */}

                {/* Header */}
                <div className="mb-7 space-y-2 text-center">
                  <h2 className="text-2xl font-bold text-slate-900">
                    Need a professional website?
                  </h2>
                  <p className="text-sm text-slate-500">
                    Get a custom quote tailored for your business.
                    <br />
                    Simple, fast, and affordable.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4">
                    <FloatingLabelInput
                      id="popup-name"
                      label="Full name"
                      required
                      value={formData.name}
                      onChange={e =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="focus:border-primary rounded-xl border-slate-200 transition-all"
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FloatingLabelInput
                        id="popup-email"
                        label="Email address"
                        type="email"
                        value={formData.email}
                        onChange={e =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="focus:border-primary rounded-xl border-slate-200 transition-all"
                      />
                      <FloatingLabelInput
                        id="popup-phone"
                        label="Phone number"
                        type="tel"
                        value={formData.phone_number}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            phone_number: e.target.value,
                          })
                        }
                        className="focus:border-primary rounded-xl border-slate-200 transition-all"
                      />
                    </div>

                    <Select
                      value={formData.website_type}
                      onValueChange={value =>
                        setFormData({ ...formData, website_type: value })
                      }
                    >
                      <SelectTrigger className="focus:ring-primary h-12 w-full rounded-xl border-slate-200 bg-white">
                        <SelectValue placeholder="What type of website?" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200">
                        {WEBSITE_TYPES.map(type => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="focus:bg-primary/5 rounded-lg"
                          >
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FloatingLabelTextarea
                      id="popup-message"
                      label="Tell us about your requirements..."
                      value={formData.message}
                      onChange={e =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="focus:border-primary rounded-xl border-slate-200 transition-all"
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="bg-primary hover:bg-primary/90 mt-2 h-12 w-full rounded-xl font-semibold text-white shadow-md transition-all active:scale-[0.98]"
                  >
                    {submitMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Get free quote
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>

                  <p className="text-center text-[11px] text-slate-400">
                    No spam. We'll get back to you within 24 hours.
                  </p>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-2xl bg-white p-8 text-center shadow-xl"
            >
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300" />

              <div className="mb-5 flex justify-center">
                <div className="rounded-2xl bg-emerald-100 p-3">
                  <CheckCircle className="h-10 w-10 text-emerald-600" />
                </div>
              </div>

              <h2 className="mb-2 text-2xl font-bold text-slate-900">
                Request sent!
              </h2>
              <p className="text-sm text-slate-500">
                Thanks for reaching out. We'll review your request and get back
                to you shortly.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
