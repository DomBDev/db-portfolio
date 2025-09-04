import { Metadata } from "next";

export const siteConfig = {
  title: "Dom | Software Engineer",
  description: "Full-stack software engineer specializing in modern web technologies. View my projects and get in touch.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  siteName: "Dom's Portfolio",
  creator: "Dom",
  locale: "en-US",
  themeColor: "#8b5e3c",
  keywords: [
    "software engineer",
    "web developer",
    "full stack developer",
    "React developer",
    "TypeScript",
    "Python"
  ] as string[]
} as const;

export type SiteConfig = typeof siteConfig;

export function generateMetadata({
  title,
  description,
  image,
  noIndex
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const displayTitle = title
    ? `${title} | ${siteConfig.siteName}`
    : siteConfig.title;
  
  const displayDescription = description || siteConfig.description;
  const ogImage = image || `${siteConfig.url}/og-default.jpg`; // TODO: Create default OG image

  return {
    title: displayTitle,
    description: displayDescription,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.creator }],
    creator: siteConfig.creator,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: "/",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
    openGraph: {
      title: displayTitle,
      description: displayDescription,
      url: siteConfig.url,
      siteName: siteConfig.siteName,
      locale: siteConfig.locale,
      type: "website",
      images: [{
        url: ogImage,
        width: 1200,
        height: 630,
        alt: displayTitle,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description: displayDescription,
      images: [ogImage],
    },
  };
}
