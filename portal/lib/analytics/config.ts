export function getAnalyticsConfig() {
  return {
    enabled: process.env.ANALYTICS_API_ENABLED === "true",
    baseUrl: (process.env.ANALYTICS_API_BASE_URL ?? "http://127.0.0.1:8086").replace(/\/$/, ""),
    timeoutMs: Number(process.env.ANALYTICS_API_TIMEOUT_MS ?? "2500")
  };
}
