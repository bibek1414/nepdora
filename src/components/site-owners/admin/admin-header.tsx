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
  User as UserIcon,
  Settings,
  ExternalLink,
  Pencil,
  FileText,
  HelpCircle,
  Share,
  FileCheck,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { User } from "@/types/auth/auth";
import { getUserInitials } from "@/lib/user-utils";
import { useState } from "react";
import OnboardingModal from "@/components/on-boarding/admin/on-boarding-component";
import { toast } from "sonner";

interface AdminHeaderProps {
  user: User;
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter();
  const { logout, user: authUser, updateUser } = useAuth();
  const currentUser = authUser || user;
  const [showOnboarding, setShowOnboarding] = useState(
    !user?.is_onboarding_complete
  );

  const handleOpenOnboarding = () => setShowOnboarding(true);
  const handleCloseOnboarding = () => setShowOnboarding(false);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    toast.success("Onboarding completed!");
  };

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

  const handleFeedback = () => {
    router.push("/support");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side - Logo */}
        <div className="flex items-center space-x-4"></div>

        <div className="flex items-center space-x-2">
          {!currentUser?.is_onboarding_complete && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenOnboarding}
              className="rounded-full border-none bg-[#E8EDF2] text-xs text-[#074685] hover:bg-[#E8EDF2] hover:text-[#074685]"
            >
              <FileCheck className="mr-2 h-4 w-4" />
              Complete Setup
            </Button>
          )}
          <Link href={`/`} target="_blank" rel="noopener noreferrer">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#E8EDF2] text-[#074685] hover:bg-[#E8EDF2] hover:text-[#074685]"
            >
              Live Site
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link
            href={`/preview/${currentUser.sub_domain}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#E8EDF2] text-[#074685] hover:bg-[#E8EDF2] hover:text-[#074685]"
            >
              Preview
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link
            href={`/builder/${currentUser.sub_domain}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-[#E8EDF2] text-[#074685] hover:bg-[#E8EDF2] hover:text-[#074685]"
            >
              <Pencil className="mr-2 h-4 w-4" />
              Website Builder
            </Button>
          </Link>

          <a
            href="https://docs.nepdora.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="ghost" size="sm">
              Docs
            </Button>
          </a>

          <Link href="/support">
            <Button variant="ghost" size="sm">
              Help
            </Button>
          </Link>
          <Link href="/support">
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
                  <AvatarImage
                    src={currentUser.avatar}
                    alt={currentUser.name}
                  />
                  <AvatarFallback className="bg-primary text-xs font-medium text-white">
                    {getUserInitials(
                      currentUser.name || currentUser.store_name
                    )}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium capitalize">
                    {currentUser.name || currentUser.store_name}
                  </p>
                  <DropdownMenuSeparator />
                </div>
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleNavigation("/admin/profile")}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleNavigation("/admin/change-password")}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Change Password</span>
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
      {showOnboarding && (
        <OnboardingModal
          userData={{
            storeName: currentUser.store_name || "",
            email: currentUser.email,
            phoneNumber: currentUser.phone_number || "",
          }}
          isOverlay={true}
          onClose={handleCloseOnboarding}
          onComplete={handleOnboardingComplete}
        />
      )}
    </header>
  );
}
