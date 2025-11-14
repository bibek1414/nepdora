"use client";
import React, { useState } from "react";
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
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-12 text-center">
        <div className="mb-2 text-5xl font-extrabold tracking-tight text-black">
          Get In Touch
        </div>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          We&apos;d love to hear from you.
        </p>
      </div>

      <div className="">
        {/* Contact Form - Left Side */}
        <Card className="mx-auto h-fit max-w-xl border-0 py-0">
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  label="First Name *"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full"
                  required
                />

                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  label="Last Name *"
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
                label="Email Address *"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full"
                required
              />

              <Input
                id="phone"
                name="phone"
                type="tel"
                label="Phone Number *"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full"
              />

              <Textarea
                id="message"
                name="message"
                placeholder="Message *"
                value={formData.message}
                onChange={handleInputChange}
                className="min-h-[120px] w-full"
                required
              />

              <Button
                type="button"
                onClick={handleSubmit}
                className="h-16 w-full rounded-full py-3 font-medium text-white transition-colors"
              >
                Send Message
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Map - Right Side */}
        {/* <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-900">
                Visit Our Office
              </CardTitle>
              <CardDescription className="text-gray-600">
                Find us at Baliyo Ventures, Kathmandu
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-96 w-full overflow-hidden rounded-b-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.1523989318835!2d85.32596447536811!3d27.681684276197256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb192d0f057801%3A0x59809dfba777fb99!2sBaliyo%20Ventures!5e0!3m2!1sen!2snp!4v1757234557232!5m2!1sen!2snp"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Baliyo Ventures Location"
                />
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </section>
  );
}
