import { CheckCircle, XCircle, X, AlertTriangle } from 'lucide-react'
import { useToast } from '../../context/ToastContext'

const ICONS = {
  success: <CheckCircle size={16} className="text-emerald-500 shrink-0" />,
  error:   <XCircle size={16} className="text-rose-500 shrink-0" />,
  warning: <AlertTriangle size={16} className="text-amber-400 shrink-0" />,
}

function ToastItem({ id, message, type }) {
  const { removeToast } = useToast()
  return (
    <div className="flex items-center gap-3 rounded-xl bg-white shadow-lg border border-gray-100 px-4 py-3 min-w-[260px] max-w-sm">
      {ICONS[type] ?? ICONS.success}
      <span className="flex-1 text-sm text-gray-800">{message}</span>
      <button onClick={() => removeToast(id)} className="text-gray-400 hover:text-gray-600">
        <X size={14} />
      </button>
    </div>
  )
}

export default function ToastContainer() {
  const { toasts } = useToast()
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>
  )
}
