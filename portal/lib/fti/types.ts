export type HealthState = "ok" | "warn" | "down" | "unknown";

export type ServiceHealth = {
  name: string;
  state: HealthState;
  detail?: string;
  latencyMs?: number;
};

export type Overview = {
  generatedAt: string;
  activeCalls: number;
  activeChargingSessions: number;
  orphanSessions: number;
  openCdrs: number;
  raStatus: "pass" | "warn" | "fail" | "unknown";
  criticalAlerts: number;
  startP99Ms?: number;
  endP99Ms?: number;
  services: ServiceHealth[];
};

export type CallSummary = {
  id: string;
  state: string;
  customer?: string;
  supplier?: string;
  destination?: string;
  startedAt?: string;
  answeredAt?: string;
  endedAt?: string;
  chargingSessionState?: string;
};

export type RevenueAssuranceSummary = {
  status: "pass" | "warn" | "fail" | "unknown";
  divergences: number;
  orphanSessions: number;
  openCdrs: number;
  checkedAt: string;
};

export type FtiApiError = {
  code: string;
  message: string;
  status?: number;
};
