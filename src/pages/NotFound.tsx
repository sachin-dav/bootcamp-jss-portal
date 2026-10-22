import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Only rendered for URLs that match no route. Never used for missing company data.
export default function NotFound() {
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white px-4 text-center">
      <p className="font-heading text-6xl font-bold text-slate-300">404</p>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-sm text-muted-foreground">
        <code className="rounded bg-secondary px-1.5 py-0.5">{pathname}</code> doesn't exist.
      </p>
      <Button asChild>
        <Link to="/">Back to all companies</Link>
      </Button>
    </div>
  );
}
