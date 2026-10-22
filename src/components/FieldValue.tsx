import { ExternalLink, Play, Star } from "lucide-react";
import { isNullish, splitItems, type CompanyProfile } from "@/lib/companyData";
import type { IntelligenceField } from "@/data/intelligenceData";

export function NotAvailablePill() {
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
      Not Available
    </span>
  );
}

function Pill({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700">
      {children}
    </span>
  );
}

const isUrl = (v: string) => /^https?:\/\//i.test(v);
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function ExternalAnchor({ href, label }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 break-all text-sm font-medium text-[#2563EB] hover:underline"
    >
      {label ?? href}
      <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
    </a>
  );
}

/** Auto-pill detection: split on ";" first; on "," only for 3+ short tokens. */
function autoPills(value: string): string[] | null {
  if (value.includes(";")) {
    const parts = value.split(";").map((s) => s.trim()).filter(Boolean);
    return parts.length > 1 ? parts : null;
  }
  if (value.includes(",")) {
    const parts = value.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 3 && parts.every((p) => p.length <= 40)) return parts;
  }
  return null;
}

export function renderValue(field: Pick<IntelligenceField, "type" | "value">) {
  const value = field.value.trim();
  if (isNullish(value)) return <NotAvailablePill />;

  switch (field.type) {
    case "url":
      return isUrl(value) ? <ExternalAnchor href={value} /> : <span className="text-sm">{value}</span>;
    case "video":
      return isUrl(value) ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2563EB] hover:underline"
        >
          <Play className="h-4 w-4" aria-hidden /> Watch video
        </a>
      ) : (
        <span className="text-sm">{value}</span>
      );
    case "rating":
      return (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" aria-hidden />
          {value}
        </span>
      );
    case "list": {
      const items = splitItems(value);
      if (items.length <= 1) return <p className="text-sm leading-relaxed text-slate-700">{value}</p>;
      return (
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 marker:text-slate-400">
          {items.map((item, i) => (
            <li key={`${i}-${item}`}>{item}</li>
          ))}
        </ul>
      );
    }
    case "paragraph":
      return <p className="text-sm leading-relaxed text-slate-700">{value}</p>;
    default: {
      if (isUrl(value)) return <ExternalAnchor href={value} />;
      if (isEmail(value)) return <ExternalAnchor href={`mailto:${value}`} label={value} />;
      const pills = autoPills(value);
      if (pills) {
        return (
          <div className="flex flex-wrap gap-1.5">
            {pills.map((p, i) => (
              <Pill key={`${i}-${p}`}>{p}</Pill>
            ))}
          </div>
        );
      }
      return <span className="text-sm text-slate-700">{value}</span>;
    }
  }
}

export type { CompanyProfile };
