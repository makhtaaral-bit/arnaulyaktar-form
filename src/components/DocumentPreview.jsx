import React from 'react'
import { getValue, getConsent } from '../utils/state.js'
import { toDDMMYYYY, toKzLongDate } from '../utils/date.js'

function Line({ label, value }) {
  return (
    <p className="doc-line">
      <span className="doc-line-label">{label}</span> {value || '____________________'}
    </p>
  )
}

function ConsentLine({ checked, text }) {
  return (
    <p className="doc-line">
      [{checked ? 'x' : ' '}] {text}
    </p>
  )
}

function ResultsTable({ rows }) {
  return (
    <table className="doc-table">
      <thead>
        <tr>
          <th>Атауы</th>
          <th>Нәтижесі / қорытындысы</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([label, value]) => (
          <tr key={label}>
            <td>{label}</td>
            <td>{value || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function DocumentPreview({ form, state }) {
  const v = (key) => getValue(state, form.id, key)
  const c = (key) => getConsent(state, form.id, key)

  return (
    <div className="doc-preview">
      <div className="doc-preview-head">
        <span>Құжат көрінісі</span>
        <span className="doc-preview-sub">A4 · Word пішімі</span>
      </div>
      <div className="doc-page">
        <div className="doc-annex">{form.annex}</div>

        {form.docBody === 'application-semi' && (
          <>
            <div className="doc-header-table">
              <p>{v('orgName') || '________________'} {v('orgHeadName') ? `басшысы ${v('orgHeadName')}-ға` : 'басшысы ________________-ға'}</p>
              <p>БСН {v('bin') || '____________'}</p>
              <p>кімнен: {v('applicantName') || '____________________'}</p>
              <p>туған күні: {toDDMMYYYY(v('birthDate')) || '__.__.____'}</p>
              <p>мекенжайы: {v('address') || '____________________'}</p>
            </div>
            <h3 className="doc-h1">ӨТІНІШ</h3>
            <p className="doc-line">
              Мені жартылай стационарлық жағдайда арнаулы әлеуметтік қызметтер көрсетуге қабылдауыңызды сұраймын.
            </p>
            <p className="doc-line" style={{ marginTop: 10 }}>Қоса берілетін құжаттар:</p>
            {(state.attachments || []).filter((a) => a.name.trim()).length ? (
              <ol className="doc-attach-list">
                {state.attachments.filter((a) => a.name.trim()).map((a) => (
                  <li key={a.id}>{a.name}</li>
                ))}
              </ol>
            ) : (
              <p className="doc-line doc-muted">— тізім бос —</p>
            )}
            {form.consents.map((cn) => (
              <ConsentLine key={cn.key} checked={c(cn.key)} text={cn.text} />
            ))}
            <p className="doc-line" style={{ marginTop: 14 }}>{toKzLongDate(v('signDate'))}</p>
            <p className="doc-sig-line">_______________<br /><span className="doc-muted">(өтініш иесінің қолы)</span></p>
            <p className="doc-line" style={{ marginTop: 10 }}>Өтінішті қабылдаған адам:</p>
            <p className="doc-line">{v('acceptedBy') || '____________________'}</p>
            <p className="doc-muted">(Т.А.Ә., лауазымы, қолы)</p>
          </>
        )}

        {form.docBody === 'application-home' && (
          <>
            <div className="doc-header-table">
              <p>{v('orgName') || '________________'} {v('orgHeadName') ? `басшысы ${v('orgHeadName')}-ға` : 'басшысы / әкімге ________________'}</p>
              <p>БСН {v('bin') || '____________'}</p>
              <p>кімнен: {v('applicantName') || '____________________'}</p>
              <p>туған күні: {toDDMMYYYY(v('birthDate')) || '__.__.____'}</p>
              <p>мекенжайы: {v('address') || '____________________'}</p>
              <p>телефон: {v('phone') || '____________'}</p>
            </div>
            <h3 className="doc-h1">ӨТІНІШ</h3>
            <p className="doc-line">Маған үйде әлеуметтік қызмет көрсетуді ұйымдастыруыңызды сұраймын.</p>
            <Line label="Мүгедектік санаты:" value={v('disabilityCategory')} />
            <Line label="Отбасы мүшелері:" value={v('familyMembers')} />
            {form.consents.map((cn) => (
              <ConsentLine key={cn.key} checked={c(cn.key)} text={cn.text} />
            ))}
            <p className="doc-line" style={{ marginTop: 14 }}>{toKzLongDate(v('signDate'))}</p>
            <p className="doc-sig-line">_______________<br /><span className="doc-muted">(өтініш иесінің қолы)</span></p>
            <p className="doc-line" style={{ marginTop: 10 }}>Өтінішті қабылдаған адам:</p>
            <p className="doc-line">{v('acceptedBy') || '____________________'}</p>
            <p className="doc-muted">(Т.А.Ә., лауазымы, қолы)</p>
          </>
        )}

        {form.docBody === 'medcard-semi' && (
          <>
            <h3 className="doc-h1">{form.title}</h3>
            <Line label="Медициналық ұйымның атауы:" value={v('medOrgName')} />
            <Line label="Пациенттің Т.А.Ә.:" value={v('applicantName')} />
            <Line label="Туған күні:" value={toDDMMYYYY(v('birthDate'))} />
            <Line label="Мекенжайы:" value={v('address')} />
            <Line label="Қысқаша анамнез:" value={v('anamnesisSemi')} />
            <p className="doc-line" style={{ marginTop: 10 }}>Мамандар тексеруі:</p>
            <ResultsTable
              rows={[
                ['Невропатолог', v('specNeurologist')],
                ['Психиатр', v('specPsychiatrist')],
                ['Дерматовенеролог', v('specDermatologist')],
                ['Фтизиатр', v('specPhthisiatrist')],
                ['Терапевт / педиатр', v('specTherapist')],
                ['Эпидемиологиялық орта бойынша қорытынды', v('specEpidemiology')],
              ]}
            />
            <p className="doc-line" style={{ marginTop: 10 }}>Зертханалық зерттеулер:</p>
            <ResultsTable
              rows={[
                ['Қанның жалпы анализі', v('labBlood')],
                ['АИТВ (ВИЧ)', v('labHiv')],
                ['Сифилис', v('labSyphilis')],
                ['Зәрдің жалпы анализі', v('labUrine')],
              ]}
            />
            <Line label="ДҚК (ВКК) төрағасының қорытындысы:" value={v('vkkConclusion')} />
            <Line label="Толтырылған күні:" value={toDDMMYYYY(v('signDate'))} />
            <table className="doc-table" style={{ marginTop: 10 }}>
              <tbody>
                <tr>
                  <td>Ұйым басшысы:</td>
                  <td>{v('orgHeadName') || '____________________'}</td>
                </tr>
                <tr>
                  <td>_______________<br /><span className="doc-muted">(қолы)</span></td>
                  <td>_______________<br /><span className="doc-muted">(Т.А.Ә.)</span></td>
                </tr>
              </tbody>
            </table>
            <p className="doc-muted" style={{ marginTop: 6 }}>М.О.</p>
          </>
        )}

        {form.docBody === 'medcard-home' && (
          <>
            <h3 className="doc-h1">{form.title}</h3>
            <Line label="Медициналық ұйымның атауы:" value={v('medOrgName')} />
            <Line label="Пациенттің Т.А.Ә.:" value={v('applicantName')} />
            <Line label="Туған күні:" value={toDDMMYYYY(v('birthDate'))} />
            <Line label="Қысқаша анамнез:" value={v('anamnesisHome')} />
            <p className="doc-line" style={{ marginTop: 10 }}>Зертханалық нәтижелер:</p>
            <ResultsTable
              rows={[
                ['Қан анализі', v('labBloodHome')],
                ['Зәр анализі', v('labUrineHome')],
                ['Бактериология', v('labBacteriology')],
              ]}
            />
            <Line label="ДҚК қорытындысы:" value={v('vkkConclusionHome')} />
            <Line label="Күні:" value={toDDMMYYYY(v('signDate'))} />
            <table className="doc-table" style={{ marginTop: 10 }}>
              <tbody>
                <tr>
                  <td>Басшысы:</td>
                  <td>{v('orgHeadName') || '____________________'}</td>
                </tr>
                <tr>
                  <td>_______________<br /><span className="doc-muted">(қолы)</span></td>
                  <td>_______________<br /><span className="doc-muted">(Т.А.Ә.)</span></td>
                </tr>
              </tbody>
            </table>
            <p className="doc-muted" style={{ marginTop: 6 }}>М.О.</p>
          </>
        )}
      </div>
    </div>
  )
}
