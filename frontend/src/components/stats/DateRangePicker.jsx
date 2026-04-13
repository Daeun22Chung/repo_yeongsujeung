export default function DateRangePicker({ startDate, endDate, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <label className="text-sm font-medium text-gray-600">기간</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => onChange('start', e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <span className="text-gray-400">~</span>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onChange('end', e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  )
}
