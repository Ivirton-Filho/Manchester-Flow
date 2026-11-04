import Brand from './Brand.jsx'
import Icon from './Icon.jsx'

const navigation = [
  { label: 'Painel', icon: 'grid' },
  { label: 'Fila', activeLabel: 'Fila de atendimento', icon: 'queue', count: '7' },
  { label: 'Nova triagem', icon: 'plus' },
  { label: 'Histórico', icon: 'clock' },
]

export default function Sidebar({ activeItem, onNavigate }) {
  return <aside className="sidebar">
    <Brand />
    <nav className="side-nav" aria-label="Navegação principal">
      {navigation.map(item => <button key={item.label} className={`nav-item ${activeItem === (item.activeLabel || item.label) ? 'active' : ''}`} onClick={() => onNavigate(item.activeLabel || item.label)}>
        <Icon name={item.icon}/><span>{item.label}</span>{item.count && <span className="nav-count">{item.count}</span>}
      </button>)}
      <button className="nav-item nav-item-upcoming" disabled aria-disabled="true"><Icon name="chart"/><span>Relatórios</span><span className="soon-label">EM BREVE</span></button>
    </nav>
    <div className="sidebar-bottom">
      <div className="support-card"><Icon name="heart" size={19}/><div><strong>Apoio à triagem</strong><small>Decisão sempre profissional</small></div></div>
    </div>
  </aside>
}
