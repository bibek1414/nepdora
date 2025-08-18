"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, value, onChange, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value || "");

    // Update internal state when controlled value changes
    React.useEffect(() => {
      setInputValue(value || "");
    }, [value]);

    // Check if field has value (works for both controlled and uncontrolled)
    const hasValue = inputValue && inputValue.toString().length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);

      // Call the original onChange if provided
      if (onChange) {
        onChange(e);
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (props.onFocus) {
        props.onFocus(e);
      }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (props.onBlur) {
        props.onBlur(e);
      }
    };

    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "border-input file:text-foreground flex h-12 w-full rounded-lg border bg-white/80 px-4 py-3 text-base ring-0 transition-all duration-200 outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-transparent focus-visible:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            label && "pt-7",
            className
          )}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          value={value !== undefined ? value : inputValue} // Controlled vs uncontrolled
          {...props}
        />
        {label && (
          <label
            className={cn(
              "text-muted-foreground pointer-events-none absolute left-4 transition-all duration-200",
              isFocused || hasValue
                ? "text-muted-foreground top-2 text-[10px] font-medium"
                : "top-1/2 -translate-y-1/2 text-xs"
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
