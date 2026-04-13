import ExpenseRow from './ExpenseRow'

export default function ExpenseTable({ receipts, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-left">
        <thead className="border-b border-gray-100 bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">이미지</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">날짜</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">상호명</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase">카테고리</th>
            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase text-right">금액</th>
            <th className="px-4 py-3 w-12" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {receipts.map((r) => (
            <ExpenseRow key={r.id} receipt={r} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
