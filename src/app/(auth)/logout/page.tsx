"use client";

import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    // Clear everything possible
    localStorage.clear();
    sessionStorage.clear();

    // Try clearing cookies (works only if cookie domain allows it)
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.slice(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.nepdora.com;`;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`; // fallback
    });

    // Check for redirect param
    const searchParams = new URLSearchParams(window.location.search);
    const nextPath = searchParams.get("next") || "/";

    // Redirect after short delay
    setTimeout(() => {
      window.location.href = nextPath;
    }, 800);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center text-lg font-semibold">
      Logging out...
    </div>
  );
}
