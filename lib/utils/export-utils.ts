import { ReportData } from "@/lib/store/appStore";
import { convertToTOON } from "./toon";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";

interface ExportOptions {
  showMobileAudits: boolean;
  showDesktopAudits: boolean;
}

export const downloadTOON = (report: ReportData, options: ExportOptions) => {
  const toonString = convertToTOON(report, options);
  const blob = new Blob([toonString], { type: "application/json" });
  saveAs(blob, `psi-report-${new Date().getTime()}.json`);
};

export const generateMarkdown = (
  report: ReportData,
  options: ExportOptions,
) => {
  return `# PageSpeed Insights Report
URL: ${report.url}
Date: ${new Date().toLocaleString()}

## Scores
- **Mobile**: ${report.mobileScore}
- **Desktop**: ${report.desktopScore}

## Additional Scores (Mobile)
- Accessibility: ${report.mobileAccessibility}
- Best Practices: ${report.mobileBestPractices}
- SEO: ${report.mobileSeo}

## Additional Scores (Desktop)
- Accessibility: ${report.desktopAccessibility}
- Best Practices: ${report.desktopBestPractices}
- SEO: ${report.desktopSeo}

## Mobile Metrics
| Metric | Value | Score |
|--------|-------|-------|
${Object.entries(report.mobileMetrics)
  .map(
    ([k, v]) =>
      `| ${k.toUpperCase()} | ${v.value} | ${Math.round(v.score * 100)} |`,
  )
  .join("\n")}

### Top Opportunities (Mobile)
${options.showMobileAudits ? report.mobileAudits?.map((a) => `- [${a.category?.toUpperCase() || "PERF"}] **${a.title}** (${a.displayValue || "N/A"}): ${a.description} (Score: ${a.score})`).join("\n") || "None" : "(Hidden in report)"}

## Desktop Metrics
| Metric | Value | Score |
|--------|-------|-------|
${Object.entries(report.desktopMetrics)
  .map(
    ([k, v]) =>
      `| ${k.toUpperCase()} | ${v.value} | ${Math.round(v.score * 100)} |`,
  )
  .join("\n")}

### Top Opportunities (Desktop)
${options.showDesktopAudits ? report.desktopAudits?.map((a) => `- [${a.category?.toUpperCase() || "PERF"}] **${a.title}** (${a.displayValue || "N/A"}): ${a.description} (Score: ${a.score})`).join("\n") || "None" : "(Hidden in report)"}
`;
};

export const downloadMarkdown = (
  report: ReportData,
  options: ExportOptions,
) => {
  const md = generateMarkdown(report, options);
  const blob = new Blob([md], { type: "text/markdown" });
  saveAs(blob, `psi-report-${new Date().getTime()}.md`);
};

export const downloadPDF = (report: ReportData, options: ExportOptions) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.text("PageSpeed Insights Report", 14, 22);

  doc.setFontSize(10);
  doc.text(`URL: ${report.url}`, 14, 30);
  doc.text(`Date: ${new Date().toLocaleString()}`, 14, 35);

  const scores = [
    ["Mobile Score", `${report.mobileScore}`],
    ["Desktop Score", `${report.desktopScore}`],
  ];

  const additionalScores = [
    ["Mobile Accessibility", `${report.mobileAccessibility}`],
    ["Mobile Best Practices", `${report.mobileBestPractices}`],
    ["Mobile SEO", `${report.mobileSeo}`],
    ["Desktop Accessibility", `${report.desktopAccessibility}`],
    ["Desktop Best Practices", `${report.desktopBestPractices}`],
    ["Desktop SEO", `${report.desktopSeo}`],
  ];

  autoTable(doc, {
    startY: 40,
    head: [["Platform", "Score"]],
    body: scores,
    theme: "grid",
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [["Category", "Score"]],
    body: additionalScores,
    theme: "grid",
  });

  doc.text("Mobile Metrics", 14, (doc as any).lastAutoTable.finalY + 10);

  const mobileRows = Object.entries(report.mobileMetrics).map(([k, v]) => [
    k.toUpperCase(),
    v.value,
    Math.round(v.score * 100),
  ]);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 15,
    head: [["Metric", "Value", "Score"]],
    body: mobileRows,
  });

  if (report.mobileAudits?.length && options.showMobileAudits) {
    doc.text(
      "Mobile Opportunities",
      14,
      (doc as any).lastAutoTable.finalY + 10,
    );
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 15,
      head: [["Category", "Opportunity", "Description", "Savings"]],
      body: report.mobileAudits.map((a) => [
        a.category?.toUpperCase() || "-",
        a.title,
        a.description,
        a.displayValue || "-",
      ]),
      theme: "striped",
      columnStyles: {
        2: { cellWidth: 70 }, // wrap description
      },
    });
  }

  doc.addPage();

  doc.text("Desktop Metrics", 14, 20);

  const desktopRows = Object.entries(report.desktopMetrics).map(([k, v]) => [
    k.toUpperCase(),
    v.value,
    Math.round(v.score * 100),
  ]);

  autoTable(doc, {
    startY: 25,
    head: [["Metric", "Value", "Score"]],
    body: desktopRows,
  });

  if (report.desktopAudits?.length && options.showDesktopAudits) {
    doc.text(
      "Desktop Opportunities",
      14,
      (doc as any).lastAutoTable.finalY + 10,
    );
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 15,
      head: [["Category", "Opportunity", "Description", "Savings"]],
      body: report.desktopAudits.map((a) => [
        a.category?.toUpperCase() || "-",
        a.title,
        a.description,
        a.displayValue || "-",
      ]),
      theme: "striped",
      columnStyles: {
        2: { cellWidth: 70 }, // wrap description
      },
    });
  }

  doc.save(`psi-report-${new Date().getTime()}.pdf`);
};
