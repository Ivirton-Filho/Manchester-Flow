import Icon from './Icon.jsx'

export default function MobileNav({ activeItem, onNavigate, onMore }) {
  return <nav className="mobile-nav" aria-label="Navegação inferior">
    <button className={activeItem === 'Painel' ? 'selected' : ''} onClick={() => onNavigate('Painel')}><Icon name="grid"/><span>Painel</span></button>
    <button className={activeItem === 'Fila de atendimento' ? 'selected' : ''} onClick={() => onNavigate('Fila de atendimento')}><Icon name="queue"/><span>Fila</span></button>
    <button className="mobile-add" onClick={() => onNavigate('Nova triagem')} aria-label="Nova triagem"><span><Icon name="plus" size={23}/></span><small>Nova</small></button>
    <button className={activeItem === 'Histórico' ? 'selected' : ''} onClick={() => onNavigate('Histórico')}><Icon name="clock"/><span>Histórico</span></button>
    <button onClick={onMore}><Icon name="more"/><span>Mais</span></button>
  </nav>
}
