import { FileX } from 'lucide-react'

export default function EmptyState({ title = '데이터가 없습니다', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400">
      <FileX size={48} className="mb-4 text-gray-300" />
      <p className="text-base font-medium text-gray-500">{title}</p>
      {description && <p className="mt-1 text-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
