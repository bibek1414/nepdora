"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    alert("Message sent successfully!");
  };

  return (
    <section className="mx-auto max-w-4xl px-3 py-12 sm:px-4 sm:py-16 md:py-20 lg:px-6 lg:py-24">
      {/* Header */}
      <div className="mb-10 text-center sm:mb-12 md:mb-16">
        <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl">
          Get in touch
        </h2>
        <p className="mx-auto max-w-xl text-sm text-slate-600 sm:text-base md:text-lg">
          Have a question or want to work together? We&apos;d love to hear from
          you.
        </p>
      </div>

      {/* Contact Form */}
      <div className="mx-auto max-w-2xl">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Name Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="space-y-1.5 sm:space-y-2">
              <label
                htmlFor="firstName"
                className="text-xs font-medium text-slate-700 sm:text-sm"
              >
                First name
              </label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                className="h-10 border-slate-200 bg-white text-sm transition-colors focus:border-slate-400 focus:ring-slate-400 sm:h-11"
                placeholder="John"
                required
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <label
                htmlFor="lastName"
                className="text-xs font-medium text-slate-700 sm:text-sm"
              >
                Last name
              </label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                className="h-10 border-slate-200 bg-white text-sm transition-colors focus:border-slate-400 focus:ring-slate-400 sm:h-11"
                placeholder="Doe"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1.5 sm:space-y-2">
            <label
              htmlFor="email"
              className="text-xs font-medium text-slate-700 sm:text-sm"
            >
              Email address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="h-10 border-slate-200 bg-white text-sm transition-colors focus:border-slate-400 focus:ring-slate-400 sm:h-11"
              placeholder="john@example.com"
              required
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-1.5 sm:space-y-2">
            <label
              htmlFor="phone"
              className="text-xs font-medium text-slate-700 sm:text-sm"
            >
              Phone number
              <span className="ml-1 text-slate-400">(optional)</span>
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              className="h-10 border-slate-200 bg-white text-sm transition-colors focus:border-slate-400 focus:ring-slate-400 sm:h-11"
              placeholder="+977 986-6316114"
            />
          </div>

          {/* Message Field */}
          <div className="space-y-1.5 sm:space-y-2">
            <label
              htmlFor="message"
              className="text-xs font-medium text-slate-700 sm:text-sm"
            >
              Message
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="min-h-[120px] resize-none border-slate-200 bg-white text-sm transition-colors focus:border-slate-400 focus:ring-slate-400 sm:min-h-[140px]"
              placeholder="Tell us about your project or question..."
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2 sm:pt-4">
            <Button
              type="submit"
              className="h-10 w-full rounded-lg text-sm font-medium transition-all hover:shadow-md sm:h-12 sm:w-auto sm:min-w-[160px] sm:text-base"
            >
              Send message
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
}
