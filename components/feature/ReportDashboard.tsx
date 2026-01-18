"use client";

import { useAppStore } from "@/lib/store/appStore";
import { motion } from "framer-motion";
import { ExportMenu } from "./ExportMenu";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAppUI } from "@/lib/store/appStore";

export function ReportDashboard() {
  const report = useAppStore((state) => state.report);
  const ui = useAppUI();

  if (!report) return null;

  return (
    <motion.div
      className="w-full max-w-5xl mx-auto p-6 space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold">
          Results for <span className="text-primary">{report.url}</span>
        </h2>
        <ExportMenu />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mobile Score */}
        <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm relative overflow-hidden flex flex-col h-full">
          <div className="absolute top-0 right-0 p-4 opacity-50 font-mono text-xs">
            MOBILE
          </div>
          <div className="flex flex-col items-center justify-center p-8">
            <div
              className={`text-6xl font-bold ${getScoreColor(report.mobileScore)}`}
            >
              {report.mobileScore}
            </div>
            <div className="text-muted-foreground mt-2">Performance Score</div>
          </div>

          {/* Other Categories */}
          <div className="flex justify-center gap-4 mb-6 px-4">
            <SmallScoreCard
              label="Accessibility"
              score={report.mobileAccessibility}
            />
            <SmallScoreCard
              label="Best Practices"
              score={report.mobileBestPractices}
            />
            <SmallScoreCard label="SEO" score={report.mobileSeo} />
          </div>

          {/* Metrics Grid Mobile */}
          {/* Metrics Grid Mobile */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {Object.entries(report.mobileMetrics).map(([key, metric]) => (
              <MetricItem key={key} name={key} metric={metric} />
            ))}
          </div>

          {/* Opportunities Mobile */}
          <div className="mt-8 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Top Opportunities
              </h4>
              <div className="flex items-center space-x-2">
                <Switch
                  id="mobile-opps"
                  checked={ui.showMobileOpportunities}
                  onCheckedChange={ui.toggleMobileOpportunities}
                />
                <Label htmlFor="mobile-opps" className="text-xs">
                  Show
                </Label>
              </div>
            </div>

            {ui.showMobileOpportunities && (
              <div className="space-y-3">
                {report.mobileAudits?.length > 0 ? (
                  report.mobileAudits.map((audit) => (
                    <AuditItem key={audit.id} audit={audit} />
                  ))
                ) : (
                  <div className="text-sm text-emerald-500">
                    No major issues found!
                  </div>
                )}
              </div>
            )}
            {!ui.showMobileOpportunities && (
              <div className="text-sm text-muted-foreground italic border-l-2 border-muted pl-3 py-1">
                Hiding {report.mobileAudits?.length || 0} opportunities (will
                not be exported).
              </div>
            )}
          </div>
        </div>

        {/* Desktop Score */}
        <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm relative overflow-hidden flex flex-col h-full">
          <div className="absolute top-0 right-0 p-4 opacity-50 font-mono text-xs">
            DESKTOP
          </div>
          <div className="flex flex-col items-center justify-center p-8">
            <div
              className={`text-6xl font-bold ${getScoreColor(report.desktopScore)}`}
            >
              {report.desktopScore}
            </div>
            <div className="text-muted-foreground mt-2">Performance Score</div>
          </div>

          {/* Other Categories */}
          <div className="flex justify-center gap-4 mb-6 px-4">
            <SmallScoreCard
              label="Accessibility"
              score={report.desktopAccessibility}
            />
            <SmallScoreCard
              label="Best Practices"
              score={report.desktopBestPractices}
            />
            <SmallScoreCard label="SEO" score={report.desktopSeo} />
          </div>

          {/* Metrics Grid Desktop */}
          {/* Metrics Grid Desktop */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {Object.entries(report.desktopMetrics).map(([key, metric]) => (
              <MetricItem key={key} name={key} metric={metric} />
            ))}
          </div>

          {/* Opportunities Desktop */}
          <div className="mt-8 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Top Opportunities
              </h4>
              <div className="flex items-center space-x-2">
                <Switch
                  id="desktop-opps"
                  checked={ui.showDesktopOpportunities}
                  onCheckedChange={ui.toggleDesktopOpportunities}
                />
                <Label htmlFor="desktop-opps" className="text-xs">
                  Show
                </Label>
              </div>
            </div>

            {ui.showDesktopOpportunities && (
              <div className="space-y-3">
                {report.desktopAudits?.length > 0 ? (
                  report.desktopAudits.map((audit) => (
                    <AuditItem key={audit.id} audit={audit} />
                  ))
                ) : (
                  <div className="text-sm text-emerald-500">
                    No major issues found!
                  </div>
                )}
              </div>
            )}
            {!ui.showDesktopOpportunities && (
              <div className="text-sm text-muted-foreground italic border-l-2 border-muted pl-3 py-1">
                Hiding {report.desktopAudits?.length || 0} opportunities (will
                not be exported).
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MetricItem({ name, metric }: { name: string; metric: any }) {
  return (
    <div className="p-3 bg-secondary/50 rounded-lg">
      <div className="text-xs uppercase text-muted-foreground mb-1">{name}</div>
      <div className="font-mono text-sm font-semibold">
        {metric.value || "-"}
      </div>
      <div className={`text-xs mt-1 ${getScoreColor(metric.score * 100)}`}>
        {metric.numericValue ? `${Math.round(metric.numericValue)}ms` : ""}
      </div>
    </div>
  );
}

function AuditItem({ audit }: { audit: any }) {
  return (
    <div className="p-3 bg-secondary/30 rounded-lg border border-border/50">
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-col gap-1">
          <div className="font-medium text-sm text-foreground/90">
            {audit.title}
          </div>
          {audit.category && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary w-fit uppercase tracking-wider font-semibold">
              {audit.category.replace("-", " ")}
            </span>
          )}
        </div>
        {audit.displayValue && (
          <div className="text-xs font-mono text-red-400 whitespace-nowrap">
            {audit.displayValue}
          </div>
        )}
      </div>
      <p
        className="text-xs text-muted-foreground mt-1 line-clamp-2"
        title={audit.description}
      >
        {audit.description}
      </p>
    </div>
  );
}

function SmallScoreCard({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold text-sm ${getScoreBorderColor(score)}`}
      >
        {score}
      </div>
      <div className="text-[10px] text-muted-foreground mt-1 max-w-[60px] text-center leading-tight">
        {label}
      </div>
    </div>
  );
}

function getScoreBorderColor(score: number) {
  if (score >= 90) return "border-emerald-500 text-emerald-500";
  if (score >= 50) return "border-amber-500 text-amber-500";
  return "border-red-500 text-red-500";
}

function getScoreColor(score: number) {
  if (score >= 90) return "text-emerald-500";
  if (score >= 50) return "text-amber-500";
  return "text-red-500";
}
