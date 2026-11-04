import { useState } from 'react'
import Icon from '../components/Icon.jsx'
import { formatClock } from '../utils/patientTime.js'
import { playUiSound } from '../utils/uiSound.js'

const steps = ['Dados iniciais', 'Sintomas', 'Sinais vitais', 'Prioridade']
const symptomOptions = ['Dor', 'Febre', 'Tosse', 'Falta de ar', 'Tontura', 'Náusea', 'Mal-estar', 'Outro']
const priorities = [
  { name: 'Vermelho', description: 'Emergência', target: 'Imediato', icon: '✦', key: 'vermelho' },
  { name: 'Laranja', description: 'Muito urgente', target: 'Até 10 min', icon: '▲', key: 'laranja' },
  { name: 'Amarelo', description: 'Urgente', target: 'Até 60 min', icon: '●', key: 'amarelo' },
  { name: 'Verde', description: 'Pouco urgente', target: 'Até 120 min', icon: '◆', key: 'verde' },
  { name: 'Azul', description: 'Não urgente', target: 'Até 240 min', icon: '●', key: 'azul' },
]

const emptyForm = () => ({
  name: '', reason: '', symptoms: '', selectedSymptoms: [],
  temperature: '', heartRate: '', respiratoryRate: '', bloodPressure: '', oxygen: '', pain: '', priority: '',
})

function Stepper({ current }) {
  return <div className="triage-stepper" aria-label={`Etapa ${current + 1} de 4: ${steps[current]}`}>
    {steps.map((step, index) => <div key={step} className={`stepper-item ${index === current ? 'current' : ''} ${index < current ? 'completed' : ''}`}>
      <span className="stepper-number">{index < current ? <Icon name="check" size={15}/> : index + 1}</span>
      <span className="stepper-label">{step}</span>
      {index < steps.length - 1 && <span className="stepper-connector"/>}
    </div>)}
  </div>
}

function Field({ label, name, value, onChange, error, placeholder, type = 'text', unit, required = true, ...props }) {
  const errorId = `${name}-error`
  return <label className={`triage-field ${error ? 'has-error' : ''}`}>
    <span className="triage-field-label">{label}{required && <i aria-hidden="true">*</i>}</span>
    <span className="triage-input-wrap"><input name={name} type={type} value={value} onChange={event => onChange(name, event.target.value)} placeholder={placeholder} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} {...props}/>{unit && <span className="field-unit">{unit}</span>}</span>
    {error && <small id={errorId} className="field-error"><Icon name="alert" size={13}/>{error}</small>}
  </label>
}

export default function NewTriagePage({ onSave, onNavigate }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [showSummary, setShowSummary] = useState(false)
  const [arrivalAt] = useState(() => new Date().toISOString())
  const arrivalTime = formatClock(arrivalAt)

  function updateField(name, value) {
    setForm(current => ({ ...current, [name]: value }))
    setErrors(current => ({ ...current, [name]: '' }))
  }

  function toggleSymptom(symptom) {
    setForm(current => ({ ...current, selectedSymptoms: current.selectedSymptoms.includes(symptom) ? current.selectedSymptoms.filter(item => item !== symptom) : [...current.selectedSymptoms, symptom] }))
    setErrors(current => ({ ...current, symptoms: '' }))
  }

  function validateStep() {
    const nextErrors = {}
    if (step === 0) {
      if (!form.name.trim()) nextErrors.name = 'Informe o nome fictício ou identificador do paciente.'
      if (!form.reason.trim()) nextErrors.reason = 'Descreva o motivo da procura.'
    }
    if (step === 1 && !form.symptoms.trim() && form.selectedSymptoms.length === 0) nextErrors.symptoms = 'Selecione ao menos um sintoma ou descreva o relato.'
    if (step === 2) {
      if (!form.temperature.trim()) nextErrors.temperature = 'Informe a temperatura.'
      if (!form.heartRate.trim()) nextErrors.heartRate = 'Informe a frequência cardíaca.'
      if (!form.respiratoryRate.trim()) nextErrors.respiratoryRate = 'Informe a frequência respiratória.'
      if (!form.bloodPressure.trim()) nextErrors.bloodPressure = 'Informe a pressão arterial.'
      if (!form.oxygen.trim()) nextErrors.oxygen = 'Informe a saturação de oxigênio.'
      if (!form.pain.trim()) nextErrors.pain = 'Informe o nível de dor de 0 a 10.'
    }
    if (step === 3 && !form.priority) nextErrors.priority = 'Selecione a prioridade definida pelo profissional.'
    setErrors(nextErrors)
    setShowSummary(Object.keys(nextErrors).length > 0)
    return Object.keys(nextErrors).length === 0
  }

  function continueStep() {
    if (!validateStep()) return
    playUiSound('step')
    setStep(current => Math.min(current + 1, steps.length - 1))
    setErrors({})
    setShowSummary(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goBack() {
    playUiSound('step')
    setStep(current => Math.max(current - 1, 0))
    setErrors({})
    setShowSummary(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function confirmTriage() {
    if (!validateStep()) return
    playUiSound('complete')
    onSave({
      id: `p-${Date.now()}`,
      name: form.name.trim(),
      initials: form.name.trim().split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase(),
      reason: form.reason.trim(),
      priority: form.priority,
      status: 'Aguardando',
      time: arrivalTime,
      arrivedAt: arrivalAt,
      triagedAt: new Date().toISOString(),
      symptoms: [...form.selectedSymptoms, form.symptoms.trim()].filter(Boolean).join(', '),
      vitals: { temperature: form.temperature, heartRate: form.heartRate, respiratoryRate: form.respiratoryRate, bloodPressure: form.bloodPressure, oxygen: form.oxygen, pain: form.pain },
    })
  }

  return <main className="dashboard triage-page">
    <section className="triage-page-heading"><div><div className="eyebrow"><span className="eyebrow-dot"/> REGISTRO DE ATENDIMENTO</div><h1>Nova triagem</h1><p>Registre as informações com atenção. A prioridade é definida por profissional habilitado.</p></div><span className="triage-arrival-chip"><Icon name="clock" size={16}/> Chegada <strong>{arrivalTime}</strong></span></section>
    <Stepper current={step}/>

    {showSummary && <div className="triage-error-summary" role="alert"><Icon name="alert" size={18}/><div><strong>Revise os campos destacados</strong><span>Há {Object.keys(errors).length} {Object.keys(errors).length === 1 ? 'campo obrigatório' : 'campos obrigatórios'} para preencher nesta etapa.</span></div></div>}

    <div className="triage-layout">
      <section className="triage-form-card" aria-labelledby="triage-step-title">
        <div className="triage-form-heading"><span>ETAPA {step + 1} DE 4</span><h2 id="triage-step-title">{steps[step]}</h2><p>{step === 0 ? 'Identifique a chegada e o motivo da procura.' : step === 1 ? 'Registre o que a pessoa relata, sem sugerir diagnóstico.' : step === 2 ? 'Registre os valores aferidos pelo profissional.' : 'Revise os dados e escolha a prioridade manualmente.'}</p></div>
        {step === 0 && <div className="triage-fields">
          <Field label="Nome fictício do paciente" name="name" value={form.name} onChange={updateField} error={errors.name} placeholder="Ex.: Paciente Teste 10" autoComplete="off"/>
          <Field label="Motivo da procura" name="reason" value={form.reason} onChange={updateField} error={errors.reason} placeholder="Descreva brevemente o motivo"/>
          <div className="auto-time-field"><span className="auto-time-icon"><Icon name="calendar" size={17}/></span><div><small>HORÁRIO DE CHEGADA</small><strong>{arrivalTime}</strong></div><span className="automatic-tag">AUTOMÁTICO</span></div>
        </div>}

        {step === 1 && <div className="triage-fields">
          <fieldset className="symptom-fieldset"><legend>Sintomas relatados <i>*</i></legend><p>Selecione uma ou mais opções ou descreva abaixo.</p><div className="symptom-chips">{symptomOptions.map(symptom => <button type="button" key={symptom} className={`symptom-chip ${form.selectedSymptoms.includes(symptom) ? 'selected' : ''}`} aria-pressed={form.selectedSymptoms.includes(symptom)} onClick={() => toggleSymptom(symptom)}>{form.selectedSymptoms.includes(symptom) && <Icon name="check" size={14} />}{symptom}</button>)}</div></fieldset>
          <label className={`triage-field ${errors.symptoms ? 'has-error' : ''}`}><span className="triage-field-label">Relato livre <small>(opcional se selecionou um sintoma)</small></span><textarea value={form.symptoms} onChange={event => updateField('symptoms', event.target.value)} placeholder="Registre com as palavras da pessoa, se necessário." rows={4} aria-invalid={Boolean(errors.symptoms)} aria-describedby={errors.symptoms ? 'symptoms-error' : undefined}/>{errors.symptoms && <small id="symptoms-error" className="field-error"><Icon name="alert" size={13}/>{errors.symptoms}</small>}</label>
        </div>}

        {step === 2 && <div className="triage-fields vitals-grid">
          <Field label="Temperatura" name="temperature" value={form.temperature} onChange={updateField} error={errors.temperature} placeholder="36,5" unit="°C" inputMode="decimal"/>
          <Field label="Frequência cardíaca" name="heartRate" value={form.heartRate} onChange={updateField} error={errors.heartRate} placeholder="72" unit="bpm" inputMode="numeric"/>
          <Field label="Frequência respiratória" name="respiratoryRate" value={form.respiratoryRate} onChange={updateField} error={errors.respiratoryRate} placeholder="16" unit="irpm" inputMode="numeric"/>
          <Field label="Pressão arterial" name="bloodPressure" value={form.bloodPressure} onChange={updateField} error={errors.bloodPressure} placeholder="120/80" unit="mmHg"/>
          <Field label="Saturação de oxigênio" name="oxygen" value={form.oxygen} onChange={updateField} error={errors.oxygen} placeholder="98" unit="%" inputMode="numeric"/>
          <Field label="Nível de dor" name="pain" value={form.pain} onChange={updateField} error={errors.pain} placeholder="0 a 10" unit="/ 10" inputMode="numeric"/>
          <p className="vitals-note"><Icon name="info" size={15}/> Valores informados pelo profissional. Este sistema não interpreta sinais vitais.</p>
        </div>}

        {step === 3 && <div className="triage-fields priority-step">
          <fieldset className="priority-fieldset"><legend>Prioridade do Protocolo de Manchester <i>*</i></legend><p>Seleção manual pelo profissional habilitado. Nenhuma prioridade é calculada pelo sistema.</p><div className="priority-choice-list">{priorities.map(priority => <label key={priority.name} className={`priority-choice ${form.priority === priority.name ? 'selected' : ''}`}>
            <input type="radio" name="priority" value={priority.name} checked={form.priority === priority.name} onChange={() => updateField('priority', priority.name)}/>
            <span className={`priority-choice-symbol priority-choice-${priority.key}`} aria-hidden="true">{priority.icon}</span><span className="priority-choice-copy"><strong>{priority.name} <small>· {priority.description}</small></strong><span>Tempo-alvo de referência: {priority.target}</span></span><span className="priority-choice-check"><Icon name="check" size={15}/></span>
          </label>)}</div></fieldset>
          {errors.priority && <small className="field-error"><Icon name="alert" size={13}/>{errors.priority}</small>}
          <div className="triage-review"><div className="triage-review-heading"><Icon name="check" size={17}/><strong>Revisão antes de confirmar</strong></div><div className="triage-review-grid"><div><small>PACIENTE</small><strong>{form.name || '—'}</strong></div><div><small>MOTIVO</small><strong>{form.reason || '—'}</strong></div><div><small>CHEGADA</small><strong>{arrivalTime}</strong></div><div><small>SINTOMAS</small><strong>{[...form.selectedSymptoms, form.symptoms].filter(Boolean).join(', ') || '—'}</strong></div><div><small>SINAIS VITAIS</small><strong>{form.temperature || '—'} °C · {form.heartRate || '—'} bpm · {form.bloodPressure || '—'} mmHg · SpO₂ {form.oxygen || '—'}%</strong></div></div></div>
          <div className="triage-reference-note"><Icon name="info" size={15}/><span>Tempos de referência do protocolo. Podem variar conforme a adoção local; siga as diretrizes da unidade. A decisão é sempre do profissional.</span></div>
        </div>}

        <div className="triage-form-actions">{step > 0 ? <button className="queue-secondary-button" onClick={goBack}><Icon name="arrow-left" size={16}/> Voltar</button> : <button className="triage-cancel-button" onClick={() => onNavigate('Painel')}>Cancelar</button>}{step < 3 ? <button className="primary-button" onClick={continueStep}>Continuar <Icon name="chevron" size={16}/></button> : <button className="primary-button" onClick={confirmTriage}><Icon name="check" size={16}/> Confirmar triagem</button>}</div>
      </section>
      <aside className="triage-side-info"><div className="triage-assist-card"><span className="assist-icon"><Icon name="heart" size={20}/></span><h3>A decisão é profissional</h3><p>O Manchester Flow organiza os registros e a fila. Não realiza diagnóstico e não escolhe a prioridade.</p></div><div className="triage-progress-card"><small>SEU PROGRESSO</small>{steps.map((label, index) => <div className={`progress-step ${index === step ? 'current' : ''} ${index < step ? 'done' : ''}`} key={label}><span>{index < step ? <Icon name="check" size={12}/> : index + 1}</span><strong>{label}</strong></div>)}</div></aside>
    </div>
    <footer className="disclaimer"><span className="disclaimer-mark">i</span><span>Sistema de apoio à organização da triagem. <strong>Não realiza diagnóstico nem substitui a decisão do profissional de saúde.</strong> Dados fictícios.</span><span className="footer-made">Feito com <b>♥</b> pela Abacaxi Tech</span></footer>
  </main>
}
