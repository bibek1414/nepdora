import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useThemeQuery } from "@/hooks/owner-site/components/use-theme";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default: "shadow-xs cursor-pointer",
        destructive:
          "shadow-xs cursor-pointer focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline: "border shadow-xs cursor-pointer",
        secondary: "shadow-xs cursor-pointer",
        ghost: "cursor-pointer",
        link: "underline-offset-4 hover:underline cursor-pointer",
        navigation: "cursor-pointer",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  style,
  ...props
}: ButtonProps) {
  const { data: themeResponse } = useThemeQuery();

  // Get theme colors with fallback to defaults
  const theme = themeResponse?.data?.[0]?.data?.theme || {
    colors: {
      text: "#0F172A",
      primary: "#3B82F6",
      primaryForeground: "#FFFFFF",
      secondary: "#F59E0B",
      secondaryForeground: "#1F2937",
      background: "#FFFFFF",
      destructive: "#EF4444",
    },
    fonts: {
      body: "Inter",
      heading: "Poppins",
    },
  };

  // Generate dynamic styles based on variant and theme
  const getThemeStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      fontFamily: theme.fonts.heading,
    };

    switch (variant) {
      case "default":
        return {
          ...baseStyles,
          backgroundColor: theme.colors.primary,
          color: theme.colors.primaryForeground,
        };

      case "secondary":
        return {
          ...baseStyles,
          backgroundColor: theme.colors.secondary,
          color: theme.colors.text,
        };

      case "outline":
        return {
          ...baseStyles,
        };

      case "ghost":
        return {
          ...baseStyles,
          backgroundColor: "transparent",
        };
      case "navigation":
        return {
          ...baseStyles,
          backgroundColor: "transparent",
          color: "black",
        };

      case "link":
        return {
          ...baseStyles,
          backgroundColor: "transparent",
          color: theme.colors.primary,
        };

      case "destructive":
        return {
          ...baseStyles,
          color: theme.colors.primaryForeground,
        };

      default:
        return baseStyles;
    }
  };

  // Generate hover styles using CSS custom properties
  const getHoverStyles = (): React.CSSProperties => {
    switch (variant) {
      case "default":
        return {
          "--hover-bg": `${theme.colors.primary}e6`, // 90% opacity
          "--hover-color": theme.colors.primaryForeground, // Keep text color consistent
        } as React.CSSProperties;

      case "secondary":
        return {
          "--hover-bg": `${theme.colors.secondary}cc`, // 80% opacity
          "--hover-color": theme.colors.secondaryForeground, // Keep text color consistent
        } as React.CSSProperties;

      case "outline":
        return {} as React.CSSProperties;
      case "link":
        return {
          "--hover-bg": "transparent",
          "--hover-color": theme.colors.primary,
        } as React.CSSProperties;
      case "ghost":
        return {
          "--hover-bg": "#f9fafb",
        } as React.CSSProperties;

      case "navigation":
        return {} as React.CSSProperties;
      default:
        return {};
    }
  };

  const Comp = asChild ? Slot : "button";

  const combinedStyles = {
    ...getThemeStyles(),
    ...getHoverStyles(),
    ...style, // Allow custom styles to override
  };

  return (
    <>
      <style>
        {`
          .themed-button-hover:hover {
            background-color: var(--hover-bg) !important;
            ${variant === "default" || variant === "secondary" ? "color: var(--hover-color) !important;" : "color: var(--hover-color, inherit) !important;"}
          }
        `}
      </style>
      <Comp
        data-slot="button"
        className={cn(
          buttonVariants({ variant, size }),
          "themed-button-hover",
          className
        )}
        style={combinedStyles}
        {...props}
      />
    </>
  );
}

export { Button, buttonVariants };
