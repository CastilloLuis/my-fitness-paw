"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/i18n";

const socialIcons = [
  {
    label: "Twitter / X",
    href: "#",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "Instagram",
    href: "#",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    label: "TikTok",
    href: "#",
    path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  },
];

export default function Footer() {
  const { t } = useTranslation();

  const footerLinks = [
    { label: t("footer.privacyPolicy"), href: "/privacy-policy" },
    { label: t("footer.termsOfService"), href: "/terms" },
    { label: t("footer.contact"), href: "mailto:contact@myfitnesspaw.com" },
  ];

  return (
    <footer className="relative bg-cocoa-700 pt-16 pb-8 text-ivory-100">
      {/* Top wave */}
      <div className="absolute -top-px left-0 right-0">
        <svg
          viewBox="0 0 1440 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 48H1440V16C1200 44 960 0 720 24C480 48 240 8 0 32V48Z"
            fill="#5A3A2E"
          />
        </svg>
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between md:items-start">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image
                src="/images/paw.png"
                alt="MyFitnessPaw"
                width={32}
                height={32}
                className="brightness-110 transition-transform duration-300 group-hover:rotate-[-8deg]"
              />
              <span className="text-lg font-extrabold tracking-tight text-ivory-50">
                MyFitness
                <span className="text-ginger-400">Paw</span>
              </span>
            </Link>
            <p className="text-sm text-ivory-100/60 max-w-xs text-center md:text-left">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-ivory-100/60 transition-colors hover:text-ginger-400"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Social */}
          <div className="flex gap-3">
            {socialIcons.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/8 transition-all duration-200 hover:bg-ginger-600 hover:scale-110"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-ivory-100/70"
                >
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-ivory-100/40">
            &copy; {new Date().getFullYear()} {t("footer.copyright")}
          </p>
          <p className="text-xs text-ivory-100/40">
            {t("footer.madeWith")}
          </p>
        </div>
      </div>
    </footer>
  );
}
