/** 공통 pulse 블록 */
function Block({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-gray-200 ${className}`} />
}

/** 대시보드 요약 카드 스켈레톤 */
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-3">
      <Block className="h-3 w-24" />
      <Block className="h-8 w-40" />
      <Block className="h-3 w-16" />
    </div>
  )
}

/** 통계 요약 카드 3개 스켈레톤 */
export function SkeletonSummaryCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-3">
          <Block className="h-10 w-10 rounded-xl" />
          <div className="space-y-2 flex-1">
            <Block className="h-3 w-16" />
            <Block className="h-6 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

/** 테이블 행 스켈레톤 */
export function SkeletonTableRows({ rows = 5 }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full">
        <thead className="border-b border-gray-100 bg-gray-50">
          <tr>
            {['이미지', '날짜', '상호명', '카테고리', '금액', ''].map((h) => (
              <th key={h} className="px-4 py-3 text-xs font-medium text-gray-500 uppercase text-left">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="px-4 py-3"><Block className="h-10 w-10 rounded-lg" /></td>
              <td className="px-4 py-3"><Block className="h-4 w-20" /></td>
              <td className="px-4 py-3"><Block className="h-4 w-28" /></td>
              <td className="px-4 py-3"><Block className="h-5 w-16 rounded-full" /></td>
              <td className="px-4 py-3"><Block className="h-4 w-20 ml-auto" /></td>
              <td className="px-4 py-3"><Block className="h-6 w-6" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/** 차트 영역 스켈레톤 */
export function SkeletonChart({ height = 260 }) {
  return (
    <div className="animate-pulse space-y-3" style={{ height }}>
      <div className="flex items-end gap-2 h-full pb-6 px-2">
        {[60, 85, 45, 95, 70, 55, 80, 40, 90, 65, 75, 50].map((h, i) => (
          <div
            key={i}
            className="flex-1 bg-gray-200 rounded-t-md"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  )
}

/** 파이 차트 스켈레톤 */
export function SkeletonPieChart() {
  return (
    <div className="animate-pulse flex flex-col items-center gap-4 py-4">
      <Block className="h-44 w-44 rounded-full" />
      <div className="flex flex-wrap justify-center gap-3">
        {[80, 60, 72, 50, 64].map((w, i) => (
          <Block key={i} className={`h-3 rounded-full`} style={{ width: w }} />
        ))}
      </div>
    </div>
  )
}
