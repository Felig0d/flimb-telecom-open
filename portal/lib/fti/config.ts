const required = (name: string, value?: string) => {
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

export function getFtiConfig() {
  const enabled = process.env.FTI_API_ENABLED === "true";

  if (!enabled) {
    return {
      enabled: false as const,
      mode: "mock" as const
    };
  }

  return {
    enabled: true as const,
    mode: "live" as const,
    baseUrl: required("FTI_API_BASE_URL", process.env.FTI_API_BASE_URL).replace(/\/$/, ""),
    token: process.env.FTI_API_TOKEN,
    timeoutMs: Number(process.env.FTI_API_TIMEOUT_MS ?? "2500")
  };
}
