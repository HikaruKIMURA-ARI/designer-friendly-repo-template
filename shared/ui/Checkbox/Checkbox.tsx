import type { InputHTMLAttributes } from 'react'

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>

/**
 * 純粋な UI の atom。チェック状態は props（checked/onChange）で制御する。
 */
export function Checkbox({ className = '', ...props }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={`size-5 cursor-pointer rounded-control border-border text-primary accent-primary ${className}`}
      {...props}
    />
  )
}
