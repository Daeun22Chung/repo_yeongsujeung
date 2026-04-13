import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { receiptsApi } from '../api/receipts'
import EmptyState from '../components/ui/EmptyState'
import Pagination from '../components/ui/Pagination'
import Spinner from '../components/ui/Spinner'
import Modal from '../components/ui/Modal'
import FilterBar from '../components/expense/FilterBar'
import ExpenseTable from '../components/expense/ExpenseTable'
import { useToast } from '../context/ToastContext'
import Button from '../components/ui/Button'

const INIT_FILTERS = { date_from: '', date_to: '', category: '', store_name: '' }

export default function ExpenseList() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [filters, setFilters] = useState(INIT_FILTERS)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ items: [], total: 0, total_pages: 1 })
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setLoading(true)
    const params = { ...filters, page, per_page: 20 }
    Object.keys(params).forEach((k) => !params[k] && delete params[k])
    receiptsApi
      .getList(params)
      .then((res) => {
        const d = res.data?.data ?? res.data
        setData({ items: d.items ?? [], total: d.total ?? 0, total_pages: d.total_pages ?? 1 })
      })
      .catch(() => addToast('목록을 불러오지 못했습니다.', 'error'))
      .finally(() => setLoading(false))
  }, [filters, page])

  function handleFilterChange(key, val) {
    setFilters((prev) => ({ ...prev, [key]: val }))
    setPage(1)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await receiptsApi.remove(deleteTarget.id)
      addToast('삭제됐습니다.', 'success')
      setDeleteTarget(null)
      setPage(1)
      setFilters({ ...INIT_FILTERS })
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">지출 내역</h1>
        <Button onClick={() => navigate('/upload')}>+ 업로드</Button>
      </div>

      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={() => { setFilters(INIT_FILTERS); setPage(1) }}
      />

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={32} /></div>
      ) : data.items.length === 0 ? (
        <EmptyState
          title="검색 결과가 없습니다"
          description="필터 조건을 바꾸거나 영수증을 업로드해보세요"
        />
      ) : (
        <>
          <p className="text-xs text-gray-400">총 {data.total}건</p>
          <ExpenseTable receipts={data.items} onDelete={setDeleteTarget} />
          <Pagination page={page} totalPages={data.total_pages} onPageChange={setPage} />
        </>
      )}

      <Modal
        isOpen={!!deleteTarget}
        title="영수증 삭제"
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        confirmLabel="삭제"
        confirmVariant="danger"
        isLoading={deleting}
      >
        <strong>{deleteTarget?.store_name}</strong> 영수증을 삭제하시겠습니까?
        <br />
        <span className="text-xs text-gray-400 mt-1 block">
          영수증과 관련 항목, 이미지가 모두 삭제됩니다.
        </span>
      </Modal>
    </div>
  )
}
