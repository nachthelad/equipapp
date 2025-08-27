import { Skeleton } from "@/components/ui/skeleton";

export function PlayerFormSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-80 mx-auto" />
      </div>
      
      <div className="space-y-4">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-64 w-full" />
        
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      
      <div className="flex justify-center space-x-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}