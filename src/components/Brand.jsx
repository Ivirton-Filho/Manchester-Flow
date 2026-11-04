import Icon from './Icon.jsx'

export default function Brand() {
  return <div className="brand">
    <div className="brand-mark"><Icon name="leaf" size={23}/></div>
    <div className="brand-copy"><strong>Manchester <span>Flow</span></strong><small>by Abacaxi Tech</small></div>
  </div>
}
