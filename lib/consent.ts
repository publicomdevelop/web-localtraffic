"use client";

/**
 * Cookie consent, stored in localStorage (not a cookie). Following the AEPD
 * cookie guide, the choice is asked again after 12 months at most.
 */
export type Consent = { analytics: boolean; date: number };

const KEY = "lt:consent";
const MAX_AGE = 365 * 24 * 60 * 60 * 1000;
export const CONSENT_EVENT = "lt:consent-change";
export const OPEN_SETTINGS_EVENT = "lt:consent-open";

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const c = JSON.parse(raw) as Consent;
    if (typeof c.analytics !== "boolean" || typeof c.date !== "number") return null;
    if (Date.now() - c.date > MAX_AGE) return null;
    return c;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean) {
  const c: Consent = { analytics, date: Date.now() };
  try {
    localStorage.setItem(KEY, JSON.stringify(c));
  } catch {
    // Storage blocked: the choice applies to this visit only.
  }
  window.dispatchEvent(new CustomEvent<Consent>(CONSENT_EVENT, { detail: c }));
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

/** Remove Google Analytics cookies after consent is withdrawn. */
export function clearAnalyticsCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.replace(/^www\./, "")}`];
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim();
    if (!name.startsWith("_ga")) return;
    domains.forEach((d) => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? `; domain=${d}` : ""}`;
    });
  });
}
