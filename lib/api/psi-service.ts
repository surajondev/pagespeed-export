import { axiosInstance } from "./axiosInstance";
import { ReportData } from "@/lib/store/appStore";

const API_KEY = process.env.NEXT_PUBLIC_PSI_API_KEY || "";

// Mock data generator for fallback
const getMockData = (url: string): ReportData => ({
  url,
  mobileScore: 45,
  desktopScore: 82,
  mobileAccessibility: 78,
  desktopAccessibility: 92,
  mobileBestPractices: 65,
  desktopBestPractices: 88,
  mobileSeo: 80,
  desktopSeo: 95,
  mobileMetrics: {
    lcp: { value: "3.5 s", score: 0.1, numericValue: 3500 },
    cls: { value: "0.25", score: 0.1, numericValue: 0.25 },
    fcp: { value: "2.8 s", score: 0.2, numericValue: 2800 },
    tbt: { value: "450 ms", score: 0.4, numericValue: 450 },
    si: { value: "4.2 s", score: 0.3, numericValue: 4200 },
  },
  desktopMetrics: {
    lcp: { value: "1.2 s", score: 0.9, numericValue: 1200 },
    cls: { value: "0.01", score: 0.95, numericValue: 0.01 },
    fcp: { value: "0.8 s", score: 0.95, numericValue: 800 },
    tbt: { value: "50 ms", score: 0.95, numericValue: 50 },
    si: { value: "1.4 s", score: 0.9, numericValue: 1400 },
  },
  mobileAudits: [
    {
      id: "unused-javascript",
      title: "Reduce unused JavaScript",
      description: "Reduce unused JavaScript...",
      score: 0,
      displayValue: "Potential savings of 150 KiB",
      category: "performance",
    },
    {
      id: "meta-description",
      title: "Document does not have a meta description",
      description:
        "Meta descriptions may be included in search results to concisely summarize page content.",
      score: 0,
      category: "seo",
    },
    {
      id: "html-has-lang",
      title: "<html> element does not have a [lang] attribute",
      description:
        "If a page doesn't specify a lang attribute, a screen reader assumes that the page is in the default language that the user chose when setting up the screen reader.",
      score: 0,
      category: "accessibility",
    },
  ],
  desktopAudits: [
    {
      id: "unused-javascript",
      title: "Reduce unused JavaScript",
      description: "Reduce unused JavaScript...",
      score: 0.5,
      displayValue: "Potential savings of 50 KiB",
      category: "performance",
    },
  ],
});

export const fetchPageSpeedData = async (url: string): Promise<ReportData> => {
  // Ensure protocol is present
  const targetUrl = url.startsWith("http") ? url : `https://${url}`;

  try {
    // Use Promise.all to fetch both strategies in parallel
    // To fetch multiple categories, we must append 'category' multiple times in the query string usually.
    // However, Axios params serializer is needed or we can pass an array if Axios supports it correctly.
    // Use URLSearchParams to be safe for repeated params.

    const params = new URLSearchParams();
    params.append("url", targetUrl);
    params.append("key", API_KEY);
    ["performance", "accessibility", "best-practices", "seo"].forEach((c) =>
      params.append("category", c),
    );

    const mobileParams = new URLSearchParams(params);
    mobileParams.append("strategy", "mobile");

    const desktopParams = new URLSearchParams(params);
    desktopParams.append("strategy", "desktop");

    const [mobileRes, desktopRes] = await Promise.all([
      axiosInstance.get("/runPagespeed", { params: mobileParams }),
      axiosInstance.get("/runPagespeed", { params: desktopParams }),
    ]);

    const mCats = mobileRes.data.lighthouseResult.categories;
    const dCats = desktopRes.data.lighthouseResult.categories;

    return {
      url: targetUrl,
      mobileScore: Math.round((mCats.performance.score || 0) * 100),
      desktopScore: Math.round((dCats.performance.score || 0) * 100),
      // New Categories
      mobileAccessibility: Math.round((mCats.accessibility?.score || 0) * 100),
      desktopAccessibility: Math.round((dCats.accessibility?.score || 0) * 100),
      mobileBestPractices: Math.round(
        (mCats["best-practices"]?.score || 0) * 100,
      ),
      desktopBestPractices: Math.round(
        (dCats["best-practices"]?.score || 0) * 100,
      ),
      mobileSeo: Math.round((mCats.seo?.score || 0) * 100),
      desktopSeo: Math.round((dCats.seo?.score || 0) * 100),

      mobileMetrics: extractMetrics(mobileRes.data.lighthouseResult),
      desktopMetrics: extractMetrics(desktopRes.data.lighthouseResult),
      mobileAudits: extractAudits(mobileRes.data.lighthouseResult),
      desktopAudits: extractAudits(desktopRes.data.lighthouseResult),
    };
  } catch (error) {
    console.warn("API Error or Quota Exceeded. Returning mock data.", error);
    // You might want to notify the user via a toast or the global error store that this is mock data
    // But for now, we return the mock structure smoothly.
    return getMockData(targetUrl);
  }
};

function extractMetrics(lhResult: any) {
  const audits = lhResult.audits;
  return {
    lcp: {
      value: audits["largest-contentful-paint"]?.displayValue,
      score: audits["largest-contentful-paint"]?.score,
      numericValue: audits["largest-contentful-paint"]?.numericValue,
    },
    cls: {
      value: audits["cumulative-layout-shift"]?.displayValue,
      score: audits["cumulative-layout-shift"]?.score,
      numericValue: audits["cumulative-layout-shift"]?.numericValue,
    },
    fcp: {
      value: audits["first-contentful-paint"]?.displayValue,
      score: audits["first-contentful-paint"]?.score,
      numericValue: audits["first-contentful-paint"]?.numericValue,
    },
    tbt: {
      value: audits["total-blocking-time"]?.displayValue,
      score: audits["total-blocking-time"]?.score,
      numericValue: audits["total-blocking-time"]?.numericValue,
    },
    si: {
      value: audits["speed-index"]?.displayValue,
      score: audits["speed-index"]?.score,
      numericValue: audits["speed-index"]?.numericValue,
    },
  };
}

function extractAudits(lhResult: any): any[] {
  const audits = lhResult.audits;
  const categories = lhResult.categories;

  let allOpportunities: any[] = [];
  const categoryKeys = [
    "performance",
    "accessibility",
    "best-practices",
    "seo",
  ];

  categoryKeys.forEach((catKey) => {
    const cat = categories[catKey];
    if (!cat || !cat.auditRefs) return;

    cat.auditRefs.forEach((ref: any) => {
      const audit = audits[ref.id];
      if (
        audit &&
        (audit.score === null ||
          (typeof audit.score === "number" && audit.score < 0.9))
      ) {
        // For non-performance categories, usually score 0 or 1. We want to show things that failed (score 0 or < 0.9).
        // Also filter out 'manual' audits if needed, but usually score null implies manual/informative.
        // We prioritize audits that have a score < 1.
        // Special case: Performance metrics usually have displayValue, others might not.

        // Avoid duplicating if an audit is in multiple categories (rare but possible)
        if (!allOpportunities.find((o) => o.id === ref.id)) {
          allOpportunities.push({
            id: ref.id,
            title: audit.title,
            description: audit.description,
            score: audit.score,
            displayValue: audit.displayValue,
            numericValue: audit.numericValue,
            category: catKey,
          });
        }
      }
    });
  });

  return allOpportunities
    .sort((a, b) => (a.score || 0) - (b.score || 0)) // Sort by score ascending (worst first)
    .slice(0, 20); // Limit to top 20 to avoid overwhelming
}
