import Icon from './Icon.jsx'

export default function Topbar({ onNotice, pageName = 'Painel', notificationCount = 0, theme = 'light', onToggleTheme }) {
  const today = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())
  const todayLabel = today.charAt(0).toLocaleUpperCase('pt-BR') + today.slice(1)

  return <header className="topbar">
    <div className="breadcrumbs"><span>Início</span><Icon name="chevron" size={14}/><strong key={pageName} className="breadcrumb-current">{pageName}</strong></div>
    <div className="topbar-actions">
      <span className="today-chip"><Icon name="calendar" size={16}/> {todayLabel}</span>
      <button className="icon-button theme-toggle" type="button" aria-label={`Ativar modo ${theme === 'light' ? 'escuro' : 'claro'}`} aria-pressed={theme === 'dark'} title={`Ativar modo ${theme === 'light' ? 'escuro' : 'claro'}`} onClick={onToggleTheme}><Icon name={theme === 'light' ? 'moon' : 'sun'} size={19}/></button>
      <button className="icon-button notification-button" aria-label={`${notificationCount} avisos de espera`} onClick={onNotice}><Icon name="bell"/>{notificationCount > 0 && <i/>}</button>
    </div>
  </header>
}
