import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

type RedirectOptions = {
  /**
   * Alternate route for first time users who still need onboarding.
   * Defaults to `/on-boarding`.
   */
  firstLoginPath?: string;
  /**
   * Ability to opt-out of the first_login based redirect.
   * Defaults to true so the login/signup pages mimic AuthContext.
   */
  respectFirstLogin?: boolean;
};

export function useAuthRedirect(
  redirectTo: string = "/admin",
  options: RedirectOptions = {}
) {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const firstLoginPath = options.firstLoginPath ?? "/on-boarding";
  const respectFirstLogin =
    options.respectFirstLogin === undefined ? true : options.respectFirstLogin;

  useEffect(() => {
    if (isLoading || !user) return;

    const shouldUseFirstLoginPath = respectFirstLogin && user.first_login;
    const destination = shouldUseFirstLoginPath ? firstLoginPath : redirectTo;

    router.replace(destination);
  }, [user, isLoading, router, redirectTo, firstLoginPath, respectFirstLogin]);

  return { isRedirecting: !isLoading && !!user, isLoading };
}
