import { ZoomIn, ImageOff } from 'lucide-react'
import { useState } from 'react'

export default function ImageViewer({ imagePath }) {
  const [open, setOpen] = useState(false)

  if (!imagePath) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center rounded-2xl bg-gray-100 text-gray-300">
        <div className="flex flex-col items-center gap-2">
          <ImageOff size={40} />
          <p className="text-sm text-gray-400">이미지 없음</p>
        </div>
      </div>
    )
  }

  const src = `/uploads/${imagePath.split('/').pop()}`

  return (
    <>
      <div
        className="group relative cursor-zoom-in overflow-hidden rounded-2xl border border-gray-200"
        onClick={() => setOpen(true)}
      >
        <img src={src} alt="영수증 원본" className="w-full object-contain max-h-[500px]" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors">
          <ZoomIn size={32} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setOpen(false)}
        >
          <img
            src={src}
            alt="영수증 원본"
            className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
