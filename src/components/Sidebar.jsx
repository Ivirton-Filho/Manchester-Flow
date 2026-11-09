import Brand from './Brand.jsx'
import Icon from './Icon.jsx'

const navigation = [
  { label: 'Painel', icon: 'grid' },
  { label: 'Fila', activeLabel: 'Fila de atendimento', icon: 'queue' },
  { label: 'Nova triagem', icon: 'plus' },
  { label: 'Histórico', icon: 'clock' },
]

export default function Sidebar({ activeItem, onNavigate, queueCount, collapsed = false, onToggleCollapsed }) {
  return <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
    <button className="sidebar-toggle" type="button" onClick={onToggleCollapsed} aria-label={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'} aria-expanded={!collapsed} title={collapsed ? 'Expandir menu' : 'Recolher menu'}><Icon name={collapsed ? 'chevron' : 'chevron-left'} size={17}/></button>
    <Brand />
    <nav className="side-nav" aria-label="Navegação principal">
      {navigation.map(item => <button key={item.label} className={`nav-item ${activeItem === (item.activeLabel || item.label) ? 'active' : ''}`} aria-label={item.activeLabel ? `${item.label}, ${queueCount} pacientes na fila` : item.label} title={item.activeLabel ? `${item.label} · ${queueCount} pacientes` : item.label} onClick={() => onNavigate(item.activeLabel || item.label)}>
        <Icon name={item.icon}/><span className="nav-item-label">{item.label}</span>{item.activeLabel && <span className="nav-count" aria-hidden="true">{queueCount}</span>}
      </button>)}
      <button className="nav-item nav-item-upcoming" title="Relatórios · Em breve" aria-label="Relatórios, em breve" disabled aria-disabled="true"><Icon name="chart"/><span className="nav-item-label">Relatórios</span><span className="soon-label">EM BREVE</span></button>
    </nav>
    <div className="sidebar-bottom">
      <div className="support-card"><Icon name="heart" size={19}/><div><strong>Apoio à triagem</strong><small>Decisão sempre profissional</small></div></div>
    </div>
  </aside>
}
