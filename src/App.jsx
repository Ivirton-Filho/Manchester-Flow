import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import MobileNav from './components/MobileNav.jsx'
import Toast from './components/Toast.jsx'
import DashboardPage from './pages/DashboardPage.jsx'

export default function App() {
  const [activeItem, setActiveItem] = useState('Painel')
  const [notice, setNotice] = useState('')

  function showNotice(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2800)
  }

  function navigate(label) {
    setActiveItem(label)
    if (label !== 'Painel') showNotice(`${label} será a próxima etapa do protótipo.`)
  }

  return <div className="app-shell">
    <Sidebar activeItem={activeItem} onNavigate={navigate} onExit={() => showNotice('A saída de sessão não está disponível nesta etapa.')}/>
    <div className="main-column">
      <Topbar onNotice={() => showNotice('Você está em dia. Nenhum aviso novo.')}/>
      <DashboardPage onNavigate={navigate}/>
    </div>
    <MobileNav activeItem={activeItem} onNavigate={navigate} onMore={() => showNotice('Menu de navegação completo nas próximas etapas.')}/>
    <Toast message={notice}/>
  </div>
}
