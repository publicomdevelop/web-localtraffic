"use client";

import { usePathname } from "next/navigation";
import { langFromPath, type Lang } from "@/lib/i18n";

/** Current language in client components, from the URL (/en/... is English). */
export function useLang(): Lang {
  return langFromPath(usePathname());
}
