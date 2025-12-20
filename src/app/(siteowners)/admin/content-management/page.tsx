"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface ContentItem {
  name: string;
  href: string;
  description: string;
}

const contentItems: ContentItem[] = [
  {
    name: "Blogs",
    href: "/admin/blogs",
    description: "Manage blog posts and articles",
  },
  {
    name: "Videos",
    href: "/admin/videos",
    description: "Manage video content",
  },
  {
    name: "Portfolios",
    href: "/admin/portfolio",
    description: "Manage portfolio projects",
  },
  {
    name: "Popup",
    href: "/admin/popup",
    description: "Configure popup messages",
  },
  {
    name: "FAQ",
    href: "/admin/faq",
    description: "Manage FAQs",
  },
  {
    name: "Testimonials",
    href: "/admin/testimonials",
    description: "Manage client testimonials",
  },
  {
    name: "Services",
    href: "/admin/services",
    description: "Manage your services",
  },
  {
    name: "Our Clients",
    href: "/admin/our-clients",
    description: "Manage your clients",
  },
  {
    name: "Team",
    href: "/admin/team-member",
    description: "Manage your team members",
  },
];

export default function ContentManagementPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto mt-12 mb-40 max-w-6xl px-6 md:px-8">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-[#003d79]">
            Content Management
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contentItems.map(item => {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="group relative block outline-none"
              >
                <div className="relative h-full overflow-hidden rounded-lg bg-slate-50 p-6 transition-all duration-200 hover:scale-[1.02] hover:bg-slate-100">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                      <h3 className="text-base font-semibold text-slate-800">
                        {item.name}
                      </h3>
                    </div>
                    <div className="flex shrink-0 items-start pt-1">
                      <ChevronRight className="h-4 w-4 text-black/40 transition-all group-hover:translate-x-0.5 group-hover:text-black/60" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
