export const SOCIAL = [
  { href: "https://www.instagram.com/localtraffic.es/", label: "Instagram", icon: "instagram" as const },
  { href: "https://www.linkedin.com/company/localtraffic", label: "LinkedIn", icon: "linkedin" as const },
];

function Icon({ name }: { name: "instagram" | "linkedin" }) {
  if (name === "instagram") {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="currentColor">
      <path d="M4.5 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3 9h3v12H3V9Zm6 0h2.9v1.7c.5-.9 1.7-1.9 3.6-1.9 3 0 3.5 2 3.5 4.6V21h-3v-6.8c0-1.6 0-3.1-1.9-3.1-1.9 0-2.1 1.4-2.1 3V21H9V9Z" />
    </svg>
  );
}

export default function SocialLinks({ className = "social", lang = "es" }: { className?: string; lang?: "es" | "en" }) {
  const newTab = lang === "en" ? "opens in a new tab" : "se abre en otra pestaña";
  return (
    <ul className={className}>
      {SOCIAL.map((s) => (
        <li key={s.href}>
          <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (${newTab})`}>
            <Icon name={s.icon} />
          </a>
        </li>
      ))}
    </ul>
  );
}
