import { Search, X } from 'lucide-react'
import { getAllCategories } from '../../utils/categoryColors'

export default function FilterBar({ filters, onChange, onReset }) {
  return (
    <div className="rounded-xl bg-white border border-gray-200 p-4">
      {/* 날짜 + 카테고리 행 */}
      <div className="flex flex-wrap gap-2 mb-2">
        <input
          type="date"
          value={filters.date_from || ''}
          onChange={(e) => onChange('date_from', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
        />
        <span className="hidden sm:flex items-center text-gray-400 text-sm">~</span>
        <input
          type="date"
          value={filters.date_to || ''}
          onChange={(e) => onChange('date_to', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
        />
        <select
          value={filters.category || ''}
          onChange={(e) => onChange('category', e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
        >
          <option value="">전체 카테고리</option>
          {getAllCategories().map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      {/* 검색 + 초기화 행 */}
      <div className="flex gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 flex-1">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            value={filters.store_name || ''}
            onChange={(e) => onChange('store_name', e.target.value)}
            placeholder="상호명 검색"
            className="flex-1 text-sm outline-none min-w-0"
          />
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 whitespace-nowrap"
        >
          <X size={13} /> 초기화
        </button>
      </div>
    </div>
  )
}
