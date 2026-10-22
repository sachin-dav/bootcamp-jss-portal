import { memo, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface CompanyLogoProps {
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  className?: string;
}

function domainFrom(url?: string): string {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** Logo.dev (if key set) → seed/DB logo_url → initial-letter circle. */
function CompanyLogoBase({ name, logoUrl, websiteUrl, className }: CompanyLogoProps) {
  const sources = useMemo(() => {
    const list: string[] = [];
    const key = import.meta.env.VITE_LOGO_DEV_PUBLISHABLE_KEY;
    const domain = domainFrom(websiteUrl);
    if (key && domain) list.push(`https://img.logo.dev/${domain}?token=${key}&size=128&format=png`);
    if (logoUrl) list.push(logoUrl);
    return list;
  }, [logoUrl, websiteUrl]);

  const [idx, setIdx] = useState(0);
  useEffect(() => setIdx(0), [sources]);

  const src = sources[idx];
  return (
    <div
      className={cn(
        "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white",
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={`${name} logo`}
          loading="lazy"
          className="h-full w-full object-contain p-1.5"
          onError={() => setIdx((i) => i + 1)}
        />
      ) : (
        <span className="font-heading text-lg font-semibold text-slate-600" aria-label={`${name} initial`}>
          {name.trim().charAt(0).toUpperCase() || "?"}
        </span>
      )}
    </div>
  );
}

export const CompanyLogo = memo(CompanyLogoBase);
