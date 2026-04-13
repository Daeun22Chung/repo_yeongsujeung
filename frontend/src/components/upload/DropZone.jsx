import { UploadCloud } from 'lucide-react'
import { useRef } from 'react'
import { validateFile } from '../../utils/validators'

export default function DropZone({ onFile, error }) {
  const inputRef = useRef()

  function handleDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  function handleChange(e) {
    const file = e.target.files[0]
    if (file) onFile(file)
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => inputRef.current.click()}
      className={`cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition hover:bg-indigo-50 ${
        error ? 'border-rose-400 bg-rose-50' : 'border-gray-300 bg-white'
      }`}
    >
      <UploadCloud size={40} className="mx-auto mb-3 text-indigo-400" />
      <p className="text-sm font-medium text-gray-700">클릭하거나 파일을 여기에 드래그하세요</p>
      <p className="mt-1 text-xs text-gray-400">JPG, PNG, PDF · 최대 10MB</p>
      {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
