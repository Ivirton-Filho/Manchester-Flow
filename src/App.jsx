import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import MobileNav from './components/MobileNav.jsx'
import Toast from './components/Toast.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import QueuePage from './pages/QueuePage.jsx'
import NewTriagePage from './pages/NewTriagePage.jsx'
import HistoryPage from './pages/HistoryPage.jsx'
import { demoPatients } from './data/demoPatients.js'
import { demoHistory } from './data/demoHistory.js'
import { elapsedWaitMinutes, formatClock, formatWaitTime, localDateKey } from './utils/patientTime.js'

export default function App() {
  const [activeItem, setActiveItem] = useState('Painel')
  const [notice, setNotice] = useState('')
  const [patients, setPatients] = useState(demoPatients)
  const [historyRecords, setHistoryRecords] = useState(demoHistory)
  const [now, setNow] = useState(() => Date.now())
  const activeQueueCount = patients.filter(patient => ['Aguardando', 'Em atendimento'].includes(patient.status)).length
  const longWaitCount = patients.filter(patient => patient.status === 'Aguardando' && elapsedWaitMinutes(patient, now) > 30).length

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  function showNotice(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2800)
  }

  function navigate(label) {
    setActiveItem(label)
    if (!['Painel', 'Fila de atendimento', 'Nova triagem', 'Histórico'].includes(label)) showNotice(`${label} será a próxima etapa do protótipo.`)
  }

  function updatePatientStatus(id, status) {
    setPatients(current => current.map(patient => {
      if (patient.id !== id) return patient
      if (status === 'Em atendimento') return { ...patient, status, waitingMinutesAtStart: elapsedWaitMinutes(patient) }
      return { ...patient, status }
    }))
  }

  function completePatient(id) {
    const patient = patients.find(item => item.id === id)
    if (!patient) return

    const completedNow = new Date()
    const date = localDateKey(completedNow)
    const completedAt = formatClock(completedNow)
    const vitals = patient.vitals || {}

    setPatients(current => current.map(item => item.id === id ? { ...item, status: 'Concluída' } : item))
    setHistoryRecords(current => [{
      id: `h-${Date.now()}`,
      name: patient.name,
      initials: patient.initials,
      reason: patient.reason,
      priority: patient.priority,
      date,
      arrivedAt: patient.arrivedAt || null,
      triagedAt: patient.triagedAt || null,
      arrival: patient.time,
      triageTime: patient.triagedAt ? formatClock(patient.triagedAt) : '—',
      completedAt,
      wait: formatWaitTime(patient, completedNow.getTime()),
      symptoms: patient.symptoms || patient.reason,
      vitals: {
        temperature: vitals.temperature || '—',
        heartRate: vitals.heartRate || '—',
        respiratoryRate: vitals.respiratoryRate || '—',
        bloodPressure: vitals.bloodPressure || '—',
        oxygen: vitals.oxygen || '—',
        pain: vitals.pain || '—',
      },
    }, ...current])
  }

  function saveTriage(patient) {
    setPatients(current => [patient, ...current])
    setActiveItem('Fila de atendimento')
    showNotice('Triagem salva. Paciente adicionado à fila.')
  }

  return <div className="app-shell">
    <Sidebar activeItem={activeItem} onNavigate={navigate} queueCount={activeQueueCount}/>
    <div className="main-column">
      <Topbar pageName={activeItem === 'Fila de atendimento' ? 'Fila' : activeItem} notificationCount={longWaitCount} onNotice={() => showNotice(longWaitCount ? `${longWaitCount} pacientes aguardam há mais de 30 minutos.` : 'Nenhum paciente aguarda há mais de 30 minutos.')}/>
      {activeItem === 'Fila de atendimento'
        ? <QueuePage patients={patients} now={now} onNavigate={navigate} onUpdatePatient={updatePatientStatus} onCompletePatient={completePatient} onNotice={showNotice}/>
        : activeItem === 'Nova triagem'
          ? <NewTriagePage onNavigate={navigate} onSave={saveTriage}/>
          : activeItem === 'Histórico'
            ? <HistoryPage records={historyRecords}/>
            : <DashboardPage onNavigate={navigate} patients={patients} historyRecords={historyRecords} now={now}/>}
    </div>
    <MobileNav activeItem={activeItem} onNavigate={navigate} onMore={() => showNotice('Menu de navegação completo nas próximas etapas.')}/>
    <Toast message={notice}/>
  </div>
}
