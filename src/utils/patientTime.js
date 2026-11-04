export function elapsedWaitMinutes(patient, now = Date.now()) {
  if (Number.isFinite(patient.waitingMinutesAtStart)) return Math.max(0, patient.waitingMinutesAtStart)
  const arrivedAt = Date.parse(patient.arrivedAt || '')
  if (!Number.isNaN(arrivedAt)) return Math.max(0, Math.floor((now - arrivedAt) / 60_000))
  return Math.max(0, Number(patient.waitingMinutes) || 0)
}

export function formatWaitTime(patient, now = Date.now()) {
  return `${elapsedWaitMinutes(patient, now)} min`
}

export function formatClock(value) {
  const date = value instanceof Date ? value : new Date(value)
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function localDateKey(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}
