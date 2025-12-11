"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import ContactList from "@/components/site-owners/admin/contact/contact-list";
import PopupFormList from "@/components/site-owners/admin/popup-inquiries/popup-inquiries-list";
import { NewsletterList } from "@/components/site-owners/admin/newsletter/newsletter-list";
import BookingList from "@/components/site-owners/admin/booking/booking-list";

type InquiryType = "contact" | "popup" | "newsletter" | "booking";

interface InquiriesClientProps {
  subDomain?: string;
}

export default function InquiriesClient({ subDomain }: InquiriesClientProps) {
  const [selectedView, setSelectedView] = useState<InquiryType>("contact");
  const isBatoma = subDomain === "batoma";

  const renderContent = () => {
    switch (selectedView) {
      case "contact":
        return <ContactList />;
      case "popup":
        return <PopupFormList />;
      case "newsletter":
        return <NewsletterList />;
      case "booking":
        return isBatoma ? <BookingList /> : <ContactList />;
      default:
        return <ContactList />;
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Inquiries Management
            </h1>
            <p className="mt-2 text-gray-600">
              Manage all your customer inquiries and communications
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedView === "contact" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedView("contact")}
          >
            Contact Inquiries
          </Button>
          <Button
            variant={selectedView === "popup" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedView("popup")}
          >
            Popup Inquiries
          </Button>
          <Button
            variant={selectedView === "newsletter" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedView("newsletter")}
          >
            Newsletter Subscriptions
          </Button>
          {isBatoma && (
            <Button
              variant={selectedView === "booking" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedView("booking")}
            >
              Bookings
            </Button>
          )}
        </div>

        <div className="mt-6">{renderContent()}</div>
      </div>
    </div>
  );
}
