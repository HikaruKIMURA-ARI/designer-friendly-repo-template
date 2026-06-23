import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'danger' | 'ghost' | 'outline'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

const variantClass: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground hover:opacity-90',
  danger: 'bg-danger text-primary-foreground hover:opacity-90',
  ghost: 'bg-transparent text-foreground-muted hover:bg-surface-muted',
  outline: 'border border-border bg-transparent text-foreground hover:bg-surface'
}

/**
 * 純粋な UI の atom。ドメインを一切知らず、props だけで描画する。
 */
export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-control px-4 py-control text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${variantClass[variant]} ${className}`}
      {...props}
    />
  )
}
