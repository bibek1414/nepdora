import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        placeholder=" "
        className={cn("peer", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
FloatingInput.displayName = "FloatingInput";

const FloatingTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <Textarea
        placeholder=" "
        className={cn("peer min-h-[100px] resize-none", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
FloatingTextarea.displayName = "FloatingTextarea";

const FloatingLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Label
      className={cn(
        "peer-focus:secondary peer-focus:dark:secondary bg-background dark:bg-background absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
FloatingLabel.displayName = "FloatingLabel";

type FloatingLabelInputProps = InputProps & {
  label?: string | React.ReactNode;
  startIcon?: React.ReactNode;
};

const FloatingLabelInput = React.forwardRef<
  React.ElementRef<typeof FloatingInput>,
  React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, startIcon, className, ...props }, ref) => {
  return (
    <div className="relative">
      {startIcon && (
        <div className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-gray-500">
          {startIcon}
        </div>
      )}
      <FloatingInput
        ref={ref}
        id={id}
        className={cn(startIcon && "pl-10", className)}
        {...props}
      />
      <FloatingLabel
        htmlFor={id}
        className={cn(
          startIcon && "peer-placeholder-shown:left-8 peer-focus:left-0"
        )}
      >
        {label}
      </FloatingLabel>
    </div>
  );
});
FloatingLabelInput.displayName = "FloatingLabelInput";

type FloatingLabelTextareaProps = TextareaProps & {
  label?: string | React.ReactNode;
};

const FloatingLabelTextarea = React.forwardRef<
  React.ElementRef<typeof FloatingTextarea>,
  React.PropsWithoutRef<FloatingLabelTextareaProps>
>(({ id, label, className, ...props }, ref) => {
  return (
    <div className="relative">
      <FloatingTextarea ref={ref} id={id} className={className} {...props} />
      <FloatingLabel htmlFor={id} className="peer-placeholder-shown:top-6">
        {label}
      </FloatingLabel>
    </div>
  );
});
FloatingLabelTextarea.displayName = "FloatingLabelTextarea";

export {
  FloatingInput,
  FloatingLabel,
  FloatingLabelInput,
  FloatingTextarea,
  FloatingLabelTextarea,
};
