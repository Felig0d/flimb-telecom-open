import { getAnalyticsSummary, getHourlyMetrics } from "@/lib/analytics/client";

function percent(value: number | null) {
  return value === null ? "—" : `${(value * 100).toFixed(1)}%`;
}

export default async function AnalyticsPage() {
  const [summary, hourly] = await Promise.all([
    getAnalyticsSummary(60),
    getHourlyMetrics(24)
  ]);

  return (
    <main className="standalonePage">
      <header className="pageHeader">
        <div>
          <p className="eyebrow">ODIN Analytics</p>
          <h1>Telecom Analytics</h1>
        </div>
        <a className="button secondary" href="/">← Visão geral</a>
      </header>

      <section className="metricGrid">
        <article className="metricCard"><span>ASR</span><strong>{percent(summary.asr)}</strong></article>
        <article className="metricCard"><span>ACD</span><strong>{summary.acdSeconds?.toFixed(1) ?? "—"} s</strong></article>
        <article className="metricCard"><span>PDD médio</span><strong>{summary.avgPddMs?.toFixed(0) ?? "—"} ms</strong></article>
        <article className="metricCard"><span>Tentativas</span><strong>{summary.attempts}</strong></article>
        <article className="metricCard"><span>Atendidas</span><strong>{summary.answered}</strong></article>
        <article className="metricCard"><span>Falhas</span><strong>{summary.failed}</strong></article>
        <article className="metricCard"><span>SELL</span><strong>{summary.sellCost.toFixed(2)}</strong></article>
        <article className="metricCard"><span>BUY</span><strong>{summary.buyCost.toFixed(2)}</strong></article>
        <article className="metricCard"><span>Margem</span><strong>{summary.grossMargin.toFixed(2)}</strong></article>
      </section>

      <section className="panel pagePanel">
        <div className="panelHeader">
          <div>
            <span className="cardLabel">Últimas horas</span>
            <h2>Tráfego agregado</h2>
          </div>
        </div>

        <div className="tableWrap">
          <table className="dataTable">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Tentativas</th>
                <th>Atendidas</th>
                <th>ASR</th>
                <th>ACD</th>
                <th>PDD</th>
                <th>Margem</th>
              </tr>
            </thead>
            <tbody>
              {hourly.map((row, index) => (
                <tr key={row.bucket_start + index}>
                  <td>{new Date(row.bucket_start).toLocaleString("pt-BR")}</td>
                  <td>{row.attempts}</td>
                  <td>{row.answered}</td>
                  <td>{percent(row.asr ?? null)}</td>
                  <td>{row.acd_seconds?.toFixed(1) ?? "—"} s</td>
                  <td>{row.avg_pdd_ms?.toFixed(0) ?? "—"} ms</td>
                  <td>{Number(row.gross_margin ?? 0).toFixed(2)}</td>
                </tr>
              ))}
              {hourly.length === 0 && (
                <tr>
                  <td colSpan={7}>Sem dados agregados ainda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
