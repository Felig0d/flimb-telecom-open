export type AnalyticsSummary = {
  windowMinutes: number;
  attempts: number;
  answered: number;
  failed: number;
  asr: number | null;
  acdSeconds: number | null;
  sellCost: number;
  buyCost: number;
  grossMargin: number;
  raFailures: number;
};

export type HourlyMetric = {
  bucket_start: string;
  tenant_ref?: string | null;
  supplier_ref?: string | null;
  route_ref?: string | null;
  attempts: number;
  answered: number;
  failed: number;
  asr?: number | null;
  acd_seconds?: number | null;
  avg_pdd_ms?: number | null;
  sell_cost: number;
  buy_cost: number;
  gross_margin: number;
};
