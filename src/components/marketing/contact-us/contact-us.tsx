"use client";
import React, { useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Handle form submission here
    alert("Message sent successfully!");
  };

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Contact <span className="text-primary">Us</span>{" "}
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Get in touch with us. We&apos;d love to hear from you and will get
          back to you as soon as possible.
        </p>
      </div>

      <Card>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input
                id="firstName"
                name="firstName"
                type="text"
                label="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full"
                required
              />

              <Input
                id="lastName"
                name="lastName"
                type="text"
                label="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full"
                required
              />
            </div>

            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full"
              required
            />

            <Input
              id="phone"
              name="phone"
              type="tel"
              label="Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full"
            />

            <Textarea
              id="message"
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleInputChange}
              className="min-h-[120px] w-full"
              required
            />

            <div className="flex justify-center">
              <Button
                type="button"
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary/80 px-8 py-2 font-medium text-white"
              >
                Send Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
