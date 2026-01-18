import { create } from "zustand";

export interface Audit {
  id: string;
  title: string;
  description: string;
  score: number;
  displayValue?: string;
  numericValue?: number;
  category?: string;
}

export interface ReportData {
  url: string;
  // Performance is the default score
  mobileScore: number;
  desktopScore: number;
  // New Categories (Scores 0-100)
  mobileAccessibility: number;
  desktopAccessibility: number;
  mobileBestPractices: number;
  desktopBestPractices: number;
  mobileSeo: number;
  desktopSeo: number;

  mobileMetrics: Record<string, any>;
  desktopMetrics: Record<string, any>;
  mobileAudits: Audit[];
  desktopAudits: Audit[];
  // TOON representation will be generated on export
}

interface AppState {
  isLoading: boolean;
  error: string | null;
  report: ReportData | null;
  actions: {
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setReport: (report: ReportData | null) => void;
  };
}

export const useAppStore = create<AppState>((set) => ({
  isLoading: false,
  error: null,
  report: null,
  actions: {
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    setReport: (report) => set({ report }),
  },
}));

export const useAppActions = () => useAppStore((state) => state.actions);
