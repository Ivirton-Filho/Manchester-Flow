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
        ? <QueuePage patients={patients} onNavigate={navigate} onUpdatePatient={updatePatientStatus} onNotice={showNotice}/>
        : activeItem === 'Nova triagem'
          ? <NewTriagePage onNavigate={navigate} onSave={saveTriage}/>
          : activeItem === 'Histórico'
            ? <HistoryPage records={demoHistory}/>
            : <DashboardPage onNavigate={navigate} patients={patients}/>}
    </div>
    <MobileNav activeItem={activeItem} onNavigate={navigate} onMore={() => showNotice('Menu de navegação completo nas próximas etapas.')}/>
    <Toast message={notice}/>
  </div>
}
