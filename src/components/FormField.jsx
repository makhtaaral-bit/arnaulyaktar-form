import React from 'react'

export default function FormField({ field, value, onChange }) {
  const { label, type, shared, required, placeholder } = field

  return (
    <label className="field">
      <span className="field-label">
        {label}
        {required ? <span className="field-required"> *</span> : null}
        {shared ? <span className="badge-shared">ортақ</span> : null}
      </span>
      {type === 'textarea' ? (
        <textarea
          className="field-input"
          rows={3}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="field-input"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  )
}
