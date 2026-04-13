import { Check, Loader2 } from 'lucide-react'

const STEPS = ['파일 업로드', 'AI 분석 중', '저장 완료']

export default function ProgressStepper({ step }) {
  // step: 0=uploading, 1=analyzing, 2=done
  return (
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((label, i) => {
        const isDone = i < step
        const isActive = i === step
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isActive
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {isDone ? (
                  <Check size={14} />
                ) : isActive ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  i + 1
                )}
              </div>
              <span className={`text-xs ${isActive ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`mb-5 h-0.5 w-16 ${i < step ? 'bg-emerald-400' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
