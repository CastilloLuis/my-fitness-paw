"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useTranslation } from "@/i18n";

export default function HowItWorks() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const steps = [
    {
      number: "01",
      title: t("howItWorks.step1Title"),
      description: t("howItWorks.step1Desc"),
      emoji: "🐾",
      color: "#CC6A1E",
      bgColor: "rgba(242,179,109,0.12)",
    },
    {
      number: "02",
      title: t("howItWorks.step2Title"),
      description: t("howItWorks.step2Desc"),
      emoji: "▶️",
      color: "#2F7D57",
      bgColor: "rgba(47,125,87,0.10)",
    },
    {
      number: "03",
      title: t("howItWorks.step3Title"),
      description: t("howItWorks.step3Desc"),
      emoji: "📈",
      color: "#8A5A3C",
      bgColor: "rgba(138,90,60,0.10)",
    },
  ];

  return (
    <section id="how-it-works" className="relative py-24 md:py-32 bg-ivory-50">
      <div ref={ref} className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full bg-cinnamon-600/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cinnamon-600 mb-4">
            {t("howItWorks.badge")}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tight text-ink-900">
            {t("howItWorks.title")}{" "}
            <span className="text-ginger-600">{t("howItWorks.titleHighlight")}</span>
          </h2>
        </motion.div>

        <div className="relative grid gap-8 md:grid-cols-3 md:gap-6">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-[72px] left-[16.66%] right-[16.66%] h-[2px]">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full origin-left"
              style={{
                background:
                  "linear-gradient(90deg, #CC6A1E, #2F7D57, #8A5A3C)",
              }}
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: 0.15 + i * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Number circle */}
              <div
                className="relative z-10 mb-6 flex h-[88px] w-[88px] items-center justify-center rounded-full transition-transform duration-300 hover:scale-110"
                style={{
                  backgroundColor: step.bgColor,
                  boxShadow: `0 4px 20px ${step.color}20`,
                }}
              >
                <span
                  className="text-3xl font-extrabold"
                  style={{ color: step.color }}
                >
                  {step.emoji}
                </span>
                <div
                  className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-extrabold text-white"
                  style={{ backgroundColor: step.color }}
                >
                  {step.number}
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-ink-900 mb-2">
                {step.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-muted max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
