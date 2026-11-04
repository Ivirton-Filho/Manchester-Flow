import Brand from './Brand.jsx'
import Icon from './Icon.jsx'

const navigation = [
  { label: 'Painel', icon: 'grid' },
  { label: 'Fila', activeLabel: 'Fila de atendimento', icon: 'queue', count: '7' },
  { label: 'Nova triagem', icon: 'plus' },
  { label: 'Histórico', icon: 'clock' },
]

export default function Sidebar({ activeItem, onNavigate, onExit }) {
  return <aside className="sidebar">
    <Brand />
    <nav className="side-nav" aria-label="Navegação principal">
      {navigation.map(item => <button key={item.label} className={`nav-item ${activeItem === (item.activeLabel || item.label) ? 'active' : ''}`} onClick={() => onNavigate(item.activeLabel || item.label)}>
        <Icon name={item.icon}/><span>{item.label}</span>{item.count && <span className="nav-count">{item.count}</span>}
      </button>)}
      <button className={`nav-item ${activeItem === 'Relatórios' ? 'active' : ''}`} onClick={() => onNavigate('Relatórios')}><Icon name="chart"/><span>Relatórios</span></button>
    </nav>
    <div className="sidebar-bottom">
      <div className="support-card"><Icon name="heart" size={19}/><div><strong>Apoio à triagem</strong><small>Decisão sempre profissional</small></div></div>
      <button className="nav-item sign-out" onClick={onExit}><Icon name="logout"/><span>Sair</span></button>
    </div>
  </aside>
}
