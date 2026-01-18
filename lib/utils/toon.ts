import { ReportData } from "@/lib/store/appStore";

/**
 * TOON (Token Oriented Object Notation)
 * Minimized JSON format for LLM context injection.
 * Schema:
 * u: url
 * s: [mobileScore, desktopScore]
 * m: metrics (m: mobile, d: desktop)
 *    l: LCP (v: value, s: score)
 *    c: CLS
 *    f: FCP
 *    t: TBT
 *    i: SI
 * a: audits (m: mobile, d: desktop) - List of { t: title, v: displayValue, c: category, d: description }
 */
export const convertToTOON = (
  data: ReportData | null,
  options?: { showMobileAudits: boolean; showDesktopAudits: boolean },
) => {
  if (!data) return "";

  const mapMetrics = (metrics: any) => ({
    l: { v: metrics.lcp.numericValue, s: metrics.lcp.score },
    c: { v: metrics.cls.numericValue, s: metrics.cls.score },
    f: { v: metrics.fcp.numericValue, s: metrics.fcp.score },
    t: { v: metrics.tbt.numericValue, s: metrics.tbt.score },
    i: { v: metrics.si.numericValue, s: metrics.si.score },
  });

  const mapAudits = (audits: any[]) =>
    audits?.map((a) => ({
      t: a.title,
      v: a.displayValue,
      c: a.category,
      d: a.description,
    })) || [];

  const toon = {
    u: data.url,
    s: [data.mobileScore, data.desktopScore],
    scores: {
      m: [data.mobileAccessibility, data.mobileBestPractices, data.mobileSeo],
      d: [
        data.desktopAccessibility,
        data.desktopBestPractices,
        data.desktopSeo,
      ],
    },
    m: {
      m: mapMetrics(data.mobileMetrics),
      d: mapMetrics(data.desktopMetrics),
    },
    a: {
      m: options?.showMobileAudits ? mapAudits(data.mobileAudits) : [],
      d: options?.showDesktopAudits ? mapAudits(data.desktopAudits) : [],
    },
  };

  return JSON.stringify(toon);
};
