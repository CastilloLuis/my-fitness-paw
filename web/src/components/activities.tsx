"use client";

import Image from "next/image";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useTranslation } from "@/i18n";

function ActivityChip({
  activity,
  index,
}: {
  activity: { name: string; emoji: string; color: string; icon: string };
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group flex flex-col items-center gap-3 rounded-2xl bg-white p-5 transition-all duration-300 cursor-default hover:-translate-y-1"
      style={{
        boxShadow: "0 1px 4px rgba(20,19,17,0.04)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = `0 4px 20px ${activity.color}25, 0 8px 32px rgba(20,19,17,0.06)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 1px 4px rgba(20,19,17,0.04)";
      }}
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-5deg]"
        style={{ backgroundColor: `${activity.color}14` }}
      >
        <Image
          src={activity.icon}
          alt={activity.name}
          width={40}
          height={40}
          className="object-contain"
        />
      </div>
      <span className="text-sm font-bold text-ink-800 text-center leading-tight">
        {activity.name}
      </span>
      <span
        className="text-[11px] font-semibold rounded-full px-2.5 py-0.5"
        style={{
          color: activity.color,
          backgroundColor: `${activity.color}12`,
        }}
      >
        {activity.emoji}
      </span>
    </motion.div>
  );
}

export default function Activities() {
  const { t } = useTranslation();
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-40px" });

  const activities = [
    { name: t("activities.wandPlay"), emoji: "🪄", color: "#E98A2A", icon: "/images/exercises/wand.png" },
    { name: t("activities.chaseFetch"), emoji: "🏃", color: "#2F7D57", icon: "/images/exercises/chase-fetch.png" },
    { name: t("activities.laserPointer"), emoji: "🔴", color: "#B33A2B", icon: "/images/exercises/laser.png" },
    { name: t("activities.puzzleFeeder"), emoji: "🧩", color: "#6B8E6B", icon: "/images/exercises/puzzle-feeder.png" },
    { name: t("activities.kickerToy"), emoji: "🐟", color: "#C06040", icon: "/images/exercises/kicker-toy.png" },
    { name: t("activities.hideAmbush"), emoji: "📦", color: "#8B7355", icon: "/images/exercises/hide-ambush.png" },
    { name: t("activities.climbing"), emoji: "🧗", color: "#5A7A8A", icon: "/images/exercises/climbing.png" },
    { name: t("activities.catnip"), emoji: "🌿", color: "#4A8A5A", icon: "/images/exercises/catnip.png" },
    { name: t("activities.freeRoam"), emoji: "🐾", color: "#8A5A3C", icon: "/images/exercises/free-play.png" },
  ];

  return (
    <section
      id="activities"
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
            {t("activities.badge")}
          </span>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tight text-ink-900">
            {t("activities.title")}{" "}
            <span className="text-ginger-600">{t("activities.titleHighlight")}</span>
          </h2>
          <p className="mt-3 text-[17px] text-muted max-w-lg mx-auto">
            {t("activities.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3 max-w-3xl mx-auto">
          {activities.map((activity, i) => (
            <ActivityChip key={activity.name} activity={activity} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
