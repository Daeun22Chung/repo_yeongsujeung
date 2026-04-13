import { Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Badge from '../ui/Badge'
import { formatCurrency, formatDate } from '../../utils/formatters'

export default function ExpenseRow({ receipt, onDelete }) {
  const navigate = useNavigate()

  return (
    <tr
      className="cursor-pointer hover:bg-indigo-50 transition-colors"
      onClick={() => navigate(`/expenses/${receipt.id}`)}
    >
      <td className="px-4 py-3">
        {receipt.image_path ? (
          <img
            src={`/uploads/${receipt.image_path.split('/').pop()}`}
            alt="영수증"
            className="h-10 w-10 rounded-lg object-cover border border-gray-100"
          />
        ) : (
          <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-300 text-xs">
            없음
          </div>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">{formatDate(receipt.date)}</td>
      <td className="px-4 py-3 text-sm font-medium text-gray-900">{receipt.store_name}</td>
      <td className="px-4 py-3"><Badge category={receipt.category} /></td>
      <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
        {formatCurrency(receipt.total_amount)}
      </td>
      <td className="px-4 py-3 text-right">
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(receipt) }}
          className="rounded p-1.5 text-gray-400 hover:bg-rose-50 hover:text-rose-500"
        >
          <Trash2 size={15} />
        </button>
      </td>
    </tr>
  )
}
