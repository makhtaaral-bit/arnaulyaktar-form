// Конфигурация 4 нысандарының өрістері.
// "shared: true" — мән барлық нысандарда бір рет енгізіліп, автоматты түрде көшіріледі ("ортақ").
// field.key — жалпы (shared) өрістер бір атаумен байланысады, форманың өз өрістері бірегей key алады.

export const FORMS = [
  {
    id: 'application-semi',
    tabLabel: 'Өтініш (жартылай стационар)',
    tabNumber: 1,
    annex: '1-қосымша',
    title: 'ӨТІНІШ (жартылай стационарлық жағдайда арнаулы әлеуметтік қызметтер көрсету)',
    intro:
      'Аты-жөні, туған күні, мекенжайы және телефоны бір рет енгізіледі — қалған нысандарға автоматты түрде көшіріледі.',
    sections: [
      {
        heading: 'Өтініш кімге беріледі',
        fields: [
          { key: 'orgHeadName', label: 'Бөлім басшысы (Т.А.Ә.)', type: 'text', shared: true, required: true },
          { key: 'orgName', label: 'Ұйымның (бөлімнің) атауы', type: 'text', shared: true },
          { key: 'bin', label: 'БСН', type: 'text', shared: true, placeholder: '12 сан' },
        ],
      },
      {
        heading: 'Өтініш иесі туралы мәліметтер',
        fields: [
          { key: 'applicantName', label: 'Өтініш иесінің Т.А.Ә.', type: 'text', shared: true, required: true },
          { key: 'birthDate', label: 'Туған күні', type: 'date', shared: true, required: true },
          { key: 'address', label: 'Мекенжайы', type: 'text', shared: true, required: true },
        ],
      },
    ],
    attachments: true,
    consents: [
      { key: 'consentData', text: 'Дербес деректерді жинауға және өңдеуге келісім беремін' },
      { key: 'consentTerms', text: 'Қабылдау және шығару шарттарымен таныстым' },
    ],
    signature: [
      { key: 'signDate', label: 'Берілген күні', type: 'date', shared: true, required: true },
      { key: 'acceptedBy', label: 'Қабылдаған тұлға (Т.А.Ә., лауазымы)', type: 'text', shared: true, required: true },
    ],
    docBody: 'application-semi',
  },
  {
    id: 'medcard-semi',
    tabLabel: 'Мед. карта (жартылай стационар)',
    tabNumber: 2,
    annex: '2-қосымша',
    title: 'МЕДИЦИНАЛЫҚ КАРТА (жартылай стационарлық жағдайда арнаулы әлеуметтік қызметтер көрсету үшін)',
    intro:
      'Аты-жөні, туған күні, мекенжайы және телефоны бір рет енгізіледі — қалған нысандарға автоматты түрде көшіріледі.',
    sections: [
      {
        heading: 'Жалпы мәліметтер',
        fields: [
          { key: 'medOrgName', label: 'Медициналық ұйымның атауы', type: 'text', shared: true, required: true },
          { key: 'applicantName', label: 'Пациенттің Т.А.Ә.', type: 'text', shared: true, required: true },
          { key: 'birthDate', label: 'Туған күні', type: 'date', shared: true, required: true },
          { key: 'address', label: 'Мекенжайы', type: 'text', shared: true, required: true },
          { key: 'anamnesisSemi', label: 'Қысқаша анамнез', type: 'textarea', placeholder: 'Аурудың басталуы, ағымы, бұрынғы емдеу нәтижелері' },
        ],
      },
      {
        heading: 'Мамандар тексеруі',
        note: 'Әр маманның қорытындысы құжаттағы кестеге түседі.',
        table: 'specialists',
        fields: [
          { key: 'specNeurologist', label: 'Невропатолог', type: 'text' },
          { key: 'specPsychiatrist', label: 'Психиатр', type: 'text' },
          { key: 'specDermatologist', label: 'Дерматовенеролог', type: 'text' },
          { key: 'specPhthisiatrist', label: 'Фтизиатр', type: 'text' },
          { key: 'specTherapist', label: 'Терапевт / педиатр', type: 'text' },
          { key: 'specEpidemiology', label: 'Эпидемиологиялық орта бойынша қорытынды', type: 'text' },
        ],
      },
      {
        heading: 'Зертханалық зерттеулер',
        table: 'labsSemi',
        fields: [
          { key: 'labBlood', label: 'Қанның жалпы анализі', type: 'text' },
          { key: 'labHiv', label: 'АИТВ (ВИЧ)', type: 'text' },
          { key: 'labSyphilis', label: 'Сифилис', type: 'text' },
          { key: 'labUrine', label: 'Зәрдің жалпы анализі', type: 'text' },
        ],
      },
      {
        heading: 'Қорытынды және қол қою',
        fields: [
          { key: 'vkkConclusion', label: 'ДҚК (ВКК) төрағасының қорытындысы', type: 'textarea' },
          { key: 'orgHeadName', label: 'Ұйым басшысының Т.А.Ә.', type: 'text', shared: true, required: true },
          { key: 'signDate', label: 'Толтырылған күні', type: 'date', shared: true, required: true },
        ],
      },
    ],
    docBody: 'medcard-semi',
  },
  {
    id: 'application-home',
    tabLabel: 'Өтініш (үйде қызмет)',
    tabNumber: 3,
    annex: '1-қосымша',
    title: 'ӨТІНІШ (үйде әлеуметтік қызмет көрсету)',
    intro:
      'Аты-жөні, туған күні, мекенжайы және телефоны бір рет енгізіледі — қалған нысандарға автоматты түрде көшіріледі.',
    sections: [
      {
        heading: 'Өтініш кімге беріледі',
        fields: [
          { key: 'orgHeadName', label: 'Басшыға / әкімге (Т.А.Ә.)', type: 'text', shared: true, required: true },
          { key: 'orgName', label: 'Ұйымның (бөлімнің) атауы', type: 'text', shared: true },
          { key: 'bin', label: 'БСН', type: 'text', shared: true, placeholder: '12 сан' },
        ],
      },
      {
        heading: 'Өтініш иесі туралы мәліметтер',
        fields: [
          { key: 'applicantName', label: 'Өтініш иесінің Т.А.Ә.', type: 'text', shared: true, required: true },
          { key: 'birthDate', label: 'Туған күні', type: 'date', shared: true, required: true },
          { key: 'phone', label: 'Телефон нөмірі', type: 'tel', shared: true },
          { key: 'address', label: 'Тұратын жері', type: 'text', shared: true, required: true },
          { key: 'disabilityCategory', label: 'Мүгедектік санаты', type: 'text', placeholder: 'Мысалы: бірінші топ, мерзімі 01.01.2027 дейін' },
          { key: 'familyMembers', label: 'Отбасы мүшелері', type: 'textarea', placeholder: 'Т.А.Ә., туыстық қатынасы, туған жылы' },
        ],
      },
    ],
    consents: [
      { key: 'consentData', text: 'Дербес деректерді жинауға және өңдеуге келісім беремін' },
      { key: 'consentDigital', text: 'Цифрлық жүйелердегі ақпаратты тексеруге келісім беремін' },
    ],
    signature: [
      { key: 'signDate', label: 'Күні', type: 'date', shared: true, required: true },
      { key: 'acceptedBy', label: 'Қабылдаған тұлға (Т.А.Ә., лауазымы)', type: 'text', shared: true, required: true },
    ],
    docBody: 'application-home',
  },
  {
    id: 'medcard-home',
    tabLabel: 'Мед. карта (үйде қызмет)',
    tabNumber: 4,
    annex: '2-қосымша',
    title: 'МЕДИЦИНАЛЫҚ КАРТА (үйде әлеуметтік қызмет көрсету үшін)',
    intro:
      'Аты-жөні, туған күні, мекенжайы және телефоны бір рет енгізіледі — қалған нысандарға автоматты түрде көшіріледі.',
    sections: [
      {
        heading: 'Жалпы мәліметтер',
        fields: [
          { key: 'medOrgName', label: 'Медициналық ұйымның атауы', type: 'text', shared: true, required: true },
          { key: 'applicantName', label: 'Пациенттің Т.А.Ә.', type: 'text', shared: true, required: true },
          { key: 'birthDate', label: 'Туған күні', type: 'date', shared: true, required: true },
          { key: 'anamnesisHome', label: 'Қысқаша анамнез', type: 'textarea' },
        ],
      },
      {
        heading: 'Зертханалық нәтижелер',
        table: 'labsHome',
        fields: [
          { key: 'labBloodHome', label: 'Қан анализі', type: 'text' },
          { key: 'labUrineHome', label: 'Зәр анализі', type: 'text' },
          { key: 'labBacteriology', label: 'Бактериология', type: 'text' },
        ],
      },
      {
        heading: 'Қорытынды және қол қою',
        fields: [
          { key: 'vkkConclusionHome', label: 'ДҚК қорытындысы', type: 'textarea' },
          { key: 'orgHeadName', label: 'Басшының Т.А.Ә.', type: 'text', shared: true, required: true },
          { key: 'signDate', label: 'Күні', type: 'date', shared: true, required: true },
        ],
      },
    ],
    docBody: 'medcard-home',
  },
]

export const SHARED_KEYS = (() => {
  const set = new Set()
  FORMS.forEach((f) => {
    ;[...(f.sections || []).flatMap((s) => s.fields), ...(f.signature || [])].forEach((field) => {
      if (field.shared) set.add(field.key)
    })
  })
  return Array.from(set)
})()

export const todayISO = () => new Date().toISOString().slice(0, 10)

export function makeInitialState() {
  const shared = {}
  SHARED_KEYS.forEach((k) => {
    shared[k] = k === 'signDate' ? todayISO() : ''
  })
  const perForm = {}
  FORMS.forEach((f) => {
    perForm[f.id] = {}
    ;(f.sections || []).flatMap((s) => s.fields).forEach((field) => {
      if (!field.shared) perForm[f.id][field.key] = ''
    })
    if (f.consents) f.consents.forEach((c) => (perForm[f.id][c.key] = false))
  })
  return {
    shared,
    perForm,
    attachments: [
      { id: 1, name: '' },
      { id: 2, name: '' },
      { id: 3, name: '' },
      { id: 4, name: '' },
    ],
  }
}
