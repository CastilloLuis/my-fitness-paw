"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/i18n";
import LanguageToggle from "@/components/language-toggle";

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen px-4 py-12 md:py-16 bg-gradient-to-b from-ivory-50 to-ivory-100">
      <div className="mx-auto max-w-[720px]">
        <header className="mb-12 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-80">
            <Image src="/images/paw.png" alt="" width={32} height={32} />
            <span className="text-2xl font-extrabold tracking-tight text-ink-900">
              MyFitness<span className="text-ginger-600">Paw</span>
            </span>
          </Link>
          <p className="mt-2 text-[15px] text-muted">{t("legal.trackJourney")}</p>
          <div className="mt-3">
            <LanguageToggle />
          </div>
        </header>

        <article className="rounded-3xl border border-taupe-200 bg-white p-8 md:p-12" style={{ boxShadow: "0 8px 24px rgba(20,19,17,0.10)" }}>
          <h1 className="text-center text-3xl font-extrabold text-ink-900 mb-2">{t("terms.title")}</h1>
          <p className="mb-10 border-b border-taupe-200 pb-6 text-center text-sm text-muted">{t("terms.lastUpdated")}</p>

          <section className="mb-8">
            <h2 className="mb-4 inline-block border-b-2 border-ginger-400 pb-2 text-xl font-extrabold text-ink-900">{t("terms.s1Title")}</h2>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("terms.s1Text")}</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 inline-block border-b-2 border-ginger-400 pb-2 text-xl font-extrabold text-ink-900">{t("terms.s2Title")}</h2>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("terms.s2Text")}</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 inline-block border-b-2 border-ginger-400 pb-2 text-xl font-extrabold text-ink-900">{t("terms.s3Title")}</h2>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">
              {t("terms.s3Text1")}{" "}
              <Link href="/privacy-policy" className="text-ginger-600 underline underline-offset-2 hover:text-ginger-700">{t("terms.s3Link")}</Link>
              {t("terms.s3Text2")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 inline-block border-b-2 border-ginger-400 pb-2 text-xl font-extrabold text-ink-900">{t("terms.s4Title")}</h2>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("terms.s4Text1")}</p>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("terms.s4Text2")}</p>
            <p className="text-[15px] leading-[1.7] text-muted">{t("terms.s4Text3")}</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 inline-block border-b-2 border-ginger-400 pb-2 text-xl font-extrabold text-ink-900">{t("terms.s5Title")}</h2>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("terms.s5Text1")}</p>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("terms.s5Text2")}</p>
            <p className="text-[15px] leading-[1.7] text-muted">{t("terms.s5Text3")}</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 inline-block border-b-2 border-ginger-400 pb-2 text-xl font-extrabold text-ink-900">{t("terms.s6Title")}</h2>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("terms.s6Intro")}</p>
            <ul className="my-4 list-disc pl-6 space-y-3">
              <li className="text-[15px] leading-[1.7] text-muted">{t("terms.s6Item1")}</li>
              <li className="text-[15px] leading-[1.7] text-muted">{t("terms.s6Item2")}</li>
              <li className="text-[15px] leading-[1.7] text-muted">{t("terms.s6Item3")}</li>
              <li className="text-[15px] leading-[1.7] text-muted">{t("terms.s6Item4")}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 inline-block border-b-2 border-ginger-400 pb-2 text-xl font-extrabold text-ink-900">{t("terms.s7Title")}</h2>
            <p className="text-[15px] leading-[1.7] text-muted">{t("terms.s7Text")}</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 inline-block border-b-2 border-ginger-400 pb-2 text-xl font-extrabold text-ink-900">{t("terms.s8Title")}</h2>
            <p className="text-[15px] leading-[1.7] text-muted">{t("terms.s8Text")}</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 inline-block border-b-2 border-ginger-400 pb-2 text-xl font-extrabold text-ink-900">{t("terms.s9Title")}</h2>
            <p className="text-[15px] leading-[1.7] text-muted">{t("terms.s9Text")}</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 inline-block border-b-2 border-ginger-400 pb-2 text-xl font-extrabold text-ink-900">{t("terms.s10Title")}</h2>
            <p className="text-[15px] leading-[1.7] text-muted">{t("terms.s10Text")}</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 inline-block border-b-2 border-ginger-400 pb-2 text-xl font-extrabold text-ink-900">{t("terms.s11Title")}</h2>
            <p className="text-[15px] leading-[1.7] text-muted">{t("terms.s11Text")}</p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 inline-block border-b-2 border-ginger-400 pb-2 text-xl font-extrabold text-ink-900">{t("terms.s12Title")}</h2>
            <p className="text-[15px] leading-[1.7] text-muted">{t("terms.s12Text")}</p>
          </section>

          <section>
            <h2 className="mb-4 inline-block border-b-2 border-ginger-400 pb-2 text-xl font-extrabold text-ink-900">{t("terms.s13Title")}</h2>
            <p className="text-[15px] leading-[1.7] text-muted">
              {t("terms.s13Text")}{" "}
              <a href="mailto:contact@myfitnesspaw.com" className="text-ginger-600 underline underline-offset-2 hover:text-ginger-700">contact@myfitnesspaw.com</a>.
            </p>
          </section>
        </article>

        <footer className="mt-10 pt-6 text-center">
          <Link href="/terms" className="text-sm text-muted transition-colors hover:text-ginger-600">{t("legal.termsOfService")}</Link>
          <span className="mx-3 text-muted">&bull;</span>
          <Link href="/privacy-policy" className="text-sm text-muted transition-colors hover:text-ginger-600">{t("legal.privacyPolicy")}</Link>
        </footer>
      </div>
    </main>
  );
}
