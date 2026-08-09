import React from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled,
  type = 'button',
  className = '',
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: Variant
  disabled?: boolean
  type?: 'button' | 'submit'
  className?: string
}) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-soft disabled:opacity-40 disabled:cursor-not-allowed'
  const styles: Record<Variant, string> = {
    primary: 'bg-accent text-paper hover:opacity-90',
    secondary: 'bg-card border border-line text-ink hover:border-accent/40',
    ghost: 'text-muted hover:text-ink',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  )
}
