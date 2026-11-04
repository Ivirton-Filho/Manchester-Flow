import { useMemo, useState } from 'react'
import Icon from '../components/Icon.jsx'

const priorityOrder = { Vermelho: 0, Laranja: 1, Amarelo: 2, Verde: 3, Azul: 4 }
const priorities = ['Vermelho', 'Laranja', 'Amarelo', 'Verde', 'Azul']
const statuses = ['Aguardando', 'Em atendimento']

function PriorityBadge({ value }) {
  const key = value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const symbol = { vermelho: '✦', laranja: '▲', amarelo: '●', verde: '◆', azul: '●' }[key]
  return <span className={`priority priority-${key}`}><span className="priority-symbol" aria-hidden="true">{symbol}</span>{value}</span>
}

function StatusBadge({ value }) {
  const icon = value === 'Em atendimento' ? 'activity' : 'clock'
  const state = value === 'Em atendimento' ? 'progress' : 'waiting'
  return <span className={`status status-${state}`}><Icon name={icon} size={14}/>{value}</span>
}

function PatientDetails({ patient, onClose, onStart }) {
  if (!patient) return null
  return <div className="queue-modal-backdrop" onMouseDown={onClose}>
    <section className="queue-modal" role="dialog" aria-modal="true" aria-labelledby="patient-modal-title" onMouseDown={event => event.stopPropagation()}>
      <div className="queue-modal-header"><div><span className="eyebrow">REGISTRO DE TRIAGEM</span><h2 id="patient-modal-title">{patient.name}</h2><p>{patient.reason} <span>·</span> chegada às {patient.time}</p></div><button className="queue-modal-close" onClick={onClose} aria-label="Fechar"><span aria-hidden="true">×</span></button></div>
      <div className="queue-modal-facts"><div><small>PRIORIDADE</small><PriorityBadge value={patient.priority}/></div><div><small>TEMPO DE ESPERA</small><strong>{patient.waiting}</strong></div><div><small>STATUS</small><StatusBadge value={patient.status}/></div></div>
      <p className="queue-modal-note">A prioridade exibida foi definida por um profissional de saúde. O sistema apoia a organização da fila e não realiza diagnóstico.</p>
      <div className="queue-modal-actions"><button className="queue-secondary-button" onClick={onClose}>Voltar à fila</button>{patient.status === 'Aguardando' ? <button className="primary-button" onClick={() => onStart(patient)}>Iniciar atendimento <Icon name="chevron" size={16}/></button> : <button className="primary-button" onClick={onClose}>Fechar registro</button>}</div>
    </section>
  </div>
}

export default function QueuePage({ patients, onNavigate, onUpdatePatient, onNotice }) {
  const [query, setQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('Todas as prioridades')
  const [statusFilter, setStatusFilter] = useState('Todos os status')
  const [selectedPatient, setSelectedPatient] = useState(null)

  const orderedPatients = useMemo(() => [...patients].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority] || a.time.localeCompare(b.time)), [patients])
  const visiblePatients = useMemo(() => orderedPatients.filter(patient => {
    const matchesQuery = `${patient.name} ${patient.reason}`.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR'))
    const matchesPriority = priorityFilter === 'Todas as prioridades' || patient.priority === priorityFilter
    const matchesStatus = statusFilter === 'Todos os status' || patient.status === statusFilter
    return matchesQuery && matchesPriority && matchesStatus
  }), [orderedPatients, query, priorityFilter, statusFilter])
  const nextPatient = orderedPatients.find(patient => patient.status === 'Aguardando')
  const waitingCount = patients.filter(patient => patient.status === 'Aguardando').length
  const inProgressCount = patients.filter(patient => patient.status === 'Em atendimento').length
  const filtersAreActive = query || priorityFilter !== 'Todas as prioridades' || statusFilter !== 'Todos os status'

  function clearFilters() {
    setQuery('')
    setPriorityFilter('Todas as prioridades')
    setStatusFilter('Todos os status')
  }

  function startPatient(patient) {
    onUpdatePatient(patient.id, 'Em atendimento')
    setSelectedPatient(null)
    onNotice(`${patient.name} atualizado para “Em atendimento”.`)
  }

  return <main className="dashboard queue-page">
    <section className="queue-page-heading">
      <div><div className="eyebrow"><span className="eyebrow-dot"/> ATENDIMENTO · TEMPO REAL</div><h1>Fila de atendimento</h1><p>Prioridade definida pelo profissional de saúde; desempate pelo horário de chegada.</p></div>
      <button className="queue-refresh-button" onClick={() => onNotice('Fila atualizada.') }><Icon name="activity" size={17}/> Atualizar fila</button>
    </section>

    <section className="queue-stat-grid" aria-label="Resumo da fila">
      <article className="queue-stat-card"><span className="queue-stat-icon stat-blue"><Icon name="users"/></span><div><small>TOTAL NA FILA</small><strong>{String(patients.length).padStart(2, '0')}</strong></div><span className="queue-stat-caption">pacientes</span></article>
      <article className="queue-stat-card"><span className="queue-stat-icon stat-amber"><Icon name="clock"/></span><div><small>AGUARDANDO</small><strong>{String(waitingCount).padStart(2, '0')}</strong></div><span className="queue-stat-caption">para atendimento</span></article>
      <article className="queue-stat-card"><span className="queue-stat-icon stat-green"><Icon name="activity"/></span><div><small>EM ATENDIMENTO</small><strong>{String(inProgressCount).padStart(2, '0')}</strong></div><span className="queue-stat-caption">neste momento</span></article>
    </section>

    {nextPatient && <section className="next-patient-card" aria-label="Próximo paciente aguardando">
      <div className="next-patient-marker"><Icon name="users" size={20}/></div>
      <div className="next-patient-copy"><small>PRÓXIMO PARA ATENDIMENTO</small><strong>{nextPatient.name}</strong><span>{nextPatient.reason} <i>·</i> chegou às {nextPatient.time}</span></div>
      <PriorityBadge value={nextPatient.priority}/>
      <div className="next-wait"><small>ESPERA</small><strong>{nextPatient.waiting}</strong></div>
      <button className="primary-button" onClick={() => setSelectedPatient(nextPatient)}>Abrir registro <Icon name="chevron" size={16}/></button>
    </section>}

    <section className="queue-list-panel">
      <div className="queue-list-heading"><div><h2>Pacientes na fila <span>{patients.length}</span></h2><p>Ordenados por prioridade e horário de chegada</p></div><span className="queue-live"><i/> Fila ativa</span></div>
      <div className="queue-filters">
        <label className="queue-search"><Icon name="search" size={18}/><input aria-label="Buscar paciente por nome ou motivo" placeholder="Buscar por nome ou motivo..." value={query} onChange={event => setQuery(event.target.value)}/></label>
        <label className="queue-select-label"><span>Prioridade</span><select value={priorityFilter} onChange={event => setPriorityFilter(event.target.value)}><option>Todas as prioridades</option>{priorities.map(priority => <option key={priority}>{priority}</option>)}</select></label>
        <label className="queue-select-label"><span>Status</span><select value={statusFilter} onChange={event => setStatusFilter(event.target.value)}><option>Todos os status</option>{statuses.map(status => <option key={status}>{status}</option>)}</select></label>
        {filtersAreActive && <button className="clear-queue-filters" onClick={clearFilters}>Limpar filtros</button>}
      </div>

      <div className="queue-desktop-table-wrap"><table className="queue-page-table"><thead><tr><th>POSIÇÃO</th><th>PACIENTE</th><th>PRIORIDADE</th><th>ESPERA</th><th>STATUS</th><th><span className="sr-only">Ação</span></th></tr></thead><tbody>{visiblePatients.map((patient, index) => <tr key={patient.id}>
        <td><span className={`position-number ${index === 0 && patient.status === 'Aguardando' ? 'first-position' : ''}`}>{String(index + 1).padStart(2, '0')}</span></td>
        <td><div className="patient-cell"><div className={`patient-avatar patient-avatar-${index % 5}`}>{patient.initials}</div><div><strong>{patient.name}</strong><small>{patient.reason} <span>·</span> Chegada {patient.time}</small></div></div></td>
        <td><PriorityBadge value={patient.priority}/></td><td><span className={`wait-time ${patient.waitingMinutes >= 30 ? 'wait-critical' : ''}`}>{patient.waiting}</span></td>
        <td><StatusBadge value={patient.status}/></td><td><button className="queue-open-button" onClick={() => setSelectedPatient(patient)}>Abrir <Icon name="chevron" size={15}/></button></td>
      </tr>)}</tbody></table></div>

      <div className="queue-mobile-cards">{visiblePatients.map((patient, index) => <article className="queue-mobile-card" key={patient.id}>
        <div className="queue-mobile-card-top"><span className={`position-number ${index === 0 && patient.status === 'Aguardando' ? 'first-position' : ''}`}>#{String(index + 1).padStart(2, '0')}</span><StatusBadge value={patient.status}/></div>
        <div className="queue-mobile-person"><div className={`patient-avatar patient-avatar-${index % 5}`}>{patient.initials}</div><div><strong>{patient.name}</strong><small>{patient.reason}</small></div></div>
        <div className="queue-mobile-facts"><PriorityBadge value={patient.priority}/><span className={`wait-time ${patient.waitingMinutes >= 30 ? 'wait-critical' : ''}`}><Icon name="clock" size={14}/>{patient.waiting}</span><span className="queue-mobile-arrival">Chegada {patient.time}</span></div>
        <button className="queue-mobile-action" onClick={() => setSelectedPatient(patient)}>Abrir registro <Icon name="chevron" size={16}/></button>
      </article>)}</div>

      {visiblePatients.length === 0 && <div className="queue-empty"><span><Icon name={patients.length === 0 ? 'users' : 'search'} size={22}/></span><strong>{patients.length === 0 ? 'A fila está vazia' : 'Nenhum paciente encontrado'}</strong><p>{patients.length === 0 ? 'Novas chegadas aparecerão aqui após o cadastro.' : 'Altere ou remova os filtros para ver pacientes.'}</p>{filtersAreActive && <button onClick={clearFilters}>Limpar filtros</button>}</div>}
      <div className="queue-list-footer"><span>Exibindo {visiblePatients.length} de {patients.length} pacientes</span><span>Atualizado agora mesmo</span></div>
    </section>
    <footer className="disclaimer"><span className="disclaimer-mark">i</span><span>Sistema de apoio à organização da triagem. <strong>Não realiza diagnóstico nem substitui a decisão do profissional de saúde.</strong> Dados fictícios.</span><span className="footer-made">Feito com <b>♥</b> pela Abacaxi Tech</span></footer>
    <PatientDetails patient={selectedPatient} onClose={() => setSelectedPatient(null)} onStart={startPatient}/>
  </main>
}
