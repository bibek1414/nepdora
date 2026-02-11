import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar Skeleton */}
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Skeleton className="h-8 w-32" />
          <div className="hidden gap-6 md:flex">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
      </header>

      {/* Hero Skeleton */}
      <div className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="flex flex-col items-center space-y-4 text-center">
            <Skeleton className="h-12 w-3/4 max-w-2xl sm:h-16" />
            <Skeleton className="h-6 w-full max-w-xl sm:h-8" />
            <div className="mt-8 flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>

        {/* Content Section Skeleton */}
        <div className="bg-muted/50 py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col gap-4">
                  <Skeleton className="aspect-video w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
