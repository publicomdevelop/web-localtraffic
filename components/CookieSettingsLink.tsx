"use client";

import { openConsentSettings } from "@/lib/consent";

export default function CookieSettingsLink({ label }: { label: string }) {
  return (
    <button type="button" className="footer__linkbtn" onClick={openConsentSettings}>
      {label}
    </button>
  );
}
