"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
  email: string;
  password: string;
}

export default function AdminLogin() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  // Check if already authenticated on mount
  useEffect(() => {
    const checkExistingAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (response.ok && data.authenticated) {
          // Already logged in, redirect to dashboard
          router.replace("/superadmin/dashboard");
        }
      } catch (error) {
        // Not authenticated, stay on login page
        console.log("Not authenticated");
      }
    };

    checkExistingAuth();
  }, [router]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate input
      if (!formData.email.trim() || !formData.password.trim()) {
        setError("Please fill in all fields");
        return;
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFormData({ email: "", password: "" });
        router.replace("/superadmin/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F9FAFB] p-4">
      {/* Abstract Background Elements */}
      <div className="bg-primary/5 absolute top-[-10%] right-[-5%] h-[400px] w-[400px] rounded-full blur-3xl" />
      <div className="bg-secondary/10 absolute bottom-[-10%] left-[-5%] h-[300px] w-[300px] rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="relative z-10 rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-sm">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Admin Portal
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Secure access to Nepdora ecosystem
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1">
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Admin Email"
                  className="focus:border-primary pr-10"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
                <Mail className="pointer-events-none absolute top-1/2 right-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  className="focus:border-primary pr-12"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            {/* Error Message */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="rounded-xl border border-red-100 bg-red-50/50 p-4"
                >
                  <div className="flex items-center">
                    <AlertCircle className="mr-3 h-5 w-5 text-red-500" />
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={
                isLoading || !formData.email.trim() || !formData.password.trim()
              }
              className="bg-primary hover:bg-primary/90 h-12 w-full rounded-xl font-semibold text-white shadow-sm transition-all duration-300 active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign In</span>
                  <ShieldCheck className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          {/* Footer Warning */}
          <div className="mt-8">
            <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
              <div className="space-y-1">
                <p className="text-xs font-semibold tracking-wider text-gray-900 uppercase">
                  Authorized Access Only
                </p>
                <p className="text-[11px] leading-relaxed text-gray-500">
                  This is a restricted administrative system. Your IP and login
                  attempts are being recorded for security auditing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Outer Footer */}
        <p className="mt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Nepdora. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
