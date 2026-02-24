"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/i18n";
import LanguageToggle from "@/components/language-toggle";

export default function PrivacyPolicyPage() {
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
          <h1 className="text-center text-3xl font-extrabold text-ink-900 mb-2">{t("privacy.title")}</h1>
          <p className="mb-6 text-center text-sm text-muted">{t("privacy.lastUpdated")}</p>

          <p className="mb-4 border-b border-taupe-200 pb-6 text-[15px] leading-[1.7] text-muted">{t("privacy.intro1")}</p>
          <p className="mb-10 text-[15px] leading-[1.7] text-muted">{t("privacy.intro2")}</p>

          <section className="mb-10">
            <h2 className="mb-6 border-b-2 border-ginger-400 pb-3 text-2xl font-extrabold text-ink-900">{t("privacy.interpretationTitle")}</h2>

            <h3 className="mt-6 mb-3 text-lg font-semibold text-ink-900">{t("privacy.interpretationSubtitle")}</h3>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.interpretationText")}</p>

            <h3 className="mt-6 mb-3 text-lg font-semibold text-ink-900">{t("privacy.definitionsSubtitle")}</h3>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.definitionsIntro")}</p>
            <ul className="my-4 list-disc pl-6 space-y-3">
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">Account</strong> {t("privacy.defAccount")}
              </li>
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">Affiliate</strong> {t("privacy.defAffiliate")}
              </li>
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">Application</strong> {t("privacy.defApplication")}
              </li>
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">Company</strong> {t("privacy.defCompany")}
              </li>
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">Country</strong> {t("privacy.defCountry")}
              </li>
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">Device</strong> {t("privacy.defDevice")}
              </li>
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">Personal Data</strong> {t("privacy.defPersonalData")}
              </li>
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">Service</strong> {t("privacy.defService")}
              </li>
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">Service Provider</strong> {t("privacy.defServiceProvider")}
              </li>
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">Usage Data</strong> {t("privacy.defUsageData")}
              </li>
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">You</strong> {t("privacy.defYou")}
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="mb-6 border-b-2 border-ginger-400 pb-3 text-2xl font-extrabold text-ink-900">{t("privacy.collectingTitle")}</h2>

            <h3 className="mt-6 mb-3 text-lg font-semibold text-ink-900">{t("privacy.typesCollectedSubtitle")}</h3>

            <h4 className="mt-5 mb-3 text-[15px] font-semibold text-ink-800">{t("privacy.personalDataSubtitle")}</h4>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.personalDataText")}</p>
            <ul className="my-4 list-disc pl-6 space-y-3">
              <li className="text-[15px] leading-[1.7] text-muted">{t("privacy.personalDataItem1")}</li>
              <li className="text-[15px] leading-[1.7] text-muted">{t("privacy.personalDataItem2")}</li>
            </ul>

            <h4 className="mt-5 mb-3 text-[15px] font-semibold text-ink-800">{t("privacy.usageDataSubtitle")}</h4>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.usageDataText1")}</p>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.usageDataText2")}</p>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.usageDataText3")}</p>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.usageDataText4")}</p>

            <h4 className="mt-5 mb-3 text-[15px] font-semibold text-ink-800">{t("privacy.appInfoSubtitle")}</h4>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.appInfoText1")}</p>
            <ul className="my-4 list-disc pl-6 space-y-3">
              <li className="text-[15px] leading-[1.7] text-muted">{t("privacy.appInfoItem1")}</li>
            </ul>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.appInfoText2")}</p>
            <p className="text-[15px] leading-[1.7] text-muted">{t("privacy.appInfoText3")}</p>
          </section>

          <section className="mb-10">
            <h2 className="mb-6 border-b-2 border-ginger-400 pb-3 text-2xl font-extrabold text-ink-900">{t("privacy.useTitle")}</h2>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.useIntro")}</p>
            <ul className="my-4 list-disc pl-6 space-y-3">
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">{t("privacy.useProvideLabel")}</strong>, {t("privacy.useProvide")}
              </li>
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">{t("privacy.useManageLabel")}</strong>: {t("privacy.useManage")}
              </li>
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">{t("privacy.useContractLabel")}</strong>: {t("privacy.useContract")}
              </li>
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">{t("privacy.useContactLabel")}</strong>: {t("privacy.useContact")}
              </li>
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">{t("privacy.useProvideInfoLabel")}</strong> {t("privacy.useProvideInfo")}
              </li>
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">{t("privacy.useRequestsLabel")}</strong>: {t("privacy.useRequests")}
              </li>
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">{t("privacy.useTransfersLabel")}</strong>: {t("privacy.useTransfers")}
              </li>
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">{t("privacy.useOtherLabel")}</strong>: {t("privacy.useOther")}
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="mb-6 border-b-2 border-ginger-400 pb-3 text-2xl font-extrabold text-ink-900">{t("privacy.sharingTitle")}</h2>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.sharingIntro")}</p>
            <ul className="my-4 list-disc pl-6 space-y-3">
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">{t("privacy.shareProvidersLabel")}</strong>: {t("privacy.shareProviders")}
              </li>
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">{t("privacy.shareTransfersLabel")}</strong>: {t("privacy.shareTransfers")}
              </li>
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">{t("privacy.shareAffiliatesLabel")}</strong>: {t("privacy.shareAffiliates")}
              </li>
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">{t("privacy.sharePartnersLabel")}</strong>: {t("privacy.sharePartners")}
              </li>
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">{t("privacy.shareUsersLabel")}</strong>: {t("privacy.shareUsers")}
              </li>
              <li className="text-[15px] leading-[1.7] text-muted">
                <strong className="font-semibold text-ink-800">{t("privacy.shareConsentLabel")}</strong>: {t("privacy.shareConsent")}
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="mb-6 border-b-2 border-ginger-400 pb-3 text-2xl font-extrabold text-ink-900">{t("privacy.retentionTitle")}</h2>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.retentionText1")}</p>
            <p className="text-[15px] leading-[1.7] text-muted">{t("privacy.retentionText2")}</p>
          </section>

          <section className="mb-10">
            <h2 className="mb-6 border-b-2 border-ginger-400 pb-3 text-2xl font-extrabold text-ink-900">{t("privacy.transferTitle")}</h2>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.transferText1")}</p>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.transferText2")}</p>
            <p className="text-[15px] leading-[1.7] text-muted">{t("privacy.transferText3")}</p>
          </section>

          <section className="mb-10">
            <h2 className="mb-6 border-b-2 border-ginger-400 pb-3 text-2xl font-extrabold text-ink-900">{t("privacy.deleteTitle")}</h2>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.deleteText1")}</p>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.deleteText2")}</p>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.deleteText3")}</p>
            <p className="text-[15px] leading-[1.7] text-muted">{t("privacy.deleteText4")}</p>
          </section>

          <section className="mb-10">
            <h2 className="mb-6 border-b-2 border-ginger-400 pb-3 text-2xl font-extrabold text-ink-900">{t("privacy.disclosureTitle")}</h2>

            <h3 className="mt-6 mb-3 text-lg font-semibold text-ink-900">{t("privacy.businessTransactionsSubtitle")}</h3>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.businessTransactionsText")}</p>

            <h3 className="mt-6 mb-3 text-lg font-semibold text-ink-900">{t("privacy.lawEnforcementSubtitle")}</h3>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.lawEnforcementText")}</p>

            <h3 className="mt-6 mb-3 text-lg font-semibold text-ink-900">{t("privacy.otherLegalSubtitle")}</h3>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.otherLegalIntro")}</p>
            <ul className="my-4 list-disc pl-6 space-y-3">
              <li className="text-[15px] leading-[1.7] text-muted">{t("privacy.otherLegalItem1")}</li>
              <li className="text-[15px] leading-[1.7] text-muted">{t("privacy.otherLegalItem2")}</li>
              <li className="text-[15px] leading-[1.7] text-muted">{t("privacy.otherLegalItem3")}</li>
              <li className="text-[15px] leading-[1.7] text-muted">{t("privacy.otherLegalItem4")}</li>
              <li className="text-[15px] leading-[1.7] text-muted">{t("privacy.otherLegalItem5")}</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="mb-6 border-b-2 border-ginger-400 pb-3 text-2xl font-extrabold text-ink-900">{t("privacy.securityTitle")}</h2>
            <p className="text-[15px] leading-[1.7] text-muted">{t("privacy.securityText")}</p>
          </section>

          <section className="mb-10">
            <h2 className="mb-6 border-b-2 border-ginger-400 pb-3 text-2xl font-extrabold text-ink-900">{t("privacy.childrenTitle")}</h2>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.childrenText1")}</p>
            <p className="text-[15px] leading-[1.7] text-muted">{t("privacy.childrenText2")}</p>
          </section>

          <section className="mb-10">
            <h2 className="mb-6 border-b-2 border-ginger-400 pb-3 text-2xl font-extrabold text-ink-900">{t("privacy.linksTitle")}</h2>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.linksText1")}</p>
            <p className="text-[15px] leading-[1.7] text-muted">{t("privacy.linksText2")}</p>
          </section>

          <section className="mb-10">
            <h2 className="mb-6 border-b-2 border-ginger-400 pb-3 text-2xl font-extrabold text-ink-900">{t("privacy.changesToPolicyTitle")}</h2>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.changesToPolicyText1")}</p>
            <p className="mb-4 text-[15px] leading-[1.7] text-muted">{t("privacy.changesToPolicyText2")}</p>
            <p className="text-[15px] leading-[1.7] text-muted">{t("privacy.changesToPolicyText3")}</p>
          </section>

          <section>
            <h2 className="mb-6 border-b-2 border-ginger-400 pb-3 text-2xl font-extrabold text-ink-900">{t("privacy.contactTitle")}</h2>
            <p className="text-[15px] leading-[1.7] text-muted">{t("privacy.contactText")}</p>
            <ul className="my-4 list-disc pl-6">
              <li className="text-[15px] leading-[1.7] text-muted">
                {t("privacy.contactByEmail")}{" "}
                <a href="mailto:contact@myfitnesspaw.com" className="text-ginger-600 underline underline-offset-2 hover:text-ginger-700">contact@myfitnesspaw.com</a>
              </li>
            </ul>
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
