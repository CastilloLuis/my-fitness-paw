import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/i18n";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://myfitnesspaw.com"),
  title: {
    default: "MyFitnessPaw — Track Your Cat's Fitness Journey",
    template: "%s | MyFitnessPaw",
  },
  description:
    "The playful way to keep your cat active and healthy. Track play sessions, monitor activity, and celebrate your cat's fitness milestones.",
  keywords: [
    "cat fitness",
    "cat exercise tracker",
    "pet health",
    "cat play sessions",
    "cat activity",
    "pet wellness",
    "cat workout",
    "cat play tracker",
    "MyFitnessPaw",
  ],
  authors: [{ name: "MyFitnessPaw" }],
  creator: "MyFitnessPaw",
  publisher: "MyFitnessPaw",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "MyFitnessPaw — Track Your Cat's Fitness Journey",
    description:
      "The playful way to keep your cat active and healthy. Track play sessions, monitor activity, and celebrate milestones.",
    type: "website",
    locale: "en_US",
    alternateLocale: "es_ES",
    siteName: "MyFitnessPaw",
    url: "https://myfitnesspaw.com",
    images: [
      {
        url: "/images/media.png",
        width: 1200,
        height: 630,
        alt: "MyFitnessPaw — Keep Your Cat Fit & Happy!",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MyFitnessPaw — Track Your Cat's Fitness Journey",
    description:
      "The playful way to keep your cat active and healthy. Track play sessions and celebrate milestones.",
    images: ["/images/media.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="font-display overflow-x-hidden">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
