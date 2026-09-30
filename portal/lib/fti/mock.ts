import type { CallSummary, Overview, RevenueAssuranceSummary } from "./types";

export const mockOverview: Overview = {
  generatedAt: new Date().toISOString(),
  activeCalls: 18,
  activeChargingSessions: 18,
  orphanSessions: 0,
  openCdrs: 0,
  raStatus: "pass",
  criticalAlerts: 0,
  startP99Ms: 84,
  endP99Ms: 61,
  services: [
    { name: "OpenSIPS", state: "ok", detail: "SIP edge", latencyMs: 8 },
    { name: "CGRateS", state: "ok", detail: "Charging", latencyMs: 11 },
    { name: "PostgreSQL", state: "ok", detail: "Storage", latencyMs: 12 },
    { name: "Redis", state: "ok", detail: "DataDB", latencyMs: 4 }
  ]
};

export const mockCalls: CallSummary[] = [
  {
    id: "synthetic-call-001",
    state: "answered",
    customer: "demo-customer",
    supplier: "demo-supplier",
    destination: "5511999990001",
    startedAt: new Date(Date.now() - 90_000).toISOString(),
    answeredAt: new Date(Date.now() - 80_000).toISOString(),
    chargingSessionState: "active"
  }
];

export const mockRa: RevenueAssuranceSummary = {
  status: "pass",
  divergences: 0,
  orphanSessions: 0,
  openCdrs: 0,
  checkedAt: new Date().toISOString()
};
