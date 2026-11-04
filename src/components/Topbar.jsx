import Icon from './Icon.jsx'

export default function Topbar({ onNotice }) {
  return <header className="topbar">
    <div className="breadcrumbs"><span>Início</span><Icon name="chevron" size={14}/><strong>Painel</strong></div>
    <div className="topbar-actions">
      <span className="today-chip"><Icon name="calendar" size={16}/> Quarta-feira, 4 de novembro</span>
      <button className="icon-button notification-button" aria-label="Notificações" onClick={onNotice}><Icon name="bell"/><i/></button>
    </div>
  </header>
}
