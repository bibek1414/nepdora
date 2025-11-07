"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

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

      // Send credentials to SERVER for validation
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
        // Clear form
        setFormData({ email: "", password: "" });

        // Redirect to dashboard with replace to prevent back button to login
        router.replace("/superadmin/dashboard");

        // Force a refresh to trigger auth check
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="bg-primary mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full">
            <svg
              className="h-10 w-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
          <p className="mt-2 text-gray-600">Secure access to admin dashboard</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <Input
              id="email"
              name="email"
              type="text"
              label="Email"
              className="focus:ring-primary border-gray-300"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div>
            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              className="focus:ring-primary border-gray-300"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-center">
                <svg
                  className="mr-3 h-5 w-5 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              isLoading || !formData.email.trim() || !formData.password.trim()
            }
            className="bg-primary hover:bg-primary focus:ring-primary w-full transform rounded-lg px-4 py-3 font-medium text-white transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-offset-2 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-xs text-amber-800">
              <svg
                className="mr-1 inline h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              Authorized personnel only. All access is monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
