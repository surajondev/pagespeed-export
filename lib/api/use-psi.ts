import { useMutation } from "@tanstack/react-query";
import { fetchPageSpeedData } from "./psi-service";
import { useAppStore } from "@/lib/store/appStore";

export const usePageSpeedAnalysis = () => {
  // Select specific actions to avoid re-renders if state changes (though actions are usually stable)
  const setLoading = useAppStore((state) => state.actions.setLoading);
  const setReport = useAppStore((state) => state.actions.setReport);

  return useMutation({
    mutationFn: fetchPageSpeedData,
    onMutate: () => {
      setLoading(true);
      // Clear previous report if any? Or keep it until new one arrives? keeping it is better UX usually, but clearing shows clean slate.
      // Let's keep it to avoid flicker if we had one.
    },
    onSuccess: (data) => {
      setReport(data);
      setLoading(false);
    },
    onError: (error) => {
      // Error handling is managed by axios interceptor -> store -> UI
      // But we must ensure loading state is reset
      setLoading(false);
      console.error("PSI mutation error:", error);
    },
  });
};
