"use client";

import React from "react";
import {
  Briefcase,
  Users,
  MessageSquare,
  Globe,
  Youtube,
  Package,
  Home,
  Handshake,
  UserCog,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";

interface ContentItem {
  name: string;
  href: string;
  icon: LucideIcon;
  description: string;
  gradient: string;
  shadowColor: string;
}

const contentItems: ContentItem[] = [
  {
    name: "Blogs",
    href: "/admin/blogs",
    icon: Globe,
    description: "Manage blog posts and articles",
    gradient: "bg-orange-50",
    shadowColor: "hover:border-orange-200",
  },
  {
    name: "Videos",
    href: "/admin/videos",
    icon: Youtube,
    description: "Manage video content",
    gradient: "bg-purple-50",
    shadowColor: "hover:border-purple-200",
  },
  {
    name: "Portfolios",
    href: "/admin/portfolio",
    icon: Briefcase,
    description: "Manage portfolio projects",
    gradient: "bg-indigo-50",
    shadowColor: "hover:border-indigo-200",
  },
  {
    name: "Popup",
    href: "/admin/popup",
    icon: Package,
    description: "Configure popup messages",
    gradient: "bg-amber-50",
    shadowColor: "hover:border-amber-200",
  },
  {
    name: "FAQ",
    href: "/admin/faq",
    icon: MessageSquare,
    description: "Manage frequently asked questions",
    gradient: "bg-emerald-50",
    shadowColor: "hover:border-emerald-200",
  },
  {
    name: "Testimonials",
    href: "/admin/testimonials",
    icon: Users,
    description: "Manage client testimonials",
    gradient: "bg-pink-50",
    shadowColor: "hover:border-pink-200",
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: Home,
    description: "Manage your services",
    gradient: "bg-sky-50",
    shadowColor: "hover:border-sky-200",
  },
  {
    name: "Our Clients",
    href: "/admin/our-clients",
    icon: Handshake,
    description: "Manage your clients",
    gradient: "bg-cyan-50",
    shadowColor: "hover:border-cyan-200",
  },
  {
    name: "Team",
    href: "/admin/team-member",
    icon: UserCog,
    description: "Manage your team members",
    gradient: "bg-slate-50",
    shadowColor: "hover:border-slate-300",
  },
];

export default function ContentManagementPage() {
  // const { siteData } = useGetSiteData(); // Removed unused hook
  // const subDomain = siteData?.subDomain; // Removed unused variable

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 space-y-2 sm:mb-8 sm:space-y-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Content Management
          </h1>
          <p className="max-w-2xl text-sm text-slate-500 sm:text-base">
            Centralize your website content. Select a module below to start
            editing.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-5 lg:grid-cols-3">
          {contentItems.map(item => {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="group relative block outline-none"
              >
                <div
                  className={`relative h-full overflow-hidden rounded-xl border border-transparent ${item.gradient} p-4 transition-all duration-300 ease-out sm:rounded-2xl sm:p-5 sm:hover:-translate-y-0.5 md:p-7 ${item.shadowColor}`}
                >
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div className="flex flex-1 flex-col gap-0.5 sm:gap-1">
                      <h3 className="text-base font-bold text-slate-800 transition-colors group-hover:text-slate-900 sm:text-lg md:text-xl">
                        {item.name}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 transition-colors group-hover:text-slate-500 sm:text-sm">
                        {item.description}
                      </p>
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
