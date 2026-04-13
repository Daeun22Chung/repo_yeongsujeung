import { FileText, X } from 'lucide-react'

export default function FilePreview({ file, onRemove }) {
  const isPdf = file.type === 'application/pdf'
  const previewUrl = !isPdf ? URL.createObjectURL(file) : null

  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4">
      {isPdf ? (
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-red-50">
          <FileText size={28} className="text-red-400" />
        </div>
      ) : (
        <img
          src={previewUrl}
          alt="미리보기"
          className="h-16 w-16 rounded-lg object-cover border border-gray-100"
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-gray-800">{file.name}</p>
        <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
      </div>
      <button onClick={onRemove} className="text-gray-400 hover:text-gray-600">
        <X size={18} />
      </button>
    </div>
  )
}
