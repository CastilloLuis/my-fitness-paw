"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/i18n";

function AnimatedCounter({
  value,
  suffix,
  active,
}: {
  value: number;
  suffix: string;
  active: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 1600;
    const steps = 40;
    const stepTime = duration / steps;
    let current = 0;
    const increment = value / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [active, value]);

  const formatted =
    value >= 10000
      ? `${(count / 1000).toFixed(count >= value ? 0 : 1)}K`
      : count.toLocaleString();

  return (
    <span>
      {formatted}
      {suffix}
    </span>
  );
}

export default function Stats() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const stats = [
    {
      value: 10000,
      suffix: "+",
      label: t("stats.sessionsTracked"),
      emoji: "🎯",
      color: "#CC6A1E",
    },
    {
      value: 2000,
      suffix: "+",
      label: t("stats.happyCats"),
      emoji: "😺",
      color: "#2F7D57",
    },
    {
      value: 500,
      suffix: "K+",
      label: t("stats.minutesOfPlay"),
      emoji: "⏱️",
      color: "#8A5A3C",
    },
    {
      value: 50,
      suffix: "K+",
      label: t("stats.caloriesBurned"),
      emoji: "🔥",
      color: "#B33A2B",
    },
  ];

  return (
    <section className="relative py-20 md:py-28 bg-ivory-50 overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(242,179,109,0.15) 0%, transparent 70%)",
        }}
      />

      <div ref={ref} className="relative z-10 mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-ink-900">
            {t("stats.title")}{" "}
            <span className="text-ginger-600">{t("stats.titleHighlight")}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative rounded-2xl bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1"
              style={{
                boxShadow: "0 2px 12px rgba(20,19,17,0.05)",
              }}
            >
              <span className="text-3xl mb-2 block">{stat.emoji}</span>
              <p
                className="text-3xl md:text-4xl font-extrabold tracking-tight"
                style={{ color: stat.color }}
              >
                {/* <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  active={inView}
                /> */}
              </p>
              <p className="mt-1 text-sm font-semibold text-muted">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
