"use client";

import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useTranslation } from "@/i18n";

export default function DownloadCta() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section id="download" className="relative py-24 md:py-32 overflow-hidden">
      {/* Full background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #5A3A2E 0%, #8A5A3C 30%, #CC6A1E 60%, #E98A2A 80%, #F2B36D 100%)",
        }}
      />

      {/* Noise */}
      <div className="absolute inset-0 noise-overlay" />

      {/* Glowing orbs */}
      <div
        className="absolute top-[10%] left-[15%] w-80 h-80 rounded-full animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[10%] right-[10%] w-96 h-96 rounded-full animate-pulse-glow"
        style={{
          background:
            "radial-gradient(circle, rgba(242,179,109,0.15) 0%, transparent 70%)",
          animationDelay: "1.5s",
        }}
      />

      <div
        ref={ref}
        className="relative z-10 mx-auto max-w-6xl px-6"
      >
        <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex-shrink-0"
          >
            <Image
              src="/images/community-playing.png"
              alt={t("downloadCta.imageAlt")}
              width={400}
              height={280}
              className="rounded-3xl drop-shadow-2xl"
              style={{
                boxShadow: "0 12px 48px rgba(20,19,17,0.25)",
              }}
            />
          </motion.div>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-center lg:text-left"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/90 mb-5 backdrop-blur-sm">
              {t("downloadCta.badge")}
            </span>

            <h2 className="text-[clamp(2rem,5vw,3.2rem)] font-extrabold leading-tight text-white tracking-tight">
              {t("downloadCta.title")}
            </h2>

            <p className="mt-4 max-w-md text-[17px] leading-relaxed text-white/80">
              {t("downloadCta.subtitlePre")}{" "}
              <span className="font-bold text-white underline decoration-ginger-400/50 decoration-2 underline-offset-2">
                MyFitnessPaw
              </span>{" "}
              {t("downloadCta.subtitlePost")}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start">
              <a
                href="#"
                className="btn-shimmer inline-flex items-center gap-3 rounded-2xl bg-white px-7 py-4 text-[15px] font-bold text-ink-900 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                style={{
                  boxShadow:
                    "0 4px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.5)",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                {t("downloadCta.downloadIos")}
              </a>
              <span className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/20 bg-white/5 px-7 py-4 text-[15px] font-bold text-white/50">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="opacity-50"
                >
                  <path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zM14.852 13.06l2.37 2.37-10.498 5.97 8.128-8.34zM20.108 10.222c.684.39.684 1.166 0 1.556l-2.458 1.4-2.56-2.56 2.56-2.56 2.458 1.164zM6.724 3.594l10.498 5.97-2.37 2.37-8.128-8.34z" />
                </svg>
                {t("downloadCta.androidComingSoon")}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
