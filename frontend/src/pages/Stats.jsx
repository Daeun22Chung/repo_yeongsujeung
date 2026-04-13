import { useEffect, useState } from 'react'
import { statsApi } from '../api/stats'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import { SkeletonSummaryCards, SkeletonChart, SkeletonPieChart } from '../components/ui/Skeleton'
import DateRangePicker from '../components/stats/DateRangePicker'
import SummaryCards from '../components/stats/SummaryCards'
import MonthlyBarChart from '../components/stats/MonthlyBarChart'
import DailyLineChart from '../components/stats/DailyLineChart'
import CategoryPieChart from '../components/stats/CategoryPieChart'
import { useToast } from '../context/ToastContext'

function defaultRange() {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - 5, 1)
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const fmt = (d) => d.toISOString().slice(0, 10)
  return { start: fmt(start), end: fmt(end) }
}

export default function Stats() {
  const { addToast } = useToast()
  const [range, setRange] = useState(defaultRange())
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    setLoading(true)
    statsApi
      .getSummary({ start_date: range.start, end_date: range.end })
      .then((res) => setSummary(res.data?.data ?? res.data))
      .catch(() => addToast('통계를 불러오지 못했습니다.', 'error'))
      .finally(() => setLoading(false))
  }, [range])

  function handleDateChange(type, val) {
    setRange((prev) => ({ ...prev, [type]: val }))
  }

  const hasData = summary && (summary.count ?? 0) > 0

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-900">통계 분석</h1>

      <DateRangePicker
        startDate={range.start}
        endDate={range.end}
        onChange={handleDateChange}
      />

      {/* 요약 카드 */}
      {loading ? (
        <SkeletonSummaryCards />
      ) : (
        <SummaryCards summary={summary} />
      )}

      {/* 월별 막대 차트 */}
      <Card className="p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">월별 총 지출</h2>
        {loading ? (
          <SkeletonChart height={260} />
        ) : !hasData || !summary.by_month?.length ? (
          <EmptyState title="월별 데이터 없음" />
        ) : (
          <MonthlyBarChart data={summary.by_month} />
        )}
      </Card>

      {/* 일별 추이 */}
      <Card className="p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">일별 지출 추이</h2>
        {loading ? (
          <SkeletonChart height={240} />
        ) : !hasData || !summary.by_day?.length ? (
          <EmptyState title="일별 데이터 없음" />
        ) : (
          <DailyLineChart data={summary.by_day} />
        )}
      </Card>

      {/* 카테고리 파이 */}
      <Card className="p-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">카테고리별 지출</h2>
        {loading ? (
          <SkeletonPieChart />
        ) : !hasData || !summary.by_category?.length ? (
          <EmptyState title="카테고리 데이터 없음" />
        ) : (
          <CategoryPieChart data={summary.by_category} />
        )}
      </Card>
    </div>
  )
}
