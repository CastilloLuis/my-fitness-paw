"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useTranslation } from "@/i18n";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactPage() {
  const { t } = useTranslation();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      });

      if (!res.ok) throw new Error();

      setStatus("success");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <Navbar />

      {/* Hero header */}
      <div
        className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-20"
        style={{
          background:
            "linear-gradient(165deg, #FBFAF7 0%, #F3EFE7 30%, rgba(242,179,109,0.10) 60%, #FBFAF7 100%)",
        }}
      >
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <span className="mb-4 inline-block rounded-full bg-ginger-400/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-ginger-700">
            {t("contact.badge")}
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-ink-900 md:text-5xl">
            {t("contact.title")}
          </h1>
          <p className="mt-3 text-[15px] text-muted">
            {t("contact.subtitle")}
          </p>
        </div>
        <div
          className="absolute right-0 bottom-0 left-0 h-16"
          style={{
            background: "linear-gradient(to top, #FBFAF7, transparent)",
          }}
        />
      </div>

      <main className="bg-ivory-50 pb-24">
        <div className="mx-auto max-w-xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl bg-white p-8 md:p-12"
            style={{
              boxShadow:
                "0 1px 4px rgba(20,19,17,0.04), 0 8px 32px rgba(20,19,17,0.07)",
            }}
          >
            {status === "success" ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-success"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-ink-900">
                  {t("contact.successTitle")}
                </h2>
                <p className="mt-2 text-sm text-muted">
                  {t("contact.successMessage")}
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-sm font-semibold text-ginger-600 transition-colors hover:text-ginger-700"
                >
                  {t("contact.sendAnother")}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-1.5 block text-sm font-semibold text-ink-800"
                  >
                    {t("contact.subjectLabel")}
                  </label>
                  <input
                    id="subject"
                    type="text"
                    required
                    maxLength={200}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={t("contact.subjectPlaceholder")}
                    className="w-full rounded-xl border border-taupe-200 bg-ivory-50 px-4 py-3 text-sm text-ink-900 outline-none transition-all placeholder:text-taupe-300 focus:border-ginger-400 focus:ring-2 focus:ring-ginger-400/20"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-semibold text-ink-800"
                  >
                    {t("contact.messageLabel")}
                  </label>
                  <textarea
                    id="message"
                    required
                    maxLength={5000}
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("contact.messagePlaceholder")}
                    className="w-full resize-none rounded-xl border border-taupe-200 bg-ivory-50 px-4 py-3 text-sm text-ink-900 outline-none transition-all placeholder:text-taupe-300 focus:border-ginger-400 focus:ring-2 focus:ring-ginger-400/20"
                  />
                </div>

                {/* Error */}
                {status === "error" && (
                  <p className="text-sm font-medium text-danger">
                    {t("contact.errorMessage")}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-shimmer inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold text-ivory-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100"
                  style={{
                    background:
                      "linear-gradient(135deg, #F5A035, #EE7E2E, #D96825)",
                    boxShadow:
                      "0 2px 12px rgba(204,106,30,0.30), inset 0 1px 0 rgba(255,255,255,0.18)",
                  }}
                >
                  {status === "sending" ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="opacity-25"
                        />
                        <path
                          d="M4 12a8 8 0 018-8"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      {t("contact.sending")}
                    </>
                  ) : (
                    t("contact.send")
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}
