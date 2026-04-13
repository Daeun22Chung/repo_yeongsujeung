import { Trash2 } from 'lucide-react'

export default function ItemRow({ item, index, onChange, onDelete }) {
  const total = (Number(item.quantity) || 0) * (Number(item.unit_price) || 0)

  return (
    <tr className="text-sm">
      <td className="py-2 pr-3">
        <input
          value={item.item_name}
          onChange={(e) => onChange(index, 'item_name', e.target.value)}
          className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
          placeholder="품명"
        />
      </td>
      <td className="py-2 pr-3 w-20">
        <input
          type="number"
          min={1}
          value={item.quantity}
          onChange={(e) => onChange(index, 'quantity', Number(e.target.value))}
          className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
      </td>
      <td className="py-2 pr-3 w-28">
        <input
          type="number"
          min={0}
          value={item.unit_price}
          onChange={(e) => onChange(index, 'unit_price', Number(e.target.value))}
          className="w-full rounded border border-gray-200 px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
      </td>
      <td className="py-2 pr-3 w-28 text-right font-medium text-gray-700">
        {total.toLocaleString('ko-KR')}원
      </td>
      <td className="py-2 w-8">
        <button
          onClick={() => onDelete(index)}
          className="text-gray-300 hover:text-rose-400"
        >
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  )
}
