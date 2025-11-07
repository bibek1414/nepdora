"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut, Settings, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useAuthContext } from "@/components/super-admin/auth-wrapper";

export default function SuperAdminHeader() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { adminEmail } = useAuthContext();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        router.replace("/superadmin/login");
      } else {
        console.error("Logout failed");
        setIsLoggingOut(false);
      }
    } catch (error) {
      console.error("Error during logout:", error);
      setIsLoggingOut(false);
    }
  };

  const getUserInitials = (email: string) => {
    if (!email) return "SA";
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-45 h-16 border-b bg-white">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side (Logo or empty space) */}
        <div />

        {/* Right side */}
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative ml-2 h-8 w-8 rounded-full"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-red-600 text-xs font-medium text-white">
                    {getUserInitials(adminEmail)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Super Administrator</p>
                  <p className="text-muted-foreground text-xs">{adminEmail}</p>
                  <Badge variant="destructive" className="w-fit text-xs">
                    Super Admin
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/superadmin/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
