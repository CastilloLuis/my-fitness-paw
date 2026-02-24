"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useTranslation } from "@/i18n";

const paws = [
  { x: "8%", y: "18%", size: 32, delay: 0, rotate: -18, anim: "animate-float" },
  { x: "85%", y: "12%", size: 26, delay: 0.6, rotate: 22, anim: "animate-float-slow" },
  { x: "78%", y: "72%", size: 22, delay: 1.2, rotate: -10, anim: "animate-float-reverse" },
  { x: "12%", y: "75%", size: 28, delay: 0.3, rotate: 15, anim: "animate-float-slow" },
  { x: "45%", y: "8%", size: 20, delay: 0.9, rotate: -25, anim: "animate-float" },
];

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-18">
      {/* Warm gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(165deg, #FBFAF7 0%, #F3EFE7 20%, rgba(242,179,109,0.13) 45%, rgba(233,138,42,0.09) 65%, #FBFAF7 100%)",
        }}
      />

      {/* Radial glow behind hero image */}
      <div
        className="absolute top-1/2 right-[10%] -translate-y-1/2 w-[600px] h-[600px] rounded-full animate-pulse-glow hidden lg:block"
        style={{
          background:
            "radial-gradient(circle, rgba(242,179,109,0.25) 0%, rgba(242,179,109,0) 70%)",
        }}
      />

      {/* Floating paw prints */}
      {paws.map((p, i) => (
        <div
          key={i}
          className={`absolute opacity-[0.12] pointer-events-none ${p.anim}`}
          style={{
            left: p.x,
            top: p.y,
            animationDelay: `${p.delay}s`,
          }}
        >
          <Image
            src="/images/two-paws.png"
            alt=""
            width={p.size}
            height={p.size}
            style={{ transform: `rotate(${p.rotate}deg)` }}
          />
        </div>
      ))}

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-16 md:py-24">
        <div className="flex flex-col-reverse items-center gap-12 lg:flex-row lg:gap-8">
          {/* Copy */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ginger-400/40 bg-ginger-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-ginger-700 mb-6">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-ginger-500 animate-pulse" />
                {t("hero.badge")}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-[clamp(2.2rem,5.5vw,4rem)] font-extrabold leading-[1.08] tracking-tight text-ink-900"
            >
              {t("hero.titleLine1")}
              <br />
              {t("hero.titleLine2")}{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #F5A035, #EE7E2E, #D96825)",
                }}
              >
                {t("hero.titleLine3")}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-5 max-w-lg text-[17px] leading-relaxed text-muted mx-auto lg:mx-0"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.34,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start"
            >
              <a
                href="#download"
                className="btn-shimmer inline-flex items-center gap-3 rounded-2xl px-7 py-4 text-[15px] font-bold text-ivory-50 transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
                style={{
                  background:
                    "linear-gradient(135deg, #F5A035, #EE7E2E, #D96825)",
                  boxShadow:
                    "0 4px 20px rgba(204,106,30,0.35), inset 0 1px 0 rgba(255,255,255,0.18)",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                {t("hero.downloadIos")}
              </a>
              <span className="inline-flex items-center gap-2 rounded-2xl border-2 border-taupe-200 bg-ivory-100 px-7 py-4 text-[15px] font-bold text-muted">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="opacity-50">
                  <path d="M3.609 1.814 13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zM14.852 13.06l2.37 2.37-10.498 5.97 8.128-8.34zM20.108 10.222c.684.39.684 1.166 0 1.556l-2.458 1.4-2.56-2.56 2.56-2.56 2.458 1.164zM6.724 3.594l10.498 5.97-2.37 2.37-8.128-8.34z"/>
                </svg>
                {t("hero.androidComingSoon")}
              </span>
            </motion.div>
          </div>

          {/* Hero character */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex-1 flex justify-center relative"
          >
            <div className="animate-float relative">
              <Image
                src="/images/character/jumping.png"
                alt={t("hero.heroAlt")}
                width={420}
                height={420}
                priority
                className="drop-shadow-2xl"
              />
            </div>

            {/* Floating stat badge */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6, type: "spring" }}
              className="absolute top-[15%] right-[-4%] animate-float-reverse"
            >
              <div
                className="rounded-2xl bg-white px-4 py-3 text-center"
                style={{
                  boxShadow:
                    "0 8px 28px rgba(20,19,17,0.10), 0 1px 4px rgba(20,19,17,0.06)",
                }}
              >
                <p className="text-2xl font-extrabold text-ginger-600">9</p>
                <p className="text-[11px] font-semibold text-muted whitespace-nowrap">
                  {t("hero.activities")}
                </p>
              </div>
            </motion.div>

            {/* Floating streak badge */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6, type: "spring" }}
              className="absolute bottom-[18%] left-[-2%] animate-float-slow"
            >
              <div
                className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3"
                style={{
                  boxShadow:
                    "0 8px 28px rgba(20,19,17,0.10), 0 1px 4px rgba(20,19,17,0.06)",
                }}
              >
                <span className="text-xl">🔥</span>
                <div>
                  <p className="text-lg font-extrabold text-ink-900 leading-none">
                    12
                  </p>
                  <p className="text-[11px] font-semibold text-muted">
                    {t("hero.dayStreak")}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40C240 70 480 80 720 60C960 40 1200 20 1440 40V80H0V40Z"
            fill="#F3EFE7"
          />
        </svg>
      </div>
    </section>
  );
}
