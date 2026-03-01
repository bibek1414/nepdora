export interface AuthFormData {
  style: "style-1" | "style-2";
  title: string;
  subtitle?: string;
  buttonText: string;
  redirectTo?: string;
}

export const DEFAULT_LOGIN_MAP: Record<"style-1" | "style-2", AuthFormData> = {
  "style-1": {
    style: "style-1",
    title: "Login",
    subtitle: "Welcome back! Please login to your account.",
    buttonText: "Login",
    redirectTo: "/",
  },
  "style-2": {
    style: "style-2",
    title: "Sign In",
    subtitle: "Access your dashboard and orders.",
    buttonText: "Sign In",
    redirectTo: "/",
  },
};

export const DEFAULT_SIGNUP_MAP: Record<"style-1" | "style-2", AuthFormData> = {
  "style-1": {
    style: "style-1",
    title: "Create Account",
    subtitle: "Join us today and start shopping!",
    buttonText: "Sign Up",
    redirectTo: "/login",
  },
  "style-2": {
    style: "style-2",
    title: "Register",
    subtitle: "Quick and easy registration.",
    buttonText: "Register Now",
    redirectTo: "/login",
  },
};
