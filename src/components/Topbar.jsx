import Icon from './Icon.jsx'

export default function Topbar({ onNotice, pageName = 'Painel' }) {
  const today = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())
  const todayLabel = today.charAt(0).toLocaleUpperCase('pt-BR') + today.slice(1)

  return <header className="topbar">
    <div className="breadcrumbs"><span>Início</span><Icon name="chevron" size={14}/><strong>{pageName}</strong></div>
    <div className="topbar-actions">
      <span className="today-chip"><Icon name="calendar" size={16}/> {todayLabel}</span>
      <button className="icon-button notification-button" aria-label="Notificações" onClick={onNotice}><Icon name="bell"/><i/></button>
    </div>
  </header>
}
