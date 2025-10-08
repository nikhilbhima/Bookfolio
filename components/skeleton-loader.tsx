import { Skeleton } from "./ui/skeleton";

export function BookGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
          <div className="space-y-2 px-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function BookListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border border-border rounded-lg">
          <Skeleton className="w-16 h-24 rounded flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-3 w-1/5" />
          </div>
          <Skeleton className="w-20 h-4" />
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="p-8 space-y-6 border border-border rounded-2xl">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <Skeleton className="w-24 h-24 rounded-full" />
        <div className="flex-1 space-y-3 text-center sm:text-left w-full">
          <Skeleton className="h-6 w-48 mx-auto sm:mx-0" />
          <Skeleton className="h-4 w-64 mx-auto sm:mx-0" />
          <Skeleton className="h-4 w-full max-w-md mx-auto sm:mx-0" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-20" />
        ))}
      </div>
    </div>
  );
}

export function StatsBoxesSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-5 border border-border rounded-2xl space-y-2">
          <Skeleton className="h-8 w-12" />
          <Skeleton className="h-4 w-24" />
        </div>
      ))}
    </div>
  );
}
