const KZ_MONTHS = [
  'қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым',
  'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан',
]

export function toDDMMYYYY(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  if (!y || !m || !d) return iso
  return `${d}.${m}.${y}`
}

export function toKzLongDate(iso) {
  if (!iso) return '«__» ______________ 20__ ж.'
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return `«${String(d).padStart(2, '0')}» ${KZ_MONTHS[m - 1]} ${y} ж.`
}
