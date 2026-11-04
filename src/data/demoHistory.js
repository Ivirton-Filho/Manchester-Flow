const sampleHistory = [
  { id: 'h01', name: 'Paula Modelo', initials: 'PM', reason: 'Tontura', priority: 'Amarelo', date: '2026-11-04', arrival: '08:12', triageTime: '08:19', completedAt: '09:04', wait: '52 min', symptoms: 'Tontura, mal-estar', vitals: { temperature: '36,7 °C', heartRate: '82 bpm', respiratoryRate: '17 irpm', bloodPressure: '118/76 mmHg', oxygen: '98%', pain: '2/10' } },
  { id: 'h02', name: 'Bruno Exemplo', initials: 'BE', reason: 'Dor no ombro', priority: 'Verde', date: '2026-11-04', arrival: '07:48', triageTime: '07:55', completedAt: '08:37', wait: '42 min', symptoms: 'Dor no ombro', vitals: { temperature: '36,5 °C', heartRate: '76 bpm', respiratoryRate: '16 irpm', bloodPressure: '120/78 mmHg', oxygen: '99%', pain: '3/10' } },
  { id: 'h03', name: 'Lívia Demonstração', initials: 'LD', reason: 'Dor de cabeça', priority: 'Amarelo', date: '2026-11-03', arrival: '15:22', triageTime: '15:30', completedAt: '16:18', wait: '48 min', symptoms: 'Dor de cabeça', vitals: { temperature: '36,8 °C', heartRate: '80 bpm', respiratoryRate: '18 irpm', bloodPressure: '122/80 mmHg', oxygen: '98%', pain: '4/10' } },
  { id: 'h04', name: 'Caio Ilustrativo', initials: 'CI', reason: 'Tosse', priority: 'Azul', date: '2026-11-03', arrival: '14:41', triageTime: '14:50', completedAt: '15:35', wait: '45 min', symptoms: 'Tosse leve', vitals: { temperature: '36,6 °C', heartRate: '72 bpm', respiratoryRate: '16 irpm', bloodPressure: '116/74 mmHg', oxygen: '99%', pain: '1/10' } },
  { id: 'h05', name: 'Rita Fictícia', initials: 'RF', reason: 'Náusea', priority: 'Laranja', date: '2026-11-03', arrival: '13:06', triageTime: '13:10', completedAt: '14:02', wait: '52 min', symptoms: 'Náusea, mal-estar', vitals: { temperature: '36,9 °C', heartRate: '88 bpm', respiratoryRate: '18 irpm', bloodPressure: '124/82 mmHg', oxygen: '98%', pain: '3/10' } },
  { id: 'h06', name: 'Davi Teste', initials: 'DT', reason: 'Febre', priority: 'Amarelo', date: '2026-11-02', arrival: '11:34', triageTime: '11:43', completedAt: '12:32', wait: '49 min', symptoms: 'Febre, mal-estar', vitals: { temperature: '38,0 °C', heartRate: '92 bpm', respiratoryRate: '19 irpm', bloodPressure: '118/78 mmHg', oxygen: '97%', pain: '2/10' } },
  { id: 'h07', name: 'Nina Exemplo', initials: 'NE', reason: 'Dor abdominal', priority: 'Verde', date: '2026-11-02', arrival: '10:18', triageTime: '10:27', completedAt: '11:21', wait: '54 min', symptoms: 'Desconforto abdominal', vitals: { temperature: '36,7 °C', heartRate: '78 bpm', respiratoryRate: '17 irpm', bloodPressure: '116/76 mmHg', oxygen: '99%', pain: '3/10' } },
  { id: 'h08', name: 'Enzo Modelo', initials: 'EM', reason: 'Dor no peito', priority: 'Laranja', date: '2026-11-01', arrival: '18:02', triageTime: '18:05', completedAt: '18:58', wait: '53 min', symptoms: 'Desconforto no peito', vitals: { temperature: '36,5 °C', heartRate: '86 bpm', respiratoryRate: '18 irpm', bloodPressure: '126/80 mmHg', oxygen: '98%', pain: '3/10' } },
  { id: 'h09', name: 'Bia Demonstração', initials: 'BD', reason: 'Mal-estar', priority: 'Azul', date: '2026-10-31', arrival: '09:15', triageTime: '09:24', completedAt: '10:10', wait: '46 min', symptoms: 'Mal-estar', vitals: { temperature: '36,6 °C', heartRate: '74 bpm', respiratoryRate: '16 irpm', bloodPressure: '114/72 mmHg', oxygen: '99%', pain: '0/10' } },
  { id: 'h10', name: 'Ivo Ilustrativo', initials: 'II', reason: 'Tontura', priority: 'Amarelo', date: '2026-10-30', arrival: '16:41', triageTime: '16:49', completedAt: '17:42', wait: '53 min', symptoms: 'Tontura', vitals: { temperature: '36,8 °C', heartRate: '84 bpm', respiratoryRate: '17 irpm', bloodPressure: '120/80 mmHg', oxygen: '98%', pain: '1/10' } },
  { id: 'h11', name: 'Lara Fictícia', initials: 'LF', reason: 'Tosse', priority: 'Verde', date: '2026-10-29', arrival: '12:07', triageTime: '12:16', completedAt: '13:09', wait: '53 min', symptoms: 'Tosse, irritação na garganta', vitals: { temperature: '36,9 °C', heartRate: '79 bpm', respiratoryRate: '18 irpm', bloodPressure: '118/76 mmHg', oxygen: '98%', pain: '1/10' } },
  { id: 'h12', name: 'Theo Teste', initials: 'TT', reason: 'Dor de cabeça', priority: 'Azul', date: '2026-10-28', arrival: '08:52', triageTime: '09:00', completedAt: '09:48', wait: '48 min', symptoms: 'Dor de cabeça leve', vitals: { temperature: '36,4 °C', heartRate: '72 bpm', respiratoryRate: '16 irpm', bloodPressure: '116/74 mmHg', oxygen: '99%', pain: '2/10' } },
]

function toTimestamp(date, time) {
  return new Date(`${date}T${time}:00`).toISOString()
}

export const demoHistory = sampleHistory.map(record => ({
  ...record,
  arrivedAt: toTimestamp(record.date, record.arrival),
  triagedAt: toTimestamp(record.date, record.triageTime),
}))
