import { FORMS } from '../data/formsConfig.js'

const fieldMap = {}
FORMS.forEach((f) => {
  const all = [...(f.sections || []).flatMap((s) => s.fields), ...(f.signature || [])]
  all.forEach((field) => {
    fieldMap[`${f.id}.${field.key}`] = field
  })
})

export function isSharedField(formId, key) {
  const field = fieldMap[`${formId}.${key}`]
  return !!(field && field.shared)
}

export function getValue(state, formId, key) {
  return isSharedField(formId, key) ? state.shared[key] ?? '' : state.perForm[formId]?.[key] ?? ''
}

export function setValue(state, formId, key, value) {
  if (isSharedField(formId, key)) {
    return { ...state, shared: { ...state.shared, [key]: value } }
  }
  return {
    ...state,
    perForm: { ...state.perForm, [formId]: { ...state.perForm[formId], [key]: value } },
  }
}

export function getConsent(state, formId, key) {
  return !!state.perForm[formId]?.[key]
}

export function setConsent(state, formId, key, value) {
  return {
    ...state,
    perForm: { ...state.perForm, [formId]: { ...state.perForm[formId], [key]: value } },
  }
}

export function applicantDisplayName(state) {
  return state.shared.applicantName?.trim() || ''
}

export function computeProgress(state) {
  let total = 0
  let filled = 0
  FORMS.forEach((f) => {
    const all = [...(f.sections || []).flatMap((s) => s.fields), ...(f.signature || [])]
    all.forEach((field) => {
      total += 1
      const v = getValue(state, f.id, field.key)
      if (v && String(v).trim()) filled += 1
    })
  })
  if (total === 0) return 0
  return Math.round((filled / total) * 100)
}
