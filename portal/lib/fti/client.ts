import { getFtiConfig } from "./config";
import { mockCalls, mockOverview, mockRa } from "./mock";
import type {
  CallSummary,
  FtiApiError,
  Overview,
  RevenueAssuranceSummary
} from "./types";

type RequestOptions = {
  path: string;
  init?: RequestInit;
};

async function requestJson<T>({ path, init }: RequestOptions): Promise<T> {
  const config = getFtiConfig();
  if (!config.enabled) throw new Error("FTI live API is disabled");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs);

  try {
    const response = await fetch(`${config.baseUrl}${path}`, {
      ...init,
      cache: "no-store",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(config.token ? { Authorization: `Bearer ${config.token}` } : {}),
        ...(init?.headers ?? {})
      }
    });

    if (!response.ok) {
      const error: FtiApiError = {
        code: "FTI_UPSTREAM_ERROR",
        message: `FTI API returned HTTP ${response.status}`,
        status: response.status
      };
      throw Object.assign(new Error(error.message), { fti: error });
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export async function getOverview(): Promise<Overview> {
  const config = getFtiConfig();
  if (!config.enabled) return mockOverview;

  // Keep the public beta decoupled from internal FTI route names.
  // A private deployment may map this path through an API gateway.
  return requestJson<Overview>({ path: process.env.FTI_API_OVERVIEW_PATH ?? "/api/overview" });
}

export async function getCalls(): Promise<CallSummary[]> {
  const config = getFtiConfig();
  if (!config.enabled) return mockCalls;

  return requestJson<CallSummary[]>({ path: process.env.FTI_API_CALLS_PATH ?? "/api/calls" });
}

export async function getRevenueAssurance(): Promise<RevenueAssuranceSummary> {
  const config = getFtiConfig();
  if (!config.enabled) return mockRa;

  return requestJson<RevenueAssuranceSummary>({
    path: process.env.FTI_API_RA_PATH ?? "/api/revenue-assurance"
  });
}
