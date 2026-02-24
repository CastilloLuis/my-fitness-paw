"use client";

import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useTranslation } from "@/i18n";

function FeatureCard({
  feature,
  index,
}: {
  feature: {
    title: string;
    description: string;
    icon: string;
    gradient: string;
    character: string;
    characterAlt: string;
  };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative rounded-3xl bg-white p-6 transition-all duration-300 hover:-translate-y-1"
      style={{
        boxShadow:
          "0 1px 4px rgba(20,19,17,0.04), 0 4px 16px rgba(20,19,17,0.04)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 20px rgba(20,19,17,0.08), 0 12px 40px rgba(20,19,17,0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 1px 4px rgba(20,19,17,0.04), 0 4px 16px rgba(20,19,17,0.04)";
      }}
    >
      {/* Gradient accent bar */}
      <div
        className="mb-5 h-1.5 w-12 rounded-full"
        style={{ background: feature.gradient }}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-extrabold text-ink-900 mb-2">
            {feature.title}
          </h3>
          <p className="text-[15px] leading-relaxed text-muted">
            {feature.description}
          </p>
        </div>

        {/* Character illustration */}
        <div className="relative flex-shrink-0 w-20 h-20 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-3deg]">
          <Image
            src={feature.character}
            alt={feature.characterAlt}
            fill
            className="object-contain drop-shadow-md"
          />
        </div>
      </div>

      {/* Icon badge */}
      <div
        className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-xl text-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
        style={{
          background: feature.gradient,
          boxShadow: "0 4px 12px rgba(20,19,17,0.12)",
        }}
      >
        {feature.icon}
      </div>
    </motion.div>
  );
}

export default function Features() {
  const { t } = useTranslation();
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-40px" });

  const features = [
    {
      title: t("features.trackTitle"),
      description: t("features.trackDesc"),
      icon: "⏱️",
      gradient: "linear-gradient(135deg, #F8C47A, #EE8A35, #A94F18)",
      character: "/images/character/jumping.png",
      characterAlt: t("features.altJumping"),
    },
    {
      title: t("features.insightsTitle"),
      description: t("features.insightsDesc"),
      icon: "📊",
      gradient: "linear-gradient(135deg, #7ABFA5, #2F7D57, #1B5E3B)",
      character: "/images/character/treadmill.png",
      characterAlt: t("features.altTreadmill"),
    },
    {
      title: t("features.profilesTitle"),
      description: t("features.profilesDesc"),
      icon: "🐱",
      gradient: "linear-gradient(135deg, #D4A074, #8A5A3C, #5A3A2E)",
      character: "/images/character/dumbell.png",
      characterAlt: t("features.altDumbbells"),
    },
    {
      title: t("features.safetyTitle"),
      description: t("features.safetyDesc"),
      icon: "🛡️",
      gradient: "linear-gradient(135deg, #A8B4C0, #6F7A86, #4A535E)",
      character: "/images/character/abs.png",
      characterAlt: t("features.altAbs"),
    },
  ];

  return (
    <section
      id="features"
      className="relative bg-ivory-100 py-24 md:py-32 noise-overlay"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headingInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-block rounded-full bg-ginger-400/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-ginger-700 mb-4">
            {t("features.badge")}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tight text-ink-900">
            {t("features.title")}
            <br />
            <span className="text-ginger-600">{t("features.titleHighlight")}</span>
          </h2>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
