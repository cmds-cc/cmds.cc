import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

interface LayoutProps {
  accent: string;
  children: ReactNode;
}

export default function Layout({ accent, children }: LayoutProps) {
  const location = useLocation();

  const navLinks = [
    { to: "/hooks", label: "Hooks" },
    { to: "/skills", label: "Skills" },
    {
      href: "https://github.com/sieteunoseis/hooks-automate-builders",
      label: "GitHub",
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ "--color-accent": accent } as React.CSSProperties}
    >
      <nav className="max-w-3xl w-full mx-auto px-6 pt-8 flex items-center justify-between">
        <Link
          to="/"
          className="text-[var(--color-accent)] font-bold text-sm hover:opacity-80 transition-opacity"
        >
          CMDS.CC
        </Link>
        <div className="flex items-center gap-6">
          {navLinks.map((link) =>
            "to" in link && link.to ? (
              <Link
                key={link.to}
                to={link.to}
                className={`text-xs transition-colors ${
                  location.pathname === link.to
                    ? "text-white"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors"
              >
                {link.label}
              </a>
            ),
          )}
        </div>
      </nav>

      <main className="flex-1">{children}</main>

      <footer className="max-w-3xl w-full mx-auto px-6 pb-12 text-center">
        <p className="text-xs text-[var(--color-text-muted)]">
          Built by{" "}
          <a
            href="https://github.com/sieteunoseis"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)] transition-colors"
          >
            sieteunoseis
          </a>
        </p>
      </footer>
    </div>
  );
}
