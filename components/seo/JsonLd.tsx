import Script from "next/script";

export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PageSpeed Export",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: "https://pagespeedexport.surajon.dev",
    description:
      "Analyze your website performance with Google PageSpeed Insights and export detailed reports in PDF, Markdown, and TOON formats. Free and no login required.",
    featureList: [
      "Mobile and Desktop Analysis",
      "PDF Report Export",
      "Markdown Export",
      "TOON Format Export",
      "Core Web Vitals Diagnostics",
    ],
  };

  return (
    <Script
      id="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
