"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CONSENT_EVENT, clearAnalyticsCookies, readConsent, type Consent } from "@/lib/consent";
import { GA_ID } from "@/lib/site";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Google Analytics 4, loaded only once the visitor accepts analytics cookies. */
export default function Analytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    setAllowed(readConsent()?.analytics === true);
    const onChange = (e: Event) => {
      const c = (e as CustomEvent<Consent>).detail;
      if (c.analytics) {
        setAllowed(true);
        window.gtag?.("consent", "update", { analytics_storage: "granted" });
      } else {
        window.gtag?.("consent", "update", { analytics_storage: "denied" });
        clearAnalyticsCookies();
      }
    };
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (!allowed || !GA_ID) return null;
  return (
    <>
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
      </Script>
      <Script id="ga-lib" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
    </>
  );
}
