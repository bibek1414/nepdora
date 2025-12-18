import React from "react";
import {
  Globe,
  Youtube,
  Briefcase,
  Package,
  Home,
  MessageSquare,
  Users,
  Handshake,
  UserCog,
  ArrowUpRight,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { generateAdminPageMetadata } from "@/lib/metadata-utils";
import type { Metadata } from "next";

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
  gradient: string;
  shadowColor: string;
}

const contentItems: ContentItem[] = [
  {
    name: "Blogs",
    href: "/admin/blogs",
    icon: Globe,
    description: "Manage blog posts and articles",
    gradient: "from-[#FFE2D9] to-[#FFD0C2]",
    shadowColor: "shadow-orange-200",
  },
  {
    name: "Videos",
    href: "/admin/videos",
    icon: Youtube,
    description: "Manage video content",
    gradient: "from-[#F0DDFE] to-[#E3C5FE]",
    shadowColor: "shadow-purple-200",
  },
  {
    name: "Portfolios",
    href: "/admin/portfolio",
    icon: Briefcase,
    description: "Manage portfolio projects",
    gradient: "from-[#E6E6FA] to-[#D8D8F6]", // Periwinkle-ish
    shadowColor: "shadow-indigo-200",
  },
  {
    name: "Popup",
    href: "/admin/popup",
    icon: Package,
    description: "Configure popup messages",
    gradient: "from-[#FFF6D1] to-[#FFEBB0]",
    shadowColor: "shadow-yellow-200",
  },
  {
    name: "FAQ",
    href: "/admin/faq",
    icon: MessageSquare,
    description: "Manage frequently asked questions",
    gradient: "from-[#DCFCE7] to-[#BBF7D0]",
    shadowColor: "shadow-green-200",
  },
  {
    name: "Testimonials",
    href: "/admin/testimonials",
    icon: Users,
    description: "Manage client testimonials",
    gradient: "from-[#FCE7F3] to-[#FBCFE8]",
    shadowColor: "shadow-pink-200",
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: Home,
    description: "Manage your services",
    gradient: "from-[#E0F2FE] to-[#BAE6FD]",
    shadowColor: "shadow-sky-200",
  },
  {
    name: "Our Clients",
    href: "/admin/our-clients",
    icon: Handshake,
    description: "Manage your clients",
    gradient: "from-[#CFFAFE] to-[#A5F3FC]",
    shadowColor: "shadow-cyan-200",
  },
  {
    name: "Team",
    href: "/admin/team-member",
    icon: UserCog,
    description: "Manage your team members",
    gradient: "from-[#F1F5F9] to-[#E2E8F0]",
    shadowColor: "shadow-slate-200",
  },
];

export default function ContentManagement() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Content Management
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Design, create, and manage your content with ease.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contentItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="group relative block"
              >
                <div
                  className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} p-8 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl ${item.shadowColor}`}
                >
                  {/* Decorative Circle Background */}
                  <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/30 blur-3xl transition-all duration-500 group-hover:scale-125 group-hover:bg-white/50" />

                  {/* Secondary decorative element */}
                  <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-white/20 blur-2xl transition-all duration-500 group-hover:scale-110" />

                  <div className="relative flex h-48 flex-col justify-between">
                    {/* Arrow Up Right Icon */}
                    <div className="absolute top-0 right-0">
                      <div className="rounded-xl bg-white/70 p-2 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/90 group-hover:shadow-md">
                        <ArrowUpRight
                          className="h-5 w-5 text-gray-800"
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="mb-4 inline-flex rounded-xl bg-white/70 p-3 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/90 group-hover:shadow-md">
                        <Icon
                          className="h-6 w-6 text-gray-800"
                          strokeWidth={2.5}
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-700">
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
