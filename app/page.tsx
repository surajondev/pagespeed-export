"use client";

import { UrlInput } from "@/components/feature/UrlInput";
import { ReportDashboard } from "@/components/feature/ReportDashboard";

export default function Home() {
  return (
    <div className="container mx-auto pb-20">
      <UrlInput />
      <ReportDashboard />
    </div>
  );
}
