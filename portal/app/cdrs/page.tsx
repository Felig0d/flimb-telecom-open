type CdrItem = {
  id: string;
  call_id: string;
  account_ref?: string | null;
  supplier_ref?: string | null;
  route_ref?: string | null;
  started_at: string;
  duration_seconds: number;
  sip_final_code?: number | null;
  answered: boolean;
  sell_cost?: number | null;
  buy_cost?: number | null;
  ra_state: string;
};

async function getCdrs(): Promise<CdrItem[]> {
  if (process.env.ANALYTICS_API_ENABLED !== "true") return [];

  const baseUrl = (process.env.ANALYTICS_API_BASE_URL ?? "http://127.0.0.1:8086").replace(/\/$/, "");
  const response = await fetch(`${baseUrl}/v1/cdrs?limit=100`, { cache: "no-store" });

  if (!response.ok) return [];

  const data = await response.json();
  return data.items ?? [];
}

export default async function CdrsPage() {
  const cdrs = await getCdrs();

  return (
    <main className="standalonePage">
      <header className="pageHeader">
        <div>
          <p className="eyebrow">ODIN Analytics</p>
          <h1>CDRs</h1>
        </div>
        <a className="button secondary" href="/">← Visão geral</a>
      </header>

      <section className="panel pagePanel">
        <div className="panelHeader">
          <div>
            <span className="cardLabel">Read plane</span>
            <h2>Últimas chamadas</h2>
          </div>
        </div>

        <div className="tableWrap">
          <table className="dataTable">
            <thead>
              <tr>
                <th>Início</th>
                <th>Call-ID</th>
                <th>Conta</th>
                <th>Fornecedor</th>
                <th>SIP</th>
                <th>Duração</th>
                <th>SELL</th>
                <th>BUY</th>
                <th>RA</th>
              </tr>
            </thead>
            <tbody>
              {cdrs.map((cdr) => (
                <tr key={cdr.id}>
                  <td>{new Date(cdr.started_at).toLocaleString("pt-BR")}</td>
                  <td className="mono">{cdr.call_id}</td>
                  <td>{cdr.account_ref ?? "—"}</td>
                  <td>{cdr.supplier_ref ?? "—"}</td>
                  <td>{cdr.sip_final_code ?? "—"}</td>
                  <td>{cdr.duration_seconds}s</td>
                  <td>{cdr.sell_cost?.toFixed(4) ?? "—"}</td>
                  <td>{cdr.buy_cost?.toFixed(4) ?? "—"}</td>
                  <td>{cdr.ra_state.toUpperCase()}</td>
                </tr>
              ))}
              {cdrs.length === 0 && (
                <tr>
                  <td colSpan={9}>Sem CDRs no read-plane ou integração ainda desabilitada.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
