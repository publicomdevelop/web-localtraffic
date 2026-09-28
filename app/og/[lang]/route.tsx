import { renderOg } from "@/lib/og";

export function generateStaticParams() {
  return [{ lang: "es" }, { lang: "en" }];
}

export function GET(_req: Request, { params }: { params: { lang: string } }) {
  return renderOg(params.lang === "en" ? "en" : "es");
}
