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
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  LogOut,
  User,
  Settings,
  ExternalLink,
  Pencil,
  FileText,
  HelpCircle,
  Share,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import Link from "next/link";

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

export default function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();
  const { logout } = useAuth();

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

  const handleEdit = () => {
    router.push(`/builder/${user.id}`);
  };

  const handlePreview = () => {
    router.push(`/preview/${user.id}`);
  };

  const handleShare = () => {
    // Implement share functionality
    const isProduction = process.env.NODE_ENV === "production";
    const liveUrl = isProduction
      ? `https://${user.subDomain}.${user.domain}`
      : `http://${user.subDomain}.localhost:3000`;

    if (navigator.share) {
      navigator.share({
        title: user.storeName,
        url: liveUrl,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(liveUrl);
    }
  };

  const handleFeedback = () => {
    // Navigate to feedback page or open feedback modal
    router.push("/admin/feedback");
  };

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word.charAt(0).toUpperCase())
      .join("")
      .substring(0, 2);
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-16 border-b bg-white">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side - Logo */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <Image src="/fulllogo.svg" alt="Logo" width={150} height={40} />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreview}
            className="rounded-full bg-[#E8EDF2] text-[#074685]"
          >
            Preview
            <ExternalLink className="mr-2" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleEdit}
            className="rounded-full bg-[#E8EDF2] text-[#074685]"
          >
            <Pencil className="mr-2" />
            Website Builder
          </Button>
          <Button variant="ghost" size="sm">
            Docs
          </Button>

          <Button variant="ghost" size="sm">
            Help
          </Button>

          <Link href="/admin/feedback">
            <Button variant="ghost" size="sm" onClick={handleFeedback}>
              Share Feedback
            </Button>
          </Link>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative ml-4 h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="bg-primary text-xs font-medium text-white">
                    {getUserInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium capitalize">{user.name}</p>
                  <p className="text-muted-foreground text-xs">{user.email}</p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {user.subDomain}
                    </Badge>
                  </div>
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
      </div>
    </header>
  );
}
