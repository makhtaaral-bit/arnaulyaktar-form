import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  AlignmentType,
  WidthType,
  BorderStyle,
} from 'docx'
import { getValue, getConsent } from '../utils/state.js'
import { toDDMMYYYY, toKzLongDate } from '../utils/date.js'

const FONT = 'Times New Roman'
const FONT_SIZE = 28 // 14pt (docx sizes are in half-points)
const ABZAC_INDENT = 720 // ~1.27cm first-line paragraph indent
const HEADER_BLOCK_INDENT = 4700 // left indent (twips) that confines the "шапка" block to a narrow right column so long lines wrap

function p(text, opts = {}) {
  const paragraphOpts = {
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { after: opts.after ?? 120, before: opts.before ?? 0 },
    children: [
      new TextRun({
        text: text || '',
        bold: !!opts.bold,
        italics: !!opts.italics,
        size: opts.size || FONT_SIZE,
        font: FONT,
      }),
    ],
  }
  const indent = {}
  if (opts.firstLine) indent.firstLine = ABZAC_INDENT
  if (opts.left) indent.left = opts.left
  if (Object.keys(indent).length) paragraphOpts.indent = indent
  return new Paragraph(paragraphOpts)
}

function heading(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200, before: 420 }, // ~1.5 line gap above the heading
    children: [new TextRun({ text, bold: true, size: FONT_SIZE, font: FONT })],
  })
}

function cell(text, opts = {}) {
  return new TableCell({
    width: opts.width ? { size: opts.width, type: WidthType.PERCENTAGE } : undefined,
    children: [p(text, { after: 0, bold: opts.bold })],
    borders: opts.noBorder
      ? {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
        }
      : undefined,
  })
}

function resultsTable(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: [cell('Атауы', { bold: true, width: 60 }), cell('Нәтижесі / қорытындысы', { bold: true, width: 40 })] }),
      ...rows.map(([label, value]) => new TableRow({ children: [cell(label, { width: 60 }), cell(value || '—', { width: 40 })] })),
    ],
  })
}

function headerBlock(v, extraLine) {
  const lines = [
    `${v('orgName') || '________________'} басшысы ${v('orgHeadName') || '________________'}`,
    `БСН ${v('bin') || '____________'}`,
    `кімнен: ${v('applicantName') || '____________________'}`,
    `туған күні: ${toDDMMYYYY(v('birthDate')) || '__.__.____'}`,
    `мекенжайы: ${v('address') || '____________________'}`,
  ]
  if (extraLine) lines.push(extraLine(v))
  return lines.map((text) => p(text, { align: AlignmentType.RIGHT, after: 40, left: HEADER_BLOCK_INDENT }))
}

function applicationDoc(form, state, salutationExtra) {
  const v = (key) => getValue(state, form.id, key)
  const c = (key) => getConsent(state, form.id, key)
  const children = [...headerBlock(v, salutationExtra)]
  children.push(heading('ӨТІНІШ'))

  if (form.docBody === 'application-semi') {
    children.push(
      p('Мені жартылай стационарлық жағдайда арнаулы әлеуметтік қызметтер көрсетуге қабылдауыңызды сұраймын.', { firstLine: true })
    )
    children.push(p('Қоса берілетін құжаттар:', { after: 60, firstLine: true }))
    const attachments = (state.attachments || []).filter((a) => a.name.trim())
    if (attachments.length) {
      attachments.forEach((a, i) => children.push(p(`${i + 1}. ${a.name}`, { after: 40, firstLine: true })))
    } else {
      children.push(p('— тізім бос —', { italics: true, after: 40, firstLine: true }))
    }
  } else {
    children.push(p('Маған үйде әлеуметтік қызмет көрсетуді ұйымдастыруыңызды сұраймын.', { firstLine: true }))
    children.push(p(`Мүгедектік санаты: ${v('disabilityCategory') || '—'}`, { firstLine: true }))
    children.push(p(`Отбасы мүшелері: ${v('familyMembers') || '—'}`, { firstLine: true }))
  }

  form.consents.forEach((cn) => {
    children.push(p(`[${c(cn.key) ? 'x' : ' '}] ${cn.text}`, { firstLine: true }))
  })

  children.push(p(toKzLongDate(v('signDate')), { after: 200, firstLine: true }))
  children.push(p('_______________ (өтініш иесінің қолы)', { after: 200, align: AlignmentType.CENTER }))
  children.push(p('Өтінішті қабылдаған адам:', { after: 40 }))
  children.push(p(v('acceptedBy') || '____________________'))
  children.push(p('(Т.А.Ә., лауазымы, қолы)', { italics: true }))

  return children
}

function medcardSemiDoc(form, state) {
  const v = (key) => getValue(state, form.id, key)
  return [
    heading(form.title),
    p(`Медициналық ұйымның атауы: ${v('medOrgName') || '—'}`),
    p(`Пациенттің Т.А.Ә.: ${v('applicantName') || '—'}`),
    p(`Туған күні: ${toDDMMYYYY(v('birthDate')) || '—'}`),
    p(`Мекенжайы: ${v('address') || '—'}`),
    p(`Қысқаша анамнез: ${v('anamnesisSemi') || '—'}`, { after: 200 }),
    p('Мамандар тексеруі:', { bold: true, after: 60 }),
    resultsTable([
      ['Невропатолог', v('specNeurologist')],
      ['Психиатр', v('specPsychiatrist')],
      ['Дерматовенеролог', v('specDermatologist')],
      ['Фтизиатр', v('specPhthisiatrist')],
      ['Терапевт / педиатр', v('specTherapist')],
      ['Эпидемиологиялық орта бойынша қорытынды', v('specEpidemiology')],
    ]),
    p('', { after: 100 }),
    p('Зертханалық зерттеулер:', { bold: true, after: 60 }),
    resultsTable([
      ['Қанның жалпы анализі', v('labBlood')],
      ['АИТВ (ВИЧ)', v('labHiv')],
      ['Сифилис', v('labSyphilis')],
      ['Зәрдің жалпы анализі', v('labUrine')],
    ]),
    p('', { after: 100 }),
    p(`ДҚК (ВКК) төрағасының қорытындысы: ${v('vkkConclusion') || '—'}`),
    p(`Толтырылған күні: ${toDDMMYYYY(v('signDate')) || '—'}`, { after: 200 }),
    p(`Ұйым басшысы: ${v('orgHeadName') || '____________________'}`),
    p('_______________ (қолы)          _______________ (Т.А.Ә.)', { after: 100, align: AlignmentType.CENTER }),
    p('М.О.', { italics: true }),
  ]
}

function medcardHomeDoc(form, state) {
  const v = (key) => getValue(state, form.id, key)
  return [
    heading(form.title),
    p(`Медициналық ұйымның атауы: ${v('medOrgName') || '—'}`),
    p(`Пациенттің Т.А.Ә.: ${v('applicantName') || '—'}`),
    p(`Туған күні: ${toDDMMYYYY(v('birthDate')) || '—'}`),
    p(`Қысқаша анамнез: ${v('anamnesisHome') || '—'}`, { after: 200 }),
    p('Зертханалық нәтижелер:', { bold: true, after: 60 }),
    resultsTable([
      ['Қан анализі', v('labBloodHome')],
      ['Зәр анализі', v('labUrineHome')],
      ['Бактериология', v('labBacteriology')],
    ]),
    p('', { after: 100 }),
    p(`ДҚК қорытындысы: ${v('vkkConclusionHome') || '—'}`),
    p(`Күні: ${toDDMMYYYY(v('signDate')) || '—'}`, { after: 200 }),
    p(`Басшысы: ${v('orgHeadName') || '____________________'}`),
    p('_______________ (қолы)          _______________ (Т.А.Ә.)', { after: 100, align: AlignmentType.CENTER }),
    p('М.О.', { italics: true }),
  ]
}

export async function buildDocxBlob(form, state) {
  let children
  if (form.docBody === 'application-semi' || form.docBody === 'application-home') {
    children = applicationDoc(form, state, form.docBody === 'application-home' ? (v) => `телефон: ${v('phone') || '____________'}` : null)
  } else if (form.docBody === 'medcard-semi') {
    children = medcardSemiDoc(form, state)
  } else {
    children = medcardHomeDoc(form, state)
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 }, // A4 in twips
            margin: { top: 1134, bottom: 1134, left: 1701, right: 850 },
          },
        },
        children,
      },
    ],
  })

  return Packer.toBlob(doc)
}

export function docFileName(form, state) {
  const name = (getValue(state, form.id, 'applicantName') || 'nysan').trim().replace(/\s+/g, '_')
  return `${form.docBody}_${name}.docx`
}
