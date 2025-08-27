import { Skeleton } from "@/components/ui/skeleton";

export function PositionSelectionSkeleton() {
  const PlayerPositionSkeleton = () => (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-24" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <Skeleton className="h-8 w-80 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          {Array.from({ length: 6 }).map((_, i) => (
            <PlayerPositionSkeleton key={i} />
          ))}
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          {Array.from({ length: 6 }).map((_, i) => (
            <PlayerPositionSkeleton key={i} />
          ))}
        </div>
      </div>
      
      <div className="flex justify-center space-x-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}