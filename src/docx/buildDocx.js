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

function p(text, opts = {}) {
  return new Paragraph({
    alignment: opts.align || AlignmentType.LEFT,
    spacing: { after: opts.after ?? 120 },
    children: [
      new TextRun({
        text: text || '',
        bold: !!opts.bold,
        italics: !!opts.italics,
        size: opts.size || 24,
        font: FONT,
      }),
    ],
  })
}

function heading(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200, before: 100 },
    children: [new TextRun({ text, bold: true, size: 26, font: FONT })],
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

function applicationDoc(form, state, salutationExtra) {
  const v = (key) => getValue(state, form.id, key)
  const c = (key) => getConsent(state, form.id, key)
  const children = [
    p(form.annex, { align: AlignmentType.RIGHT, after: 60 }),
    p(`${v('orgName') || '________________'} ${v('orgHeadName') ? `басшысы ${v('orgHeadName')}-ға` : 'басшысы ________________-ға'}`, {
      align: AlignmentType.RIGHT,
      after: 40,
    }),
    p(`БСН ${v('bin') || '____________'}`, { align: AlignmentType.RIGHT, after: 40 }),
    p(`кімнен: ${v('applicantName') || '____________________'}`, { align: AlignmentType.RIGHT, after: 40 }),
    p(`туған күні: ${toDDMMYYYY(v('birthDate')) || '__.__.____'}`, { align: AlignmentType.RIGHT, after: 40 }),
    p(`мекенжайы: ${v('address') || '____________________'}`, { align: AlignmentType.RIGHT, after: 40 }),
  ]
  if (salutationExtra) children.push(p(salutationExtra(v), { align: AlignmentType.RIGHT, after: 40 }))
  children.push(heading('ӨТІНІШ'))

  if (form.docBody === 'application-semi') {
    children.push(p('Мені жартылай стационарлық жағдайда арнаулы әлеуметтік қызметтер көрсетуге қабылдауыңызды сұраймын.'))
    children.push(p('Қоса берілетін құжаттар:', { after: 60 }))
    const attachments = (state.attachments || []).filter((a) => a.name.trim())
    if (attachments.length) {
      attachments.forEach((a, i) => children.push(p(`${i + 1}. ${a.name}`, { after: 40 })))
    } else {
      children.push(p('— тізім бос —', { italics: true, after: 40 }))
    }
  } else {
    children.push(p('Маған үйде әлеуметтік қызмет көрсетуді ұйымдастыруыңызды сұраймын.'))
    children.push(p(`Мүгедектік санаты: ${v('disabilityCategory') || '—'}`))
    children.push(p(`Отбасы мүшелері: ${v('familyMembers') || '—'}`))
  }

  form.consents.forEach((cn) => {
    children.push(p(`[${c(cn.key) ? 'x' : ' '}] ${cn.text}`))
  })

  children.push(p(toKzLongDate(v('signDate')), { after: 200 }))
  children.push(p('_______________ (өтініш иесінің қолы)', { after: 200 }))
  children.push(p('Өтінішті қабылдаған адам:', { after: 40 }))
  children.push(p(v('acceptedBy') || '____________________'))
  children.push(p('(Т.А.Ә., лауазымы, қолы)', { italics: true }))

  return children
}

function medcardSemiDoc(form, state) {
  const v = (key) => getValue(state, form.id, key)
  return [
    p(form.annex, { align: AlignmentType.RIGHT, after: 60 }),
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
    p('_______________ (қолы)          _______________ (Т.А.Ә.)', { after: 100 }),
    p('М.О.', { italics: true }),
  ]
}

function medcardHomeDoc(form, state) {
  const v = (key) => getValue(state, form.id, key)
  return [
    p(form.annex, { align: AlignmentType.RIGHT, after: 60 }),
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
    p('_______________ (қолы)          _______________ (Т.А.Ә.)', { after: 100 }),
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
  return `${form.annex.replace(/\s/g, '')}_${form.docBody}_${name}.docx`
}
