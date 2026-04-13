import { ArrowLeft, AlertTriangle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useReceipt } from '../hooks/useReceipts'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import Button from '../components/ui/Button'
import ImageViewer from '../components/expense/ImageViewer'
import ExpenseForm from '../components/expense/ExpenseForm'
import { useToast } from '../context/ToastContext'

export default function ExpenseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const { receipt, loading, saving, error, update } = useReceipt(id)

  async function handleSave(payload) {
    const result = await update(payload)
    if (result.ok) {
      addToast('저장됐습니다.', 'success')
      navigate('/expenses')
    } else {
      addToast(result.message || '저장에 실패했습니다.', 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={36} />
      </div>
    )
  }

  if (error || !receipt) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="rounded-full bg-rose-50 p-4">
          <AlertTriangle size={32} className="text-rose-400" />
        </div>
        <p className="text-gray-600 font-medium">{error ?? '영수증을 찾을 수 없습니다.'}</p>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={15} /> 뒤로
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
      >
        <ArrowLeft size={16} />
        뒤로
      </button>
      <h1 className="text-xl font-bold text-gray-900">지출 상세 / 수정</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">원본 영수증</h2>
          <ImageViewer imagePath={receipt.image_path} />
        </Card>

        <Card className="p-5">
          <h2 className="text-sm font-semibold text-gray-600 mb-4">지출 정보</h2>
          <ExpenseForm
            receipt={receipt}
            onSave={handleSave}
            onCancel={() => navigate(-1)}
            isSaving={saving}
          />
        </Card>
      </div>
    </div>
  )
}
