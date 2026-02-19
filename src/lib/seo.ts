import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://elysiantravels.example.com";
const defaultOgImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600";

const baseKeywords = [
  "Sri Lanka",
  "Luxury Travel",
  "Travel Agency",
  "Wildlife Safari",
  "Cultural Tours",
  "Beach Holidays",
  "Bespoke Travel",
  "Elysian Travels",
  "Sri Lanka Tours",
];

export const siteSeo = {
  siteUrl,
  brandName: "Elysian Travels",
  contactEmail: "hello@elysiantravels.com",
  phone: "+94 777 123 456",
  defaultTitle: "Elysian Travels | Luxury Sri Lanka Travel Experiences",
  defaultDescription:
    "Discover extraordinary journeys through Sri Lanka's most enchanting landscapes. Curated luxury travel experiences, bespoke itineraries, and unforgettable adventures await.",
  defaultOgImage,
  baseKeywords,
};

export function buildMetadata(options: {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article" | "profile" | "book";
} = {}): Metadata {
  const url = options.path ? `${siteUrl}${options.path}` : siteUrl;
  const title = options.title || siteSeo.defaultTitle;
  const description = options.description || siteSeo.defaultDescription;
  const keywords = Array.from(new Set([...(options.keywords || []), ...siteSeo.baseKeywords]));
  const image = options.image || siteSeo.defaultOgImage;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteSeo.brandName,
      type: options.type || "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    category: "travel",
  };
}

export function buildTourMetadata(tour: {
  title: string;
  description: string;
  slug: string;
  category?: string;
  duration?: string;
  images?: string[];
}): Metadata {
  const primaryImage = tour.images?.[0] || siteSeo.defaultOgImage;
  const keywords = [tour.title, tour.category || "Sri Lanka Tour", tour.duration || "Sri Lanka Itinerary"];

  return buildMetadata({
    title: `${tour.title} | ${siteSeo.brandName}`,
    description: tour.description.slice(0, 155),
    path: `/packages/${tour.slug}`,
    keywords,
    image: primaryImage,
    type: "article",
  });
}

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: siteSeo.brandName,
    url: siteSeo.siteUrl,
    logo: `${siteSeo.siteUrl}/favicon.ico`,
    description: siteSeo.defaultDescription,
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteSeo.phone,
        contactType: "customer service",
        areaServed: "LK",
        availableLanguage: ["English"],
        email: siteSeo.contactEmail,
      },
    ],
  };
}
