"use client";

import { useRouter } from "next/navigation";
import {
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import { Input } from "@/components/ui/input";

interface FormData {
  email: string;
  password: string;
}

interface AuthCheckResult {
  isValid: boolean;
  shouldRedirect: boolean;
}

export default function AdminLogin() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // Check if already authenticated
  useEffect(() => {
    const checkExistingAuth = (): AuthCheckResult => {
      try {
        const authStatus: string | null =
          localStorage.getItem("adminAuthenticated");
        const authTime: string | null = localStorage.getItem("adminAuthTime");
        const currentTime: number = Date.now();

        // Check if auth is valid and not expired
        const SESSION_TIMEOUT: number = 8 * 60 * 60 * 1000; // 8 hours
        const isValidAuth: boolean =
          authStatus === "true" &&
          authTime !== null &&
          currentTime - parseInt(authTime) < SESSION_TIMEOUT;

        if (isValidAuth) {
          router.push("/superadmin/dashboard");
          return { isValid: true, shouldRedirect: true };
        }

        return { isValid: false, shouldRedirect: false };
      } catch (error) {
        console.error("Auth check failed:", error);
        // Clear potentially corrupted auth data
        localStorage.removeItem("adminAuthenticated");
        localStorage.removeItem("adminAuthTime");
        localStorage.removeItem("adminUser");
        return { isValid: false, shouldRedirect: false };
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
    // Clear error when user starts typing
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

      await new Promise<void>(resolve => setTimeout(resolve, 1000));

      // Get admin credentials from environment variables
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

      if (
        formData.email === adminEmail &&
        formData.password === adminPassword
      ) {
        const currentTime: number = Date.now();

        localStorage.setItem("adminAuthenticated", "true");
        localStorage.setItem("adminAuthTime", currentTime.toString());
        localStorage.setItem("adminUser", formData.email);

        setFormData({ email: "", password: "" });

        router.push("/superadmin/dashboard");
      } else {
        setError("Invalid credentials. Please check your email and password.");

        console.warn("Failed login attempt:", {
          email: formData.email,
          timestamp: new Date().toISOString(),
          ip: "client-side",
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && !isLoading) {
      // Create a synthetic form event for handleLogin
      const form = e.currentTarget.form;
      if (form) {
        const syntheticEvent = new Event("submit", {
          bubbles: true,
          cancelable: true,
        });
        Object.defineProperty(syntheticEvent, "target", { value: form });
        Object.defineProperty(syntheticEvent, "currentTarget", { value: form });
        handleLogin(syntheticEvent as unknown as FormEvent<HTMLFormElement>);
      }
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
              onKeyPress={handleKeyPress}
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
              onKeyPress={handleKeyPress}
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
              <>
                <svg
                  className="mr-2 inline h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Sign In
              </>
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
