import { getAnalyticsSummary } from "@/lib/analytics/client";
import { getOverview } from "@/lib/fti/client";

const events = [
  { time: "10:42:17", title: "Chamada encerrada", meta: "Synthetic Call-ID · billing reconciled" },
  { time: "10:41:58", title: "Sessão iniciada", meta: "prepaid · route alpha" },
  { time: "10:40:31", title: "Gateway recuperado", meta: "synthetic-gw-b · health probe green" },
  { time: "10:38:09", title: "RA concluída", meta: "0 divergências · 0 sessões órfãs" }
];

const nav = [
  "Visão geral",
  "Chamadas",
  "Charging",
  "Routing",
  "Clientes",
  "Fornecedores",
  "CDRs",
  "Analytics",
  "Revenue Assurance",
  "Infraestrutura",
  "Alertas",
  "Segurança",
  "Configurações"
];

function StatusDot({ ok = true }: { ok?: boolean }) {
  return <span className={ok ? "dot dotOk" : "dot dotWarn"} />;
}

function pct(value: number | null) {
  return value === null ? "—" : `${(value * 100).toFixed(1)}%`;
}

export default async function Home() {
  const [overview, analytics] = await Promise.all([
    getOverview(),
    getAnalyticsSummary(60)
  ]);

  const allHealthy = overview.services.every((service) => service.state === "ok");

  const services = overview.services.map((service) => ({
    name: service.name,
    state: service.state === "ok" ? "Online" : service.state,
    detail: service.detail ?? "service",
    metric: service.latencyMs !== undefined ? `${service.latencyMs} ms` : "—",
    ok: service.state === "ok"
  }));

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandMark">O</div>
          <div>
            <strong>ODIN</strong>
            <span>Control Center</span>
          </div>
        </div>

        <nav className="nav">
          {nav.map((item, index) => (
            <a className={index === 0 ? "navItem active" : "navItem"} href="#" key={item}>
              <span className="navGlyph">{String(index + 1).padStart(2, "0")}</span>
              {item}
            </a>
          ))}
        </nav>

        <div className="sidebarFooter">
          <div className="environment">DEV / BETA</div>
          <small>Adapter-driven data</small>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Operações em tempo real</p>
            <h1>Visão geral</h1>
          </div>
          <div className="topActions">
            <div className="healthBadge">
              <StatusDot ok={allHealthy} />
              {allHealthy ? "Plataforma saudável" : "Atenção necessária"}
            </div>
            <button className="button secondary">Últimos 60 min</button>
            <button className="button">Atualizar</button>
          </div>
        </header>

        <section className="heroGrid">
          <article className="heroCard primaryCard">
            <div>
              <span className="cardLabel">Chamadas ativas</span>
              <strong className="bigNumber">{overview.activeCalls}</strong>
            </div>
            <div className="trend">ASR {pct(analytics.asr)}</div>
          </article>

          <article className="heroCard">
            <div>
              <span className="cardLabel">Sessões CGRateS</span>
              <strong className="bigNumber">{overview.activeChargingSessions}</strong>
            </div>
            <span className="miniStatus">
              <StatusDot ok={overview.orphanSessions === 0} />
              {overview.orphanSessions} órfãs
            </span>
          </article>

          <article className="heroCard">
            <div>
              <span className="cardLabel">Revenue Assurance</span>
              <strong className="bigNumber">{overview.raStatus.toUpperCase()}</strong>
            </div>
            <span className="miniStatus">
              <StatusDot ok={overview.raStatus === "pass"} />
              {analytics.raFailures} divergências na janela
            </span>
          </article>

          <article className="heroCard">
            <div>
              <span className="cardLabel">Alertas críticos</span>
              <strong className="bigNumber">{overview.criticalAlerts}</strong>
            </div>
            <span className="miniStatus">
              <StatusDot ok={overview.criticalAlerts === 0} />
              {overview.criticalAlerts === 0 ? "Ambiente estável" : "Requer atenção"}
            </span>
          </article>
        </section>

        <section className="contentGrid">
          <article className="panel servicesPanel">
            <div className="panelHeader">
              <div>
                <span className="cardLabel">Runtime</span>
                <h2>Serviços críticos</h2>
              </div>
              <button className="linkButton">Ver infraestrutura →</button>
            </div>

            <div className="serviceList">
              {services.map((service) => (
                <div className="serviceRow" key={service.name}>
                  <div className="serviceIdentity">
                    <div className="serviceIcon">{service.name.slice(0, 2).toUpperCase()}</div>
                    <div>
                      <strong>{service.name}</strong>
                      <span>{service.detail}</span>
                    </div>
                  </div>
                  <div className="serviceMetric">{service.metric}</div>
                  <div className="serviceState">
                    <StatusDot ok={service.ok} /> {service.state}
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel financePanel">
            <div className="panelHeader">
              <div>
                <span className="cardLabel">Telecom Analytics</span>
                <h2>Qualidade e financeiro</h2>
              </div>
            </div>

            <div className="financeStats">
              <div><span>ASR</span><strong>{pct(analytics.asr)}</strong></div>
              <div><span>ACD</span><strong>{analytics.acdSeconds?.toFixed(1) ?? "—"} s</strong></div>
              <div><span>START p99</span><strong>{overview.startP99Ms ?? "—"} ms</strong></div>
              <div><span>END p99</span><strong>{overview.endP99Ms ?? "—"} ms</strong></div>
            </div>

            <div className="barChart" aria-label="Synthetic activity chart">
              {[28, 42, 35, 58, 51, 67, 61, 74, 65, 82, 72, 88].map((height, index) => (
                <span key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="chartLegend">
              <span>{analytics.attempts} tentativas / {analytics.answered} atendidas</span>
              <strong>margem {analytics.grossMargin.toFixed(2)}</strong>
            </div>
          </article>

          <article className="panel eventsPanel">
            <div className="panelHeader">
              <div>
                <span className="cardLabel">Timeline</span>
                <h2>Eventos recentes</h2>
              </div>
              <button className="linkButton">Abrir eventos →</button>
            </div>

            <div className="timeline">
              {events.map((event) => (
                <div className="timelineItem" key={event.time + event.title}>
                  <span className="timelineTime">{event.time}</span>
                  <span className="timelineRail"><StatusDot /></span>
                  <div>
                    <strong>{event.title}</strong>
                    <p>{event.meta}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel riskPanel">
            <div className="panelHeader">
              <div>
                <span className="cardLabel">Correlação</span>
                <h2>SIP × Financeiro</h2>
              </div>
            </div>

            <div className="correlation">
              <div className="correlationNode"><span>Chamadas</span><strong>{overview.activeCalls}</strong></div>
              <div className="connector">↔</div>
              <div className="correlationNode"><span>Sessions</span><strong>{overview.activeChargingSessions}</strong></div>
            </div>

            <div className="checks">
              <div><StatusDot ok={overview.orphanSessions === 0} /> Sessões órfãs <strong>{overview.orphanSessions}</strong></div>
              <div><StatusDot ok={overview.openCdrs === 0} /> CDRs abertos <strong>{overview.openCdrs}</strong></div>
              <div><StatusDot ok={analytics.raFailures === 0} /> RA divergente <strong>{analytics.raFailures}</strong></div>
              <div><StatusDot /> SELL / BUY <strong>{analytics.sellCost.toFixed(2)} / {analytics.buyCost.toFixed(2)}</strong></div>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
