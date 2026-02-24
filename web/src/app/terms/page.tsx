"use client";

import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useTranslation } from "@/i18n";

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <>
      <Navbar />

      {/* Hero header */}
      <div
        className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(165deg, #FBFAF7 0%, #F3EFE7 30%, rgba(242,179,109,0.10) 60%, #FBFAF7 100%)",
        }}
      >
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <span className="inline-block rounded-full bg-ginger-400/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-ginger-700 mb-4">
            {t("legal.termsOfService")}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-ink-900">
            {t("terms.title")}
          </h1>
          <p className="mt-3 text-muted text-[15px]">{t("terms.lastUpdated")}</p>
        </div>
        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16"
          style={{
            background: "linear-gradient(to top, #FBFAF7, transparent)",
          }}
        />
      </div>

      <main className="bg-ivory-50 pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <article
            className="rounded-3xl bg-white p-8 md:p-12 lg:p-16"
            style={{
              boxShadow:
                "0 1px 4px rgba(20,19,17,0.04), 0 8px 32px rgba(20,19,17,0.07)",
            }}
          >
            <Section title={t("terms.s1Title")}>
              <P>{t("terms.s1Text")}</P>
            </Section>

            <Section title={t("terms.s2Title")}>
              <P>{t("terms.s2Text")}</P>
            </Section>

            <Section title={t("terms.s3Title")}>
              <P>
                {t("terms.s3Text1")}{" "}
                <Link href="/privacy-policy" className="text-ginger-600 font-medium underline underline-offset-2 decoration-ginger-400/40 hover:text-ginger-700 hover:decoration-ginger-500 transition-colors">
                  {t("terms.s3Link")}
                </Link>
                {t("terms.s3Text2")}
              </P>
            </Section>

            <Section title={t("terms.s4Title")}>
              <P>{t("terms.s4Text1")}</P>
              <P>{t("terms.s4Text2")}</P>
              <P last>{t("terms.s4Text3")}</P>
            </Section>

            <Section title={t("terms.s5Title")}>
              <P>{t("terms.s5Text1")}</P>
              <P>{t("terms.s5Text2")}</P>
              <P last>{t("terms.s5Text3")}</P>
            </Section>

            <Section title={t("terms.s6Title")}>
              <P>{t("terms.s6Intro")}</P>
              <ul className="mt-3 space-y-2.5 pl-5">
                <Li>{t("terms.s6Item1")}</Li>
                <Li>{t("terms.s6Item2")}</Li>
                <Li>{t("terms.s6Item3")}</Li>
                <Li>{t("terms.s6Item4")}</Li>
              </ul>
            </Section>

            <Section title={t("terms.s7Title")}>
              <P last>{t("terms.s7Text")}</P>
            </Section>

            <Section title={t("terms.s8Title")}>
              <P last>{t("terms.s8Text")}</P>
            </Section>

            <Section title={t("terms.s9Title")}>
              <P last>{t("terms.s9Text")}</P>
            </Section>

            <Section title={t("terms.s10Title")}>
              <P last>{t("terms.s10Text")}</P>
            </Section>

            <Section title={t("terms.s11Title")}>
              <P last>{t("terms.s11Text")}</P>
            </Section>

            <Section title={t("terms.s12Title")}>
              <P last>{t("terms.s12Text")}</P>
            </Section>

            <Section title={t("terms.s13Title")} last>
              <P last>
                {t("terms.s13Text")}{" "}
                <a
                  href="mailto:contact@myfitnesspaw.com"
                  className="text-ginger-600 font-medium underline underline-offset-2 decoration-ginger-400/40 hover:text-ginger-700 hover:decoration-ginger-500 transition-colors"
                >
                  contact@myfitnesspaw.com
                </a>
                .
              </P>
            </Section>
          </article>

          {/* Cross-links */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <Link href="/terms" className="text-sm font-semibold text-ginger-600">
              {t("legal.termsOfService")}
            </Link>
            <span className="h-1 w-1 rounded-full bg-taupe-300" />
            <Link href="/privacy-policy" className="text-sm font-medium text-muted transition-colors hover:text-ginger-600">
              {t("legal.privacyPolicy")}
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function Section({
  title,
  last,
  children,
}: {
  title: string;
  last?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={last ? "" : "mb-10 pb-10 border-b border-taupe-100"}>
      <h2 className="mb-4 text-lg font-extrabold text-ink-900 flex items-center gap-3">
        <span
          className="inline-block h-2 w-2 rounded-full flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #F5A035, #D96825)" }}
        />
        {title}
      </h2>
      {children}
    </section>
  );
}

function P({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return (
    <p className={`text-[15px] leading-[1.75] text-muted ${last ? "" : "mb-3"}`}>
      {children}
    </p>
  );
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li className="relative pl-4 text-[15px] leading-[1.75] text-muted before:absolute before:left-0 before:top-[0.65em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-ginger-400/50">
      {children}
    </li>
  );
}
