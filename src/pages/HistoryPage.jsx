import { useMemo, useState } from 'react'
import Icon from '../components/Icon.jsx'

const pageSize = 5
const priorities = ['Vermelho', 'Laranja', 'Amarelo', 'Verde', 'Azul']

function formatDate(value) {
  const [year, month, day] = value.split('-').map(Number)
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(year, month - 1, day)).replace('.', '')
}

function PriorityBadge({ value }) {
  const key = value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const symbol = { vermelho: '✦', laranja: '▲', amarelo: '●', verde: '◆', azul: '●' }[key]
  return <span className={`priority priority-${key}`}><span className="priority-symbol" aria-hidden="true">{symbol}</span>{value}</span>
}

function ReadOnlyDetails({ record, onClose }) {
  if (!record) return null
  return <div className="queue-modal-backdrop" onMouseDown={onClose}>
    <section className="queue-modal history-modal" role="dialog" aria-modal="true" aria-labelledby="history-modal-title" onMouseDown={event => event.stopPropagation()}>
      <div className="queue-modal-header"><div><span className="eyebrow">REGISTRO CONCLUÍDO · SOMENTE LEITURA</span><h2 id="history-modal-title">{record.name}</h2><p>{record.reason} <span>·</span> {formatDate(record.date)}</p></div><button className="queue-modal-close" onClick={onClose} aria-label="Fechar"><span aria-hidden="true">×</span></button></div>
      <div className="history-modal-badges"><PriorityBadge value={record.priority}/><span className="history-complete-badge"><Icon name="check" size={13}/> Concluída</span></div>
      <div className="history-record-grid"><div><small>CHEGADA</small><strong>{record.arrival}</strong></div><div><small>TEMPO DE ESPERA</small><strong>{record.wait}</strong></div><div><small>INÍCIO DA TRIAGEM</small><strong>{record.triageTime}</strong></div><div><small>CONCLUÍDA</small><strong>{record.completedAt}</strong></div><div className="history-record-wide"><small>SINTOMAS REGISTRADOS</small><strong>{record.symptoms}</strong></div></div>
      <section className="history-vitals"><h3>Sinais vitais registrados</h3><div>{Object.entries({ 'Temperatura': record.vitals.temperature, 'Frequência cardíaca': record.vitals.heartRate, 'Frequência respiratória': record.vitals.respiratoryRate, 'Pressão arterial': record.vitals.bloodPressure, 'Saturação': record.vitals.oxygen, 'Nível de dor': record.vitals.pain }).map(([label, value]) => <span key={label}><small>{label}</small><strong>{value}</strong></span>)}</div></section>
      <section className="history-timeline"><h3>Linha do tempo</h3><div><i/><span><strong>Chegada registrada</strong><small>{record.arrival} · {formatDate(record.date)}</small></span></div><div><i/><span><strong>Triagem registrada</strong><small>{record.triageTime}</small></span></div><div><i/><span><strong>Atendimento concluído</strong><small>{record.completedAt}</small></span></div></section>
      <div className="history-readonly-footer"><Icon name="lock" size={15}/> Este registro é somente leitura.</div>
    </section>
  </div>
}

export default function HistoryPage({ records }) {
  const [search, setSearch] = useState('')
  const [priority, setPriority] = useState('Todas as prioridades')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [page, setPage] = useState(1)
  const [selectedRecord, setSelectedRecord] = useState(null)

  const filteredRecords = useMemo(() => records.filter(record => {
    const matchesSearch = `${record.name} ${record.reason} ${record.symptoms}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR'))
    return matchesSearch && (priority === 'Todas as prioridades' || record.priority === priority) && (!fromDate || record.date >= fromDate) && (!toDate || record.date <= toDate)
  }).sort((a, b) => `${b.date} ${b.completedAt}`.localeCompare(`${a.date} ${a.completedAt}`)), [records, search, priority, fromDate, toDate])
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const filtersActive = search || priority !== 'Todas as prioridades' || fromDate || toDate

  function resetFilters() {
    setSearch(''); setPriority('Todas as prioridades'); setFromDate(''); setToDate(''); setPage(1)
  }

  function updateFilter(setter, value) {
    setter(value)
    setPage(1)
  }

  return <main className="dashboard history-page">
    <section className="history-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/> REGISTROS DA UNIDADE</div><h1>Histórico de triagens</h1><p>Consulte registros concluídos. As informações estão disponíveis somente para leitura.</p></div><div className="history-total"><span className="history-total-icon"><Icon name="clock" size={18}/></span><span><small>REGISTROS ENCONTRADOS</small><strong>{filteredRecords.length}</strong></span></div></section>

    <section className="history-panel">
      <div className="history-panel-heading"><div><h2>Triagens concluídas</h2><p>Dados de demonstração fictícios</p></div><span className="history-readonly-tag"><Icon name="lock" size={13}/> SOMENTE LEITURA</span></div>
      <div className="history-filters">
        <label className="history-search"><Icon name="search" size={17}/><input value={search} onChange={event => updateFilter(setSearch, event.target.value)} placeholder="Buscar por nome ou motivo..." aria-label="Buscar histórico por nome ou motivo"/></label>
        <label className="history-filter-label"><span>De</span><input type="date" value={fromDate} max={toDate || undefined} onChange={event => updateFilter(setFromDate, event.target.value)} aria-label="Data inicial"/></label>
        <label className="history-filter-label"><span>Até</span><input type="date" value={toDate} min={fromDate || undefined} onChange={event => updateFilter(setToDate, event.target.value)} aria-label="Data final"/></label>
        <label className="history-filter-label priority-history-filter"><span>Prioridade</span><select value={priority} onChange={event => updateFilter(setPriority, event.target.value)}><option>Todas as prioridades</option>{priorities.map(value => <option key={value}>{value}</option>)}</select></label>
        {filtersActive && <button className="history-clear-button" onClick={resetFilters}>Limpar filtros</button>}
      </div>
      <div className="history-table-wrap"><table className="history-table"><thead><tr><th>DATA</th><th>PACIENTE</th><th>MOTIVO</th><th>PRIORIDADE</th><th>TEMPO DE ESPERA</th><th><span className="sr-only">Abrir registro</span></th></tr></thead><tbody>{pageRecords.map((record, index) => <tr key={record.id}>
        <td><span className="history-date">{formatDate(record.date)}</span><small className="history-time">{record.completedAt}</small></td>
        <td><div className="patient-cell"><div className={`patient-avatar patient-avatar-${index % 5}`}>{record.initials}</div><div><strong>{record.name}</strong><small>Concluída</small></div></div></td>
        <td><span className="history-reason">{record.reason}</span></td><td><PriorityBadge value={record.priority}/></td><td><span className="wait-time">{record.wait}</span></td><td><button className="queue-open-button" onClick={() => setSelectedRecord(record)}>Ver registro <Icon name="chevron" size={15}/></button></td>
      </tr>)}</tbody></table></div>
      <div className="history-mobile-cards">{pageRecords.map(record => <article className="history-mobile-card" key={record.id}>
        <div className="history-mobile-top"><div className="patient-cell"><div className="patient-avatar">{record.initials}</div><div><strong>{record.name}</strong><small>{formatDate(record.date)} · {record.completedAt}</small></div></div><PriorityBadge value={record.priority}/></div>
        <div className="history-mobile-meta"><span>{record.reason}</span><span>Espera: <strong>{record.wait}</strong></span></div>
        <button className="history-mobile-open" onClick={() => setSelectedRecord(record)}>Ver registro concluído <Icon name="chevron" size={15}/></button>
      </article>)}</div>
      {pageRecords.length === 0 && <div className="queue-empty"><span><Icon name="search" size={22}/></span><strong>Nenhum registro encontrado</strong><p>Ajuste os filtros para ver outros registros concluídos.</p>{filtersActive && <button onClick={resetFilters}>Limpar filtros</button>}</div>}
      <div className="history-pagination"><span>Mostrando {filteredRecords.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredRecords.length)} de {filteredRecords.length}</span><div><button aria-label="Página anterior" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><Icon name="chevron-left" size={16}/></button>{Array.from({ length: totalPages }, (_, index) => index + 1).map(value => <button key={value} className={currentPage === value ? 'active' : ''} aria-current={currentPage === value ? 'page' : undefined} onClick={() => setPage(value)}>{value}</button>)}<button aria-label="Próxima página" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}><Icon name="chevron" size={16}/></button></div></div>
    </section>
    <footer className="disclaimer"><span className="disclaimer-mark">i</span><span>Sistema de apoio à organização da triagem. <strong>Não realiza diagnóstico nem substitui a decisão do profissional de saúde.</strong> Dados fictícios.</span><span className="footer-made">Feito com <b>♥</b> pela Abacaxi Tech</span></footer>
    <ReadOnlyDetails record={selectedRecord} onClose={() => setSelectedRecord(null)}/>
  </main>
}
