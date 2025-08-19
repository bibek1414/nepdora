"use client";

import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, LogOut, User, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface User {
  id: number;
  email: string;
  name: string;
  storeName: string;
  role: string;
  phoneNumber: string;
  domain: string;
  subDomain: string;
  hasProfile: boolean;
  hasProfileCompleted: boolean;
  avatar: string;
}

interface AdminHeaderProps {
  user: User;
}

const getPageTitle = (pathname: string): string => {
  const pathSegments = pathname.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];

  const titles: { [key: string]: string } = {
    admin: "Dashboard",
    products: "Products",
    orders: "Orders",
    blogs: "Blogs",
    testimonials: "Testimonials",
    customers: "Customers",
    settings: "Settings",
  };

  return titles[lastSegment] || "Dashboard";
};

export default function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();

  const pageTitle = getPageTitle(pathname);

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const handleLogout = async () => {
    try {
      logout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);
  };

  return (
    <header className="h-16 border-b bg-white shadow-sm">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Page title */}
        <div className="flex-1 lg:flex-none">
          <h1 className="ml-10 text-xl font-semibold text-gray-900 lg:text-2xl">
            {pageTitle}
          </h1>
        </div>

        {/* Profile dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-blue-600 text-xs font-medium text-white">
                  {getUserInitials(user.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-muted-foreground text-xs">{user.email}</p>
                <p className="font-mono text-xs text-blue-600">{user.domain}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleNavigation("/admin/profile")}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleNavigation("/admin/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
