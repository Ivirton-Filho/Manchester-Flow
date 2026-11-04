import { useState } from 'react'
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

export default function App() {
  const [activeItem, setActiveItem] = useState('Painel')
  const [notice, setNotice] = useState('')
  const [patients, setPatients] = useState(demoPatients)
  const [historyRecords, setHistoryRecords] = useState(demoHistory)

  function showNotice(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2800)
  }

  function navigate(label) {
    setActiveItem(label)
    if (!['Painel', 'Fila de atendimento', 'Nova triagem', 'Histórico'].includes(label)) showNotice(`${label} será a próxima etapa do protótipo.`)
  }

  function updatePatientStatus(id, status) {
    setPatients(current => current.map(patient => patient.id === id ? { ...patient, status } : patient))
  }

  function completePatient(id) {
    const patient = patients.find(item => item.id === id)
    if (!patient) return

    const now = new Date()
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    const completedAt = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    const vitals = patient.vitals || {}

    setPatients(current => current.map(item => item.id === id ? { ...item, status: 'Concluída' } : item))
    setHistoryRecords(current => [{
      id: `h-${Date.now()}`,
      name: patient.name,
      initials: patient.initials,
      reason: patient.reason,
      priority: patient.priority,
      date,
      arrival: patient.time,
      triageTime: patient.triageTime || patient.time,
      completedAt,
      wait: patient.waiting,
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
    <Sidebar activeItem={activeItem} onNavigate={navigate}/>
    <div className="main-column">
      <Topbar pageName={activeItem === 'Fila de atendimento' ? 'Fila' : activeItem} onNotice={() => showNotice('Você está em dia. Nenhum aviso novo.')}/>
      {activeItem === 'Fila de atendimento'
        ? <QueuePage patients={patients} onNavigate={navigate} onUpdatePatient={updatePatientStatus} onCompletePatient={completePatient} onNotice={showNotice}/>
        : activeItem === 'Nova triagem'
          ? <NewTriagePage onNavigate={navigate} onSave={saveTriage}/>
          : activeItem === 'Histórico'
            ? <HistoryPage records={historyRecords}/>
            : <DashboardPage onNavigate={navigate} patients={patients}/>}
    </div>
    <MobileNav activeItem={activeItem} onNavigate={navigate} onMore={() => showNotice('Menu de navegação completo nas próximas etapas.')}/>
    <Toast message={notice}/>
  </div>
}
