"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "@/i18n";
import LanguageToggle from "./language-toggle";

const CAT_POOL = ["🐱", "😺", "😸", "🐈", "🐈‍⬛"];

function pickRandom(count: number) {
  const shuffled = [...CAT_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const SLOT_OFFSETS = ["-0.4em", "0.8em", "2em"];

function BouncingCats({ visible }: { visible: boolean }) {
  const [cats, setCats] = useState<string[]>([]);

  useEffect(() => {
    if (visible) setCats(pickRandom(3));
  }, [visible]);

  return (
    <span className="pointer-events-none absolute left-0 right-0 top-full">
      <AnimatePresence>
        {visible &&
          cats.map((emoji, i) => (
            <motion.span
              key={`${emoji}-${i}`}
              initial={{ opacity: 0, scale: 0.3, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.3, y: 4 }}
              transition={{
                duration: 0.35,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute text-sm select-none"
              style={{ left: `calc(50% + ${SLOT_OFFSETS[i]})` }}
            >
              {emoji}
            </motion.span>
          ))}
      </AnimatePresence>
    </span>
  );
}

export default function Navbar() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);

  const links = [
    { label: t("navbar.features"), href: "#features" },
    { label: t("navbar.howItWorks"), href: "#how-it-works" },
    { label: t("navbar.activities"), href: "#activities" },
    { label: t("navbar.download"), href: "#download" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled
            ? "rgba(251,250,247,0.82)"
            : "rgba(251,250,247,0)",
          backdropFilter: scrolled ? "blur(18px) saturate(1.6)" : "none",
          boxShadow: scrolled
            ? "0 1px 12px rgba(20,19,17,0.06)"
            : "none",
        }}
      >
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <Link
            href="/"
            className="relative flex items-center gap-2.5 group"
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <Image
              src="/images/paw.png"
              alt="MyFitnessPaw"
              width={36}
              height={36}
              className="transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-110"
            />
            <span className="relative text-lg font-extrabold tracking-tight text-ink-900">
              MyFitness
              <span className="text-ginger-600">Paw</span>
              <BouncingCats visible={logoHovered} />
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative text-[15px] font-semibold text-ink-800 transition-colors hover:text-ginger-600 after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-0 after:bg-ginger-500 after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Language toggle + CTA */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageToggle />
            <a
              href="#download"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-ivory-50 transition-all duration-200 hover:scale-[1.04] active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #F5A035, #EE7E2E, #D96825)",
                boxShadow:
                  "0 2px 12px rgba(204,106,30,0.30), inset 0 1px 0 rgba(255,255,255,0.18)",
              }}
            >
              {t("navbar.downloadApp")}
            </a>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden flex flex-col gap-[5px] p-2"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="block h-[2.5px] w-6 rounded-full bg-ink-900"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0, x: 8 } : { opacity: 1, x: 0 }}
              className="block h-[2.5px] w-6 rounded-full bg-ink-900"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="block h-[2.5px] w-6 rounded-full bg-ink-900"
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-18 z-40 border-b border-taupe-200 md:hidden"
            style={{
              backgroundColor: "rgba(251,250,247,0.96)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-[15px] font-semibold text-ink-800 transition-colors hover:bg-ivory-100 hover:text-ginger-600"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex justify-center py-2">
                <LanguageToggle />
              </div>
              <a
                href="#download"
                onClick={() => setMobileOpen(false)}
                className="mt-2 flex items-center justify-center rounded-full px-5 py-3 text-sm font-bold text-ivory-50"
                style={{
                  background:
                    "linear-gradient(135deg, #F5A035, #EE7E2E, #D96825)",
                }}
              >
                {t("navbar.downloadApp")}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
