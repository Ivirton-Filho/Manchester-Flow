import { useMemo, useState } from 'react'
import Icon from '../components/Icon.jsx'
import { demoPatients } from '../data/demoPatients.js'

const priorityLevels = [
  { name: 'Emergência', level: 'Vermelho', color: 'red' },
  { name: 'Muito urgente', level: 'Laranja', color: 'orange' },
  { name: 'Urgente', level: 'Amarelo', color: 'yellow' },
  { name: 'Pouco urgente', level: 'Verde', color: 'green' },
  { name: 'Não urgente', level: 'Azul', color: 'blue' },
]

function PriorityBadge({ name }) {
  const key = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const symbol = { vermelho: '✦', laranja: '▲', amarelo: '●', verde: '◆', azul: '●' }[key]
  return <span className={`priority priority-${key}`}><span className="priority-symbol" aria-hidden="true">{symbol}</span>{name}</span>
}

function MetricCard({ icon, tone, title, value, suffix, trend, caption, children }) {
  return <article className="metric-card">
    <div className="metric-top"><span className={`metric-icon ${tone}-icon`}><Icon name={icon}/></span><span className="metric-context">{title}</span><span className="metric-menu"><Icon name="more" size={18}/></span></div>
    <div className="metric-number-row"><strong>{value}{suffix && <span className="metric-unit">{suffix}</span>}</strong>{trend}</div>
    <div className="metric-caption">{caption}</div>
    {children}
  </article>
}

export default function DashboardPage({ onNavigate, patients = demoPatients }) {
  const [period, setPeriod] = useState('Hoje')
  const [search, setSearch] = useState('')
  const activePatients = useMemo(() => patients.filter(patient => ['Aguardando', 'Em atendimento'].includes(patient.status)), [patients])
  const waitingCount = activePatients.filter(patient => patient.status === 'Aguardando').length
  const distribution = priorityLevels.map(level => ({ ...level, amount: activePatients.filter(patient => patient.priority === level.level).length }))
  const filteredPatients = useMemo(() => activePatients.filter(p => `${p.name} ${p.reason}`.toLowerCase().includes(search.toLowerCase())).slice(0, 5), [activePatients, search])
  let gradientOffset = 0
  const donutGradient = activePatients.length === 0 ? '#e8eef4' : `conic-gradient(${distribution.map(item => {
    const start = gradientOffset
    gradientOffset += item.amount / activePatients.length * 100
    return `${{ red: '#df655f', orange: '#e99245', yellow: '#efc94b', green: '#66ad78', blue: '#6493bc' }[item.color]} ${start}% ${gradientOffset}%`
  }).join(', ')})`

  return <main className="dashboard">
    <section className="welcome-row">
      <div><div className="eyebrow"><span className="eyebrow-dot"/> QUARTA-FEIRA, 4 DE NOVEMBRO DE 2026</div><h1>Painel geral <span className="wave">☀</span></h1><p>Acompanhe o movimento da unidade em tempo real.</p></div>
      <button className="primary-button" onClick={() => onNavigate('Nova triagem')}><Icon name="plus" size={19}/> Nova triagem</button>
    </section>

    <section className="metric-grid" aria-label="Indicadores operacionais">
      <MetricCard icon="users" tone="blue" title="TOTAL NA FILA" value={String(activePatients.length).padStart(2, '0')} trend={<span className="trend trend-neutral"><span className="trend-dot"/> fila ativa</span>} caption={`${waitingCount} aguardando · ${activePatients.length - waitingCount} em atendimento`}>
        <div className="metric-bottom"><span>Capacidade da unidade</span><div className="capacity"><span style={{width:`${Math.min(activePatients.length / 20 * 100, 100)}%`}}/></div><b>{activePatients.length} <small>/ 20</small></b></div>
      </MetricCard>
      <MetricCard icon="clock" tone="amber" title="TEMPO MÉDIO DE ESPERA" value="24" suffix="min" trend={<span className="trend trend-good">↓ 12% <small>vs. ontem</small></span>} caption="da chegada até o atendimento">
        <div className="metric-sparkline">{[35,48,40,63,49,70,56,82,65,90,70,58].map((height, i) => <span key={i} className={i === 11 ? 'spark-accent' : ''} style={{height:`${height}%`}}/>)}</div>
      </MetricCard>
      <MetricCard icon="check" tone="green" title="CONCLUÍDOS HOJE" value="32" trend={<span className="trend trend-good">↑ 8% <small>vs. ontem</small></span>} caption="atendimentos finalizados">
        <div className="metric-progress"><div className="progress-line"><span style={{width:'68%'}}/></div><span>68% da meta diária</span></div>
      </MetricCard>
      <MetricCard icon="activity" tone="violet" title="TEMPO MÉDIO DE TRIAGEM" value="6" suffix="min" trend={<span className="trend trend-good">↓ 2 min</span>} caption="da chegada até a classificação">
        <div className="metric-bottom plain-bottom"><span className="mini-avatar-stack"><i>AC</i><i>JM</i><i>+</i></span><span>equipe de enfermagem</span><span className="metric-spacer"/><span className="live-pulse"/> ao vivo</div>
      </MetricCard>
    </section>

    <section className="content-grid">
      <article className="panel queue-panel">
        <div className="panel-heading"><div><div className="section-title-line"><h2>Fila de atendimento</h2><span className="live-tag"><i/> AO VIVO</span></div><p>Prioridade definida pelo profissional de saúde</p></div><button className="text-link" onClick={() => onNavigate('Fila de atendimento')}>Ver fila completa <Icon name="chevron" size={16}/></button></div>
        <div className="queue-toolbar"><label className="search-box"><Icon name="search" size={17}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar paciente..." aria-label="Buscar paciente na prévia da fila"/><kbd>⌘ K</kbd></label><div className="queue-summary"><span className="summary-dot"/> {search ? `${filteredPatients.length} resultado(s)` : `${Math.min(5, activePatients.length)} de ${activePatients.length} pacientes`}</div></div>
        <div className="queue-table-wrap"><table className="queue-table"><thead><tr><th>POSIÇÃO</th><th>PACIENTE</th><th>PRIORIDADE</th><th>ESPERA</th><th>STATUS</th><th><span className="sr-only">Abrir paciente</span></th></tr></thead><tbody>{filteredPatients.map((patient, index) => <tr key={patient.name}>
          <td><span className={`position-number ${index === 0 ? 'first-position' : ''}`}>{String(index + 1).padStart(2,'0')}</span></td>
          <td><div className="patient-cell"><div className={`patient-avatar patient-avatar-${index}`}>{patient.initials}</div><div><strong>{patient.name}</strong><small>{patient.reason} <span>·</span> {patient.time}</small></div></div></td>
          <td><PriorityBadge name={patient.priority}/></td><td><span className={`wait-time ${index === 0 ? 'wait-critical' : ''}`}>{patient.waiting}</span></td>
          <td><span className={`status status-${patient.status === 'Em atendimento' ? 'progress' : 'waiting'}`}><i/>{patient.status}</span></td>
          <td><button className="row-action" aria-label={`Ver ${patient.name}`} onClick={() => onNavigate('Fila de atendimento')}><Icon name="chevron" size={17}/></button></td>
        </tr>)}</tbody></table>{filteredPatients.length === 0 && <div className="search-empty">Nenhum paciente encontrado nesta prévia.</div>}</div>
        <div className="queue-footer"><span>Atualizado agora mesmo</span><button onClick={() => onNavigate('Fila de atendimento')}>Abrir painel da fila <Icon name="arrow" size={14}/></button></div>
      </article>

      <div className="right-column">
        <article className="panel distribution-panel"><div className="panel-heading compact-heading"><div><h2>Distribuição por prioridade</h2><p>Pacientes na fila agora</p></div><button className="period-select" onClick={() => setPeriod(period === 'Hoje' ? 'Esta semana' : 'Hoje')}>{period}<Icon name="down" size={15}/></button></div>
          <div className="distribution-summary"><div className="donut" style={{background:donutGradient}} role="img" aria-label="Distribuição de pacientes por prioridade"><div><strong>{String(activePatients.length).padStart(2, '0')}</strong><span>pacientes</span></div></div><div className="distribution-note"><span className="note-icon"><Icon name="activity" size={17}/></span><span><strong>Fila equilibrada</strong><small>Distribuição atualizada em tempo real</small></span></div></div>
          <div className="priority-legend">{distribution.map(item => <div className="legend-row" key={item.level}><span className={`legend-color legend-${item.color}`}/><span className="legend-name">{item.name}</span><span className="legend-count">{item.amount}</span><span className="legend-percent">{activePatients.length ? Math.round(item.amount / activePatients.length * 100) : 0}%</span></div>)}</div>
        </article>
        <article className="alert-card"><div className="alert-icon"><Icon name="activity" size={18}/></div><div className="alert-copy"><strong>Atenção à espera</strong><p>2 pacientes aguardam há mais de 30 minutos.</p></div><button aria-label="Ver pacientes aguardando" onClick={() => onNavigate('Fila de atendimento')}><Icon name="chevron" size={17}/></button></article>
        <article className="panel shift-panel"><div className="shift-heading"><span className="shift-icon"><Icon name="calendar" size={17}/></span><div><strong>Resumo do turno</strong><small>Turno da manhã <span>·</span> 07:00–13:00</small></div><span className="shift-tag">EM ANDAMENTO</span></div><div className="shift-stats"><div><strong>41</strong><span>chegadas</span></div><div><strong>32</strong><span>concluídos</span></div><div><strong>09</strong><span>na fila</span></div></div><div className="shift-progress"><span style={{width:'78%'}}/></div></article>
      </div>
    </section>
    <footer className="disclaimer"><span className="disclaimer-mark">i</span><span>Sistema de apoio à organização da triagem. <strong>Não realiza diagnóstico nem substitui a decisão do profissional de saúde.</strong> Dados fictícios.</span><span className="footer-made">Feito com <b>♥</b> pela Abacaxi Tech</span></footer>
  </main>
}
