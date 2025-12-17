import React from "react";
import Link from "next/link";
import {
  Globe,
  Youtube,
  Briefcase,
  Package,
  Home,
  MessageSquare,
  LucideIcon,
  Users,
  Handshake,
  UserCog,
} from "lucide-react";
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
    shadowColor: "shadow-orange-100",
  },
  {
    name: "Videos",
    href: "/admin/videos",
    icon: Youtube,
    description: "Manage video content",
    gradient: "from-[#F0DDFE] to-[#E3C5FE]",
    shadowColor: "shadow-purple-100",
  },
  {
    name: "Portfolios",
    href: "/admin/portfolio",
    icon: Briefcase,
    description: "Manage portfolio projects",
    gradient: "from-[#E6E6FA] to-[#D8D8F6]", // Periwinkle-ish
    shadowColor: "shadow-indigo-100",
  },
  {
    name: "Popup",
    href: "/admin/popup",
    icon: Package,
    description: "Configure popup messages",
    gradient: "from-[#FFF6D1] to-[#FFEBB0]",
    shadowColor: "shadow-yellow-100",
  },
  {
    name: "FAQ",
    href: "/admin/faq",
    icon: MessageSquare,
    description: "Manage frequently asked questions",
    gradient: "from-[#DCFCE7] to-[#BBF7D0]",
    shadowColor: "shadow-green-100",
  },
  {
    name: "Testimonials",
    href: "/admin/testimonials",
    icon: Users,
    description: "Manage client testimonials",
    gradient: "from-[#FCE7F3] to-[#FBCFE8]",
    shadowColor: "shadow-pink-100",
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: Home, // Changed from Users to Home/Briefcase or similar for distinction if needed, but keeping Users is fine if preferred. I'll use Home for now to diversify.
    description: "Manage your services",
    gradient: "from-[#E0F2FE] to-[#BAE6FD]",
    shadowColor: "shadow-sky-100",
  },
  {
    name: "Our Clients",
    href: "/admin/our-clients",
    icon: Handshake,
    description: "Manage your clients",
    gradient: "from-[#CFFAFE] to-[#A5F3FC]",
    shadowColor: "shadow-cyan-100",
  },
  {
    name: "Team",
    href: "/admin/team-member",
    icon: UserCog,
    description: "Manage your team members",
    gradient: "from-[#F1F5F9] to-[#E2E8F0]",
    shadowColor: "shadow-slate-100",
  },
];

export default function ContentManagement() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            Content Management
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Design, create, and manage your content with ease.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {contentItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="group relative block"
              >
                <div
                  className={`relative overflow-hidden rounded-2xl bg-linear-to-br ${item.gradient} p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl ${item.shadowColor}`}
                >
                  {/* Decorative Circle Background */}
                  <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-white/30 blur-2xl transition-all duration-500 group-hover:bg-white/40" />

                  <div className="relative flex h-40 flex-col justify-between">
                    {" "}
                    {/* Fixed height for uniformity */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed font-medium text-gray-700/80">
                        {item.description}
                      </p>
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                      <div className="rounded-full bg-white/60 p-3 backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-white/80">
                        <Icon
                          className="h-6 w-6 text-gray-800"
                          strokeWidth={2}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Image/Illustration Placeholder - if we had custom images they would go here. 
                      For now, we use the icon in a nice container. 
                      To mimic Canva more, we could put a large icon faded in the background or right side.
                  */}
                  <div className="absolute -right-4 -bottom-4 opacity-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12">
                    <Icon className="h-32 w-32 text-black" />
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
