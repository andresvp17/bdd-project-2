import type { ReactNode } from 'react'

function Field({
  label,
  hint,
  wide = false,
  children,
}: {
  label: string
  hint?: string
  wide?: boolean
  children: ReactNode
}) {
  return (
    <label className={`field${wide ? ' field--wide' : ''}`}>
      <span className="field__label">{label}</span>
      {children}
      {hint != null && <span className="field__hint">{hint}</span>}
    </label>
  )
}

export function TextField({
  label,
  value,
  onChange,
  type = 'text',
  hint,
  wide,
  required,
  mono = false,
  placeholder,
  minLength,
  maxLength,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: 'text' | 'email' | 'tel' | 'date' | 'datetime-local' | 'url'
  hint?: string
  wide?: boolean
  required?: boolean
  mono?: boolean
  placeholder?: string
  minLength?: number
  maxLength?: number
}) {
  return (
    <Field label={label} hint={hint} wide={wide}>
      <input
        className={`field__input${mono ? ' field__input--mono' : ''}`}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        placeholder={placeholder}
        minLength={minLength}
        maxLength={maxLength}
      />
    </Field>
  )
}

export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  hint,
  wide,
  required,
  mono = true,
}: {
  label: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  hint?: string
  wide?: boolean
  required?: boolean
  mono?: boolean
}) {
  return (
    <Field label={label} hint={hint} wide={wide}>
      <input
        className={`field__input${mono ? ' field__input--mono' : ''}`}
        type="number"
        value={Number.isFinite(value) ? value : ''}
        onChange={(event) =>
          onChange(event.target.value === '' ? 0 : Number(event.target.value))
        }
        min={min}
        max={max}
        step={step}
        required={required}
      />
    </Field>
  )
}

export function ReadOnlyField({
  label,
  value,
  hint,
  wide,
}: {
  label: string
  value: string
  hint?: string
  wide?: boolean
}) {
  return (
    <Field label={label} hint={hint} wide={wide}>
      <input
        className="field__input field__input--mono field__input--readonly"
        type="text"
        value={value}
        readOnly
      />
    </Field>
  )
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  hint,
  wide,
  required,
  placeholder,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
  hint?: string
  wide?: boolean
  required?: boolean
  placeholder?: string
}) {
  return (
    <Field label={label} hint={hint} wide={wide}>
      <select
        className="field__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      >
        {placeholder != null && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  )
}

export function CheckboxField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  hint?: string
}) {
  return (
    <label className="field field--checkbox">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="field__label">{label}</span>
      {hint != null && <span className="field__hint">{hint}</span>}
    </label>
  )
}
