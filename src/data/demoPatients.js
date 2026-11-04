import { formatClock } from '../utils/patientTime.js'

const samplePatients = [
  { id: 'p01', name: 'Paciente Teste 01', initials: 'PT', reason: 'Dor abdominal', priority: 'Vermelho', initialWaitMinutes: 8, status: 'Aguardando' },
  { id: 'p02', name: 'Lucas Ilustrativo', initials: 'LI', reason: 'Dor no peito', priority: 'Laranja', initialWaitMinutes: 22, status: 'Em atendimento' },
  { id: 'p03', name: 'Maria Fictícia', initials: 'MF', reason: 'Mal-estar e tontura', priority: 'Laranja', initialWaitMinutes: 18, status: 'Aguardando' },
  { id: 'p04', name: 'Ana Demonstração', initials: 'AD', reason: 'Tosse persistente', priority: 'Amarelo', initialWaitMinutes: 36, status: 'Aguardando' },
  { id: 'p05', name: 'Beatriz Modelo', initials: 'BM', reason: 'Mal-estar', priority: 'Amarelo', initialWaitMinutes: 32, status: 'Aguardando' },
  { id: 'p06', name: 'João Exemplo', initials: 'JE', reason: 'Dor de cabeça', priority: 'Amarelo', initialWaitMinutes: 26, status: 'Aguardando' },
  { id: 'p07', name: 'Marina Exemplo', initials: 'ME', reason: 'Dor lombar', priority: 'Verde', initialWaitMinutes: 56, status: 'Aguardando' },
  { id: 'p08', name: 'Rafael Exemplo', initials: 'RE', reason: 'Dor no ombro', priority: 'Verde', initialWaitMinutes: 41, status: 'Aguardando' },
  { id: 'p09', name: 'Carlos Modelo', initials: 'CM', reason: 'Retorno', priority: 'Azul', initialWaitMinutes: 53, status: 'Aguardando' },
]

export const demoPatients = samplePatients.map(({ initialWaitMinutes, ...patient }) => {
  const arrivedAt = new Date(Date.now() - initialWaitMinutes * 60_000).toISOString()
  const waitingMinutesAtStart = patient.status === 'Em atendimento' ? initialWaitMinutes : undefined
  return { ...patient, arrivedAt, time: formatClock(arrivedAt), ...(waitingMinutesAtStart === undefined ? {} : { waitingMinutesAtStart }) }
})
