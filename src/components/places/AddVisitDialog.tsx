import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, CalendarDays, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface AddVisitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  placeName: string
  visitNumber: 1 | 2
  onConfirm: (date: string, comment: string) => void
}

export function AddVisitDialog({ open, onOpenChange, placeName, visitNumber, onConfirm }: AddVisitDialogProps) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [comment, setComment] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!date) return
    onConfirm(date, comment.trim())
    setComment('')
    setDate(new Date().toISOString().slice(0, 10))
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-70 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-dark-800 p-5 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <Dialog.Title className="text-base font-bold text-white">
                Registrar visita #{visitNumber}
              </Dialog.Title>
              <Dialog.Description className="text-xs text-white/40 mt-0.5">
                {placeName}
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                aria-label="Fechar"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="visit-date" className="block text-xs font-medium text-white/50 mb-1.5">
                Data da visita
              </label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none" />
                <input
                  id="visit-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full bg-dark-900 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors scheme-dark"
                />
              </div>
            </div>

            <div>
              <label htmlFor="visit-comment" className="block text-xs font-medium text-white/50 mb-1.5">
                Comentário <span className="text-white/30">(opcional)</span>
              </label>
              <textarea
                id="visit-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                placeholder="Como foi a experiência?"
                className="w-full bg-dark-900 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors resize-none"
              />
            </div>

            <Button type="submit" className="w-full" variant="brand">
              <Plus className="h-4 w-4" />
              Registrar visita
            </Button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
