import type { InputHTMLAttributes } from 'react'

export type TextInputProps = InputHTMLAttributes<HTMLInputElement>

/**
 * 純粋な UI の atom。値は props（value/onChange）で制御する。
 */
export function TextInput({ className = '', type = 'text', ...props }: TextInputProps) {
  return (
    <input
      type={type}
      className={`w-full rounded-control border border-border bg-surface px-3 py-control text-sm text-foreground outline-none placeholder:text-foreground-muted focus:border-primary ${className}`}
      {...props}
    />
  )
}
