interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({
  message = "Loading...",
}: LoadingSpinnerProps) {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="border-primary h-32 w-32 animate-spin rounded-full border-b-2"></div>
        <p className="text-muted-foreground text-sm">{message}</p>
      </div>
    </div>
  );
}
