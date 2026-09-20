import React from 'react'

const MAX_ITEMS = 10

export default function AttachmentsList({ items, onChange }) {
  const setName = (id, name) => {
    onChange(items.map((it) => (it.id === id ? { ...it, name } : it)))
  }
  const removeRow = (id) => {
    onChange(items.filter((it) => it.id !== id))
  }
  const addRow = () => {
    if (items.length >= MAX_ITEMS) return
    const nextId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1
    onChange([...items, { id: nextId, name: '' }])
  }

  return (
    <div className="attachments">
      <div className="section-heading">Қоса берілетін құжаттар</div>
      <div className="section-note">10 данаға дейін. Қажет болса жол қосыңыз.</div>
      <div className="field-label" style={{ marginTop: 8 }}>
        Құжаттар тізімі
      </div>
      <ol className="attachments-list">
        {items.map((it, idx) => (
          <li key={it.id} className="attachments-row">
            <input
              className="field-input"
              placeholder="Құжаттың атауы"
              value={it.name}
              onChange={(e) => setName(it.id, e.target.value)}
            />
            <button type="button" className="btn-icon" onClick={() => removeRow(it.id)} aria-label="Жолды жою">
              ✕
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className="btn-secondary" onClick={addRow} disabled={items.length >= MAX_ITEMS}>
        + Жол қосу
      </button>
    </div>
  )
}
