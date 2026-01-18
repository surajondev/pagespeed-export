"use client";

import { Download, FileJson, FileText, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store/appStore";
import {
  downloadMarkdown,
  downloadPDF,
  downloadTOON,
} from "@/lib/utils/export-utils";
import { convertToTOON } from "@/lib/utils/toon";
import { generateMarkdown } from "@/lib/utils/export-utils";
import { useState } from "react";

export function ExportMenu() {
  const report = useAppStore((state) => state.report);
  const [copiedTOON, setCopiedTOON] = useState(false);
  const [copiedMD, setCopiedMD] = useState(false);

  if (!report) return null;

  const handleCopyTOON = () => {
    const toon = convertToTOON(report);
    navigator.clipboard.writeText(toon);
    setCopiedTOON(true);
    setTimeout(() => setCopiedTOON(false), 2000);
  };

  const handleCopyMarkdown = () => {
    const md = generateMarkdown(report);
    navigator.clipboard.writeText(md);
    setCopiedMD(true);
    setTimeout(() => setCopiedMD(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
      <Button
        variant="outline"
        onClick={() => downloadPDF(report)}
        className="gap-2"
      >
        <FileText className="w-4 h-4" /> Export PDF
      </Button>
      <Button
        variant="outline"
        onClick={() => downloadMarkdown(report)}
        className="gap-2"
      >
        <Download className="w-4 h-4" /> Export MD
      </Button>
      <Button
        variant="outline"
        onClick={() => downloadTOON(report)}
        className="gap-2"
      >
        <FileJson className="w-4 h-4" /> Export TOON
      </Button>
      <Button
        variant="secondary"
        onClick={handleCopyMarkdown}
        className="gap-2"
      >
        <FileCode className="w-4 h-4" /> {copiedMD ? "Copied MD!" : "Copy MD"}
      </Button>
      <Button variant="secondary" onClick={handleCopyTOON} className="gap-2">
        <FileCode className="w-4 h-4" />{" "}
        {copiedTOON ? "Copied TOON!" : "Copy TOON"}
      </Button>
    </div>
  );
}
