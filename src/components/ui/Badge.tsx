import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'cuisine' | 'promo' | 'outline'
  className?: string
}

export function Badge({ children, variant = 'outline', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        variant === 'cuisine' && 'bg-brand-500/20 text-brand-300 border border-brand-500/30',
        variant === 'promo'   && 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
        variant === 'outline' && 'bg-white/10 text-white/70 border border-white/20',
        className,
      )}
    >
      {children}
    </span>
  )
}
