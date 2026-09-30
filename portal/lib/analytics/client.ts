import { getAnalyticsConfig } from "./config";
import type { AnalyticsSummary, HourlyMetric } from "./types";

const mockSummary: AnalyticsSummary = {
  windowMinutes: 60,
  attempts: 164,
  answered: 129,
  failed: 35,
  asr: 129 / 164,
  acdSeconds: 92.4,
  avgPddMs: 412,
  sellCost: 18.72,
  buyCost: 11.36,
  grossMargin: 7.36,
  raFailures: 0
};

async function requestJson<T>(path: string): Promise<T> {
  const config = getAnalyticsConfig();

  if (!config.enabled) {
    throw new Error("Analytics live API is disabled");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch(`${config.baseUrl}${path}`, {
      cache: "no-store",
      signal: controller.signal,
      headers: { Accept: "application/json" }
    });

    if (!response.ok) {
      throw new Error(`Analytics API returned HTTP ${response.status}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export async function getAnalyticsSummary(windowMinutes = 60): Promise<AnalyticsSummary> {
  const config = getAnalyticsConfig();
  if (!config.enabled) return { ...mockSummary, windowMinutes };

  return requestJson<AnalyticsSummary>(`/v1/summary?window_minutes=${windowMinutes}`);
}

export async function getHourlyMetrics(limit = 24): Promise<HourlyMetric[]> {
  const config = getAnalyticsConfig();
  if (!config.enabled) return [];

  const response = await requestJson<{ items: HourlyMetric[] }>(
    `/v1/metrics/hourly?limit=${limit}`
  );
  return response.items;
}
