import React from "react";
import Link from "next/link";
import { MessageSquare, Mail, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

// ✅ Add dynamic metadata
export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Inquiries Management",
    pageDescription:
      "View and manage all customer inquiries in {storeName}. Access contact form messages, popup inquiries, and newsletter subscriptions in one place.",
    pageRoute: "/admin/inquiries",
  });
}

interface InquiryItem {
  name: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

const inquiryItems: InquiryItem[] = [
  {
    name: "Contact Inquiries",
    href: "/admin/contacts",
    icon: MessageSquare,
    description: "Manage customer inquiries and messages",
  },
  {
    name: "Popup Inquiries",
    href: "/admin/popup-inquiries",
    icon: MessageSquare,
    description: "View inquiries from popup forms",
  },
  {
    name: "Newsletter Subscriptions",
    href: "/admin/newsletter",
    icon: Mail,
    description: "Manage newsletter subscriptions",
  },
];

export default function InquiriesManagement() {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Inquiries Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage all your customer inquiries and communications
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {inquiryItems.map(item => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="outline"
                  className="group hover:border-primary h-auto w-full bg-white p-6 text-left shadow-none transition-all duration-200"
                >
                  <div className="flex w-full items-start space-x-4">
                    <div className="rounded-lg bg-blue-50 p-3 transition-colors group-hover:bg-blue-100">
                      <Icon className="text-primary h-6 w-6" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="group-hover:text-primary text-lg font-semibold text-gray-900 transition-colors">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm font-normal text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
