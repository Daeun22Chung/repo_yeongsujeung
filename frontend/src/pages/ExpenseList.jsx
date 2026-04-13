import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useReceipts } from '../hooks/useReceipts'
import { receiptsApi } from '../api/receipts'
import EmptyState from '../components/ui/EmptyState'
import Pagination from '../components/ui/Pagination'
import { SkeletonTableRows } from '../components/ui/Skeleton'
import Modal from '../components/ui/Modal'
import FilterBar from '../components/expense/FilterBar'
import ExpenseTable from '../components/expense/ExpenseTable'
import { useToast } from '../context/ToastContext'
import Button from '../components/ui/Button'

export default function ExpenseList() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { data, loading, error, filters, page, setPage, changeFilter, resetFilters, refetch } =
    useReceipts(20)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await receiptsApi.remove(deleteTarget.id)
      addToast('삭제됐습니다.', 'success')
      setDeleteTarget(null)
      refetch()
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

      <FilterBar filters={filters} onChange={changeFilter} onReset={resetFilters} />

      {loading ? (
        <SkeletonTableRows rows={6} />
      ) : error ? (
        <EmptyState
          title="목록을 불러오지 못했습니다"
          description={error}
          action={
            <Button variant="secondary" onClick={refetch}>다시 시도</Button>
          }
        />
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
