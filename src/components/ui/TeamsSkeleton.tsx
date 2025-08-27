import { Skeleton } from "@/components/ui/skeleton";

export function TeamsSkeleton() {
  const PlayerSkeleton = () => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-6 w-12 rounded-full" />
    </div>
  );

  const TeamSkeleton = () => (
    <div className="team-card rounded-2xl p-6 shadow-xl">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Skeleton className="w-4 h-4 rounded-full" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-8" />
      </div>
      
      <div className="space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <PlayerSkeleton key={i} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
        <Skeleton className="h-8 w-48 mx-auto mb-2" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </div>

      {/* Teams */}
      <div className="grid md:grid-cols-2 gap-6">
        <TeamSkeleton />
        <TeamSkeleton />
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-44" />
      </div>

      {/* Back button */}
      <div className="text-center pt-4">
        <Skeleton className="h-8 w-40 mx-auto" />
      </div>
    </div>
  );
}