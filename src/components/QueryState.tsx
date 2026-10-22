import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="mx-auto max-w-5xl space-y-4 px-3 py-6 sm:px-4" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-10 w-2/3" />
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function ErrorState({
  message,
  onRetry,
  showHome = true,
}: {
  message?: string;
  onRetry: () => void;
  showHome?: boolean;
}) {
  return (
    <div className="mx-auto mt-10 max-w-md rounded-xl border border-border bg-white p-8 text-center">
      <AlertTriangle className="mx-auto h-8 w-8 text-amber-600" aria-hidden />
      <p className="mt-3 font-heading text-lg font-semibold">Couldn't load this data</p>
      <p className="mt-1 break-words text-sm text-muted-foreground">{message || "Something went wrong."}</p>
      <div className="mt-4 flex justify-center gap-2">
        <Button onClick={onRetry}>Retry</Button>
        {showHome && (
          <Button asChild variant="outline">
            <Link to="/">All companies</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
