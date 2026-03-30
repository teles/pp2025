import { Download, CheckCircle } from 'lucide-react'
import { useInstallPrompt } from '@/hooks/useInstallPrompt'

export function Footer() {
  const { canInstall, installed, install } = useInstallPrompt()

  return (
    <footer className="border-t border-white/10 bg-dark-800 px-4 py-5 mt-6">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
        <p>
          Guia digital complementar ao <span className="text-white/50">Passaporte Pinheiros</span>.
          Para validar benefícios, apresente o passaporte físico no estabelecimento.
        </p>

        {installed ? (
          <span className="flex items-center gap-1.5 text-brand-400">
            <CheckCircle className="h-3.5 w-3.5" />
            Aplicativo instalado
          </span>
        ) : canInstall ? (
          <button
            onClick={install}
            className="flex items-center gap-1.5 rounded-xl border border-brand-500/40 bg-brand-500/10 px-3 py-1.5 text-brand-300 hover:bg-brand-500/20 hover:text-brand-200 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Instalar no celular
          </button>
        ) : null}
      </div>
    </footer>
  )
}
