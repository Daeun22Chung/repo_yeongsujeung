import { X } from 'lucide-react'
import { useEffect } from 'react'
import Button from './Button'

export default function Modal({ isOpen, title, children, onClose, onConfirm, confirmLabel = '확인', confirmVariant = 'primary', isLoading }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl mx-4">
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
          <button onClick={onClose} className="ml-auto text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>
        <div className="text-sm text-gray-600">{children}</div>
        {onConfirm && (
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>취소</Button>
            <Button variant={confirmVariant} onClick={onConfirm} isLoading={isLoading}>
              {confirmLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
