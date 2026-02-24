"use client";

import { useTranslation, type Locale } from "@/i18n";

const options: { value: Locale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "es", label: "ES" },
];

export default function LanguageToggle() {
  const { locale, setLocale } = useTranslation();

  return (
    <div
      className="inline-flex rounded-full p-0.5"
      style={{ backgroundColor: "rgba(20,19,17,0.06)" }}
    >
      {options.map((opt) => {
        const active = locale === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => setLocale(opt.value)}
            className="relative rounded-full px-3 py-1 text-xs font-bold tracking-wide transition-all duration-200"
            style={{
              backgroundColor: active ? "#CC6A1E" : "transparent",
              color: active ? "#FBFAF7" : "#6F7A86",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
