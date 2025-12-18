"use client";

import React from "react";
import {
  FileText,
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
  ArrowUpRight,
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
    <div className="animate-in fade-in min-h-screen bg-white p-8 duration-700 sm:p-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Content Management
          </h1>
          <p className="max-w-2xl text-lg text-slate-500">
            Centralize your website content. Select a module below to start
            editing.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {contentItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="group relative block outline-none"
                style={{
                  animationDelay: `${idx * 75}ms`,
                }}
              >
                <div
                  className={`relative h-full overflow-hidden rounded-2xl border border-transparent ${item.gradient} p-7 transition-all duration-500 ease-out hover:-translate-y-1.5 ${item.shadowColor}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-1 flex-col gap-1">
                      <h3 className="text-xl font-bold text-slate-800 transition-colors group-hover:text-slate-900">
                        {item.name}
                      </h3>
                      <p className="text-sm font-medium text-slate-500 transition-colors group-hover:text-slate-600">
                        {item.description}
                      </p>
                    </div>
                    {/* Re-added Icon rendering since it's used in design */}
                    <div className="shrink-0">
                      <Icon
                        className="h-8 w-8 text-slate-700 opacity-80"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  {/* Decorative Arrow */}
                  <div className="absolute top-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <ArrowUpRight className="h-5 w-5 text-slate-400" />
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
