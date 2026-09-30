const services = [
  { name: "OpenSIPS", state: "Online", detail: "SIP edge", metric: "18 dialogs" },
  { name: "CGRateS", state: "Online", detail: "Charging", metric: "18 sessions" },
  { name: "PostgreSQL", state: "Online", detail: "Storage", metric: "12 ms" },
  { name: "Redis", state: "Online", detail: "DataDB", metric: "4 ms" }
];

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
  "Revenue Assurance",
  "Infraestrutura",
  "Alertas",
  "Segurança",
  "Configurações"
];

function StatusDot({ ok = true }: { ok?: boolean }) {
  return <span className={ok ? "dot dotOk" : "dot dotWarn"} />;
}

export default function Home() {
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
          <small>Synthetic data only</small>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Operações em tempo real</p>
            <h1>Visão geral</h1>
          </div>
          <div className="topActions">
            <div className="healthBadge"><StatusDot /> Plataforma saudável</div>
            <button className="button secondary">Últimos 15 min</button>
            <button className="button">Atualizar</button>
          </div>
        </header>

        <section className="heroGrid">
          <article className="heroCard primaryCard">
            <div>
              <span className="cardLabel">Chamadas ativas</span>
              <strong className="bigNumber">18</strong>
            </div>
            <div className="trend">+12% agora</div>
          </article>

          <article className="heroCard">
            <div>
              <span className="cardLabel">Sessões CGRateS</span>
              <strong className="bigNumber">18</strong>
            </div>
            <span className="miniStatus"><StatusDot /> 100% correlacionadas</span>
          </article>

          <article className="heroCard">
            <div>
              <span className="cardLabel">Revenue Assurance</span>
              <strong className="bigNumber">PASS</strong>
            </div>
            <span className="miniStatus"><StatusDot /> 0 divergências</span>
          </article>

          <article className="heroCard">
            <div>
              <span className="cardLabel">Alertas críticos</span>
              <strong className="bigNumber">0</strong>
            </div>
            <span className="miniStatus"><StatusDot /> Ambiente estável</span>
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
                  <div className="serviceState"><StatusDot /> {service.state}</div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel financePanel">
            <div className="panelHeader">
              <div>
                <span className="cardLabel">Charging</span>
                <h2>Saúde financeira</h2>
              </div>
            </div>

            <div className="financeStats">
              <div><span>START p99</span><strong>84 ms</strong></div>
              <div><span>END p99</span><strong>61 ms</strong></div>
              <div><span>Sessões órfãs</span><strong>0</strong></div>
              <div><span>CDRs abertos</span><strong>0</strong></div>
            </div>

            <div className="barChart" aria-label="Synthetic activity chart">
              {[28, 42, 35, 58, 51, 67, 61, 74, 65, 82, 72, 88].map((height, index) => (
                <span key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="chartLegend"><span>últimos 60 minutos</span><strong>estável</strong></div>
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
              <div className="correlationNode"><span>Dialogs SIP</span><strong>18</strong></div>
              <div className="connector">↔</div>
              <div className="correlationNode"><span>Sessions</span><strong>18</strong></div>
            </div>

            <div className="checks">
              <div><StatusDot /> CGRateS sem dialog SIP <strong>0</strong></div>
              <div><StatusDot /> Dialog sem sessão financeira <strong>0</strong></div>
              <div><StatusDot /> Saldo zero com sessão ativa <strong>0</strong></div>
              <div><StatusDot /> SELL/BUY ausente <strong>0</strong></div>
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
