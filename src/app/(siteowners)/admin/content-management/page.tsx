import React from "react";
import Link from "next/link";
import {
  Globe,
  Youtube,
  Briefcase,
  Package,
  Tag,
  MessageSquare,
  LucideIcon,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

// ✅ Add this metadata function
export async function generateMetadata(): Promise<Metadata> {
  return generateAdminPageMetadata({
    pageName: "Content Management",
    pageDescription:
      "Easily manage all your website content in {storeName}. Control blogs, videos, portfolio, FAQs, testimonials, and more from one dashboard.",
    pageRoute: "/admin/content-management",
  });
}

interface ContentItem {
  name: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

const contentItems: ContentItem[] = [
  {
    name: "Blogs",
    href: "/admin/blogs",
    icon: Globe,
    description: "Manage blog posts and articles",
  },
  {
    name: " Videos",
    href: "/admin/videos",
    icon: Youtube,
    description: "Manage video content",
  },
  {
    name: "Portfolios",
    href: "/admin/portfolio",
    icon: Briefcase,
    description: "Manage portfolio projects",
  },
  {
    name: "Popup",
    href: "/admin/popup",
    icon: Package,
    description: "Configure popup messages",
  },
  {
    name: "FAQ",
    href: "/admin/faq",
    icon: MessageSquare,
    description: "Manage frequently asked questions",
  },
  {
    name: "Testimonials",
    href: "/admin/testimonials",
    icon: Tag,
    description: "Manage client testimonials",
  },
  {
    name: "Team",
    href: "/admin/team-member",
    icon: Users,
    description: "Manage your team members",
  },
];

export default function ContentManagement() {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Content Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage all your website content from one place
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contentItems.map(item => {
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
