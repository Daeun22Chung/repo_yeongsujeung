import { Wallet, Receipt, TrendingUp } from 'lucide-react'
import Card from '../ui/Card'
import { formatCurrency } from '../../utils/formatters'

export default function SummaryCards({ summary }) {
  const total = summary?.total_amount ?? 0
  const count = summary?.count ?? 0
  const avg = count > 0 ? total / count : 0

  const items = [
    { icon: Wallet, label: '총 지출', value: formatCurrency(total), color: 'text-indigo-600' },
    { icon: Receipt, label: '영수증 수', value: `${count}건`, color: 'text-emerald-600' },
    { icon: TrendingUp, label: '건당 평균', value: formatCurrency(avg), color: 'text-amber-500' },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 xs:grid-cols-3 sm:grid-cols-3">
      {items.map(({ icon: Icon, label, value, color }) => (
        <Card key={label} className="p-5">
          <div className="flex items-center gap-3">
            <div className={`rounded-xl bg-gray-50 p-2.5 ${color}`}>
              <Icon size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className={`text-lg font-bold ${color}`}>{value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
