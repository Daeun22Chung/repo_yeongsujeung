export default function DateRangePicker({ startDate, endDate, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-3">
      <span className="text-sm font-medium text-gray-600 shrink-0">기간</span>
      <input
        type="date"
        value={startDate}
        onChange={(e) => onChange('start', e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
      />
      <span className="text-gray-400 text-sm hidden sm:inline">~</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onChange('end', e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
      />
    </div>
  )
}
