import Link from "next/link";
import JsonLd, { breadcrumbLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";

type Crumb = { href: string; label: string };

export default function PageHero({
  title,
  lede,
  crumbs = [],
  art,
}: {
  title: string;
  lede: string;
  crumbs?: Crumb[];
  art?: React.ReactNode;
}) {
  return (
    <section className="page-hero band--grid">
      {crumbs.length > 0 && (
        <JsonLd data={breadcrumbLd(crumbs.map((c) => ({ name: c.label, path: c.href === "/" ? "" : c.href })), SITE_URL)} />
      )}
      <div className={`wrap page-hero__inner${art ? " page-hero__inner--art" : ""}`}>
        <div>
          {crumbs.length > 0 && (
            <nav aria-label="Estás en" className="crumbs">
              <ol>
                {crumbs.map((c) => (
                  <li key={c.href}>
                    <Link href={c.href}>{c.label}</Link>
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <h1 className="page-title">{title}</h1>
          <p className="section-lede">{lede}</p>
        </div>
        {art && <div className="page-hero__art">{art}</div>}
      </div>
    </section>
  );
}
