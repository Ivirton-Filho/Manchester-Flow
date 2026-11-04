import Icon from './Icon.jsx'

export default function Toast({ message }) {
  if (!message) return null
  return <div role="status" className="toast"><span className="toast-check"><Icon name="check" size={16}/></span>{message}</div>
}
