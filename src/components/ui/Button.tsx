import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'brand' | 'ghost' | 'outline'
  size?: 'sm' | 'md'
}

export function Button({ variant = 'brand', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:opacity-50',
        variant === 'brand'   && 'bg-brand-500 hover:bg-brand-400 text-pure-white',
        variant === 'ghost'   && 'bg-white/10 hover:bg-white/20 text-white',
        variant === 'outline' && 'border border-white/20 hover:border-brand-400 hover:text-brand-400 text-white/70',
        size === 'md' && 'px-4 py-2 text-sm',
        size === 'sm' && 'px-3 py-1 text-xs',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
