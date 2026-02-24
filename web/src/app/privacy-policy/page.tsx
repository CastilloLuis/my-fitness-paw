"use client";

import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { useTranslation } from "@/i18n";

export default function PrivacyPolicyPage() {
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
            {t("legal.privacyPolicy")}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-ink-900">
            {t("privacy.title")}
          </h1>
          <p className="mt-3 text-muted text-[15px]">{t("privacy.lastUpdated")}</p>
        </div>
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
            {/* Intro */}
            <div className="mb-10 pb-10 border-b border-taupe-100">
              <P>{t("privacy.intro1")}</P>
              <P last>{t("privacy.intro2")}</P>
            </div>

            {/* Interpretation and Definitions */}
            <Section title={t("privacy.interpretationTitle")}>
              <H3>{t("privacy.interpretationSubtitle")}</H3>
              <P>{t("privacy.interpretationText")}</P>

              <H3>{t("privacy.definitionsSubtitle")}</H3>
              <P>{t("privacy.definitionsIntro")}</P>
              <ul className="mt-3 space-y-2.5 pl-5">
                <DefLi term="Account">{t("privacy.defAccount")}</DefLi>
                <DefLi term="Affiliate">{t("privacy.defAffiliate")}</DefLi>
                <DefLi term="Application">{t("privacy.defApplication")}</DefLi>
                <DefLi term="Company">{t("privacy.defCompany")}</DefLi>
                <DefLi term="Country">{t("privacy.defCountry")}</DefLi>
                <DefLi term="Device">{t("privacy.defDevice")}</DefLi>
                <DefLi term="Personal Data">{t("privacy.defPersonalData")}</DefLi>
                <DefLi term="Service">{t("privacy.defService")}</DefLi>
                <DefLi term="Service Provider">{t("privacy.defServiceProvider")}</DefLi>
                <DefLi term="Usage Data">{t("privacy.defUsageData")}</DefLi>
                <DefLi term="You">{t("privacy.defYou")}</DefLi>
              </ul>
            </Section>

            {/* Collecting Data */}
            <Section title={t("privacy.collectingTitle")}>
              <H3>{t("privacy.typesCollectedSubtitle")}</H3>

              <H4>{t("privacy.personalDataSubtitle")}</H4>
              <P>{t("privacy.personalDataText")}</P>
              <ul className="mt-2 mb-4 space-y-1.5 pl-5">
                <Li>{t("privacy.personalDataItem1")}</Li>
                <Li>{t("privacy.personalDataItem2")}</Li>
              </ul>

              <H4>{t("privacy.usageDataSubtitle")}</H4>
              <P>{t("privacy.usageDataText1")}</P>
              <P>{t("privacy.usageDataText2")}</P>
              <P>{t("privacy.usageDataText3")}</P>
              <P>{t("privacy.usageDataText4")}</P>

              <H4>{t("privacy.appInfoSubtitle")}</H4>
              <P>{t("privacy.appInfoText1")}</P>
              <ul className="mt-2 mb-4 space-y-1.5 pl-5">
                <Li>{t("privacy.appInfoItem1")}</Li>
              </ul>
              <P>{t("privacy.appInfoText2")}</P>
              <P last>{t("privacy.appInfoText3")}</P>
            </Section>

            {/* Use of Data */}
            <Section title={t("privacy.useTitle")}>
              <P>{t("privacy.useIntro")}</P>
              <ul className="mt-3 space-y-2.5 pl-5">
                <DefLi term={t("privacy.useProvideLabel")}>{t("privacy.useProvide")}</DefLi>
                <DefLi term={t("privacy.useManageLabel")}>{t("privacy.useManage")}</DefLi>
                <DefLi term={t("privacy.useContractLabel")}>{t("privacy.useContract")}</DefLi>
                <DefLi term={t("privacy.useContactLabel")}>{t("privacy.useContact")}</DefLi>
                <DefLi term={t("privacy.useProvideInfoLabel")}>{t("privacy.useProvideInfo")}</DefLi>
                <DefLi term={t("privacy.useRequestsLabel")}>{t("privacy.useRequests")}</DefLi>
                <DefLi term={t("privacy.useTransfersLabel")}>{t("privacy.useTransfers")}</DefLi>
                <DefLi term={t("privacy.useOtherLabel")}>{t("privacy.useOther")}</DefLi>
              </ul>
            </Section>

            {/* Sharing */}
            <Section title={t("privacy.sharingTitle")}>
              <P>{t("privacy.sharingIntro")}</P>
              <ul className="mt-3 space-y-2.5 pl-5">
                <DefLi term={t("privacy.shareProvidersLabel")}>{t("privacy.shareProviders")}</DefLi>
                <DefLi term={t("privacy.shareTransfersLabel")}>{t("privacy.shareTransfers")}</DefLi>
                <DefLi term={t("privacy.shareAffiliatesLabel")}>{t("privacy.shareAffiliates")}</DefLi>
                <DefLi term={t("privacy.sharePartnersLabel")}>{t("privacy.sharePartners")}</DefLi>
                <DefLi term={t("privacy.shareUsersLabel")}>{t("privacy.shareUsers")}</DefLi>
                <DefLi term={t("privacy.shareConsentLabel")}>{t("privacy.shareConsent")}</DefLi>
              </ul>
            </Section>

            {/* Retention */}
            <Section title={t("privacy.retentionTitle")}>
              <P>{t("privacy.retentionText1")}</P>
              <P last>{t("privacy.retentionText2")}</P>
            </Section>

            {/* Transfer */}
            <Section title={t("privacy.transferTitle")}>
              <P>{t("privacy.transferText1")}</P>
              <P>{t("privacy.transferText2")}</P>
              <P last>{t("privacy.transferText3")}</P>
            </Section>

            {/* Delete */}
            <Section title={t("privacy.deleteTitle")}>
              <P>{t("privacy.deleteText1")}</P>
              <P>{t("privacy.deleteText2")}</P>
              <P>{t("privacy.deleteText3")}</P>
              <P last>{t("privacy.deleteText4")}</P>
            </Section>

            {/* Disclosure */}
            <Section title={t("privacy.disclosureTitle")}>
              <H3>{t("privacy.businessTransactionsSubtitle")}</H3>
              <P>{t("privacy.businessTransactionsText")}</P>

              <H3>{t("privacy.lawEnforcementSubtitle")}</H3>
              <P>{t("privacy.lawEnforcementText")}</P>

              <H3>{t("privacy.otherLegalSubtitle")}</H3>
              <P>{t("privacy.otherLegalIntro")}</P>
              <ul className="mt-2 space-y-1.5 pl-5">
                <Li>{t("privacy.otherLegalItem1")}</Li>
                <Li>{t("privacy.otherLegalItem2")}</Li>
                <Li>{t("privacy.otherLegalItem3")}</Li>
                <Li>{t("privacy.otherLegalItem4")}</Li>
                <Li>{t("privacy.otherLegalItem5")}</Li>
              </ul>
            </Section>

            {/* Security */}
            <Section title={t("privacy.securityTitle")}>
              <P last>{t("privacy.securityText")}</P>
            </Section>

            {/* Children */}
            <Section title={t("privacy.childrenTitle")}>
              <P>{t("privacy.childrenText1")}</P>
              <P last>{t("privacy.childrenText2")}</P>
            </Section>

            {/* Links */}
            <Section title={t("privacy.linksTitle")}>
              <P>{t("privacy.linksText1")}</P>
              <P last>{t("privacy.linksText2")}</P>
            </Section>

            {/* Changes */}
            <Section title={t("privacy.changesToPolicyTitle")}>
              <P>{t("privacy.changesToPolicyText1")}</P>
              <P>{t("privacy.changesToPolicyText2")}</P>
              <P last>{t("privacy.changesToPolicyText3")}</P>
            </Section>

            {/* Contact */}
            <Section title={t("privacy.contactTitle")} last>
              <P last>{t("privacy.contactText")}</P>
              <ul className="mt-2 pl-5">
                <Li>
                  {t("privacy.contactByEmail")}{" "}
                  <a
                    href="mailto:contact@myfitnesspaw.com"
                    className="text-ginger-600 font-medium underline underline-offset-2 decoration-ginger-400/40 hover:text-ginger-700 hover:decoration-ginger-500 transition-colors"
                  >
                    contact@myfitnesspaw.com
                  </a>
                </Li>
              </ul>
            </Section>
          </article>

          {/* Cross-links */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <Link href="/terms" className="text-sm font-medium text-muted transition-colors hover:text-ginger-600">
              {t("legal.termsOfService")}
            </Link>
            <span className="h-1 w-1 rounded-full bg-taupe-300" />
            <Link href="/privacy-policy" className="text-sm font-semibold text-ginger-600">
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

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-6 mb-2 text-[15px] font-bold text-ink-800">
      {children}
    </h3>
  );
}

function H4({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mt-5 mb-2 text-[14px] font-bold uppercase tracking-wide text-ink-700">
      {children}
    </h4>
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

function DefLi({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <li className="relative pl-4 text-[15px] leading-[1.75] text-muted before:absolute before:left-0 before:top-[0.65em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-ginger-400/50">
      <strong className="font-semibold text-ink-800">{term}</strong> — {children}
    </li>
  );
}
