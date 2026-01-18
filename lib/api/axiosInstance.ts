import axios from "axios";
import { useAppStore } from "@/lib/store/appStore";

export const axiosInstance = axios.create({
  baseURL: "https://www.googleapis.com/pagespeedonline/v5",
  timeout: 60000, // 60s timeout as PSI can be slow
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      "An unknown error occurred";

    // Set global error in store
    useAppStore.getState().actions.setError(errorMessage);

    return Promise.reject(error);
  },
);
