import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Schema.org types
type SchemaType = 
  | "Organization" 
  | "SoftwareApplication" 
  | "Service" 
  | "Article" 
  | "FAQPage" 
  | "WebPage"
  | "Product";

interface FAQItem {
  question: string;
  answer: string;
}

interface SEOProps {
  titleKey?: string;
  descriptionKey?: string;
  title?: string;
  description?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  noIndex?: boolean;
  canonicalUrl?: string;
  // JSON-LD Schema props
  schemaType?: SchemaType;
  schemaData?: {
    // For SoftwareApplication/Product
    productName?: string;
    productDescription?: string;
    applicationCategory?: string;
    operatingSystem?: string;
    offers?: {
      price?: string;
      priceCurrency?: string;
    };
    aggregateRating?: {
      ratingValue: number;
      reviewCount: number;
    };
    // For Service
    serviceName?: string;
    serviceDescription?: string;
    provider?: string;
    areaServed?: string;
    // For Article
    headline?: string;
    datePublished?: string;
    dateModified?: string;
    author?: string;
    articleImage?: string;
    // For FAQPage
    faqItems?: FAQItem[];
  };
  // Additional schemas (for combining multiple schemas like SoftwareApplication + FAQPage)
  additionalSchemas?: Array<{
    type: SchemaType;
    data?: SEOProps["schemaData"];
  }>;
}

const BASE_URL = "https://clickonepro.com";
const SUPPORTED_LANGUAGES = ["pt-BR", "en-US", "es"];

const SEO = ({
  titleKey,
  descriptionKey,
  title: directTitle,
  description: directDescription,
  ogImage = "https://clickonepro.com/og-image.png",
  ogType = "website",
  noIndex = false,
  canonicalUrl,
  schemaType,
  schemaData,
  additionalSchemas,
}: SEOProps) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  // Update HTML lang attribute when language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // Use direct values if provided, otherwise use translation keys
  const title = directTitle || (titleKey ? t(titleKey) : t("seo.home.title"));
  const description = directDescription || (descriptionKey ? t(descriptionKey) : t("seo.home.description"));

  // Generate canonical URL automatically if not provided
  const currentPath = location.pathname.replace(/\/$/, '') || '/';
  const autoCanonical = `${BASE_URL}${currentPath === '/' ? '' : currentPath}`;
  const finalCanonical = canonicalUrl || autoCanonical;

  // Generate hreflang URLs for all supported languages
  const hreflangUrls = SUPPORTED_LANGUAGES.map(lang => ({
    lang,
    url: `${BASE_URL}${currentPath === '/' ? '' : currentPath}`
  }));

  // Generate JSON-LD based on schema type
  const generateJsonLd = (type?: SchemaType, data?: SEOProps["schemaData"]) => {
    const baseOrganization = {
      "@type": "Organization",
      "name": "ClickOne AI",
      "url": "https://clickonepro.com",
      "logo": "https://clickonepro.com/favicon.png",
      "sameAs": [
        "https://www.linkedin.com/company/clickone-ai",
        "https://twitter.com/clickoneai"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-800-CLICKONE",
        "contactType": "sales",
        "availableLanguage": ["English", "Portuguese", "Spanish"]
      }
    };

    if (!type) {
      // Default Organization schema for all pages
      return {
        "@context": "https://schema.org",
        ...baseOrganization
      };
    }

    switch (type) {
      case "Organization":
        return {
          "@context": "https://schema.org",
          ...baseOrganization,
          "description": description
        };

      case "SoftwareApplication":
        return {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": data?.productName || title,
          "description": data?.productDescription || description,
          "applicationCategory": data?.applicationCategory || "BusinessApplication",
          "operatingSystem": data?.operatingSystem || "Web, iOS, Android",
          "offers": {
            "@type": "Offer",
            "price": data?.offers?.price || "0",
            "priceCurrency": data?.offers?.priceCurrency || "USD",
            "availability": "https://schema.org/InStock"
          },
          ...(data?.aggregateRating && {
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": data.aggregateRating.ratingValue,
              "reviewCount": data.aggregateRating.reviewCount,
              "bestRating": "5",
              "worstRating": "1"
            }
          }),
          "publisher": baseOrganization
        };

      case "Product":
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": data?.productName || title,
          "description": data?.productDescription || description,
          "brand": {
            "@type": "Brand",
            "name": "ClickOne AI"
          },
          ...(data?.aggregateRating && {
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": data.aggregateRating.ratingValue,
              "reviewCount": data.aggregateRating.reviewCount,
              "bestRating": "5",
              "worstRating": "1"
            }
          }),
          "offers": {
            "@type": "Offer",
            "price": data?.offers?.price || "0",
            "priceCurrency": data?.offers?.priceCurrency || "USD",
            "availability": "https://schema.org/InStock",
            "seller": baseOrganization
          }
        };

      case "Service":
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": data?.serviceName || title,
          "description": data?.serviceDescription || description,
          "provider": {
            "@type": "Organization",
            "name": data?.provider || "ClickOne AI",
            "url": "https://clickonepro.com"
          },
          "areaServed": data?.areaServed || "Worldwide",
          "serviceType": "AI Virtual Receptionist"
        };

      case "Article":
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data?.headline || title,
          "description": description,
          "image": data?.articleImage || ogImage,
          "datePublished": data?.datePublished,
          "dateModified": data?.dateModified || data?.datePublished,
          "author": {
            "@type": "Person",
            "name": data?.author || "ClickOne AI Team"
          },
          "publisher": {
            "@type": "Organization",
            "name": "ClickOne AI",
            "logo": {
              "@type": "ImageObject",
              "url": "https://clickonepro.com/favicon.png"
            }
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": finalCanonical
          }
        };

      case "FAQPage":
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": data?.faqItems?.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.answer
            }
          })) || []
        };

      case "WebPage":
      default:
        return {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": title,
          "description": description,
          "publisher": baseOrganization
        };
    }
  };

  // Generate all JSON-LD schemas
  const schemas = [
    generateJsonLd(schemaType, schemaData),
    ...(additionalSchemas?.map(s => generateJsonLd(s.type, s.data)) || [])
  ];

  return (
    <Helmet>
      <html lang={i18n.language} />
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:locale" content={i18n.language} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      
      {/* Canonical */}
      <link rel="canonical" href={finalCanonical} />

      {/* Hreflang tags for international SEO */}
      {hreflangUrls.map(({ lang, url }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${BASE_URL}${currentPath === '/' ? '' : currentPath}`} />

      {/* JSON-LD Structured Data - Support for multiple schemas */}
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
