import React, { useEffect, useMemo, useState } from 'react'
import { saveAs } from 'file-saver'
import { FORMS, makeInitialState } from './data/formsConfig.js'
import FormField from './components/FormField.jsx'
import AttachmentsList from './components/AttachmentsList.jsx'
import DocumentPreview from './components/DocumentPreview.jsx'
import { getValue, setValue, getConsent, setConsent, applicantDisplayName, computeProgress } from './utils/state.js'
import { buildDocxBlob, docFileName } from './docx/buildDocx.js'

const STORAGE_KEY = 'arnaulyaktar-form-state-v1'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    /* игнор: жеке шолғышта сақтау мүмкін болмауы мүмкін */
  }
  return makeInitialState()
}

export default function App() {
  const [state, setState] = useState(loadState)
  const [activeId, setActiveId] = useState(FORMS[0].id)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      /* игнор */
    }
  }, [state])

  const activeForm = useMemo(() => FORMS.find((f) => f.id === activeId), [activeId])
  const progress = useMemo(() => computeProgress(state), [state])
  const name = applicantDisplayName(state)

  const updateField = (formId, key, value) => setState((s) => setValue(s, formId, key, value))
  const updateConsent = (formId, key, value) => setState((s) => setConsent(s, formId, key, value))
  const updateAttachments = (items) => setState((s) => ({ ...s, attachments: items }))

  const handleWord = async () => {
    setBusy(true)
    try {
      const blob = await buildDocxBlob(activeForm, state)
      saveAs(blob, docFileName(activeForm, state))
    } finally {
      setBusy(false)
    }
  }

  const handlePrint = () => window.print()

  const handleClear = () => {
    if (!window.confirm('Барлық енгізілген деректерді тазалау керек пе?')) return
    setState(makeInitialState())
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-top">
          <div className="app-icon">📋</div>
          <div>
            <h1 className="app-title">Арнаулы әлеуметтік қызметтер алуға рәсімделетін құжаттар нысандары</h1>
            <p className="app-subtitle">Өтініштер мен медициналық карталар · 4 нысан</p>
          </div>
        </div>
        <div className="app-header-badges">
          <span className="pill">
            Алушы: <strong>{name || 'аты-жөні енгізілмеген'}</strong>
          </span>
          <span className="pill">
            Толтырылды: <strong>{progress}%</strong>
          </span>
        </div>
        <nav className="tabs" aria-label="Нысандар">
          {FORMS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`tab ${f.id === activeId ? 'tab-active' : ''}`}
              onClick={() => setActiveId(f.id)}
            >
              <span className="tab-num">{f.tabNumber}</span>
              {f.tabLabel}
            </button>
          ))}
        </nav>
      </header>

      <div className="app-body">
        <main className="form-column">
          <section className="card card-intro">
            <div className="doc-annex-tag">{activeForm.annex}</div>
            <h2 className="form-title">{activeForm.title}</h2>
            <p className="form-intro">{activeForm.intro}</p>
          </section>

          {activeForm.sections.map((section, idx) => (
            <section className="card" key={idx}>
              <h3 className="section-heading">{section.heading}</h3>
              {section.note ? <p className="section-note">{section.note}</p> : null}
              <div className="field-grid">
                {section.fields.map((field) => (
                  <FormField
                    key={field.key}
                    field={field}
                    value={getValue(state, activeForm.id, field.key)}
                    onChange={(val) => updateField(activeForm.id, field.key, val)}
                  />
                ))}
              </div>
            </section>
          ))}

          {activeForm.attachments ? (
            <section className="card">
              <AttachmentsList items={state.attachments} onChange={updateAttachments} />
            </section>
          ) : null}

          {activeForm.consents ? (
            <section className="card">
              <h3 className="section-heading">Келісімдер</h3>
              {activeForm.consents.map((cn) => (
                <label className="consent-row" key={cn.key}>
                  <input
                    type="checkbox"
                    checked={getConsent(state, activeForm.id, cn.key)}
                    onChange={(e) => updateConsent(activeForm.id, cn.key, e.target.checked)}
                  />
                  <span>{cn.text}</span>
                </label>
              ))}
            </section>
          ) : null}

          {activeForm.signature ? (
            <section className="card">
              <h3 className="section-heading">Қол қою</h3>
              <div className="field-grid">
                {activeForm.signature.map((field) => (
                  <FormField
                    key={field.key}
                    field={field}
                    value={getValue(state, activeForm.id, field.key)}
                    onChange={(val) => updateField(activeForm.id, field.key, val)}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <p className="privacy-note">Енгізілген деректер тек осы браузерде қалады — серверге жіберілмейді.</p>
        </main>

        <aside className="preview-column">
          <DocumentPreview form={activeForm} state={state} />
        </aside>
      </div>

      <footer className="action-bar">
        <button type="button" className="btn-primary" onClick={handleWord} disabled={busy}>
          {busy ? 'Дайындалуда…' : '⬇ Word'}
        </button>
        <button type="button" className="btn-secondary" onClick={handlePrint}>
          🖶 Басып шығару
        </button>
        <button type="button" className="btn-danger" onClick={handleClear}>
          🗑 Тазалау
        </button>
      </footer>
    </div>
  )
}
