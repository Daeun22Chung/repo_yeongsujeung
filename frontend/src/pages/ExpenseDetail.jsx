import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { receiptsApi } from '../api/receipts'
import Card from '../components/ui/Card'
import Spinner from '../components/ui/Spinner'
import ImageViewer from '../components/expense/ImageViewer'
import ExpenseForm from '../components/expense/ExpenseForm'
import { useToast } from '../context/ToastContext'

export default function ExpenseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [receipt, setReceipt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    receiptsApi
      .getById(id)
      .then((res) => setReceipt(res.data?.data ?? res.data))
      .catch(() => addToast('영수증을 불러오지 못했습니다.', 'error'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSave(payload) {
    setSaving(true)
    try {
      await receiptsApi.update(id, payload)
      addToast('저장됐습니다.', 'success')
      navigate('/expenses')
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size={36} />
      </div>
    )
  }

  if (!receipt) {
    return <p className="text-center text-gray-400 py-20">영수증을 찾을 수 없습니다.</p>
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
