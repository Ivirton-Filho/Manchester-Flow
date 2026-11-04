import Brand from './Brand.jsx'
import Icon from './Icon.jsx'

const navigation = [
  { label: 'Painel', icon: 'grid' },
  { label: 'Fila de atendimento', icon: 'queue', count: '9' },
  { label: 'Nova triagem', icon: 'plus' },
  { label: 'Histórico', icon: 'clock' },
]

export default function Sidebar({ activeItem, onNavigate }) {
  return <aside className="sidebar">
    <Brand />
    <div className="unit-select"><span className="unit-avatar">U</span><span className="unit-copy"><small>UNIDADE DE SAÚDE</small><strong>Unidade Central</strong></span><Icon name="down" size={16}/></div>
    <div className="nav-label">MENU PRINCIPAL</div>
    <nav className="side-nav" aria-label="Navegação principal">
      {navigation.map(item => <button key={item.label} className={`nav-item ${activeItem === item.label ? 'active' : ''}`} onClick={() => onNavigate(item.label)}>
        <Icon name={item.icon}/><span>{item.label}</span>{item.count && <span className="nav-count">{item.count}</span>}
      </button>)}
      <div className="nav-label nav-label-spaced">ACOMPANHAMENTO</div>
      <button className={`nav-item ${activeItem === 'Relatórios' ? 'active' : ''}`} onClick={() => onNavigate('Relatórios')}><Icon name="chart"/><span>Relatórios</span><span className="soon-label">EM BREVE</span></button>
    </nav>
    <div className="sidebar-bottom"><div className="online-indicator"><span/>Sistema operacional</div><div className="sidebar-foot">Manchester Flow <span>·</span> v1.0</div></div>
  </aside>
}
