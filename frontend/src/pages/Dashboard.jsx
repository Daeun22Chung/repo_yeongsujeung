import { Upload, RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { receiptsApi } from '../api/receipts'
import { statsApi } from '../api/stats'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonCard, SkeletonPieChart, SkeletonTableRows } from '../components/ui/Skeleton'
import ExpenseTable from '../components/expense/ExpenseTable'
import CategoryPieChart from '../components/stats/CategoryPieChart'
import { useToast } from '../context/ToastContext'
import { formatCurrency } from '../utils/formatters'

function thisMonthRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const fmt = (d) => d.toISOString().slice(0, 10)
  return { start: fmt(start), end: fmt(end) }
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [summary, setSummary] = useState(null)
  const [recent, setRecent] = useState([])

  function load() {
    setLoading(true)
    setError(null)
    const { start, end } = thisMonthRange()
    Promise.all([
      statsApi.getSummary({ start_date: start, end_date: end }),
      receiptsApi.getList({ page: 1, per_page: 5 }),
    ])
      .then(([statsRes, listRes]) => {
        setSummary(statsRes.data?.data ?? statsRes.data)
        setRecent(listRes.data?.data?.items ?? listRes.data?.items ?? [])
      })
      .catch((err) => {
        setError(err.message ?? '데이터를 불러오지 못했습니다.')
        addToast('데이터를 불러오지 못했습니다.', 'error')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const categoryData = summary?.by_category ?? []

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">대시보드</h1>
        <button
          onClick={() => navigate('/upload')}
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          <Upload size={16} />
          <span className="hidden sm:inline">영수증 업로드</span>
          <span className="sm:hidden">업로드</span>
        </button>
      </div>

      {/* 네트워크 오류 배너 */}
      {!loading && error && (
        <div className="flex items-center justify-between rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-700">
          <span>{error}</span>
          <button onClick={load} className="flex items-center gap-1.5 font-medium hover:text-rose-900">
            <RefreshCw size={14} /> 다시 시도
          </button>
        </div>
      )}

      {/* 이번 달 총 지출 */}
      {loading ? (
        <SkeletonCard />
      ) : (
        <Card className="p-6">
          <p className="text-sm text-gray-500 mb-1">이번 달 총 지출</p>
          <p className="text-3xl font-bold text-indigo-700">
            {formatCurrency(summary?.total_amount ?? 0)}
          </p>
          <p className="mt-1 text-xs text-gray-400">총 {summary?.count ?? 0}건</p>
        </Card>
      )}

      {/* 카테고리 파이 차트 */}
      <Card className="p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">카테고리별 지출</h2>
        {loading ? (
          <SkeletonPieChart />
        ) : categoryData.length > 0 ? (
          <CategoryPieChart data={categoryData} />
        ) : (
          <EmptyState title="이번 달 지출 데이터가 없습니다" />
        )}
      </Card>

      {/* 최근 5건 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">최근 지출</h2>
          <button
            onClick={() => navigate('/expenses')}
            className="text-xs text-indigo-600 hover:text-indigo-800"
          >
            전체 보기
          </button>
        </div>
        {loading ? (
          <SkeletonTableRows rows={3} />
        ) : recent.length > 0 ? (
          <ExpenseTable receipts={recent} onDelete={() => {}} />
        ) : (
          <EmptyState
            title="지출 내역이 없습니다"
            description="영수증을 업로드해 지출을 기록해보세요"
            action={
              <button
                onClick={() => navigate('/upload')}
                className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                업로드하기
              </button>
            }
          />
        )}
      </Card>
    </div>
  )
}
