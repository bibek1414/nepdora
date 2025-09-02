"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function VerificationCard({
  decodedKey,
  autoRedirect = true,
}: {
  decodedKey: string;
  autoRedirect?: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!decodedKey) {
        setStatus("error");
        setMessage("Verification key is missing");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/verify-email/`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ key: decodedKey }),
          }
        );

        const data = (await response.json()) as {
          status: number;
          message?: string;
          errors?: Array<{ message: string; code: string; param: string }>;
        };

        if (response.ok) {
          setStatus("success");
          setMessage("Email verified successfully!");
        } else {
          setStatus("error");
          if (data.errors && data.errors.length > 0) {
            setMessage(data.errors[0].message);
          } else {
            setMessage("Email verification failed");
          }
        }
      } catch (error) {
        setStatus("error");
        setMessage("An error occurred during verification");
        console.error("Verification error:", error);
      }
    };

    verifyEmail();
  }, [decodedKey]);

  useEffect(() => {
    if (status === "success" && autoRedirect) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, autoRedirect, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8">
        <div className="text-center">
          {status === "loading" && (
            <>
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                Verifying your email...
              </h2>
              <p className="text-gray-600">
                Please wait while we verify your email address.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                Email Verified!
              </h2>
              <p className="mb-4 text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">
                Redirecting you in a moment...
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                Verification Failed
              </h2>
              <p className="mb-4 text-gray-600">{message}</p>
              <button
                onClick={() => router.push("/login")}
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
              >
                Go to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
